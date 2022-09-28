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
      <template v-if="!hasAddBtn" #formActions>
        <t-button theme="primary" @click="$router.push('/variable/add')">新增</t-button>
        <t-button theme="success">使用帮助</t-button>
      </template>
    </base-table>

    <json-editor-dialog v-model:visible="jsonViewVisible" :record="record" />
  </page-container>
</template>

<script setup lang="jsx">
import { ref, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { find, includes } from 'lodash'
import JsonEditorDialog from '@/components/JsonEditorDialog/index.vue'
import { confirmDialog } from '@/utils/business'
import { varSourceList, variableTypeList } from '@/config/variables'
import { fetchDeleteVariable } from '@/api/case-variable'

const props = defineProps({
  hasAddBtn: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['bind'])

const router = useRouter()
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

const actionOptionList = computed(() => {
  const options = [
    {
      content: '编辑',
      value: 'edit',
      theme: 'primary',
      onClick({ row }) {
        router.push({
          path: '/variable/edit',
          query: {
            id: row.id,
          },
        })
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
  if (props.hasAddBtn) {
    options.push({
      content: '关联',
      value: 'add',
      theme: 'success',
      async onClick({ row }) {
        emit('bind', row)
      },
    })
  }
  return options
})

const record = ref({})
const jsonViewVisible = ref(false)

const showJsonDetail = row => {
  record.value = row
  jsonViewVisible.value = true
}

const renderJson = row => (
  <t-button variant="text" shape="circle" onClick={() => showJsonDetail(row)}>
    <t-icon name="browse">查看</t-icon>
  </t-button>
)

const renderColumn = (h, { row, col, type }) => {
  if (type !== 'title') {
    if (includes(row.var_type, 'json')) {
      return renderJson({ ...row, title: col.title, colKey: col.colKey })
    }
    return row[col.colKey]
  }
}
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
    render: renderColumn,
  },
  {
    colKey: 'var_value',
    title: '变量当前值',
    ellipsis: true,
    width: 200,
    render: renderColumn,
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
</script>

<style lang="scss" scoped></style>
