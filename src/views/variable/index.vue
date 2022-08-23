<template>
  <page-container>
    <base-table
      ref="baseTableRef"
      :form-model="formModel"
      :field-list="fieldList"
      :columns="columns"
      :action-option-list="actionOptionList"
      url="/api/case_variable_page"
    >
      <template #formActions>
        <t-button theme="primary" @click="userDialogVisible = true">新增</t-button>
      </template>
    </base-table>
  </page-container>
</template>

<script setup lang="jsx">
import { ref, computed, inject } from 'vue'
import { cloneDeep, find } from 'lodash'
import { confirmDialog } from '@/utils/business'
import { varSourceList, variableTypeList } from '@/config/variables'

const baseTableRef = ref()
const formModel = ref({})
const selectChange = {
  change: () => {
    baseTableRef.value.getData = true
  },
}
const message = inject('message')
const fieldList = [
  {
    label: '变量名称',
    value: 'var_name',
  },
  {
    label: '变量类型',
    component: 't-select',
    list: variableTypeList,
    value: 'var_type',
    on: selectChange,
  },
  {
    label: '来源',
    component: 't-select',
    list: varSourceList,
    value: 'var_source',
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

const userDialogVisible = ref(false)
const userForm = ref({})

const actionOptionList = [
  {
    content: '编辑',
    value: 'edit',
    theme: 'primary',
    onClick({ row }) {
      userForm.value = cloneDeep(row)
      userDialogVisible.value = true
    },
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
    colKey: 'var_name',
    title: '变量名称',
    ellipsis: true,
    width: 200,
  },
  {
    colKey: 'var_init_value',
    title: '变量初始值',
    ellipsis: true,
    width: 200,
  },
  {
    colKey: 'var_value',
    title: '变量当前值',
    ellipsis: true,
    width: 200,
  },
  {
    colKey: 'var_type',
    title: '类型',
    ellipsis: true,
    width: 180,
    render: (h, { row, type }) => {
      const status = find(variableTypeList, { value: row.var_type })
      return status?.label
    },
  },
  {
    colKey: 'var_source',
    title: '来源',
    ellipsis: true,
    width: 100,
    render: (h, { row, type }) => {
      const status = find(varSourceList, { value: row.var_source })
      return status?.label
    },
  },
  {
    colKey: 'create_time',
    title: '创建时间',
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
