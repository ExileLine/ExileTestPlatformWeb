import { createRouter, createWebHistory, useRoute } from 'vue-router'
import { flatten, keys } from 'lodash'
import Layout from '@/layout/index.vue'

const rts = import.meta.globEager('./modules/*.js')
export const pageRoutes = flatten(keys(rts).map(key => rts[key].default))
const routes = [
  {
    path: '/',
    redirect: '/dashboard',
    component: Layout,
    children: pageRoutes.sort((a, b) => a?.meta?.sort - b.meta.sort),
  },
  {
    path: '/project',
    component: () => import('@/views/project/index.vue'),
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/dashboard',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export const getActive = (maxLevel = 2) => {
  const route = useRoute()
  if (!route.path) {
    return ''
  }
  return route.path
    .split('/')
    .filter((_item, index) => index <= maxLevel && index > 0)
    .map(item => `/${item}`)
    .join('')
}
export default router
