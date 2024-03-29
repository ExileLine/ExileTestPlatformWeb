<template>
  <page-container>
    <base-table
      ref="baseTableRef"
      :form-model="formModel"
      :field-list="fieldList"
      :columns="columns"
      :action-option-list="actionOptionList"
      url="/api/case_scenario_page"
      @select-change="tableSelectChange"
    >
      <template #formActions>
        <t-button v-if="hasAddBtn" theme="primary" @click="$emit('add-selected')">
          添加选中
        </t-button>
        <t-button v-else theme="primary" @click="$router.push('/api-case/add-scene')">
          新增
        </t-button>
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
        <log-tabs-container is-scene :execute-log="caseLog" />
      </div>
    </t-dialog>

    <execute-dialog
      v-model:visible="executeDialogVisible"
      :info="record"
      :execute-name="record.scenario_title"
      execute-type="scenario"
    />
  </page-container>
</template>

<script setup lang="jsx">
import { ref, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { filter } from 'lodash'
import ExecuteDialog from '@view/api-case/components/ExecuteDialog.vue'
import LogTabsContainer from './components/LogTabsContainer.vue'
import { fetchGetCaseLog } from '@/api/case-logs'
import { confirmDialog } from '@/utils/business'
import { fetchDeleteCaseScenario, fetchCopyCaseScenario } from '@/api/case-scenario'

const message = inject('message')
const router = useRouter()

const props = defineProps({
  hasAddBtn: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['add', 'add-selected', 'select-change'])

const baseTableRef = ref()
const formModel = ref({})
const selectChange = {
  change: () => {
    baseTableRef.value.getData = true
  },
}
const fieldList = [
  {
    label: '场景名称',
    value: 'scenario_title',
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
const caseLog = ref({})

const executeDialogVisible = ref(false)
const record = ref({})

const editBtn = {
  content: '编辑',
  value: 'edit',
  theme: 'primary',
  onClick({ row }) {
    router.push({
      path: '/api-case/edit-scene',
      query: {
        id: row.id,
      },
    })
  },
}

const deleteBtn = {
  content: '删除',
  value: 'delete',
  theme: 'danger',
  async onClick({ row }) {
    const dialog = await confirmDialog(
      <div>
        是否删除场景：<span class="text-warning-6">{row.scenario_title}</span>
      </div>
    )
    await fetchDeleteCaseScenario(row)
    message.success('操作成功')
    dialog.hide()
    baseTableRef.value.getData = true
  },
}
const actionOptionList = computed(() => {
  const options = [
    {
      content: '执行',
      value: 'play-circle',
      theme: 'success',
      onClick({ row }) {
        record.value = row
        executeDialogVisible.value = true
      },
    },
    editBtn,
    {
      content: '日志',
      value: 'file',
      theme: 'warning',
      async onClick({ row }) {
        const resp = await fetchGetCaseLog({
          execute_id: row.id,
          execute_type: 'scenario',
        })
        caseLog.value = resp.scenario_logs
        logDialogVisible.value = true
      },
    },
    {
      content: '复制',
      value: 'file-copy',
      theme: 'info',
      async onClick({ row }) {
        const dialog = await confirmDialog(
          <div>
            是否复制场景：<span class="text-warning-6">{row.scenario_title}</span>
          </div>
        )
        await fetchCopyCaseScenario(row)
        message.success('操作成功')
        dialog.hide()
        baseTableRef.value.getData = true
      },
    },
    deleteBtn,
  ]

  if (props.hasAddBtn) {
    return [
      {
        content: '加入',
        value: 'add',
        theme: 'success',
        onClick({ row }) {
          emit('add', row)
        },
      },
      editBtn,
      deleteBtn,
    ]
  }

  return options
})

const columns = computed(() =>
  filter([
    props.hasAddBtn
      ? {
          colKey: 'row-select',
          type: 'multiple',
          width: 50,
          align: 'center',
        }
      : null,
    {
      colKey: 'id',
      title: 'ID',
      ellipsis: true,
      width: 100,
    },
    {
      colKey: 'scenario_title',
      title: '场景名称',
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
      colKey: 'status',
      title: '公开使用',
      ellipsis: true,
      width: 100,
      render(h, { type, row }) {
        if (type === 'title') return
        return <t-switch value={row.is_public} customValue={[1, 0]} label={['是', '否']}></t-switch>
      },
    },
    {
      colKey: 'remark',
      title: '备注',
      ellipsis: true,
      width: 180,
    },
  ])
)

const tableSelectChange = (...rest) => {
  emit('select-change', ...rest)
}
</script>

<style lang="scss" scoped></style>
