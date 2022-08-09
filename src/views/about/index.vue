<template>
  <page-container>{{ title }}</page-container>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
const title = route.meta?.title ?? ''
</script>

<style lang="scss" scoped></style>
