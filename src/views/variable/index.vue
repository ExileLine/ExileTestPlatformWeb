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
        <t-button theme="primary" @click="variableDialogVisible = true">新增</t-button>
      </template>
    </base-table>

    <t-dialog
      v-model:visible="variableDialogVisible"
      :footer="null"
      placement="center"
      width="600px"
      header="新增变量"
      @close="close"
    >
      <common-form
        dialog
        ref="variableFormRef"
        :data="variableForm"
        :rules="variableRules"
        :field-list="variableFieldList"
        label-width="10em"
        confirm-text="确认"
        cancel-text="取消"
        @cancel="variableDialogVisible = false"
        @confirm="saveVariable"
      />
    </t-dialog>
  </page-container>
</template>

<script setup lang="jsx">
import { ref, computed, inject } from 'vue'
import { cloneDeep, find } from 'lodash'
import { confirmDialog } from '@/utils/business'
import { varSourceList, variableTypeList } from '@/config/variables'
import { validateRequired } from '@/components/validate'
import { fetchAddVariable, fetchUpdateVariable, fetchDeleteVariable } from '@/api/case-variable'

const message = inject('message')

const baseTableRef = ref()
const formModel = ref({})

const refresh = () => {
  baseTableRef.value.getData = true
}
const selectChange = {
  change: refresh,
}
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

const variableFormRef = ref()
const variableForm = ref({})
const variableDialogVisible = ref(false)

const actionOptionList = [
  {
    content: '编辑',
    value: 'edit',
    theme: 'primary',
    onClick({ row }) {
      // row.is_source = !!row.var_source
      variableForm.value = cloneDeep(row)
      variableDialogVisible.value = true
    },
  },
  {
    content: '删除',
    value: 'close',
    theme: 'danger',
    async onClick({ row }) {
      const dialog = await confirmDialog(
        <div>
          是否删除响应断言规则：<span class="text-warning-6">{row.var_name}</span>
        </div>
      )
      await fetchDeleteVariable(row)
      dialog.hide()
      message.success('操作成功')
      refresh()
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

//
const switchField = {
  component: 't-switch',
  extraProps: {
    label: ['是', '否'],
  },
}
const variableRules = {
  var_name: [validateRequired('请输入变量名称')],
  var_type: [validateRequired('请选择变量类型')],
}
const variableFieldList = computed(() => {
  const form = variableForm.value
  const is_source = {
    disabled: !form.is_source,
  }

  return [
    {
      label: '迭代版本',
      value: 'version_list',
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
      label: '变量名称',
      value: 'var_name',
    },
    {
      label: '变量类型',
      value: 'var_type',
      component: 't-select',
      list: variableTypeList,
    },
    {
      label: '变量值(初始值)',
      value: 'var_init_value',
    },
    {
      label: '变量值(当前值)',
      value: 'var_value',
    },
    {
      label: '动态变更',
      value: 'is_active',
      ...switchField,
    },
    {
      label: '动态获取',
      value: 'is_source',
      ...switchField,
    },
    {
      label: '变量来源',
      value: 'var_source',
      component: 't-select',
      list: varSourceList,
      extraProps: is_source,
    },
    {
      label: '取值的key',
      value: 'var_get_key',
      extraProps: is_source,
    },
    {
      label: '表达式开启',
      value: 'is_expression',
      component: 't-switch',
      extraProps: {
        label: ['是', '否'],
        ...is_source,
      },
    },
    {
      label: '表达式',
      value: 'expression',
      extraProps: is_source,
    },
    {
      label: '备注',
      value: 'remark',
      component: 't-textarea',
    },
  ]
})

const close = () => {
  variableFormRef.value.cancel()
}

const saveVariable = async () => {
  const data = variableForm.value
  if (data.id) {
    await fetchUpdateVariable(data)
  } else {
    await fetchAddVariable(data)
  }
  close()
  refresh()
  variableDialogVisible.value = false
  message.success('操作成功')
}
</script>

<style lang="scss" scoped></style>
