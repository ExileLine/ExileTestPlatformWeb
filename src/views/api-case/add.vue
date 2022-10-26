<template>
  <page-container>
    <t-row :gutter="20" class="mb-30">
      <t-col :md="5" :xs="12">
        <div class="mb-20 fs-20 fw-600 mt-10">用例信息</div>
        <common-form
          ref="caseFormRef"
          label-width="100px"
          :data="addModel"
          :rules="rules"
          :field-list="fieldList"
          confirm-text="保存"
          @confirm="saveCase"
        />
      </t-col>
    </t-row>

    <t-row :gutter="20">
      <t-col :md="12" :xs="12">
        <div class="mb-20 fs-20 fw-600 mt-10">参数信息</div>
        <div class="justify-end mb-10">
          <t-tooltip content="选择请求参数">
            <t-button theme="success" @click="paramListDialogVisible = true">
              <t-icon name="root-list"></t-icon>
            </t-button>
          </t-tooltip>
          <t-tooltip content="新增请求参数">
            <t-button theme="primary" @click="() => addReqData()">
              <t-icon name="add"></t-icon>
            </t-button>
          </t-tooltip>
        </div>
        <t-tabs
          v-model:value="dataInfoTab"
          placement="left"
          class="t-card--shadow"
          @remove="removeDataInfoTab"
        >
          <t-tab-panel
            v-for="(data, idx) in data_list"
            :idx="data.cid"
            :value="data.data_info.cid"
            :label="data.data_info.data_name"
            removable
          >
            <template #label>
              <div class="align-center">
                <t-tooltip content="设为默认" placement="left">
                  <span class="align-center" @click.stop="defaultCid = data.data_info.cid">
                    <t-radio :checked="data.data_info.cid === defaultCid">&nbsp;</t-radio>
                  </span>
                </t-tooltip>
                <t-tooltip :content="data.data_info.data_name" placement="left">
                  <span class="ellipsis" style="width: 10em">{{ data.data_info.data_name }}</span>
                </t-tooltip>
              </div>
            </template>
            <div class="p-10">
              <div class="mb-10 flex-between">
                <t-input
                  v-model="data.data_info.data_name"
                  class="w-200"
                  placeholder="请输入参数名称"
                />

                <t-button theme="success" @click="sendCase(data.data_info)">发送</t-button>
              </div>
              <t-tabs v-model:value="paramsTab" theme="card">
                <t-tab-panel v-for="tab in paramsTabList" :value="tab.label" :label="tab.label">
                  <div class="pt-10 body-container">
                    <component
                      v-if="tab.isAssert"
                      v-model:data="data[tab.key]"
                      :is="tab.component"
                      @get-assertion-list="type => getAssertionList(type, data)"
                      @add="type => addAssertionRule(type, data)"
                      @edit="(type, row) => editAssertionRule(type, row, data)"
                    />
                    <component
                      v-else
                      :is="tab.component"
                      v-model:data="data.data_info[tab.key]"
                      v-model:body-type="data.data_info.request_body_type"
                      @get-variable-list="() => getVariableList(data)"
                    />
                  </div>
                </t-tab-panel>
              </t-tabs>
            </div>
          </t-tab-panel>
        </t-tabs>
      </t-col>
    </t-row>

    <t-button class="case-btn" size="medium" @click="submitCase">
      <t-icon name="check" />
      提交
    </t-button>
    <response-detail-dialog v-model:visible="responseDetailDialogVisible" :info="responseDetail" />
    <response-rule-dialog
      ref="respRef"
      v-model:visible="responseRuleVisible"
      :data="responseForm"
      @save="saveAssertionRule"
      @close="responseForm = { ass_json: [] }"
    />
    <assert-list-dialog
      v-model:visible="assertListDialogVisible"
      :assertion-type="assertListRuleType"
      :info="dataInfo"
      @bind="bindAssertion"
    />

    <param-list-dialog v-model:visible="paramListDialogVisible" @bind="addReqData" />
    <variable-list-dialog v-model:visible="variableListDialogVisible" @bind="addVariableData" />
  </page-container>
</template>

