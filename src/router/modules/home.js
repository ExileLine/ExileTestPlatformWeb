const router = [
  {
    path: "/home",
    name: "Home",
    meta: {
      sort: 0,
      icon: "home",
      title: "首页"
    },
    component: () => import("@view/home/index.vue")
  }
];

export default router;
