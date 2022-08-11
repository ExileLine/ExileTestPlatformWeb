const router = [
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: {
      sort: 0,
      icon: 'dashboard',
      title: '仪表盘',
    },
    component: () => import('@view/dashboard/index.vue'),
  },
]

export default router
