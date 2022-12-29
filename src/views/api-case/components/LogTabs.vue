<template>
  <t-tabs class="case-tabs" :default-value="defaultValue">
    <t-tab-panel v-for="(log, idx) in executeLog" :key="log.case_id" :value="String(idx)"
      :label="`${log.case_name}（${idx + 1}）`">
      <template #label>
        {{ log.case_name }}（{{ idx + 1 }}）
        <t-icon v-if="!log.flag" name="close-circle" class="text-error-6 ml-5" />
        <t-icon v-else name="check-circle" class="text-success-6 ml-5" />
      </template>
      <div class="pt-10"></div>
      <div class="h-600 overflow-y narrow-scrollbar">
        <t-collapse :default-value="getCollapseDefaultValue(log.data_dict)">
          <t-collapse-panel v-for="(data, key) in log.data_dict" :key="key" :value="String(key)"
            :header="data.data_name" destroy-on-collapse>
            <template #headerRightContent>
              <t-icon v-if="!data.flag" name="close-circle" class="text-error-6" />
              <t-icon v-else name="check-circle" class="text-success-6" />
            </template>
            <t-tabs default-value="logs_summary">
              <t-tab-panel value="logs_summary" key="logs_summary" label="日志汇总">
                <json-editor read-only :model-value="data.logs_summary" mode="application/json" />
              </t-tab-panel>
              <t-tab-panel v-for="tab in tabs" :value="tab.key" :key="tab.key" :label="data.logs[tab.key].description">
                <template #label>
                  {{ data.logs[tab.key].description }}
                  <t-icon v-if="data.logs[tab.key].flag === false" name="close-circle" class="text-error-6 ml-5" />
                </template>
                <json-editor read-only :model-value="data.logs[tab.key].logs" mode="application/json" />
              </t-tab-panel>
            </t-tabs>
          </t-collapse-panel>
        </t-collapse>
      </div>
    </t-tab-panel>
  </t-tabs>
</template>

<script setup>
import { computed } from 'vue'
import { keys } from 'lodash'
import JsonEditor from '@/components/JsonEditor/index.vue'
const props = defineProps({
  executeLog: {
    type: [Array, Object],
    required: true,
  },
})
const tabs = [
  {
    label: '参数前置准备',
    key: 'request_before',
  },
  {
    label: '接口地址',
    key: 'url',
  },
  {
    label: '请求方式',
    key: 'method',
  },
  {
    label: '请求头',
    key: 'request_headers',
  },
  {
    label: '请求体',
    key: 'request_body',
  },
  {
    label: 'HTTP响应码',
    key: 'http_code',
  },

  {
    label: '响应头',
    key: 'response_headers',
  },
  {
    label: '响应体',
    key: 'response_body',
  },
  {
    label: '参数后置准备',
    key: 'request_after',
  },
  {
    label: '响应断言',
    key: 'response_assert',
  },
  {
    label: '字段断言',
    key: 'field_assert',
  },
]
const defaultValue = computed(() => {
  return keys(props.executeLog)[0]
})

const getCollapseDefaultValue = list => {
  return [keys(list)[0]]
}
</script>

<style lang="scss" scoped>
.case-tabs {
  overflow: hidden;

  ::v-deep(.t-collapse) {
    border: none;

    .t-collapse-panel__content {
      padding: 0;
    }

    .json-editor {
      height: 504px;
    }
  }
}
</style>
