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
          <t-button @click="addReqData">
            <t-icon name="add" />
          </t-button>
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
              <t-tooltip :content="data.data_info.data_name" placement="left">
                <span class="ellipsis" style="width: 10em">{{ data.data_info.data_name }}</span>
              </t-tooltip>
            </template>
            <div class="p-10">
              <t-input
                v-model="data.data_info.data_name"
                class="mb-10 w-200"
                placeholder="请输入参数名称"
              />
              <t-tabs v-model:value="paramsTab" theme="card">
                <t-tab-panel v-for="tab in paramsTabList" :value="tab.label" :label="tab.label">
                  <div class="pt-10 body-container">
                    <component
                      :is="tab.component"
                      v-model:data="data.data_info[tab.key]"
                      v-model:body-type="data.data_info.request_body_type"
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
  </page-container>
</template>

<script setup>
import { ref, reactive, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { requestMethodList, caseStatusList } from '@/config/variables'
import QueryTable from './components/QueryTable.vue'
import BodyJson from './components/BodyJson.vue'
import { fetchAddCase, fetchBindCase } from '@/api/api-case'
import { validateRequired } from '@/components/validate'

const store = useStore()
const route = useRoute()
const router = useRouter()
const message = inject('message')

const caseFormRef = ref()

const switchLabel = ['是', '否']
const addModel = reactive({})
const fieldList = [
  {
    value: 'version_list',
    label: '迭代版本',
    component: 'remote-select',
    extraProps: {
      url: '/api/project_version_page',
      labelKey: 'version_name',
      valueKey: 'id',
      class: 'wp-100',
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
      class: 'wp-100',
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
  },
  {
    label: '前置条件',
  },
  {
    label: '后置条件',
  },
  {
    label: '响应断言',
  },
  {
    label: '字段断言',
  },
]

const paramsTab = ref(paramsTabList[0].label)

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
  ass_resp_id_list: [],
  ass_field_id_list: [],
})
const data_list = ref([genReqData()])
data_list.value.forEach(i => (i.data_info.cid = cid++))

dataInfoTab.value = data_list.value[0].data_info.cid

const addReqData = () => {
  data_list.value.push(genReqData())
  dataInfoTab.value = cid
}
const removeDataInfoTab = ({ index }) => {
  if (data_list.value.length > 1) {
    data_list.value.splice(index, 1)
  }
}

const saveCase = async () => {
  const { id } = await fetchAddCase(addModel)
  message.success('保存成功')
  return id
}

const submitCase = async () => {
  const validateResult = await caseFormRef.value.validate()
  if (validateResult === true) {
    const case_id = await saveCase()
    await fetchBindCase({
      case_id,
      data_list: data_list.value,
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
  z-index: 2;
}
</style>
