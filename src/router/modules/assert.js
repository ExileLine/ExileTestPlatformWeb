const router = [
  {
    name: 'assert',
    path: '/assert',
    redirect: '/assert/resp',
    meta: {
      sort: 1000,
      icon: 'chart-bubble',
      title: '断言管理',
    },
    component: () => import('@/layout/BlankLayout.vue'),
    children: [
      {
        name: 'respAssertList',
        path: 'resp',
        meta: {
          title: '响应断言',
        },
        component: () => import('@view/assert/response.vue'),
      },
      {
        name: 'fieldAssertList',
        path: 'field',
        meta: {
          title: '字段断言',
        },
        component: () => import('@view/assert/field.vue'),
      },
    ],
  },
]

export default router
