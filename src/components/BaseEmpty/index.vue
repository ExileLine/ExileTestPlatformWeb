<template>
  <div class="flex-col-center">
    <svg-icon icon="no-data" :width="width" :height="height" />
    <div class="text-gray-6 mt-10">{{ description }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  description: {
    type: String,
    default: '暂无数据',
  },
  width: {
    type: String,
    default: '10em',
  },
  height: {
    type: String,
    default: '10em',
  },
})
</script>

<style lang="scss" scoped></style>
