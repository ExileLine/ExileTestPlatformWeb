const router = [
  {
    name: 'variable',
    path: '/variable',
    redirect: '/variable/index',
    meta: {
      sort: 700,
      icon: 'hourglass',
      title: '变量管理'
    },
    component: () => import('@/layout/BlankLayout.vue'),
    children: [
      {
        name: 'variableList',
        path: 'index',
        meta: {
          title: '变量列表'
        },
        component: () => import('@view/about/index.vue')
      }
    ]
  }
]

export default router
