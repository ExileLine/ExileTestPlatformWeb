const router = [
  {
    name: 'permission',
    path: '/permission',
    redirect: '/permission/index',
    meta: {
      sort: 200,
      icon: 'secured',
      title: '权限管理'
    },
    component: () => import('@/layout/BlankLayout.vue'),
    children: [
      {
        name: 'permissionList',
        path: 'index',
        meta: {
          title: '权限配置'
        },
        component: () => import('@view/about/index.vue')
      }
    ]
  }
]

export default router
