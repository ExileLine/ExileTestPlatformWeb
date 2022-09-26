<template>
  <t-row :gutter="20">
    <t-col :xl="7" class="mb-20">
      <t-card :bordered="false">
        <t-row :gutter="20" class="wp-100">
          <t-col class="hp-100" :md="3" :xs="12">
            <h3>仪表盘</h3>
            <p>执行周期统计</p>
            <h3>
              <count-to :start-value="0" :end-value="7754" />
            </h3>
            <p>当前执行成功数</p>
            <h3>
              <count-to :start-value="0" :end-value="1234" />
            </h3>
            <p>当前执行失败数</p>
            <t-button theme="primary">
              <template #icon>
                <t-icon name="cloud-download"></t-icon>
              </template>
              当天报表
            </t-button>
          </t-col>
          <t-col class="flex-1-hidden hp-100" :md="9" :xs="12">
            <div ref="lineRef" class="wp-100 hp-100 chart-container"></div>
          </t-col>
        </t-row>
      </t-card>
    </t-col>
    <t-col :xl="5" class="mb-20">
      <t-card :bordered="false">
        <div ref="pieRef" class="wp-100 chart-container"></div>
      </t-card>
    </t-col>
  </t-row>
</template>

<script setup>
import { computed, ref } from 'vue'
import CountTo from '@/components/CountTo/index.vue'
import { useEcharts } from '@/composables/echarts'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
    required: true,
  },
})
const lineOptions = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985',
      },
    },
  },
  legend: {
    data: ['成功', '失败'],
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: [
        '06:00',
        '08:00',
        '10:00',
        '12:00',
        '14:00',
        '16:00',
        '18:00',
        '20:00',
        '22:00',
        '24:00',
      ],
    },
  ],
  yAxis: [
    {
      type: 'value',
    },
  ],
  series: [
    {
      color: '#85dbbe',
      name: '成功',
      type: 'line',
      smooth: true,
      stack: 'Total',
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0.25,
              color: '#85dbbe',
            },
            {
              offset: 1,
              color: '#fff',
            },
          ],
        },
      },
      emphasis: {
        focus: 'series',
      },
      data: [4623, 6145, 6268, 6411, 1890, 4251, 2978, 3880, 3606, 4311],
    },
    {
      color: '#f78d94',
      name: '失败',
      type: 'line',
      smooth: true,
      stack: 'Total',
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0.25,
              color: '#f78d94',
            },
            {
              offset: 1,
              color: '#fff',
            },
          ],
        },
      },
      emphasis: {
        focus: 'series',
      },
      data: [2208, 2016, 2916, 4512, 8281, 2008, 1963, 2367, 2956, 678],
    },
  ],
})

const { domRef: lineRef } = useEcharts(lineOptions)
const pieOptions = computed(() => ({
  tooltip: {
    trigger: 'item',
  },
  legend: {
    bottom: '1%',
    left: 'center',
    itemStyle: {
      borderWidth: 0,
    },
  },
  series: [
    {
      color: ['#85dbbe', '#f78d94', '#f1cf50', '#4787f0'],
      name: '时间安排',
      type: 'pie',
      radius: ['45%', '75%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 1,
      },
      label: {
        show: false,
        position: 'center',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '12',
        },
      },
      labelLine: {
        show: false,
      },
      data: [
        { value: props.data.total_execute_success, name: '成功' },
        { value: props.data.total_execute_fail, name: '失败' },
        { value: props.data.total_execute_error, name: '错误' },
        { value: props.data.total_execute_count, name: '执行' },
      ],
    },
  ],
}))

const { domRef: pieRef } = useEcharts(pieOptions)
</script>

<style scoped>
.chart-container {
  height: 360px;
}
</style>
