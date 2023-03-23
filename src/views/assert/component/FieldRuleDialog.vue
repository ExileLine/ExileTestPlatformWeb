<template>
  <div class="field-rule-dialog">
    <t-dialog
      placement="center"
      :visible="visible"
      :footer="false"
      :header="title"
      width="1400"
      destroy-on-close
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
        class="assert-dialog-form flex-1 flex-col pb-20 overflow-hidden"
        @confirm="saveRespAssert"
        @cancel="formClose"
      >
        <template #ass_json>
          <t-tabs
            v-model:value="defalutValue"
            theme="card"
            addable
            class="wp-100"
            @add="addTab"
            @remove="removeTab"
          >
            <t-tab-panel v-for="(db, idx) in data.ass_json" :key="idx" :value="idx" removable>
              <template #label>字段断言{{ idx + 1 }}</template>
              <div class="align-center bg-white ptb-10">
                <span class="mr-10">数据库</span>
                <div class="flex-1">
                  <remote-select
                    v-model="db.db_id"
                    value-key="id"
                    label-key="name"
                    url="/api/case_db_page"
                    class="w-200"
                  />
                </div>
                <t-button @click="addQuery(db.assert_list)">添加语句</t-button>
              </div>

              <div class="flex-1 overflow-y narrow-scrollbar">
                <div v-for="(assert, cIdx) in db.assert_list" :key="cIdx" class="pt-20">
                  <div class="align-center mb-10">
                    <span class="mr-10">查询语句</span>
                    <json-editor v-model="assert.query" mode="text/x-mariadb" />
                    <t-button
                      theme="danger"
                      @click="() => db.assert_list.length > 1 && db.assert_list.splice(cIdx, 1)"
                    >
                      删除
                    </t-button>
                  </div>
                  <div class="pl-20">
                    <t-table
                      bordered
                      :max-height="260"
                      row-key="uuid"
                      :data="assert.assert_field_list"
                      :columns="columns(assert.assert_field_list)"
                      size="small"
                    />
                  </div>
                </div>
              </div>
            </t-tab-panel>
          </t-tabs>
        </template>
      </common-form>
    </t-dialog>
  </div>
</template>

<script setup lang="jsx">
import { ref, computed, inject, watch } from 'vue'
import { AddIcon } from 'tdesign-icons-vue-next'
import { find, findIndex } from 'lodash'
import { fetchAddFieldRule, fetchUpdateFieldRule } from '@/api/assertion'
import { addVersionList, isOpenExpression } from '@/utils/business'
import { validateRequired } from '@/components/validate'
import RemoteSelect from '@/components/CommonForm/components/RemoteSelect.vue'
import { ruleList, valTypeList } from '@/config/variables'
import { renderAction } from '@/composables/renderTableAction'
import { helpDialog, pythonExpression, pythonExpressionTip } from '@/utils/helpDialog'
import JsonEditor from '@/components/JsonEditor/index.vue'

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
const title = computed(() => (props.data.id ? '编辑字段断言规则' : '新增字段断言规则'))

const defalutValue = ref(0)
const rules = {
  assert_description: [validateRequired('请输入断言描述')],
}

const genAssertData = () => ({
  uuid: Date.now(),
  assert_key: '',
  expect_val: '',
  expect_val_type: '',
  is_expression: false,
  python_val_exp: '',
  rule: '',
})
const genQueryData = () => ({
  query: '',
  assert_field_list: [genAssertData()],
})
const addQuery = list => {
  list.push(genQueryData())
}
const addTab = () => {
  props.data.ass_json.push({
    db_id: null,
    assert_list: [genQueryData()],
  })
}
watch(
  () => props.data,
  ({ id }) => !id && !props.data.ass_json.length && addTab(),
  {
    immediate: true,
  }
)
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

const actionOptionList = [
  {
    content: '添加',
    value: 'add',
    theme: 'primary',
    onClick({ rowIndex, assert_field_list }) {
      assert_field_list.splice(rowIndex + 1, 0, genAssertData())
    },
  },
  {
    content: '删除',
    value: 'close',
    theme: 'danger',
    onClick({ rowIndex, assert_field_list }) {
      assert_field_list.splice(rowIndex, 1)
    },
  },
]

const renderAddAction = assert_field_list => (
  <t-button theme="primary" variant="text" onClick={() => assert_field_list.push(genAssertData())}>
    <AddIcon />
  </t-button>
)
const columns = assert_field_list => [
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
                        <JsonEditor modelValue={pythonExpression} read-only mode="python" />
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
      type === 'title'
        ? renderAddAction(assert_field_list)
        : renderAction(actionOptionList, { ...rest, assert_field_list }),
  },
]

const removeTab = ({ index }) => {
  props.data.ass_json.splice(index, 1)
}
const formClose = () => {
  emit('update:visible', false)
  emit('close')
}

const dialogClose = () => {
  assertFormRef.value.cancel()
  formClose()
}

const getAssertRule = list => find(list, assert => isOpenExpression(assert.assert_field_list))

const saveRespAssert = async () => {
  let data = addVersionList(props.data)
  const isUpdate = !!data.id
  const emptVarDataIndex = findIndex(data.ass_json, i => getAssertRule(i.assert_list))
  if (emptVarDataIndex > -1) {
    const emptVarData = data.ass_json[emptVarDataIndex]
    const assert = getAssertRule(emptVarData.assert_list)
    const { assert_key } = isOpenExpression(assert.assert_field_list)

    return message.warning({
      content: (
        <div>
          字段断言{emptVarDataIndex + 1} 的断言键: <span class="text-warning-6">{assert_key} </span>
          的表达式不能为空
        </div>
      ),
    })
  }
  if (isUpdate) {
    data = await fetchUpdateFieldRule(data)
  } else {
    data = await fetchAddFieldRule(data)
  }
  emit('save', data, isUpdate)
  dialogClose()
  message.success('操作成功')
}
</script>

<style lang="scss" scoped>
.field-rule-dialog {
  ::v-deep {
    .t-dialog__position,
    .t-dialog,
    .t-dialog__body,
    .t-form__controls-content,
    .t-tabs,
    .t-tab-panel {
      height: 100%;
    }
    .t-dialog__body,
    .t-form__item:nth-last-child(2) {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .t-form__item:nth-last-child(2),
    .t-tabs__content {
      flex: 1;
    }
    .t-tabs,
    .t-tab-panel {
      display: flex;
      flex-direction: column;
    }
    .t-tab-panel {
      overflow-y: auto;
    }

    .t-tabs__nav {
      background-color: var(--td-bg-color-secondarycontainer);
    }
  }
}
</style>
