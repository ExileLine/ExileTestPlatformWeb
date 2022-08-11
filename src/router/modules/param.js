const router = [
  {
    name: 'param',
    path: '/param',
    redirect: '/param/index',
    meta: {
      sort: 800,
      icon: 'gift',
      title: '参数管理',
    },
    component: () => import('@/layout/BlankLayout.vue'),
    children: [
      {
        name: 'paramList',
        path: 'index',
        meta: {
          title: '参数列表',
        },
        component: () => import('@view/about/index.vue'),
      },
    ],
  },
]

export default router
