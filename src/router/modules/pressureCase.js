const router = [
  {
    name: 'pressure-case',
    path: '/pressure-case',
    redirect: '/pressure-case/case',
    meta: {
      sort: 600,
      icon: 'link',
      title: '性能测试',
    },
    component: () => import('@/layout/BlankLayout.vue'),
    children: [
      {
        name: 'PressureCaseList',
        path: 'case',
        meta: {
          title: '用例列表',
        },
        component: () => import('@view/maintenance/index.vue'),
      },
    ],
  },
]

export default router
