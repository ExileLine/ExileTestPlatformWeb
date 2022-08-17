<template>
  <page-container>
    <div class="mb-10">{{ title }}</div>
    <json-editor v-model="jsonData" />
  </page-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import JsonEditor from '@/components/JsonEditor/index.vue'

const route = useRoute()
const title = route.meta?.title ?? ''

const jsonData = ref({})
</script>

<style lang="scss" scoped></style>
