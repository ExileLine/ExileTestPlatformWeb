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
          title: 'UI用例列表',
        },
        component: () => import('@view/ui-case/index.vue'),
      },
      {
        name: 'addUiCaseList',
        path: 'add',
        meta: {
          title: '新增UI用例',
          hidden: true,
        },
        component: () => import('@view/ui-case/add.vue'),
      },
      {
        name: 'editUiCaseList',
        path: 'edit',
        meta: {
          title: '编辑UI用例',
          hidden: true,
        },
        component: () => import('@view/ui-case/add.vue'),
      },
    ],
  },
]

export default router
