const router = [
  {
    name: 'api-case',
    path: '/api-case',
    redirect: '/api-case/case',
    meta: {
      sort: 400,
      icon: 'logo-codepen',
      title: '接口测试',
    },
    component: () => import('@/layout/BlankLayout.vue'),
    children: [
      {
        name: 'apiCaseList',
        path: 'case',
        meta: {
          title: '用例列表',
        },
        component: () => import('@view/api-case/index.vue'),
      },
      {
        name: 'apiSceneList',
        path: 'scene',
        meta: {
          title: '场景列表',
        },
        component: () => import('@view/api-case/scene.vue'),
      },
      {
        name: 'addCase',
        path: 'add',
        meta: {
          title: '添加接口用例',
          hidden: true,
        },
        component: () => import('@view/api-case/add.vue'),
      },

      {
        name: 'editCase',
        path: 'edit',
        meta: {
          title: '编辑接口用例',
          hidden: true,
        },
        component: () => import('@view/api-case/add.vue'),
      },
      {
        name: 'editScene',
        path: 'edit-scene',
        meta: {
          title: '编辑场景',
          hidden: true,
        },
        component: () => import('@view/api-case/add-scene.vue'),
      },
      {
        name: 'addScene',
        path: 'add-scene',
        meta: {
          title: '添加场景',
          hidden: true,
        },
        component: () => import('@view/api-case/add-scene.vue'),
      },
    ],
  },
]

export default router
