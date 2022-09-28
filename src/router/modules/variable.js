const router = [
  {
    name: 'variable',
    path: '/variable',
    redirect: '/variable/index',
    meta: {
      sort: 700,
      icon: 'hourglass',
      title: '变量管理',
    },
    component: () => import('@/layout/BlankLayout.vue'),
    children: [
      {
        name: 'variableList',
        path: 'index',
        meta: {
          title: '变量列表',
        },
        component: () => import('@view/variable/index.vue'),
      },
      {
        name: 'addVariable',
        path: 'add',
        meta: {
          title: '添加变量',
          hidden: true,
          parentIndex: 0,
        },
        component: () => import('@view/variable/add.vue'),
      },
      {
        name: 'editVariable',
        path: 'edit',
        meta: {
          title: '编辑变量',
          hidden: true,
          parentIndex: 0,
        },
        component: () => import('@view/variable/add.vue'),
      },
    ],
  },
]

export default router
