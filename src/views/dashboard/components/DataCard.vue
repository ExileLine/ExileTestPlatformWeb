<template>
  <t-row :gutter="20">
    <t-col v-for="item in cardData" :key="item.id" :xl="3" :sm="6" :xs="12" class="mb-20">
      <gradient-bg :start-color="item.colors[0]" :end-color="item.colors[1]">
        <div class="fs-16">{{ item.title }}</div>
        <div class="justify-between align-end mt-30">
          <t-icon :name="item.icon" size="30px" />
          <count-to :prefix="item.unit" :start-value="1" :end-value="item.value" class="fs-30" />
        </div>
      </gradient-bg>
    </t-col>
  </t-row>
</template>

<script setup>
import GradientBg from './GradientBg.vue'
import CountTo from '@/components/CountTo/index.vue'

const cardData = [
  {
    id: 'case_count',
    title: '用例数',
    value: 1000000,
    unit: '',
    colors: ['#ec4786', '#b955a4'],
    icon: 'chart',
  },
  {
    id: 'scenario_count',
    title: '场景数',
    value: 234567.89,
    unit: '',
    colors: ['#865ec0', '#5144b4'],
    icon: 'chart-bar',
  },
  {
    id: 'assertion_count',
    title: '断言数',
    value: 666666,
    unit: '',
    colors: ['#56cdf3', '#719de3'],
    icon: 'chart-bubble',
  },
  {
    id: 'var_count',
    title: '变量数',
    value: 999999,
    unit: '',
    colors: ['#fcbc25', '#f68057'],
    icon: 'hourglass',
  },
  {
    id: 'execute_count',
    title: '执行数',
    value: 234567.89,
    unit: '',
    // 6-10
    colors: ['#4787f0', '#001f97'],
    icon: 'chart-pie',
  },
  {
    id: 'success_count',
    title: '成功数',
    value: 1000000,
    unit: '',
    // 3-6
    colors: ['#85dbbe', '#078d5c'],
    icon: 'check-circle',
  },
  {
    id: 'fail_count',
    title: '失败数',
    value: 999999,
    unit: '',
    // 4-7
    colors: ['#f78d94', '#c9353f'],
    icon: 'close-circle',
  },
  {
    id: 'error_count',
    title: '错误数',
    value: 666666,
    unit: '',
    colors: ['#f1cf50', '#f8cb23'],
    icon: 'info-circle',
  },
]
</script>
