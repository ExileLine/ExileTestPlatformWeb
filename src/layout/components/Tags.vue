<template>
  <div class="flex-between h-38 bg-white">
    <div class="flex-1 pl-10 align-center overflow-x narrow-scrollbar">
      <t-tag
        v-for="(tag, index) in tagList"
        closable
        :theme="nowPath === tag.fullPath ? 'primary' : 'default'"
        :key="tag.fullPath"
        :title="tag.meta ? tag.meta.title : ''"
        :disable-transitions="true"
        class="mr-10 pointer"
        @click="changeRouter(index)"
        @close="canIClose(index)"
      >
        {{ tag.meta ? tag.meta.title : '' }}
      </t-tag>
    </div>
    <t-dropdown placement="bottom" @click="handleTags">
      <t-button variant="text">
        <t-icon name="chevron-down"></t-icon>
      </t-button>
      <template #dropdown>
        <t-dropdown-menu size="small">
          <t-dropdown-item value="other">关闭其他</t-dropdown-item>
          <t-dropdown-item value="all">关闭所有</t-dropdown-item>
        </t-dropdown-menu>
      </template>
    </t-dropdown>
  </div>
</template>
<script setup>
import { ref, reactive, watch, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
import { useStore } from 'vuex'

const route = useRoute()
const router = useRouter()
const store = useStore()

const tagList = ref([])
const lastRoute = ref({ fullPath: '/' })
const nowPath = computed(() => route.fullPath)

function setTags(route) {
  if (!tagList.value.some(item => item.fullPath === route.fullPath) && route.path !== '/') {
    tagList.value.push({
      path: route.path,
      fullPath: route.fullPath,
      query: route.query,
      meta: route.meta || {},
    })
  }
  if (tagList.value.length > 12) {
    tagList.value.shift()
  }
  store.commit('app/setCurrentTags', tagList.value)
}
function canIClose(index) {
  handleClose(index)
}
function handleClose(index) {
  const closePath = tagList.value[index].fullPath
  // 当只有一个tag的时候，并且这个tag就是首页，那么就不需要删除
  const needDelete = !(closePath === '/home/index' && tagList.value.length === 1)
  if (closePath === route.fullPath) {
    if (index > 0) {
      router.push(tagList.value[index - 1].fullPath)
    } else {
      if (tagList.value.length > 1) {
        router.push(tagList.value[index + 1].fullPath)
      } else {
        if (needDelete) {
          router.push('/')
        }
      }
    }
  }
  if (needDelete) {
    tagList.value = tagList.value.filter((e, i) => i !== index)
    store.commit('app/setCurrentTags', tagList.value)
  }
}
function changeRouter(index) {
  const currenRouter = tagList.value[index]
  if (!currenRouter || currenRouter.fullPath === nowPath.value) return
  router.push(currenRouter)
}
function closeRouter(fullPath) {
  //关闭指定路由
  let path = lastRoute.value.fullPath
  if (fullPath) {
    path = fullPath
  }
  let index = tagList.value.findIndex(item => item.fullPath === path)
  if (index > -1) {
    handleClose(index)
  }
}
function goBack() {
  closeRouter()
}
// 关闭全部标签
function closeAll() {
  tagList.value = []
  store.commit('app/setCurrentTags', tagList.value)
  router.push('/')
}
// 关闭其他标签
function closeOther() {
  const curItem = tagList.value.filter(item => {
    return item.fullPath === route.fullPath
  })
  tagList.value = curItem
  store.commit('app/setCurrentTags', tagList.value)
}
function handleTags(command) {
  command.value === 'other' ? closeOther() : closeAll()
}
onBeforeRouteUpdate((to, from) => {
  if (to.fullPath !== from.fullPath) {
    lastRoute.value = from
    nextTick(() => {
      setTags(to)
    })
  }
})
watch(
  () => store.state.app.currentTags,
  n => {
    tagList.value = [...n]
  },
  {
    deep: true,
  }
)
watch(
  () => store.state.app.needClosePath,
  n => {
    if (n) {
      store.commit('app/clearNowTag', '')
      closeRouter(n)
    }
  }
)

onMounted(() => {
  if (store.state.app?.currentTags?.length == 0) {
    setTags(route)
  } else {
    tagList.value = store.state.app.currentTags
  }
  window.addEventListener('popstate', goBack, false)
})
onUnmounted(() => {
  window.removeEventListener('popstate', goBack, false)
})
</script>
