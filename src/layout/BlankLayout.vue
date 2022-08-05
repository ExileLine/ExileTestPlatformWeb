<template>
  <router-view v-slot="{ Component, route }">
    <base-keep-alive ref="keepAlive">
      <component :is="Component" :key="route.fullPath" />
    </base-keep-alive>
  </router-view>
</template>
<script>
import { KeepAlive } from "./KeepAlive";
export default {
  components: {
    BaseKeepAlive: KeepAlive
  },
  watch: {
    "$store.state.app.currentTags": {
      handler: function (newTags, oldTags) {
        const keepAliveInstance = this.$refs.keepAlive?.$;
        if (keepAliveInstance) {
          if (oldTags.length == 0) return;
          let delRoutes = [];
          if (newTags.length === 0) {
            delRoutes = oldTags.map(g => g.fullPath);
          } else {
            delRoutes = oldTags
              .filter(e => !newTags.find(f => f.fullPath === e.fullPath))
              .map(g => g.fullPath);
          }
          if (delRoutes.length === 0) return;
          const cache = keepAliveInstance.__v_cache;
          delRoutes.forEach(key => {
            const vnode = cache.get(key);
            if (vnode) {
              let shapeFlag = vnode.shapeFlag;
              if (shapeFlag & 256 /* COMPONENT_SHOULD_KEEP_ALIVE */) {
                shapeFlag -= 256; /* COMPONENT_SHOULD_KEEP_ALIVE */
              }
              if (shapeFlag & 512 /* COMPONENT_KEPT_ALIVE */) {
                shapeFlag -= 512; /* COMPONENT_KEPT_ALIVE */
              }
              vnode.shapeFlag = shapeFlag;
              const renderer = keepAliveInstance.ctx.renderer;
              renderer.um(vnode, keepAliveInstance, keepAliveInstance.suspense);
              cache.delete(key);
            }
          });
        }
      },
      deep: true
    }
  }
};
</script>
