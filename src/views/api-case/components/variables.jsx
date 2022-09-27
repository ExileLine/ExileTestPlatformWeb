import JsonEditor from '@/components/JsonEditor/index.vue'
import { renderAction } from '@/composables/renderTableAction'
import { varSourceList } from '@/config/variables'
import { pythonExpressionTip, pythonExpression, helpDialog } from '@/utils/helpDialog'

export const genVariableColumns = props => [
  {
    colKey: 'id',
    title: 'ID',
    align: 'center',
    width: 100,
  },
  {
    colKey: 'var_name',
    title: '参数名称',
    align: 'center',
    ellipsis: true,
    width: 180,
  },
  {
    colKey: 'var_value',
    title: '当前值',
    align: 'center',
    ellipsis: true,
    width: 180,
  },
  {
    colKey: 'var_source',
    title: '更新值来源',
    align: 'center',
    width: 140,
    render: (h, { type, row }) =>
      type !== 'title' && <t-select v-model={row.var_source} options={varSourceList}></t-select>,
  },
  {
    colKey: 'var_get_key',
    title: '取值的key',
    align: 'center',
    width: 200,
    render: (h, { type, row }) =>
      type !== 'title' && (
        <t-input v-model={row.var_get_key} placeholder="请输入取值的key"></t-input>
      ),
  },
  {
    colKey: 'is_expression',
    title: '表达式开启',
    width: 120,
    align: 'center',
    render: (h, { type, row }) =>
      type !== 'title' && <t-switch v-model={row.is_expression} label={['开', '关']}></t-switch>,
  },
  {
    colKey: 'expression',
    title: '表达式',
    width: 230,
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
      return <t-input v-model={row.expression} placeholder="请输入表达式"></t-input>
    },
  },
  {
    colKey: 'action',
    title: '操作',
    align: 'center',
    fixed: 'right',
    width: 80,
    render: (h, { type, rowIndex }) =>
      type !== 'title' && (
        <t-tooltip content="移除">
          <t-button
            theme="danger"
            variant="text"
            size="small"
            onClick={() => props.data.splice(rowIndex, 1)}
          >
            <t-icon name="close" />
          </t-button>
        </t-tooltip>
      ),
  },
]

const actionOptionList = [
  {
    content: '编辑',
    value: 'edit',
    theme: 'primary',
    onClick({ row, props }) {
      props.emit('edit', props.type, row)
    },
  },
  {
    content: '删除',
    value: 'close',
    theme: 'danger',
    onClick({ rowIndex, props: { props } }) {
      props.data.splice(rowIndex, 1)
    },
  },
]
export const genResponseColumns = props => [
  {
    colKey: 'id',
    title: 'ID',
    align: 'center',
    width: 100,
  },
  {
    colKey: 'assert_description',
    title: '断言描述',
    align: 'center',
  },
  // {
  //   colKey: 'remark',
  //   title: '备注',
  //   align: 'center',
  // },
  {
    colKey: 'action',
    title: '操作',
    align: 'center',
    fixed: 'right',
    width: 160,
    render: (h, { type, ...rest }) =>
      type !== 'title' && renderAction(actionOptionList, { ...rest, props }),
  },
]
export const genFieldColumns = genResponseColumns
