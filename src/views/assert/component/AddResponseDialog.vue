<template>
  <t-dialog
    placement="center"
    :visible="visible"
    :footer="false"
    :header="title"
    width="1400"
    @close="close"
  >
    <common-form
      dialog
      ref="assertFormRef"
      :rules="rules"
      :data="data"
      :field-list="fieldList"
      label-width="6em"
      confirm-text="确定"
      cancel-text="取消"
      class="assert-dialog-form"
      @confirm="saveRespAssert"
      @cancel="$emit('update:visible', false)"
    >
      <template #assertJson>
        <div class="h-300">
          <t-table
            bordered
            :max-height="300"
            row-key="cid"
            :data="data.ass_json"
            :columns="columns"
            size="small"
          />
        </div>
      </template>
    </common-form>
  </t-dialog>
</template>

<script setup lang="jsx">
import { ref, computed } from 'vue'
import { AddIcon } from 'tdesign-icons-vue-next'
import { renderAction } from '@/composables/renderTableAction'
import { varSourceList, ruleList } from '@/config/variables'

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  visible: {
    type: Boolean,
    default: false,
  },
})

const assertFormRef = ref()
const title = computed(() => (props.data.id ? '编辑响应断言规则' : '新增响应断言规则'))

const rules = {}
const fieldList = [
  {
    value: 'version_list',
    label: '迭代版本',
    component: 'remote-select',
    extraProps: {
      url: '/api/project_version_page',
      labelKey: 'version_name',
      valueKey: 'id',
      valueType: 'object',
      multiple: true,
      class: 'assert-dialog-input',
    },
  },
  {
    label: '断言描述',
    value: 'assert_description',
    extraProps: {
      class: 'assert-dialog-input',
    },
  },
  {
    label: '备注',
    value: 'remark',
    component: 't-textarea',
    extraProps: {
      class: 'assert-dialog-input',
    },
  },
  {
    label: '公开使用',
    value: 'is_public',
    component: 't-switch',
    extraProps: {
      label: ['是', '否'],
    },
  },
  {
    scopedSlots: 'assertJson',
    labelWidth: '0',
  },
]
let cid = 0
props.data.ass_json.forEach(i => (i.cid = ++cid))
const genAssertData = () => ({
  cid: ++cid,
  assert_key: '',
  rule: '',
  response_source: '',
  expect_val: '',
  expect_val_type: '',
  is_expression: false,
  python_val_exp: '',
})
const actionOptionList = [
  {
    content: '添加',
    value: 'add',
    theme: 'primary',
    onClick({ rowIndex }) {
      props.data.ass_json.splice(rowIndex + 1, 0, genAssertData())
    },
  },
  {
    content: '删除',
    value: 'close',
    theme: 'danger',
    onClick({ rowIndex }) {
      props.data.ass_json.splice(rowIndex, 1)
    },
  },
]
const renderAddAction = () => (
  <t-button
    theme="primary"
    variant="text"
    onClick={() => props.data.ass_json.push(genAssertData())}
  >
    <AddIcon />
  </t-button>
)

const columns = [
  {
    colKey: 'assert_key',
    title: '断言键',
    align: 'center',
    width: 160,
    render: (h, { type, row }) => type !== 'title' && <t-input v-model={row.assert_key}></t-input>,
  },
  {
    colKey: 'rule',
    title: '规则',
    width: 100,
    align: 'center',
    render: (h, { type, row }) =>
      type !== 'title' && <t-select v-model={row.rule} options={ruleList}></t-select>,
  },
  {
    colKey: 'response_source',
    title: '来源',
    width: 100,
    align: 'center',
    render: (h, { type, row }) =>
      type !== 'title' && (
        <t-select v-model={row.response_source} options={varSourceList}></t-select>
      ),
  },
  {
    colKey: 'expect_val',
    title: '期望值',
    align: 'center',
    width: 160,
    render: (h, { type, row }) => type !== 'title' && <t-input v-model={row.expect_val}></t-input>,
  },
  {
    colKey: 'expect_val_type',
    title: '期望值类型',
    align: 'center',
    width: 120,
    render: (h, { type, row }) =>
      type !== 'title' && <t-select v-model={row.expect_val_type}></t-select>,
  },
  {
    colKey: 'is_expression',
    title: '启用表达式',
    width: 120,
    align: 'center',
    render: (h, { type, row }) =>
      type !== 'title' && <t-switch v-model={row.is_expression} label={['是', '否']}></t-switch>,
  },
  {
    colKey: 'python_val_exp',
    title: '表达式',
    align: 'center',
    width: 350,
    render: (h, { type, row }) =>
      type !== 'title' && <t-input v-model={row.python_val_exp}></t-input>,
  },
  {
    colKey: 'action',
    title: '操作',
    align: 'center',
    fixed: 'right',
    width: 130,
    render: (h, { type, ...rest }) =>
      type === 'title' ? renderAddAction() : renderAction(actionOptionList, rest),
  },
]

const close = () => {
  assertFormRef.value.cancel()
  emit('update:visible', false)
  emit('close')
}

const saveRespAssert = () => {
  close()
  emit('save')
  message.success('保存成功')
}
</script>

<style lang="scss" scoped></style>
