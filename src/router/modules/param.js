const router = [
  {
    name: 'api-case-param',
    path: '/api-case-param',
    redirect: '/api-case-param/index',
    meta: {
      sort: 800,
      icon: 'gift',
      title: '参数管理',
    },
    component: () => import('@/layout/BlankLayout.vue'),
    children: [
      {
        name: 'api-case-param-list',
        path: 'index',
        meta: {
          title: '参数列表',
        },
        component: () => import('@view/api-case-param/index.vue'),
      },
      {
        name: 'add-api-case-param',
        path: 'add',
        meta: {
          title: '新增请求参数',
          hidden: true,
        },
        component: () => import('@view/api-case-param/add.vue'),
      },
      {
        name: 'edit-api-case-param',
        path: 'edit',
        meta: {
          title: '编辑请求参数',
          hidden: true,
        },
        component: () => import('@view/api-case-param/add.vue'),
      },
    ],
  },
]

export default router
