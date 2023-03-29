const router = [
  {
    name: 'configure',
    path: '/configure',
    redirect: '/configure/env',
    meta: {
      sort: 1200,
      icon: 'setting',
      title: '配置管理',
    },
    component: () => import('@/layout/BlankLayout.vue'),
    children: [
      {
        name: 'envList',
        path: 'env',
        meta: {
          title: '环境配置',
        },
        component: () => import('@view/configure/env.vue'),
      },
      {
        name: 'dingdingList',
        path: 'dingding',
        meta: {
          title: '钉钉配置',
        },
        component: () => import('@view/configure/dingding.vue'),
      },
      {
        name: 'mailList',
        path: 'mail',
        meta: {
          title: '邮件配置',
        },
        component: () => import('@/views/configure/email.vue'),
      },
      {
        name: 'dbList',
        path: 'db',
        meta: {
          title: '数据库配置',
        },
        component: () => import('@view/configure/db.vue'),
      },
      {
        name: 'cicdList',
        path: 'cicd',
        meta: {
          title: 'CI/CD配置',
        },
        component: () => import('@view/maintenance/index.vue'),
      },
    ],
  },
]

export default router
