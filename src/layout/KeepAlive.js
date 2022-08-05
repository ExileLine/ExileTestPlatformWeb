import { isString, isFunction, isArray, NOOP, normalizeClass, normalizeStyle, isOn, invokeArrayFns } from '@vue/shared'
import {
    isRef,
    warn,
    callWithAsyncErrorHandling,
    callWithErrorHandling,
    getCurrentInstance,
    setTransitionHooks,
    onMounted,
    onUpdated,
    onBeforeUnmount,
    watch,
} from 'vue'

let isFlushing = false
let isFlushPending = false
const queue = []
let flushIndex = 0
const pendingPreFlushCbs = []
let activePreFlushCbs = null
let preFlushIndex = 0
const pendingPostFlushCbs = []
let activePostFlushCbs = null
let postFlushIndex = 0
const resolvedPromise = Promise.resolve()
function queueFlush() {
    if (!isFlushing && !isFlushPending) {
        isFlushPending = true
        resolvedPromise.then(flushJobs)
    }
}
function queueCb(cb, activeQueue, pendingQueue, index) {
    if (!isArray(cb)) {
        if (!activeQueue || !activeQueue.includes(cb, cb.allowRecurse ? index + 1 : index)) {
            pendingQueue.push(cb)
        }
    } else {
        // if cb is an array, it is a component lifecycle hook which can only be
        // triggered by a job, which is already deduped in the main queue, so
        // we can skip duplicate check here to improve perf
        pendingQueue.push(...cb)
    }
    queueFlush()
}

function queuePostFlushCb(cb) {
    queueCb(cb, activePostFlushCbs, pendingPostFlushCbs, postFlushIndex)
}
function flushPreFlushCbs(seen, parentJob = null) {
    if (pendingPreFlushCbs.length) {
        activePreFlushCbs = [...new Set(pendingPreFlushCbs)]
        pendingPreFlushCbs.length = 0
        for (preFlushIndex = 0; preFlushIndex < activePreFlushCbs.length; preFlushIndex++) {
            activePreFlushCbs[preFlushIndex]()
        }
        activePreFlushCbs = null
        preFlushIndex = 0
        // recursively flush until it drains
        flushPreFlushCbs(seen, parentJob)
    }
}
function flushPostFlushCbs(seen) {
    if (pendingPostFlushCbs.length) {
        const deduped = [...new Set(pendingPostFlushCbs)]
        pendingPostFlushCbs.length = 0
        // #1947 already has active queue, nested flushPostFlushCbs call
        if (activePostFlushCbs) {
            activePostFlushCbs.push(...deduped)
            return
        }
        activePostFlushCbs = deduped
        activePostFlushCbs.sort((a, b) => getId(a) - getId(b))
        for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
            activePostFlushCbs[postFlushIndex]()
        }
        activePostFlushCbs = null
        postFlushIndex = 0
    }
}
const getId = (job) => (job.id == null ? Infinity : job.id)
function flushJobs(seen) {
    isFlushPending = false
    isFlushing = true
    flushPreFlushCbs(seen)
    // Sort queue before flush.
    // This ensures that:
    // 1. Components are updated from parent to child. (because parent is always
    //    created before the child so its render effect will have smaller
    //    priority number)
    // 2. If a component is unmounted during a parent component's update,
    //    its update can be skipped.
    queue.sort((a, b) => getId(a) - getId(b))
    // conditional usage of checkRecursiveUpdate must be determined out of
    // try ... catch block since Rollup by default de-optimizes treeshaking
    // inside try-catch. This can leave all warning code unshaked. Although
    // they would get eventually shaken by a minifier like terser, some minifiers
    // would fail to do that (e.g. https://github.com/evanw/esbuild/issues/1610)
    const check = NOOP
    try {
        for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
            const job = queue[flushIndex]
            if (job && job.active !== false) {
                if (false && check(job));
                // console.log(`running:`, job.id)
                callWithErrorHandling(job, null, 14 /* SCHEDULER */)
            }
        }
    } finally {
        flushIndex = 0
        queue.length = 0
        flushPostFlushCbs()
        isFlushing = false
        // some postFlushCb queued jobs!
        // keep flushing until it drains.
        if (queue.length || pendingPreFlushCbs.length || pendingPostFlushCbs.length) {
            flushJobs(seen)
        }
    }
}

