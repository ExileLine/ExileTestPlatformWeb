<template>
  <page-container>
    <base-table
      :form-model="formModel"
      :field-list="fieldList"
      :columns="columns"
      url="/api/case_page"
    >
      <template #formActions>
        <t-button theme="primary">新增</t-button>
      </template>
    </base-table>
  </page-container>
</template>

<script setup lang="jsx">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const isMobile = computed(() => store.getters.isMobile)
const formModel = ref({})
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
    value: 'request_method',
  },
  {
    label: '用例状态',
    value: 'case_status',
  },
  {
    label: '版本迭代',
    value: 'version_id',
  },
  {
    label: '模块',
    value: 'module_id',
  },
  {
    label: '创建者',
    value: 'creator',
  },
]

const actionOptionList = [
  {
    content: '编辑',
    value: 'edit',
  },
  {
    content: '禁用',
    value: 'error-circle',
  },
  {
    content: '删除',
    value: 'delete',
  },
]

const renderAction = () => {
  if (isMobile.value) {
    return (
      <t-dropdown options={actionOptionList}>
        <t-button variant="outline">更多...</t-button>
      </t-dropdown>
    )
  }
  return (
    <div>
      <t-button theme="primary" variant="text">
        <t-icon name="edit" />
      </t-button>
      <t-button theme="warning" variant="text">
        <t-icon name="error-circle" />
      </t-button>
      <t-button theme="danger" variant="text">
        <t-icon name="delete" />
      </t-button>
    </div>
  )
}

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
  {
    colKey: 'action',
    title: '操作',
    width: isMobile.value ? 120 : 210,
    fixed: 'right',
    render: (h, { type }) => type !== 'title' && renderAction(),
  },
])
</script>

<style lang="scss" scoped></style>