<script setup>
import { ref, inject, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { map, find, findIndex } from 'lodash'
import { requestMethodList, caseStatusList } from '@/config/variables'
import QueryTable from './components/QueryTable.vue'
import BodyJson from './components/BodyJson.vue'
import VariableTable from './components/VariableTable.vue'
import ResponseAssertTable from './components/ResponseAssertTable.vue'
import FieldAssertTable from './components/FieldAssertTable.vue'
import ResponseDetailDialog from './components/ResponseDetailDialog.vue'
import AssertListDialog from './components/AssertListDialog.vue'
import ParamListDialog from './components/ParamListDialog.vue'
import VariableListDialog from './components/VariableListDialog.vue'
import ResponseRuleDialog from '@/views/assert/component/ResponseRuleDialog.vue'
import {
  fetchGetCase,
  fetchAddCase,
  fetchUpdateCase,
  fetchBindCase,
  fetchSendCase,
} from '@/api/api-case'
import { fetchGetRespRule } from '@/api/assertion'
import { validateRequired } from '@/components/validate'
import { toSelectList, addVersionList, addModuleList } from '@/utils/business'

const store = useStore()
const route = useRoute()
const router = useRouter()
const message = inject('message')

const caseFormRef = ref()

const switchLabel = ['是', '否']
const addModel = ref({
  version_list: [],
  module_list: [],
})
const fieldList = [
  {
    value: 'version_list',
    label: '迭代版本',
    component: 'remote-select',
    extraProps: {
      url: '/api/project_version_page',
      labelKey: 'version_name',
      valueKey: 'id',
      valueType: 'object',
      multiple: true,
    },
  },
  {
    value: 'module_list',
    label: '模块',
    component: 'remote-select',
    extraProps: {
      url: '/api/module_app_page',
      labelKey: 'module_name',
      valueKey: 'id',
      valueType: 'object',
      multiple: true,
    },
  },
  {
    value: 'case_name',
    label: '用例名称',
  },
  {
    value: 'request_base_url',
    label: '请求地址',
  },
  {
    value: 'request_url',
    label: '接口',
  },
  {
    value: 'request_method',
    label: '请求方式',
    component: 't-select',
    list: requestMethodList,
    extraProps: {
      class: 'wp-100',
    },
  },
  {
    value: 'case_status',
    label: '用例状态',
    component: 't-select',
    list: caseStatusList,
    extraProps: {
      class: 'wp-100',
    },
  },
  {
    value: 'is_public',
    label: '公开使用',
    component: 't-switch',
    extraProps: {
      label: switchLabel,
    },
  },
  {
    value: 'is_shared',
    label: '公开执行',
    component: 't-switch',
    extraProps: {
      label: switchLabel,
    },
  },
  {
    value: 'remark',
    label: '备注',
    component: 't-textarea',
  },
]

const rules = {
  case_name: [validateRequired('请输入用例名称')],
  request_base_url: [validateRequired('请输入请求地址')],
  request_url: [validateRequired('请输入接口')],
  request_method: [validateRequired('请选择请求方式'), 'change'],
  case_status: [validateRequired('请选择用例状态'), 'change'],
}

const paramsTabList = [
  {
    label: 'Params',
    key: 'request_params_hash',
    component: QueryTable,
  },
  {
    label: 'Headers',
    key: 'request_headers_hash',
    component: QueryTable,
  },
  {
    label: 'Body',
    key: 'request_body_hash',
    component: BodyJson,
  },
  {
    label: '关系变量',
    key: 'update_var_list',
    component: VariableTable,
  },
  {
    label: '前置条件',
  },
  {
    label: '后置条件',
  },
  {
    label: '响应断言',
    isAssert: true,
    key: 'case_resp_ass_info',
    component: ResponseAssertTable,
  },
  {
    label: '字段断言',
    isAssert: true,
    key: 'case_field_ass_info',
    component: FieldAssertTable,
  },
]

const paramsTab = ref(paramsTabList[0].label)

let case_id = route.query.id

let cid = 0
const dataInfoTab = ref()

const genReqData = () => ({
  data_info: {
    cid: ++cid,
    data_after: [],
    data_before: [],
    data_name: '未命名',
    is_after: false,
    is_before: false,
    request_body_type: 'none',
    request_params_hash: [],
    request_headers_hash: [],
    request_body_hash: '',
    update_var_list: [],
    var_list: null,
  },
  case_field_ass_info: [],
  case_resp_ass_info: [],
})
const data_list = ref([genReqData()])
data_list.value.forEach(i => (i.data_info.cid = cid++))
const defaultCid = ref()

const paramListDialogVisible = ref(false)
const addReqData = row => {
  if (row) {
    const hasReqData = find(data_list.value, ({ data_info }) => data_info.id === row.id)
    if (hasReqData) {
      return message.warning(`参数(${row.data_name})已关联用例`)
    }
    data_list.value.push({
      data_info: {
        cid: ++cid,
        ...row,
      },
      case_field_ass_info: [],
      case_resp_ass_info: [],
    })
  } else {
    data_list.value.push(genReqData())
  }
  dataInfoTab.value = cid
}

const removeDataInfoTab = ({ index }) => {
  if (data_list.value.length > 1) {
    const [deleteItem] = data_list.value.splice(index, 1)
    if (dataInfoTab.value === deleteItem.data_info.cid) {
      const idx = index - 1 < 0 ? 0 : index - 1
      defaultCid.value = dataInfoTab.value = data_list.value[idx].data_info.cid
    }
  }
}

const saveCase = async () => {
  const caseParams = addVersionList(addModuleList(addModel.value))
  if (!case_id) {
    const { id } = await fetchAddCase(caseParams)
    message.success('用例保存成功')
    return id
  }
  await fetchUpdateCase(caseParams)
  message.success('用例保存成功')
  return case_id
}

const submitCase = async () => {
  const validateResult = await caseFormRef.value.validate()
  if (validateResult === true) {
    const case_id = await saveCase()
    const bindParams = data_list.value.sort(({ data_info }, { data_info: next }) => {
      if (data_info.cid === defaultCid.value) return -1
      if (next.cid === defaultCid.value) return 1
      return 0
    })
    await fetchBindCase({
      case_id,
      data_list: map(bindParams, item => ({
        ...item,
        ass_resp_id_list: map(item.case_resp_ass_info, 'id'),
        ass_field_id_list: map(item.case_field_ass_info, 'id'),
      })),
    })
    message.success('操作成功')
    store.commit('app/delTag', route.fullPath)
    router.push({
      path: '/api-case',
    })
  } else {
    message.warning('请填写必选项')
  }
}

const responseDetailDialogVisible = ref(false)
const responseDetail = ref({})

const sendCase = async record => {
  responseDetail.value = await fetchSendCase({
    ...addModel.value,
    ...record,
  })
  responseDetailDialogVisible.value = true
}

// 响应断言规则
const dataInfo = ref({
  data_info: {},
})
const responseRuleVisible = ref(false)
const responseForm = ref({
  ass_json: [],
  version_list: [],
})
const assertListRuleType = ref('response')
const assertListDialogVisible = ref(false)
const setAssertionRule = (type, info) => {
  dataInfo.value = info
  assertListRuleType.value = type
}
const getAssertionList = (type, info) => {
  setAssertionRule(type, info)
  assertListDialogVisible.value = true
}
const addAssertionRule = (type, info) => {
  setAssertionRule(type, info)
  if (assertListRuleType.value === 'response') {
    responseRuleVisible.value = true
  }
}

const editAssertionRule = async (type, row, info) => {
  setAssertionRule(type, info)
  if (assertListRuleType.value === 'response') {
    responseForm.value = await fetchGetRespRule(row.id)
    responseRuleVisible.value = true
  }
}
function getAssInfo() {
  let list
  if (assertListRuleType.value === 'response') {
    list = dataInfo.value.case_resp_ass_info
  } else {
    list = dataInfo.value.case_field_ass_info
  }
  return list
}
const bindAssertion = row => {
  const assertRuleList = getAssInfo()
  const hasRule = find(assertRuleList, { id: row.id })
  if (hasRule) {
    return message.warning(
      `参数(${dataInfo.value.data_info.data_name})已关联：${row.assert_description}`
    )
  }
  assertRuleList.push(row)
}

const saveAssertionRule = (rule, isUpdate) => {
  const assertRuleList = getAssInfo()
  if (isUpdate) {
    const idx = findIndex(assertRuleList, { id: rule.id })
    assertRuleList[idx] = rule
  } else {
    assertRuleList.push(rule)
  }
}

// 变量
const variableInfo = ref({})
const variableListDialogVisible = ref(false)
const getVariableList = info => {
  variableInfo.value = info
  variableListDialogVisible.value = true
}

const currentReqData = computed(() => {
  return find(data_list.value, ({ data_info }) => data_info.cid === dataInfoTab.value)
})

const addVariableData = row => {
  const data_info = currentReqData.value.data_info
  const var_list = data_info.update_var_list
  const hasReqData = find(var_list, ({ id }) => id === row.id)
  if (hasReqData) {
    return message.warning(`变量(${row.var_name})已关联参数：${data_info.data_name}`)
  }
  var_list.push(row)
}

onMounted(async () => {
  if (case_id) {
    const { bind_info, case_info } = await fetchGetCase(case_id)
    addModel.value = {
      ...case_info,
      version_list: toSelectList(case_info.version_list, 'version_name'),
      module_list: toSelectList(case_info.module_list, 'module_name'),
    }
    data_list.value = map(bind_info, item => {
      item.data_info.cid = ++cid
      return item
    })

    if (bind_info.some(i => i.data_info.request_body_type !== 'none')) {
      paramsTab.value = paramsTabList[2].label
    }
  }

  defaultCid.value = dataInfoTab.value = data_list.value[0].data_info.cid
})
</script>

<style lang="scss" scoped>
.body-container {
  min-height: 500px;
  display: flex;
  flex-direction: column;
}

.case-btn {
  position: fixed;
  right: 40px;
  bottom: 60px;
  z-index: 100;
}
</style>
