<template>
  <page-container>
    <base-table
      ref="baseTableRef"
      :form-model="formModel"
      :field-list="fieldList"
      :columns="columns"
      :action-option-list="actionOptionList"
      url="/api/case_page"
    >
      <template #formActions>
        <t-button theme="primary" @click="$router.push('/api-case/add')">新增</t-button>
      </template>
    </base-table>
  </page-container>
</template>

<script setup lang="jsx">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { find } from 'lodash'
import { requestMethodList, caseStatusList } from '@/config/variables'
const store = useStore()
const isMobile = computed(() => store.getters.isMobile)

const baseTableRef = ref()
const formModel = ref({})
const selectChange = {
  change: () => {
    baseTableRef.value.getData = true
  },
}
const fieldList = [
  {
    label: '用例名称',
    value: 'case_name',
  },
  {
    label: '接口',
    value: 'request_url',
  },
  {
    label: '请求方式',
    component: 't-select',
    list: requestMethodList,
    value: 'request_method',
    on: selectChange,
  },
  {
    label: '用例状态',
    value: 'case_status',
    component: 't-select',
    list: caseStatusList,
    on: selectChange,
  },
  {
    label: '版本迭代',
    value: 'version_id',
    component: 'remote-select',
    extraProps: {
      url: '/api/project_version_page',
      labelKey: 'version_name',
    },
    on: selectChange,
  },
  {
    label: '模块',
    value: 'module_id',
    component: 'remote-select',
    extraProps: {
      url: '/api/module_app_page',
      labelKey: 'module_name',
    },
    on: selectChange,
  },
  {
    label: '创建者',
    value: 'creator_id',
    component: 'remote-select',
    extraProps: {
      url: '/api/user_page',
      labelKey: 'username',
    },
    on: selectChange,
  },
]

const actionOptionList = [
  {
    content: '执行',
    value: 'play-circle',
    theme: 'success',
    onClick() {},
  },
  {
    content: '编辑',
    value: 'edit',
    theme: 'primary',
    onClick() {
      console.log('编辑')
    },
  },
  {
    content: '日志',
    value: 'file',
    theme: 'warning',
    onClick() {},
  },
  {
    content: '复制',
    value: 'file-copy',
    theme: 'info',
    onClick() {},
  },
  {
    content: '删除',
    value: 'delete',
    theme: 'danger',
    onClick() {},
  },
]

const columns = computed(() => [
  {
    colKey: 'id',
    title: 'ID',
    ellipsis: true,
    width: 100,
  },
  {
    colKey: 'case_name',
    title: '用例名称',
    ellipsis: true,
    width: 200,
  },
  {
    colKey: 'request_method',
    title: '请求方式',
    ellipsis: true,
    width: 120,
    render: (h, { row, type }) =>
      type !== 'title' && (
        <t-tag
          theme={find(requestMethodList, { value: row.request_method })?.theme}
          variant="light"
        >
          {row.request_method}
        </t-tag>
      ),
  },
  {
    colKey: 'request_base_url',
    title: '请求地址',
    ellipsis: true,
    width: 200,
  },
  {
    colKey: 'request_url',
    title: '接口',
    ellipsis: true,
    width: 140,
  },
  {
    colKey: 'total_execution',
    title: '执行次数',
    ellipsis: true,
    width: 120,
  },
  {
    colKey: 'case_status',
    title: '用例状态',
    ellipsis: true,
    width: 120,
    render: (h, { row, type }) => {
      if (type !== 'title') {
        const status = find(caseStatusList, { value: row.case_status })
        return (
          status && (
            <t-tag theme={status?.theme} variant="light">
              {status.label}
            </t-tag>
          )
        )
      }
    },
  },
  {
    colKey: 'creator',
    title: '创建者',
    ellipsis: true,
    width: 120,
  },
  {
    colKey: 'create_time',
    title: '创建时间',
    ellipsis: true,
    width: 200,
  },
  {
    colKey: 'modifier',
    title: '更新者',
    ellipsis: true,
    width: 120,
  },
  {
    colKey: 'update_time',
    title: '更新时间',
    ellipsis: true,
    width: 200,
  },
  {
    colKey: 'remark',
    title: '备注',
    ellipsis: true,
    width: 180,
  },
])
</script>

<style lang="scss" scoped></style>