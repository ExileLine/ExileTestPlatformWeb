<template>
  <div class="result-container">
    <svg-icon icon="maintenance" width="20em" height="20em" class="result-icon" />
    <div class="mt-10 mb-20 flex-col-center">
      <div class="fs-20 mb-5 fw-600">功能开发中</div>
      <div class="text-gray-6">功能开发中，请留意官方公告</div>
    </div>
    <t-button theme="default" @click="gotoHome">返回首页</t-button>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const store = useStore()
const gotoHome = () => {
  store.commit('app/delTag', route.fullPath)
  router.push({
    path: '/dashboard',
  })
}
</script>

<style lang="scss" scoped>
.result-container {
  min-height: 400px;
  height: 75vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;

  .result-icon {
    color: var(--td-brand-color);
  }
}
</style>
