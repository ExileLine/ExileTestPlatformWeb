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
    id: 'case',
    title: '用例数',
    value: 1000000,
    unit: '',
    colors: ['#ec4786', '#b955a4'],
    icon: 'chart'
  },
  {
    id: 'execute_count',
    title: '执行数',
    value: 234567.89,
    unit: '',
    colors: ['#865ec0', '#5144b4'],
    icon: 'chart-bar'
  },
  {
    id: 'success',
    title: '成功数',
    value: 666666,
    unit: '',
    colors: ['#56cdf3', '#719de3'],
    icon: 'chart-bubble'
  },
  {
    id: 'fail',
    title: '失败数',
    value: 999999,
    unit: '',
    colors: ['#fcbc25', '#f68057'],
    icon: 'chart-pie'
  },

  //
  {
    id: 'case1',
    title: '用例数',
    value: 1000000,
    unit: '',
    colors: ['#ec4786', '#b955a4'],
    icon: 'chart'
  },
  {
    id: 'execute_count1',
    title: '执行数',
    value: 234567.89,
    unit: '',
    colors: ['#865ec0', '#5144b4'],
    icon: 'chart-bar'
  },
  {
    id: 'success1',
    title: '成功数',
    value: 666666,
    unit: '',
    colors: ['#56cdf3', '#719de3'],
    icon: 'chart-bubble'
  },
  {
    id: 'fail1',
    title: '失败数',
    value: 999999,
    unit: '',
    colors: ['#fcbc25', '#f68057'],
    icon: 'chart-pie'
  }
]
</script>
