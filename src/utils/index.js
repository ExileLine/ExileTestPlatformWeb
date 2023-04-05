import { camelCase, forEach, isArray } from 'lodash'
export const getScrollContainer = (el, isVertical) => {
  let parent = el
  while (parent) {
    if ([window, document, document.documentElement].includes(parent)) {
      return window
    }
    if (isScroll(parent, isVertical)) {
      return parent
    }
    parent = parent.parentNode
  }
  return parent
}

export const getStyle = function (element, styleName) {
  if (!element || !styleName) return null
  styleName = camelCase(styleName)
  if (styleName === 'float') {
    styleName = 'cssFloat'
  }
  try {
    const style = element.style[styleName]
    if (style) return style
    const computed = document.defaultView.getComputedStyle(element, '')
    return computed ? computed[styleName] : ''
  } catch (e) {
    return element.style[styleName]
  }
}
export const isScroll = (el, isVertical) => {
  const determinedDirection = isVertical === null || isVertical === undefined
  const overflow = determinedDirection
    ? getStyle(el, 'overflow')
    : isVertical
    ? getStyle(el, 'overflow-y')
    : getStyle(el, 'overflow-x')
  return overflow.match(/(scroll|auto|overlay)/)
}

export const getOffsetTop = el => {
  let offset = 0
  let parent = el
  while (parent) {
    offset += parent.offsetTop
    parent = parent.offsetParent
  }
  return offset
}

export const getOffsetTopDistance = (el, containerEl) => {
  return Math.abs(getOffsetTop(el) - getOffsetTop(containerEl))
}

export const treeToObject = (res = {}, list, valueKey = 'uuid', childKey = 'business_list') => {
  forEach(list, item => {
    const child = item[childKey]
    res[item[valueKey]] = item
    if (isArray(child)) {
      treeToObject(res, child)
    }
  })
  return res
}
