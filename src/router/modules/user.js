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
    ],
  },
]

export default router
