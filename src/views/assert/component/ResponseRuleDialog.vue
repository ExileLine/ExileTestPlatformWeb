<template>
  <div>
    <t-dialog
      placement="center"
      :visible="visible"
      :footer="false"
      :header="title"
      width="1400"
      @close="dialogClose"
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
        @cancel="formClose"
      >
        <template #ass_json>
          <div class="h-300 wp-100">
            <t-table
              bordered
              :max-height="300"
              row-key="uuid"
              :data="data.ass_json"
              :columns="columns"
              size="small"
            />
          </div>
        </template>
      </common-form>
    </t-dialog>
  </div>
</template>

<script setup lang="jsx">
import { ref, computed, inject } from 'vue'
import { AddIcon } from 'tdesign-icons-vue-next'
import JsonEditor from '@/components/JsonEditor/index.vue'
import { pythonExpressionTip, pythonExpression, helpDialog } from '@/utils/helpDialog'
import { renderAction } from '@/composables/renderTableAction'
import { varSourceList, ruleList, valTypeList, expTip } from '@/config/variables'
import { fetchAddRespRule, fetchUpdateRespRule } from '@/api/assertion'
import { addVersionList } from '@/utils/business'
import { validateRequired } from '@/components/validate'

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

const emit = defineEmits('update:visible', 'close', 'save')
const message = inject('message')

const assertFormRef = ref()
const title = computed(() => (props.data.id ? '编辑响应断言规则' : '新增响应断言规则'))

const rules = {
  assert_description: [validateRequired('请输入断言描述')],
}
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
    slot: 'ass_json',
    labelWidth: '0',
  },
]

const genAssertData = () => ({
  uuid: Date.now(),
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
      type !== 'title' && <t-select v-model={row.expect_val_type} options={valTypeList}></t-select>,
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
    width: 350,
    render: (h, { type, row }) => {
      if (type === 'title') {
        return (
          <div>
            <span class="mr-10">表达式</span>
            <t-tooltip content="帮助">
              <t-icon
                name="help-circle-filled"
                onClick={() =>
                  helpDialog(
                    <div>
                      <div class="mb-10 fw-600">{pythonExpressionTip}</div>
                      <div class="h-650">
                        <JsonEditor v-model={pythonExpression} read-only mode="python" />
                      </div>
                    </div>,
                    '关于取值表达式'
                  )
                }
              />
            </t-tooltip>
          </div>
        )
      }
      return <t-input v-model={row.python_val_exp}></t-input>
    },
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
const formClose = () => {
  emit('update:visible', false)
  emit('close')
}
const dialogClose = () => {
  assertFormRef.value.cancel()
  formClose()
}

const saveRespAssert = async () => {
  let data = addVersionList(props.data)
  const isUpdate = !!data.id
  if (isUpdate) {
    data = await fetchUpdateRespRule(data)
  } else {
    data = await fetchAddRespRule(data)
  }
  emit('save', data, isUpdate)
  dialogClose()
  message.success('保存成功')
}
</script>

<style lang="scss" scoped></style>
