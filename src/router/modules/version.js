const router = [
  {
    name: 'version',
    path: '/version',
    redirect: '/version/index',
    meta: {
      sort: 300,
      icon: 'view-module',
      title: '版本配置',
    },
    component: () => import('@/layout/BlankLayout.vue'),
    children: [
      {
        name: 'versionList',
        path: 'index',
        meta: {
          title: '版本迭代',
        },
        component: () => import('@view/version/index.vue'),
      },
      {
        name: 'versionTaskList',
        path: 'task',
        meta: {
          title: '任务列表',
          hidden: true,
          parentIndex: 0,
        },
        component: () => import('@view/version/version-task.vue'),
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
