const router = [
  {
    name: 'report',
    path: '/report',
    redirect: '/report/index',
    meta: {
      sort: 1100,
      icon: 'file',
      title: '测试报告',
    },
    component: () => import('@/layout/BlankLayout.vue'),
    children: [
      {
        name: 'reportList',
        path: 'index',
        meta: {
          title: '报告列表',
        },
        component: () => import('@view/report/index.vue'),
      },
    ],
  },
]

export default router
