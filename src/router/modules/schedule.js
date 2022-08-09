const router = [
  {
    name: 'schedule',
    path: '/schedule',
    redirect: '/schedule/index',
    meta: {
      sort: 1300,
      icon: 'round',
      title: '定时任务'
    },
    component: () => import('@/layout/BlankLayout.vue'),
    children: [
      {
        name: 'scheduleList',
        path: 'index',
        meta: {
          title: '任务列表'
        },
        component: () => import('@view/about/index.vue')
      }
    ]
  }
]

export default router
