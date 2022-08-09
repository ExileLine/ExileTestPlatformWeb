const router = [
  {
    name: 'api-case',
    path: '/api-case',
    redirect: '/api-case/case',
    meta: {
      sort: 400,
      icon: 'logo-codepen',
      title: '接口测试'
    },
    component: () => import('@/layout/BlankLayout.vue'),
    children: [
      {
        name: 'apiCaseList',
        path: 'case',
        meta: {
          title: '用例列表'
        },
        component: () => import('@view/about/index.vue')
      },
      {
        name: 'apiSceneList',
        path: 'scene',
        meta: {
          title: '场景列表'
        },
        component: () => import('@view/about/index.vue')
      }
    ]
  }
]

export default router
