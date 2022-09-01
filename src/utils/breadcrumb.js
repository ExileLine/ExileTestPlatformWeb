import { concat } from 'lodash'
import { pageRoutes } from '@/router'

let routeTitle = {}
export function genBreadcrumbRoutePath(routes = pageRoutes, parent = {}, titleList = []) {
  routes.forEach(route => {
    const { path } = route
    const routePath = path.startsWith('/')
      ? path
      : `${parent.path || ''}/${path.replace(/^\//, '')}`
    routeTitle[routePath] = concat([], titleList, route)
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
