const router = [
  {
    name: 'ui-case',
    path: '/ui-case',
    redirect: '/ui-case/case',
    meta: {
      sort: 500,
      icon: 'logo-chrome',
      title: 'UI测试',
    },
    component: () => import('@/layout/BlankLayout.vue'),
    children: [
      {
        name: 'uiCaseList',
        path: 'case',
        meta: {
          title: '用例列表',
        },
        component: () => import('@view/about/index.vue'),
      },
    ],
  },
]

export default router
