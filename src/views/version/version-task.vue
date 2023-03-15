<template>
  <page-container>
    <base-table
      ref="baseTableRef"
      :form-model="formModel"
      :field-list="fieldList"
      :columns="columns"
      :action-option-list="actionOptionList"
      url="/api/version_task_page"
    >
      <template #formActions>
        <t-button
          theme="primary"
          @click="
            $router.push({
              path: '/version/add-task',
              query: $route.query,
            })
          "
        >
          新增
        </t-button>
      </template>
    </base-table>

    <execute-dialog
      v-model:visible="executeDialogVisible"
      :info="record"
      :execute-name="record.task_name"
      execute-key="task"
    />
  </page-container>
</template>

<script setup lang="jsx">
import { ref, computed, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { versionTaskTypeList } from '@/config/variables'
import ExecuteDialog from '@view/api-case/components/ExecuteDialog.vue'
import { confirmDialog } from '@/utils/business'
import { fetchDeleteVersionTask } from '@/api/version-task'

const route = useRoute()
const router = useRouter()
const baseTableRef = ref()
const formModel = ref({
  version_id: route.query.version_id,
})
const message = inject('message')

const selectChange = {
  change: () => {
    baseTableRef.value.getData = true
  },
}

const fieldList = [
  {
    label: '任务名称',
    value: 'task_name',
  },
  {
    label: '任务类型',
    value: 'task_type',
    component: 't-select',
    list: versionTaskTypeList,
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

const executeDialogVisible = ref(false)
const record = ref({})

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
        path: '/version/edit-task',
        query: {
          ...route.query,
          id: row.id,
        },
      })
    },
  },
  {
    content: '删除',
    value: 'delete',
    theme: 'danger',
    async onClick({ row }) {
      const dialog = await confirmDialog(
        <div>
          是否删除任务：
          <span class="text-warning-6">{row.task_name}</span>
        </div>
      )
      await fetchDeleteVersionTask(row)
      dialog.hide()
      selectChange.change()
      message.success('操作成功')
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
    colKey: 'task_name',
    title: '任务名称',
    ellipsis: true,
    width: 300,
  },
  {
    colKey: 'task_type',
    title: '任务类型',
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
    colKey: 'remark',
    title: '备注',
    ellipsis: true,
    width: 180,
  },
])
</script>

<style lang="scss" scoped></style>
