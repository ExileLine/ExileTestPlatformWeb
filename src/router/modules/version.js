const router = [
  {
    name: 'version',
    path: '/version',
    redirect: '/version/version',
    meta: {
      sort: 300,
      icon: 'view-module',
      title: '版本配置',
    },
    component: () => import('@/layout/BlankLayout.vue'),
    children: [
      {
        name: 'versionList',
        path: 'version',
        meta: {
          title: '版本迭代',
        },
        component: () => import('@view/about/index.vue'),
      },
      {
        name: 'moduleList',
        path: 'module',
        meta: {
          title: '功能模块',
        },
        component: () => import('@view/about/index.vue'),
      },
    ],
  },
]

export default router
