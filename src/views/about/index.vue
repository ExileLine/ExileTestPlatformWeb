<template>
  <page-container>
    <div class="mb-10">{{ title }}</div>
    <json-editor v-model="jsonData" ref="jsonEditor" />
  </page-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import JsonEditor from '@/components/JsonEditor/index.vue'

const route = useRoute()
const title = route.meta?.title ?? ''

const jsonData = ref({})

for (let index = 0; index < 1000; index++) {
  jsonData.value[Math.random()] = { index }
}
</script>

<style lang="scss" scoped></style>
