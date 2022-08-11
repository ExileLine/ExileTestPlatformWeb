<template>
  <svg aria-hidden="true" :width="width" :height="height">
    <use :xlink:href="symbolId" fill="currentColor" />
  </svg>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  /** 前缀 */
  prefix: {
    type: String,
    default: 'icon',
  },
  /** 图标名称(图片的文件名) */
  icon: String,
  width: {
    type: String,
    default: '1em',
  },
  height: {
    type: String,
    default: '1em',
  },
})
const symbolId = computed(() => `#${props.prefix}-${props.icon}`)
</script>
