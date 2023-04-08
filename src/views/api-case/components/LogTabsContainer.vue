<template>
  <t-tabs theme="card" class="t-card--shadow" :default-value="tabs[0].label">
    <t-tab-panel v-for="tab in tabs" :key="tab.label" :value="tab.label" :label="tab.label">
      <template v-if="tab.executeLog.length">
        <template v-if="isScene">
          <t-tabs class="t-card--shadow" default-value="0">
            <t-tab-panel
              v-for="(scenario, idx) in tab.executeLog"
              :key="idx"
              :value="idx + ''"
              :label="scenario.scenario_title"
            >
              <template #label>
                {{ scenario.scenario_title }}
                <t-icon
                  v-if="scenario.flag === false"
                  name="close-circle"
                  class="text-error-6 ml-5"
                />
                <t-icon v-else name="check-circle" class="text-success-6 ml-5" />
              </template>
              <log-tabs :execute-log="scenario.case_dict" />
            </t-tab-panel>
          </t-tabs>
        </template>
        <template v-else-if="isUiCase">
          <t-tabs class="t-card--shadow" default-value="0">
            <t-tab-panel
              v-for="(uiCase, idx) in tab.executeLog"
              :key="idx"
              :value="idx + ''"
              :label="uiCase.execute_name"
            >
              <template #label>
                {{ uiCase.execute_name }}
                <t-icon
                  v-if="uiCase.result_summary.execute_fail"
                  name="close-circle"
                  class="text-error-6 ml-5"
                />
                <t-icon v-else name="check-circle" class="text-success-6 ml-5" />
              </template>
              <div class="h-600 overflow-y narrow-scrollbar">
                <t-tabs default-value="ui_case_logs">
                  <t-tab-panel value="ui_case_logs" key="ui_case_logs" label="日志汇总">
                    <json-editor
                      read-only
                      :model-value="uiCase.ui_case_logs"
                      mode="application/json"
                    />
                  </t-tab-panel>
                  <t-tab-panel value="logs_summary" key="logs_summary" label="错误节点">
                    <json-editor
                      read-only
                      :model-value="
                        uiCase.result_summary.execute_fail ? uiCase.ui_case_logs.slice(-2) : []
                      "
                      mode="application/json"
                    />
                  </t-tab-panel>
                </t-tabs>
              </div>
            </t-tab-panel>
          </t-tabs>
        </template>
        <template v-else>
          <log-tabs :execute-log="tab.executeLog" />
        </template>
      </template>
      <template v-else>
        <div class="h-600 flex-col-center">
          <base-empty :description="`暂无${tab.label}日志`" />
        </div>
      </template>
    </t-tab-panel>
  </t-tabs>
</template>

<script setup>
import { computed } from 'vue'
import { filter } from 'lodash'
import JsonEditor from '@/components/JsonEditor/index.vue'
import BaseEmpty from '@/components/BaseEmpty/index.vue'
import LogTabs from './LogTabs.vue'

const props = defineProps({
  executeLog: {
    type: [Array, Object],
    required: true,
  },
  isScene: {
    type: Boolean,
    default: false,
  },
  isUiCase: {
    type: Boolean,
    default: false,
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
      executeLog: filter(executeLog, 'flag'),
    },
    {
      label: '失败',
      executeLog: filter(executeLog, i => !i.flag),
    },
  ]
})
</script>

<style lang="scss" scoped></style>
