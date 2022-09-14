<template>
  <page-container>
    <base-table
      ref="baseTableRef"
      :form-model="formModel"
      :field-list="fieldList"
      :columns="columns"
      :action-option-list="actionOptionList"
      url="/api/case_execute_logs_page"
    ></base-table>
  </page-container>
</template>

<script setup lang="jsx">
import { ref, inject, computed } from 'vue'
import { find } from 'lodash'
import { executeTypeList, triggerTypeList, executeStatusList } from '@/config/variables'
import { fetchGetReport } from '@/api/report'
import { downloadFile } from '@/utils/download'

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
    label: '名称',
    value: 'execute_name',
  },
  {
    label: '执行类型',
    component: 't-select',
    list: executeTypeList,
    value: 'execute_type',
    on: selectChange,
  },
  {
    label: '触发类型',
    component: 't-select',
    list: triggerTypeList,
    value: 'trigger_type',
    on: selectChange,
  },
  {
    label: '状态',
    component: 't-select',
    list: executeStatusList,
    value: 'execute_status',
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

const actionOptionList = [
  {
    content: '报告',
    value: 'file',
    theme: 'success',
    async onClick({ row }) {
      window.open(`${import.meta.env.VITE_BASE_URL}api/case_report/${row.redis_key}`, '_blank')
    },
  },
  {
    content: '下载',
    value: 'download',
    theme: 'primary',
    async onClick({ row }) {
      const data = await fetchGetReport(row.redis_key)
      downloadFile(data, `${row.execute_name}.html`)
      message.success('操作成功')
    },
  },
]

const columns = [
  {
    colKey: 'id',
    title: 'ID',
    ellipsis: true,
    width: 100,
  },
  {
    colKey: 'execute_name',
    title: '名称',
    ellipsis: true,
    width: 200,
  },
  {
    colKey: 'execute_type',
    title: '类型',
    ellipsis: true,
    width: 100,
  },
  {
    colKey: 'trigger_type',
    title: '触发类型',
    ellipsis: true,
    width: 100,
  },
  {
    colKey: 'execute_status',
    title: '状态',
    ellipsis: true,
    width: 100,
    render: (h, { row, type }) => {
      if (type !== 'title') {
        const status = find(executeStatusList, { value: row.execute_status })
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
    colKey: 'create_time',
    title: '创建时间',
    ellipsis: true,
    width: 200,
  },
]
</script>

<style lang="scss" scoped></style>
