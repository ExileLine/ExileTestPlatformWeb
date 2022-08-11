<template>
  <div class="p-15 gradient-bg" :style="{ backgroundImage: gradientStyle }">
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  /** 渐变开始的颜色 */
  startColor: String,
  /** 渐变结束的颜色 */
  endColor: String,
})
const gradientStyle = computed(
  () => `linear-gradient(to bottom right, ${props.startColor}, ${props.endColor})`
)
</script>

<style lang="scss" scoped>
.gradient-bg {
  border-radius: 16px;
  color: $gray-color-1;
}
</style>
