<template>
  <div class="crumbs">
    <t-row class="crumbs-nav">
      <t-col :span="20">
        <t-breadcrumb separator="/">
          <t-breadcrumb-item
            v-for="(item, index) in routeList"
            :key="item.index"
            :to="index == 1 ? item.path : ''"
          >
            {{ item.name }}
          </t-breadcrumb-item>
        </t-breadcrumb>
      </t-col>
    </t-row>
  </div>
</template>
<script>
import { pageRoutes } from "@/router";
export default {
  data() {
    return {
      routeList: [],
      back: false
    };
  },
  mounted() {
    // console.log('ojiliguala',this.routeList)
    this.init();
  },
  computed: {
    routePath() {
      return this.$route.path;
    },
    tooltips() {
      return this.$route.meta?.tooltips;
    },
    effect() {
      return Array.isArray(this.tooltips) ? "dark" : "light";
    }
  },
  watch: {
    routePath(n, o) {
      if (n !== o) {
        this.init();
      }
    }
  },
  methods: {
    init() {
      const path = this.$route.path;
      const arr = path.split("/");
      const arr2 = [];
      arr.reduce((a, b) => {
        arr2.push(a + "/" + b);
        return a + "/" + b;
      });
      const routeList = [];
      for (let item of arr2) {
        let name = this.getName(item, pageRoutes);
        if (name) {
          routeList.push({ name, path: item });
        }
      }
      this.routeList = routeList;
    },
    getName(path, routes) {
      let name = "";
      for (let item of routes) {
        if (item.path === path) {
          name = item.meta ? item.meta.title : "";
          break;
        }
        if (item.children) {
          let res = this.getName(path, item.children);
          if (res) {
            name = res;
            break;
          }
        }
      }
      return name;
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="scss">
.crumbs {
  padding: 0 20px;
}
.t-menu-vertical-demo:not(.t-menu--collapse) {
  width: 200px;
}
.crumbs-nav {
  height: 38px;
  line-height: 38px;
}
.t-breadcrumb {
  height: 38px;
  line-height: 38px !important;
}
</style>