function emit(event, ...args) {}
const devtoolsComponentAdded = /*#__PURE__*/ createDevtoolsComponentHook('component:added' /* COMPONENT_ADDED */)
function createDevtoolsComponentHook(hook) {
    return (component) => {
        emit(
            hook,
            component.appContext.app,
            component.uid,
            component.parent ? component.parent.uid : undefined,
            component
        )
    }
}

/**
 * mark the current rendering instance for asset resolution (e.g.
 * resolveComponent, resolveDirective) during render
 */
let currentRenderingInstance = null

function queueEffectWithSuspense(fn, suspense) {
    if (suspense && suspense.pendingBranch) {
        if (isArray(fn)) {
            suspense.effects.push(...fn)
        } else {
            suspense.effects.push(fn)
        }
    } else {
        queuePostFlushCb(fn)
    }
}

const isAsyncWrapper = (i) => !!i.type.__asyncLoader

const queuePostRenderEffect = queueEffectWithSuspense
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
    callWithAsyncErrorHandling(hook, instance, 7 /* VNODE_HOOK */, [vnode, prevVNode])
}

const Fragment = Symbol(undefined)
function isVNode(value) {
    return value ? value.__v_isVNode === true : false
}
const normalizeKey = ({ key }) => (key != null ? key : null)
const normalizeRef = ({ ref }) => {
    return ref != null
        ? isString(ref) || isRef(ref) || isFunction(ref)
            ? { i: currentRenderingInstance, r: ref }
            : ref
        : null
}
function cloneVNode(vnode, extraProps, mergeRef = false) {
    // This is intentionally NOT using spread or extend to avoid the runtime
    // key enumeration cost.
    const { props, ref, patchFlag, children } = vnode
    const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props
    const cloned = {
        __v_isVNode: true,
        __v_skip: true,
        type: vnode.type,
        props: mergedProps,
        key: mergedProps && normalizeKey(mergedProps),
        ref:
            extraProps && extraProps.ref
                ? // #2078 in the case of <component :is="vnode" ref="extra"/>
                  // if the vnode itself already has a ref, cloneVNode will need to merge
                  // the refs so the single vnode can be set on multiple refs
                  mergeRef && ref
                    ? isArray(ref)
                        ? ref.concat(normalizeRef(extraProps))
                        : [ref, normalizeRef(extraProps)]
                    : normalizeRef(extraProps)
                : ref,
        scopeId: vnode.scopeId,
        slotScopeIds: vnode.slotScopeIds,
        children: children,
        target: vnode.target,
        targetAnchor: vnode.targetAnchor,
        staticCount: vnode.staticCount,
        shapeFlag: vnode.shapeFlag,
        // if the vnode is cloned with extra props, we can no longer assume its
        // existing patch flag to be reliable and need to add the FULL_PROPS flag.
        // note: perserve flag for fragments since they use the flag for children
        // fast paths only.
        patchFlag:
            extraProps && vnode.type !== Fragment
                ? patchFlag === -1 // hoisted node
                    ? 16 /* FULL_PROPS */
                    : patchFlag | 16 /* FULL_PROPS */
                : patchFlag,
        dynamicProps: vnode.dynamicProps,
        dynamicChildren: vnode.dynamicChildren,
        appContext: vnode.appContext,
        dirs: vnode.dirs,
        transition: vnode.transition,
        // These should technically only be non-null on mounted VNodes. However,
        // they *should* be copied for kept-alive vnodes. So we just always copy
        // them since them being non-null during a mount doesn't affect the logic as
        // they will simply be overwritten.
        component: vnode.component,
        suspense: vnode.suspense,
        ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
        ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
        el: vnode.el,
        anchor: vnode.anchor,
    }
    return cloned
}
function mergeProps(...args) {
    const ret = {}
    for (let i = 0; i < args.length; i++) {
        const toMerge = args[i]
        for (const key in toMerge) {
            if (key === 'class') {
                if (ret.class !== toMerge.class) {
                    ret.class = normalizeClass([ret.class, toMerge.class])
                }
            } else if (key === 'style') {
                ret.style = normalizeStyle([ret.style, toMerge.style])
            } else if (isOn(key)) {
                const existing = ret[key]
                const incoming = toMerge[key]
                if (existing !== incoming && !(isArray(existing) && existing.includes(incoming))) {
                    ret[key] = existing ? [].concat(existing, incoming) : incoming
                }
            } else if (key !== '') {
                ret[key] = toMerge[key]
            }
        }
    }
    return ret
}

