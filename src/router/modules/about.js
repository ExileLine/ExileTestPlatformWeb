const router = [
  {
    path: '/about',
    name: 'about',
    meta: {
      sort: 99999,
      icon: 'books',
      title: '关于'
    },
    component: () => import('@view/about/index.vue')
  }
]

export default router
