const router = [
  {
    name: 'user',
    path: '/user',
    redirect: '/user/index',
    meta: {
      sort: 100,
      icon: 'usergroup',
      title: '用户管理',
    },
    component: () => import('@/layout/BlankLayout.vue'),
    children: [
      {
        name: 'userList',
        path: 'index',
        meta: {
          title: '用户列表',
        },
        component: () => import('@view/user/index.vue'),
      },
      {
        name: 'userInfo',
        path: 'info',
        meta: {
          title: '个人信息',
          hidden: true,
        },
        component: () => import('@view/user/info.vue'),
      },
    ],
  },
]

export default router