function getComponentName(Component) {
    return isFunction(Component) ? Component.displayName || Component.name : Component.name
}

const isKeepAlive = (vnode) => vnode.type.__isKeepAlive
const KeepAliveImpl = {
    name: `KeepAlive`,
    // Marker for special handling inside the renderer. We are not using a ===
    // check directly on KeepAlive in the renderer, because importing it directly
    // would prevent it from being tree-shaken.
    __isKeepAlive: true,
    props: {
        include: [String, RegExp, Array],
        exclude: [String, RegExp, Array],
        max: [String, Number],
    },
    setup(props, { slots }) {
        const instance = getCurrentInstance()
        // KeepAlive communicates with the instantiated renderer via the
        // ctx where the renderer passes in its internals,
        // and the KeepAlive instance exposes activate/deactivate implementations.
        // The whole point of this is to avoid importing KeepAlive directly in the
        // renderer to facilitate tree-shaking.
        const sharedContext = instance?.ctx
        console.log(instance)
        // if the internal renderer is not registered, it indicates that this is server-side rendering,
        // for KeepAlive, we just need to render its children
        if (!sharedContext?.renderer) {
            return slots.default
        }
        const cache = new Map()
        const keys = new Set()
        let current = null
        // if (process.env.NODE_ENV !== 'production') {
        // instance.__v_cache = cache
        // }
        instance.__v_cache = cache
        const parentSuspense = instance.suspense
        const {
            renderer: {
                p: patch,
                m: move,
                um: _unmount,
                o: { createElement },
            },
        } = sharedContext
        const storageContainer = createElement('div')
        sharedContext.activate = (vnode, container, anchor, isSVG, optimized) => {
            const instance = vnode.component
            move(vnode, container, anchor, 0 /* ENTER */, parentSuspense)
            // in case props have changed
            patch(
                instance.vnode,
                vnode,
                container,
                anchor,
                instance,
                parentSuspense,
                isSVG,
                vnode.slotScopeIds,
                optimized
            )
            queuePostRenderEffect(() => {
                instance.isDeactivated = false
                if (instance.a) {
                    invokeArrayFns(instance.a)
                }
                const vnodeHook = vnode.props && vnode.props.onVnodeMounted
                if (vnodeHook) {
                    invokeVNodeHook(vnodeHook, instance.parent, vnode)
                }
            }, parentSuspense)
            if (process.env.NODE_ENV !== 'production') {
                // Update components tree
                devtoolsComponentAdded(instance)
            }
        }
        sharedContext.deactivate = (vnode) => {
            const instance = vnode.component
            move(vnode, storageContainer, null, 1 /* LEAVE */, parentSuspense)
            queuePostRenderEffect(() => {
                if (instance.da) {
                    invokeArrayFns(instance.da)
                }
                const vnodeHook = vnode.props && vnode.props.onVnodeUnmounted
                if (vnodeHook) {
                    invokeVNodeHook(vnodeHook, instance.parent, vnode)
                }
                instance.isDeactivated = true
            }, parentSuspense)
            if (process.env.NODE_ENV !== 'production') {
                // Update components tree
                devtoolsComponentAdded(instance)
            }
        }
        function unmount(vnode) {
            // reset the shapeFlag so it can be properly unmounted
            resetShapeFlag(vnode)
            _unmount(vnode, instance, parentSuspense)
        }
        function pruneCache(filter) {
            cache.forEach((vnode, key) => {
                const name = getComponentName(vnode.type)
                if (name && (!filter || !filter(name))) {
                    pruneCacheEntry(key)
                }
            })
        }
        function pruneCacheEntry(key) {
            const cached = cache.get(key)
            if (!current || cached.type !== current.type) {
                unmount(cached)
            } else if (current) {
                // current active instance should no longer be kept-alive.
                // we can't unmount it now but it might be later, so reset its flag now.
                resetShapeFlag(current)
            }
            cache.delete(key)
            keys.delete(key)
        }
        // prune cache on include/exclude prop change
        watch(
            () => [props.include, props.exclude],
            ([include, exclude]) => {
                include && pruneCache((name) => matches(include, name))
                exclude && pruneCache((name) => !matches(exclude, name))
            },
            // prune post-render after `current` has been updated
            { flush: 'post', deep: true }
        )
        // cache sub tree after render
        let pendingCacheKey = null
        const cacheSubtree = () => {
            // fix #1621, the pendingCacheKey could be 0
            if (pendingCacheKey != null) {
                cache.set(pendingCacheKey, getInnerChild(instance.subTree))
            }
        }
        onMounted(cacheSubtree)
        onUpdated(cacheSubtree)
        onBeforeUnmount(() => {
            cache.forEach((cached) => {
                const { subTree, suspense } = instance
                const vnode = getInnerChild(subTree)
                if (cached.type === vnode.type) {
                    // current instance will be unmounted as part of keep-alive's unmount
                    resetShapeFlag(vnode)
                    // but invoke its deactivated hook here
                    const da = vnode.component.da
                    da && queuePostRenderEffect(da, suspense)
                    return
                }
                unmount(cached)
            })
        })
        return () => {
            pendingCacheKey = null
            if (!slots.default) {
                return null
            }
            const children = slots.default()
            const rawVNode = children[0]
            if (children.length > 1) {
                if (process.env.NODE_ENV !== 'production') {
                    warn(`KeepAlive should contain exactly one component child.`)
                }
                current = null
                return children
            } else if (
                !isVNode(rawVNode) ||
                (!((rawVNode.shapeFlag & 4) /* STATEFUL_COMPONENT */) && !((rawVNode.shapeFlag & 128) /* SUSPENSE */))
            ) {
                current = null
                return rawVNode
            }
            let vnode = getInnerChild(rawVNode)
            const comp = vnode.type
            // for async components, name check should be based in its loaded
            // inner component if available
            const name = getComponentName(isAsyncWrapper(vnode) ? vnode.type.__asyncResolved || {} : comp)
            const { include, exclude, max } = props
            if ((include && (!name || !matches(include, name))) || (exclude && name && matches(exclude, name))) {
                current = vnode
                return rawVNode
            }
            const key = vnode.key == null ? comp : vnode.key
            const cachedVNode = cache.get(key)
            // clone vnode if it's reused because we are going to mutate it
            if (vnode.el) {
                vnode = cloneVNode(vnode)
                if (rawVNode.shapeFlag & 128 /* SUSPENSE */) {
                    rawVNode.ssContent = vnode
                }
            }
            // #1513 it's possible for the returned vnode to be cloned due to attr
            // fallthrough or scopeId, so the vnode here may not be the final vnode
            // that is mounted. Instead of caching it directly, we store the pending
            // key and cache `instance.subTree` (the normalized vnode) in
            // beforeMount/beforeUpdate hooks.
            pendingCacheKey = key
            if (cachedVNode) {
                // copy over mounted state
                vnode.el = cachedVNode.el
                vnode.component = cachedVNode.component
                if (vnode.transition) {
                    // recursively update transition hooks on subTree
                    setTransitionHooks(vnode, vnode.transition)
                }
                // avoid vnode being mounted as fresh
                vnode.shapeFlag |= 512 /* COMPONENT_KEPT_ALIVE */
                // make this key the freshest
                keys.delete(key)
                keys.add(key)
            } else {
                keys.add(key)
                // prune oldest entry
                if (max && keys.size > parseInt(max, 10)) {
                    pruneCacheEntry(keys.values().next().value)
                }
            }
            // avoid vnode being unmounted
            vnode.shapeFlag |= 256 /* COMPONENT_SHOULD_KEEP_ALIVE */
            current = vnode
            return rawVNode
        }
    },
}
// export the public type for h/tsx inference
// also to avoid inline import() in generated d.ts files
const KeepAlive = KeepAliveImpl
function matches(pattern, name) {
    if (isArray(pattern)) {
        return pattern.some((p) => matches(p, name))
    } else if (isString(pattern)) {
        return pattern.split(',').indexOf(name) > -1
    } else if (pattern.test) {
        return pattern.test(name)
    }
    /* istanbul ignore next */
    return false
}

function resetShapeFlag(vnode) {
    let shapeFlag = vnode.shapeFlag
    if (shapeFlag & 256 /* COMPONENT_SHOULD_KEEP_ALIVE */) {
        shapeFlag -= 256 /* COMPONENT_SHOULD_KEEP_ALIVE */
    }
    if (shapeFlag & 512 /* COMPONENT_KEPT_ALIVE */) {
        shapeFlag -= 512 /* COMPONENT_KEPT_ALIVE */
    }
    vnode.shapeFlag = shapeFlag
}
function getInnerChild(vnode) {
    return vnode.shapeFlag & 128 /* SUSPENSE */ ? vnode.ssContent : vnode
}

export { KeepAlive, isKeepAlive }