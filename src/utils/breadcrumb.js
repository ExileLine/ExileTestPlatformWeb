import { concat } from 'lodash'
import { pageRoutes } from '@/router'

let routeTitle = {}
export function genBreadcrumbRoutePath(routes = pageRoutes, parent = {}, titleList = []) {
  routes.forEach(route => {
    const {
      path,
      meta: { parentIndex },
    } = route
    const routePath = path.startsWith('/')
      ? path
      : `${parent.path || ''}/${path.replace(/^\//, '')}`
    const routeParent = routes[parentIndex]
    routeTitle[routePath] = concat([], titleList, routeParent || [], route)
    if (route.children?.length) {
      genBreadcrumbRoutePath(route.children, route, routeTitle[routePath])
    }
  })
}

/**
 * 获取面包屑数据
 * @param activeKey - 当前页面路由的key
 */
export function getBreadcrumbByRouteKey(activeKey) {
  return routeTitle[activeKey]
}

console.log(routeTitle)
