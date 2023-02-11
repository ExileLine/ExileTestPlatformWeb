<template>
  <page-container>
    <base-table
      ref="baseTableRef"
      :form-model="formModel"
      :field-list="fieldList"
      :columns="columns"
      :action-option-list="actionOptionList"
      url="/api/ui_case_page"
    >
      <template #formActions>
        <t-button theme="primary" @click="$router.push('/ui-case/add')">新增</t-button>
      </template>
    </base-table>

    <t-dialog
      v-model:visible="logDialogVisible"
      header="最新日志（10条）"
      :footer="null"
      width="1260px"
      placement="center"
      destroy-on-close
    >
      <div class="p-5">
        <log-tabs-container :execute-log="caseLog" />
      </div>
    </t-dialog>
  </page-container>
</template>

<script setup lang="jsx">
import { ref, computed, inject, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { find } from 'lodash'
import { requestMethodList, caseStatusList } from '@/config/variables'
import { fetchDeleteCase } from '@/api/api-case'
import { fetchGetCaseLog } from '@/api/case-logs'
import { confirmDialog } from '@/utils/business'
// import { caseLog } from '@/config/mock'

const router = useRouter()
const message = inject('message')

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

const logDialogVisible = ref(false)
const record = ref({})
const executeDialogVisible = ref(false)
const caseLog = ref({})
const actionOptionList = [
  {
    content: '执行',
    value: 'play-circle',
    theme: 'success',
    onClick({ row }) {
      record.value = row
      executeDialogVisible.value = true
    },
  },
  {
    content: '编辑',
    value: 'edit',
    theme: 'primary',
    onClick({ row }) {
      router.push({
        path: '/api-case/edit',
        query: {
          id: row.id,
        },
      })
    },
  },
  {
    content: '日志',
    value: 'file',
    theme: 'warning',
    async onClick({ row }) {
      const resp = await fetchGetCaseLog({
        execute_id: row.id,
        execute_type: 'case',
      })
      caseLog.value = resp.case_logs
      logDialogVisible.value = true
    },
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
    async onClick({ row }) {
      const dialog = await confirmDialog(
        <div>
          是否删除用例：<span class="text-warning-6">{row.case_name}</span>
        </div>
      )
      await fetchDeleteCase(row)
      message.success('操作成功')
      dialog.hide()
      baseTableRef.value.getData = true
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
    colKey: 'case_name',
    title: '用例名称',
    ellipsis: true,
    width: 200,
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
