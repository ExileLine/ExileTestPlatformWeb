const router = [
  {
    path: '/home',
    name: 'Home',
    meta: {
      sort: 0,
      icon: 'home',
      title: '首页'
    },
    component: () => import('@view/home/index.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: {
      sort: 0,
      icon: 'dashboard',
      title: '仪表盘'
    },
    component: () => import('@view/dashboard/index.vue')
  }
]

export default router
