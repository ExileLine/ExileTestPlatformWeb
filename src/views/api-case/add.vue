<template>
  <page-container>
    <t-row :gutter="20" class="mb-30">
      <t-col :md="5" :xs="12">
        <div class="mb-20 fs-20 fw-600 mt-10">用例信息</div>
        <common-form
          label-width="100px"
          :data="addModel"
          :field-list="fieldList"
          confirm-text="保存"
        />
      </t-col>
    </t-row>

    <t-row :gutter="20">
      <t-col :md="8" :xs="12">
        <div class="mb-20 fs-20 fw-600 mt-10">参数信息</div>
        <div class="justify-end mb-10">
          <t-button>
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
                  <div class="pt-10">
                    <component :is="tab.component" :data="data.data_info[tab.key]" />
                  </div>
                </t-tab-panel>
              </t-tabs>
            </div>
          </t-tab-panel>
        </t-tabs>
      </t-col>
    </t-row>
  </page-container>
</template>

<script setup>
import { ref } from 'vue'
import { requestMethodList, caseStatusList } from '@/config/variables'
import QueryTable from './components/QueryTable.vue'
const switchLabel = ['是', '否']
const addModel = ref({})
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
    extraProps: {
      allowCreate: true,
      url: '/api/case_env_page',
      labelKey: 'env_name',
      class: 'wp-100',
      placeholder: '请选择或输入环境',
    },
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
]

const paramsTab = ref(paramsTabList[0].label)

let cid = 0
const dataInfoTab = ref()
const data_list = ref([
  {
    data_info: {
      create_time: '2022-06-27 14:02:18',
      create_timestamp: 1656309738,
      creator: 'shell',
      creator_id: 999999,
      data_after: [],
      data_before: [],
      data_name: '测试数据:12',
      data_size: 69,
      id: 12,
      cid: 1,
      is_after: 0,
      is_before: 0,
      is_deleted: 0,
      is_public: 1,
      md5: null,
      modifier: 'user_00008',
      modifier_id: 8,
      remark: '脚本生成',
      request_params_hash: {
        token: {
          active: true,
          key: 'token',
          value: '123456',
          desc: 'token',
        },
      },
      request_headers_hash: {
        token: {
          key: 'token23213',
          active: true,
          value: '123456',
          desc: 'token',
        },
      },
      request_body_hash: {
        id: {
          active: true,
          value: '123',
          desc: '用例id',
        },
        name: {
          active: false,
          value: '123',
          desc: '名称',
        },
        user_id: {
          active: true,
          value: '${user_id}',
          desc: '名称',
        },
      },
      request_body: '{\n\t"password": 2452572,\n\t"user_id": "${user_id}"\n}',
      request_body_type: 2,
      request_headers: '{\n\t"token": "${token}"\n}',
      request_params: '{}',
      status: 1,
      update_time: '2022-08-12 14:36:22',
      update_timestamp: 1659575846,
      update_var_list: [],
      var_list: null,
    },
    ass_resp_id_list: [],
    ass_field_id_list: [],
  },
  {
    data_info: {
      create_time: '2022-06-27 14:02:18',
      create_timestamp: 1656309738,
      creator: 'shell',
      creator_id: 999999,
      data_after: [],
      data_before: [],
      data_name: '测试数据测试数据测试数据',
      data_size: 69,
      id: 12,
      cid: 2,
      is_after: 0,
      is_before: 0,
      is_deleted: 0,
      is_public: 1,
      md5: null,
      modifier: 'user_00008',
      modifier_id: 8,
      remark: '脚本生成',
      request_body: '{\n\t"password": 2452572,\n\t"user_id": "${user_id}"\n}',
      request_body_type: 2,
      request_headers: '{\n\t"token": "${token}"\n}',
      request_params: '{}',
      status: 1,
      update_time: '2022-08-12 14:36:22',
      update_timestamp: 1659575846,
      update_var_list: [],
      var_list: null,
    },
    ass_resp_id_list: [],
    ass_field_id_list: [],
  },
  {
    data_info: {
      create_time: '2022-06-27 14:02:18',
      create_timestamp: 1656309738,
      creator: 'shell',
      creator_id: 999999,
      data_after: [],
      data_before: [],
      data_name: '3333',
      data_size: 69,
      id: 12,
      cid: 3,
      is_after: 0,
      is_before: 0,
      is_deleted: 0,
      is_public: 1,
      md5: null,
      modifier: 'user_00008',
      modifier_id: 8,
      remark: '脚本生成',
      request_body: '{\n\t"password": 2452572,\n\t"user_id": "${user_id}"\n}',
      request_body_type: 2,
      request_headers: '{\n\t"token": "${token}"\n}',
      request_params: '{}',
      status: 1,
      update_time: '2022-08-12 14:36:22',
      update_timestamp: 1659575846,
      update_var_list: [],
      var_list: null,
    },
    ass_resp_id_list: [],
    ass_field_id_list: [],
  },
])

dataInfoTab.value = data_list.value[0].data_info.cid

const removeDataInfoTab = ({ index }) => {
  data_list.value.splice(index, 1)
}
</script>

<style lang="scss" scoped></style>
