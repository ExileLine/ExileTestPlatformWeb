<template>
  <t-tabs theme="card" class="t-card--shadow" :default-value="tabs[0].label">
    <t-tab-panel v-for="tab in tabs" :key="tab.label" :value="tab.label" :label="tab.label">
      <template v-if="tab.executeLog.length">
        <log-tabs :execute-log="tab.executeLog" />
      </template>
      <template v-else>
        <div class="h-600 flex-col-center ">
          <base-empty :description="`暂无${tab.label}日志`" />
        </div>
      </template>
    </t-tab-panel>
  </t-tabs>
</template>

<script setup>
import { computed } from 'vue'
import { filter } from 'lodash'
import BaseEmpty from '@/components/BaseEmpty/index.vue'
import LogTabs from './LogTabs.vue'

const props = defineProps({
  executeLog: {
    type: [Array, Object],
    required: true,
  },
})

const tabs = computed(() => {
  const { executeLog } = props
  return [
    {
      label: '全部',
      executeLog,
    },
    {
      label: '成功',
      executeLog: filter(executeLog, i => !i.fail),
    },
    {
      label: '失败',
      executeLog: filter(executeLog, 'fail'),
    },
  ]
})
</script>

<style lang="scss" scoped></style>
