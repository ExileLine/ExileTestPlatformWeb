<template>
  <t-row :gutter="20">
    <t-col v-for="item in cardData" :key="item.id" :xl="3" :sm="6" :xs="12" class="mb-20">
      <gradient-bg :start-color="item.colors[0]" :end-color="item.colors[1]">
        <div class="fs-16">{{ item.title }}</div>
        <div class="justify-between align-end mt-30">
          <t-icon :name="item.icon" size="30px" />
          <count-to :prefix="item.unit" :start-value="0" :end-value="data[item.id]" class="fs-30" />
        </div>
      </gradient-bg>
    </t-col>
  </t-row>
</template>

<script setup>
import GradientBg from './GradientBg.vue'
import CountTo from '@/components/CountTo/index.vue'

defineProps({
  data: {
    type: Object,
    default: () => ({}),
    required: true,
  },
})
const cardData = [
  {
    id: 'total_case',
    title: '用例数',
    unit: '',
    colors: ['#ec4786', '#b955a4'],
    icon: 'chart',
  },
  {
    id: 'total_scenario',
    title: '场景数',
    unit: '',
    colors: ['#865ec0', '#5144b4'],
    icon: 'chart-bar',
  },
  {
    id: 'total_assert',
    title: '断言数',
    unit: '',
    colors: ['#56cdf3', '#719de3'],
    icon: 'chart-bubble',
  },
  {
    id: 'total_variable',
    title: '变量数',
    unit: '',
    colors: ['#fcbc25', '#f68057'],
    icon: 'hourglass',
  },
  {
    id: 'total_execute_count',
    title: '执行数',
    unit: '',
    // 6-10
    colors: ['#4787f0', '#001f97'],
    icon: 'chart-pie',
  },
  {
    id: 'total_execute_success',
    title: '成功数',
    unit: '',
    // 3-6
    colors: ['#85dbbe', '#078d5c'],
    icon: 'check-circle',
  },
  {
    id: 'total_execute_fail',
    title: '失败数',
    unit: '',
    // 4-7
    colors: ['#f78d94', '#c9353f'],
    icon: 'close-circle',
  },
  {
    id: 'total_execute_error',
    title: '错误数',
    unit: '',
    colors: ['#f1cf50', '#f8cb23'],
    icon: 'info-circle',
  },
]
</script>
