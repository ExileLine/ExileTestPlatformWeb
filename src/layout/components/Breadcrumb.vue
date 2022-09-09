<template>
  <div class="crumbs">
    <t-row class="crumbs-nav">
      <t-col :span="20">
        <t-breadcrumb separator="/">
          <t-breadcrumb-item v-for="item in routeList" :key="item.index" :to="item.path">
            <span class="align-center">
              <t-icon v-if="item.meta && item.meta.icon" :name="item.meta.icon"></t-icon>
              <span>{{ item.meta.title }}</span>
            </span>
          </t-breadcrumb-item>
        </t-breadcrumb>
      </t-col>
    </t-row>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getBreadcrumbByRouteKey } from '@/utils/breadcrumb'
const route = useRoute()
const routeList = computed(() => getBreadcrumbByRouteKey(route.path))
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
