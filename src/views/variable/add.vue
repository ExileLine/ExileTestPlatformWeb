<template>
  <page-container class="variable-container">
    <t-row :gutter="20" class="mb-30">
      <t-col :md="5" :xs="12">
        <common-form
          ref="variableFormRef"
          :data="variableForm"
          :rules="variableRules"
          :field-list="variableFieldList"
          label-width="10em"
          confirm-text="保存"
          cancel-text="重置"
          @confirm="saveVariable"
        />
      </t-col>
    </t-row>
  </page-container>
</template>

<script setup lang="jsx">
import { ref, computed, inject, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { includes, concat, pickBy } from 'lodash'
import JsonEditor from '@/components/JsonEditor/index.vue'
import { validateRequired } from '@/components/validate'
import { varSourceList, variableTypeList } from '@/config/variables'
import { fetchGetVariable, fetchAddVariable, fetchUpdateVariable } from '@/api/case-variable'
import { pythonExpressionTip, pythonExpression, helpDialog } from '@/utils/helpDialog'

const route = useRoute()
const store = useStore()
const router = useRouter()
const message = inject('message')

const { id } = route.query

const variableForm = ref({
  version_list: [],
})

const variableRules = computed(() => {
  const defaultRules = {
    var_name: [validateRequired('请输入变量名称')],
    var_type: [validateRequired('请选择变量类型')],
    var_args: [
      validateRequired('请输入位数'),
      { validator: val => val > 0 && val < 16, message: '位数只能1~16位' },
    ],
    var_init_value: [validateRequired('请输入变量值(初始值)')],
  }

  if (variableForm.value.is_source) {
    defaultRules.var_get_key = [validateRequired('请输入取值的key')]
  }
  if (variableForm.value.is_expression) {
    defaultRules.expression = [validateRequired('请输入表达式')]
  }
  return defaultRules
})
const switchField = {
  component: 't-switch',
  extraProps: {
    label: ['是', '否'],
  },
}
function getType(str) {
  if (str === 'bool') return 't-radio'
  if (includes(str, 'json')) return 'json-editor'
  if (includes(str, 'int') || includes(str, 'number')) return 't-input-number'
  return 't-input'
}

const fieldProps = {
  list: [
    {
      value: true,
      label: 'true',
    },
    {
      value: false,
      label: 'false',
    },
  ],
  extraProps: {
    theme: 'normal',
    class: 'wp-100',
  },
}
const variableFieldList = computed(() => {
  const form = variableForm.value
  const { var_type } = form
  const is_source = {
    disabled: !form.is_source,
  }

  const leftFieldList = [
    {
      label: '迭代版本',
      value: 'version_list',
      component: 'remote-select',
      extraProps: {
        url: '/api/project_version_page',
        labelKey: 'version_name',
        valueKey: 'id',
        valueType: 'object',
        multiple: true,
      },
    },
    {
      label: '变量名称',
      value: 'var_name',
    },
    {
      label: '变量类型',
      value: 'var_type',
      component: 't-select',
      list: variableTypeList,
      on: {
        change(val) {
          variableForm.value.var_args = ''
          variableForm.value.var_init_value = ''
          variableForm.value.var_value = ''
          if (includes(val, 'json')) {
            variableForm.value.var_init_value = '{}'
            variableForm.value.var_value = '{}'
          } else if (val === 'bool') {
            variableForm.value.var_init_value = true
            variableForm.value.var_value = true
          }
        },
      },
    },
  ]

  let rightFieldList = [
    {
      label: '动态变更',
      value: 'is_active',
      ...switchField,
    },
    {
      label: '动态获取',
      value: 'is_source',
      ...switchField,
    },
    {
      label: '变量来源',
      value: 'var_source',
      component: 't-select',
      list: varSourceList,
      extraProps: is_source,
    },
    {
      label: '取值的key',
      value: 'var_get_key',
      extraProps: is_source,
    },
    {
      label: '表达式开启',
      value: 'is_expression',
      component: 't-switch',
      extraProps: {
        label: ['是', '否'],
        ...is_source,
      },
    },
    {
      label: () => (
        <span class="flex-end">
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
        </span>
      ),
      value: 'expression',
      extraProps: {
        ...is_source,
        placeholder: '请输入表达式',
      },
    },
    {
      label: '备注',
      value: 'remark',
      component: 't-textarea',
    },
  ]
  let fieldList = []
  if (['uuid', 'date', 'time', 'random'].some(type => includes(var_type, type))) {
    if (!['uuid', 'date', 'time', 'bool'].some(type => includes(var_type, type))) {
      fieldList.push({
        label: '位数',
        value: 'var_args',
        component: 't-input-number',
        extraProps: {
          ...fieldProps.extraProps,
          min: 1,
          max: 16,
        },
      })
    }
  } else {
    fieldList = [
      {
        label: '变量值(初始值)',
        value: 'var_init_value',
        component: getType(form.var_type),
        ...fieldProps,
      },
      {
        label: '变量值(当前值)',
        value: 'var_value',
        component: getType(form.var_type),
        ...fieldProps,
      },
    ]
  }
  return concat(leftFieldList, fieldList, rightFieldList)
})

const saveVariable = async () => {
  const data = variableForm.value
  const _data = {
    ...data,
    var_args: pickBy(
      {
        ...data._var_args,
        length: data.var_args,
      },
      val => val
    ),
  }
  if (data.id) {
    await fetchUpdateVariable(_data)
  } else {
    await fetchAddVariable(_data)
  }
  message.success('操作成功')
  store.commit('app/delTag', route.fullPath)
  router.push({
    path: '/variable',
  })
}

onMounted(async () => {
  if (id) {
    const resp = await fetchGetVariable(id)
    variableForm.value = {
      ...resp,
      _var_args: resp.var_args,
      var_args: resp.var_args?.length ?? '',
      version_list: resp?.version_list ?? [],
    }
  }
})
</script>

<style lang="scss" scoped>
.variable-container {
  ::v-deep(.json-editor) {
    height: 200px;
  }
}
</style>
