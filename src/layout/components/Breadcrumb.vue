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
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { pageRoutes } from '@/router'
const route = useRoute()
const routePath = computed(() => route.path)
const routeList = ref([])

function getName(path, routes) {
  let name = ''
  for (let item of routes) {
    if (item.path === path) {
      name = item.meta ? item.meta.title : ''
      break
    }
    if (item.children) {
      let res = getName(path, item.children)
      if (res) {
        name = res
        break
      }
    }
  }
  return name
}

function init() {
  const path = routePath.value
  const arr = path.split('/')
  const arr2 = []
  arr.reduce((a, b) => {
    arr2.push(a + '/' + b)
    return a + '/' + b
  })
  const _routeList = []
  for (let item of arr2) {
    let name = getName(item, pageRoutes)
    if (name) {
      _routeList.push({ name, path: item })
    }
  }
  routeList.value = _routeList
}

watch(
  () => routePath.value,
  (n, o) => {
    if (n !== o) {
      init()
    }
  }
)
onMounted(() => {
  init()
})
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
