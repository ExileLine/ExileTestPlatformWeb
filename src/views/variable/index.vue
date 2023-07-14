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
        <t-button theme="success" @click="showHelpDialog">使用帮助</t-button>
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
import add_var from '@/assets/add_var.png'
import use_var1 from '@/assets/use_var1.png'
import use_var2 from '@/assets/use_var2.png'
import set_var1 from '@/assets/set_var1.png'
import set_var2 from '@/assets/set_var2.png'
import use_set_var1 from '@/assets/use_set_var1.png'
import use_set_var2 from '@/assets/use_set_var2.png'
import { helpDialog } from '@/utils/helpDialog'

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

const demoJson = `{
    "user_count": 99,
    "user_list": [
        {
            "username": "alex",
            "age": 18
        },
        {
            "username": "kim",
            "age": 22
        },
        {
            "username": "test",
            "age": 24
        }
    ]
}`

const showHelpDialog = () => {
  helpDialog(
    <div>
      <p>1.新增一个变量：a，值为：123，如图</p>
      <img src={add_var} class="wp-100" />
      <p>2.引用方式：$+花括号的形式引用，如图</p>
      <img src={use_var1} class="wp-100" />
      <img src={use_var2} class="wp-100" />
      <p>
        3.动态获取：即使用接口的`响应值`或`响应头`的某个值，赋值在该变量上，如果这个值的key不在第一层则需要使用表达式进行获取，
        <div>
          例如：{demoJson} 取值99，那么填写user_count即可，否则需要使用表达式进行获取对应的值。
        </div>
        如图
      </p>
      <img src={set_var1} class="wp-100" />
      <img src={set_var2} class="wp-100" />
      <img src={use_set_var1} class="wp-100" />
      <img src={use_set_var2} class="wp-100" />
      <p>
        4.动态变更：在场景中，一个用例执行后可能会对某个变量的值进行重新赋值（例如：A用例执行后将变量x的值从1变为2），此时如果后面的用例需要使用新的变量值即：x=2，那么需要把`动态变更`开启，否则后面用例引用x的值为1。
      </p>
    </div>,
    '变量使用说明',
    1000
  )
}
//
</script>

<style lang="scss" scoped></style>
