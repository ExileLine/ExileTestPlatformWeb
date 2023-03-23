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
        name: 'AddVersionTask',
        path: 'add-task',
        meta: {
          title: '添加任务',
          hidden: true,
          parentIndex: 1,
        },
        component: () => import('@view/version/add-version-task.vue'),
      },
      {
        name: 'EditVersionTask',
        path: 'edit-task',
        meta: {
          title: '编辑任务',
          hidden: true,
          parentIndex: 1,
        },
        component: () => import('@view/version/add-version-task.vue'),
      },
      {
        name: 'moduleList',
        path: 'module',
        meta: {
          title: '功能模块',
        },
        component: () => import('@view/module/index.vue'),
      },
      {
        name: 'AddModule',
        path: 'add-module',
        meta: {
          title: '添加模块',
          hidden: true,
          parentIndex: 4,
        },
        component: () => import('@view/module/add.vue'),
      },
      {
        name: 'EditModule',
        path: 'edit-module',
        meta: {
          title: '编辑模块',
          hidden: true,
          parentIndex: 4,
        },
        component: () => import('@view/module/add.vue'),
      },
    ],
  },
]

export default router
