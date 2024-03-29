<template>
  <page-container>
    <base-table
      ref="baseTableRef"
      :form-model="formModel"
      :field-list="fieldList"
      :columns="columns"
      :action-option-list="actionOptionList"
      url="/api/case_req_data_page"
    >
      <template v-if="!hasAddBtn" #formActions>
        <t-button theme="primary" @click="goToAdd">新增</t-button>
      </template>
    </base-table>
    <json-editor-dialog v-model:visible="jsonViewVisible" :record="record" />
  </page-container>
</template>

<script setup lang="jsx">
import { ref, inject, computed } from 'vue'
import { useRouter } from 'vue-router'
import { find } from 'lodash'
import JsonEditorDialog from '@/components/JsonEditorDialog/index.vue'
import { bodyTypeList } from '@/config/variables'
import { confirmDialog } from '@/utils/business'
import { fetchDeleteReqData } from '@/api/api-case-param'

const props = defineProps({
  hasAddBtn: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['add'])

const router = useRouter()
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
    label: '参数名称',
    value: 'data_name',
  },
  {
    label: '参数类型',
    component: 't-select',
    list: bodyTypeList,
    value: 'var_type',
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

const goToAdd = () =>
  router.push({
    path: '/api-case-param/add',
  })
const actionOptionList = computed(() => {
  const options = [
    {
      content: '编辑',
      value: 'edit',
      theme: 'primary',
      onClick({ row }) {
        router.push({
          path: '/api-case-param/edit',
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
            是否删除参数：<span class="text-warning-6">{row.data_name}</span>
          </div>
        )
        await fetchDeleteReqData(row)
        dialog.hide()
        message.success('操作成功')
        selectChange.change()
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

const renderColumn = (h, { row, col, type }) =>
  type !== 'title' && renderJson({ ...row, title: col.title, colKey: col.colKey })

const columns = [
  {
    colKey: 'id',
    title: 'ID',
    ellipsis: true,
    width: 100,
  },
  {
    colKey: 'data_name',
    title: '参数名称',
    ellipsis: true,
    width: 200,
  },
  {
    colKey: 'request_headers',
    title: 'Headers',
    ellipsis: true,
    width: 120,
    render: renderColumn,
  },
  {
    colKey: 'request_params',
    title: 'Params',
    ellipsis: true,
    width: 120,
    render: renderColumn,
  },
  {
    colKey: 'request_body',
    title: 'Body',
    ellipsis: true,
    width: 120,
    render: renderColumn,
  },
  {
    colKey: 'request_body_type',
    title: '类型',
    ellipsis: true,
    width: 180,
    render: (h, { row }) => {
      const status = find(bodyTypeList, { value: row.request_body_type })
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
]
</script>

<style lang="scss" scoped></style>
