<template>
  <span>{{ value }}</span>
</template>
<script setup>
import { ref, computed, onMounted, watch, watchEffect } from 'vue'
import { useTransition, TransitionPresets } from '@vueuse/core'
import { isNumber } from 'lodash'

const props = defineProps({
  /** 初始值 */
  startValue: {
    type: Number,
    default: 0,
  },
  /** 结束值 */
  endValue: {
    type: Number,
    default: 1,
  },
  /** 动画时长 */
  duration: {
    type: Number,
    default: 1500,
  },
  /** 自动动画 */
  autoplay: {
    type: Boolean,
    default: true,
  },
  /** 进制 */
  decimals: {
    type: Number,
    default: 0,
  },
  /** 前缀 */
  prefix: {
    type: String,
    default: '',
  },
  /** 后缀 */
  suffix: {
    type: String,
    default: '',
  },
  /** 分割符号 */
  separator: {
    type: String,
    default: '',
  },
  /** 小数点 */
  decimal: {
    type: String,
    default: '',
  },
  /** 使用缓冲动画函数 */
  useEasing: {
    type: Boolean,
    default: true,
  },
  /** 缓冲动画函数类型 */
  transition: {
    type: String,
    default: 'linear',
  },
})
const emit = defineEmits(['on-started', 'on-finished'])
const source = ref(props.startValue)
let outputValue = useTransition(source)
const value = computed(() => formatNumber(outputValue.value))
const disabled = ref(false)
function run() {
  outputValue = useTransition(source, {
    disabled,
    duration: props.duration,
    onStarted: () => emit('on-started'),
    onFinished: () => emit('on-finished'),
    ...(props.useEasing ? { transition: TransitionPresets[props.transition] } : {}),
  })
}
function start() {
  run()
  source.value = props.endValue
}
function formatNumber(num) {
  if (!num && num !== 0) {
    return ''
  }
  const { decimals, decimal, separator, suffix, prefix } = props
  let number = Number(num).toFixed(decimals)
  number += ''
  const x = number.split('.')
  let x1 = x[0]
  const x2 = x.length > 1 ? decimal + x[1] : ''
  const rgx = /(\d+)(\d{3})/
  if (separator && !isNumber(separator)) {
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, `$1${separator}$2`)
    }
  }
  return prefix + x1 + x2 + suffix
}
watch([() => props.startValue, () => props.endValue], () => {
  if (props.autoplay) {
    start()
  }
})
watchEffect(() => {
  source.value = props.startValue
})
onMounted(() => {
  if (props.autoplay) {
    start()
  }
})
</script>

<style scoped></style>
