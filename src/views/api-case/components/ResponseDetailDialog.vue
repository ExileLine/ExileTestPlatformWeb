<template>
  <t-dialog
    :visible="visible"
    :footer="false"
    header="响应详情"
    width="1000px"
    destroy-on-close
    placement="center"
    @close="$emit('update:visible', false)"
  >
    <div class="mb-20">
      <t-tag :theme="methodTheme" variant="light" class="mr-10">{{ info.request_method }}</t-tag>
      <t-tag variant="light">{{ info.url }}</t-tag>
    </div>
    <t-card shadow class="mb-20">
      <div class="mb-10">
        <t-tag theme="success" variant="light">{{ bodyType }}</t-tag>
        请求参数：
      </div>
      <div class="json-editor-container">
        <json-editor read-only :model-value="requestBody" :mode="bodyTypeMode" />
      </div>
    </t-card>

    <div v-if="isMobile" :class="respCodeClass">
      <span class="mr-10">响应码：{{ info.http_code }}</span>
      <span class="text-success-6">耗时：{{ info.time }}</span>
    </div>
    <div class="resp-shadow">
      <div v-if="!isMobile" class="resp-code" :class="respCodeClass">
        <span class="mr-10">响应码：{{ info.http_code }}</span>
        <span class="text-success-6">耗时：{{ info.time }}</span>
      </div>
      <t-tabs :default-value="respTabList[0].label" theme="card">
        <t-tab-panel
          v-for="resp in respTabList"
          :value="resp.label"
          :key="resp.label"
          :label="resp.label"
        >
          <div class="json-editor-container">
            <json-editor read-only :model-value="resp.value" mode="application/json" />
          </div>
        </t-tab-panel>
      </t-tabs>
    </div>
  </t-dialog>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { find, toUpper, keys } from 'lodash'
import JsonEditor from '@/components/JsonEditor/index.vue'
import { requestMethodList, bodyTypeList } from '@/config/variables'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  info: {
    type: Object,
    default: () => ({}),
  },
})

const store = useStore()
const isMobile = computed(() => store.getters.isMobile)

const methodTheme = computed(
  () => find(requestMethodList, { value: props.info.request_method })?.theme
)

const bodyTypeMode = computed(
  () => find(bodyTypeList, { value: props.info.request_body_type })?.mode
)

const isGet = computed(() => toUpper(props.info.request_method) === 'GET')
const bodyType = computed(() => (isGet.value ? 'Params' : props.info.request_body_type))

const requestBody = computed(() =>
  isGet.value ? props.info.request_params : props.info.request_body
)
const getKeysLen = obj => {
  return keys(obj).length
}
const respTabList = computed(() => {
  const { response_body, request_headers, response_headers } = props.info
  return [
    {
      value: response_body,
      label: `响应(${getKeysLen(response_body)})`,
    },
    {
      value: request_headers,
      label: `请求头(${getKeysLen(request_headers)})`,
    },
    {
      value: response_headers,
      label: `响应头(${getKeysLen(response_headers)})`,
    },
  ]
})

const respCodeClass = computed(() => {
  const { http_code } = props.info
  if (http_code >= 400) {
    return 'text-error-6 '
  }
  if (http_code >= 300) {
    return 'text-warning-6 '
  }
  if (http_code >= 200) {
    return 'text-success-6 '
  }
  return 'text-gray-6 '
})
</script>

<style lang="scss" scoped>
.resp-shadow {
  position: relative;
  border: 1px solid var(--td-component-border);
  box-shadow: var(--td-shadow-1);
  border-radius: var(--td-radius-medium);
  overflow: hidden;
}
.resp-code {
  position: absolute;
  z-index: 10;
  right: 10px;
  top: 12px;
}
.json-editor-container {
  height: 260px;
}
</style>
