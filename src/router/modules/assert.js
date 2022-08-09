const router = [
  {
    name: 'assert',
    path: '/assert',
    redirect: '/assert/resp',
    meta: {
      sort: 1000,
      icon: 'gift',
      title: '断言管理'
    },
    component: () => import('@/layout/BlankLayout.vue'),
    children: [
      {
        name: 'respAssertList',
        path: 'resp',
        meta: {
          title: '断言管理'
        },
        component: () => import('@view/about/index.vue')
      },
      {
        name: 'fieldAssertList',
        path: 'field',
        meta: {
          title: '字段断言'
        },
        component: () => import('@view/about/index.vue')
      }
    ]
  }
]

export default router
