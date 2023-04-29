<template>
  <page-container class="hp-100 overflow-y">
    <t-row :gutter="20">
      <t-col :lg="4" :xs="12">
        <div class="mb-20 fs-20 fw-600 mt-10">场景信息</div>
        <common-form
          label-width="100px"
          :data="formModal"
          :rules="rules"
          :field-list="fieldList"
          confirm-text="保存"
          action-class="hide"
          @confirm="saveCaseScenario"
        />
      </t-col>
      <t-col :lg="8" :xs="12">
        <div class="mb-20 fs-20 fw-600 mt-10 flex-between">
          <span>场景-用例列表</span>
          <t-button theme="danger" @click="deleteSelectedCase">删除所选</t-button>
        </div>

        <t-table
          row-key="uuid"
          :columns="columns"
          bordered
          :data="filterCaseList"
          :maxHeight="600"
          :selected-row-keys="deleteSelectedCaseList"
          :filter-value="filterCaseValue"
          @filter-change="filterChange"
          @select-change="deleteSelectedCaseChange"
        />

        <case-list-dialog
          v-model:visible="caseListDialogVisible"
          @select-change="selectChange"
          @add="value => addSelectedCase(value, true)"
          @add-selected="addSelectedCase"
        />
      </t-col>
    </t-row>

    <t-button class="case-btn" size="medium" @click="saveCaseScenario">
      <template #icon><t-icon name="check" /></template>
      提交
    </t-button>
  </page-container>
</template>

<script setup lang="jsx">
import { onMounted, ref, inject, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { map, filter, includes, isNumber, forEach } from 'lodash'
import CaseListDialog from './components/CaseListDialog.vue'
import { renderAction } from '@/composables/renderTableAction'

import {
  fetchGetCaseScenario,
  fetchAddCaseScenario,
  fetchUpdateCaseScenario,
} from '@/api/case-scenario'
import { validateRequired } from '@/components/validate'

const route = useRoute()
const router = useRouter()
const store = useStore()
const { id } = route.query
const message = inject('message')

const formModal = ref({
  case_list: [],
  version_list: [],
  module_list: [],
})

const rules = {
  scenario_title: [validateRequired('请输入场景名称')],
}

const switchLabel = ['是', '否']

const extraProps = {
  class: 'w-300',
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
      ...extraProps,
    },
  },
  {
    value: 'module_list',
    label: '模块',
    component: 'remote-select',
    extraProps: {
      url: '/api/module_app_page',
      labelKey: 'module_name',
      valueKey: 'id',
      valueType: 'object',
      multiple: true,
      ...extraProps,
    },
  },
  {
    value: 'scenario_title',
    label: '场景名称',
    extraProps,
  },
  {
    value: 'is_public',
    label: '公开使用',
    component: 't-switch',
    extraProps: {
      label: switchLabel,
    },
  },
  // {
  //   value: 'is_shared',
  //   label: '公开执行',
  //   component: 't-switch',
  //   extraProps: {
  //     label: switchLabel,
  //   },
  // },
  {
    value: 'remark',
    label: '备注',
    component: 't-textarea',
    extraProps,
  },
]

const renderAddAction = () => (
  <t-button theme="primary" variant="text" onClick={() => (caseListDialogVisible.value = true)}>
    <t-icon name="add" />
  </t-button>
)
const caseSwitchLabel = ['开启', '屏蔽']
const caseListDialogVisible = ref(false)
const actionOptionList = [
  {
    content: '移除',
    value: 'close',
    theme: 'danger',
    onClick({ rowIndex }) {
      console.log(rowIndex)
      formModal.value.case_list.splice(rowIndex, 1)
    },
  },
]
const columns = [
  {
    colKey: 'row-select',
    type: 'multiple',
    width: 50,
    align: 'center',
  },
  {
    colKey: 'case_id',
    title: 'ID',
    ellipsis: true,
    width: 100,
    align: 'center',
  },
  {
    colKey: 'case_name',
    title: '用例名称',
    ellipsis: true,
    minWidth: 200,
    align: 'center',
    // 输入框过滤配置
    filter: {
      type: 'input',
      resetValue: '',
      confirmEvents: ['onEnter'],
      props: { placeholder: '请输入用例名称' },
      showConfirmAndReset: true,
    },
  },
  {
    colKey: 'index',
    title: '排序',
    width: 160,
    align: 'center',
    cell: (h, { row }) => (
      <t-input-number
        v-model={row.index}
        theme="normal"
        placeholder="排序"
        clearable
        class="wp-100"
      />
    ),
  },
  {
    colKey: 'sleep',
    title: '等待时间',
    width: 260,
    align: 'center',
    cell: (h, { row }) => (
      <t-input-number
        v-model={row.sleep}
        theme="normal"
        placeholder="执行后等待时间"
        clearable
        class="wp-100"
      />
    ),
  },
  {
    colKey: 'is_active',
    title: '是否屏蔽',
    width: 120,
    align: 'center',
    cell: (h, { row }) => (
      <t-switch
        v-model={row.is_active}
        value={row.is_active}
        customValue={[1, 0]}
        label={caseSwitchLabel}
      />
    ),
  },
  {
    colKey: 'operation',
    title: '操作',
    width: 80,
    align: 'center',
    render: (h, { type, ...rest }) =>
      type == 'title' ? renderAddAction() : renderAction(actionOptionList, rest),
    fixed: 'right',
  },
]

const selectedCase = ref([])
const addSelectedCase = (value, isSingle) => {
  if (isSingle) {
    const { id, case_name } = value
    formModal.value.case_list.push({
      case_name,
      case_id: id,
      uuid: ++uuid,
      is_active: 0,
    })
  } else {
    if (!selectedCase.value?.length) return message.warning('请先勾选用例')
    formModal.value.case_list.push(...selectedCase.value)
  }
  message.success('加入成功')
}

const deleteSelectedCaseList = ref([])
const deleteSelectedCaseChange = idList => {
  deleteSelectedCaseList.value = idList
}
const deleteSelectedCase = () => {
  if (!deleteSelectedCaseList.value?.length) return message.warning('请先勾选用例')
  formModal.value.case_list = filter(
    formModal.value.case_list,
    i => !includes(deleteSelectedCaseList.value, i.uuid)
  )
}

let uuid = 0
const selectChange = (keys, { selectedRowData }) => {
  selectedCase.value = map(selectedRowData, ({ id, case_name }) => ({
    uuid: ++uuid,
    case_name,
    case_id: id,
    is_active: 0,
  }))
}

const filterCaseValue = ref({
  case_name: '',
})
const filterChange = filters => {
  filterCaseValue.value = filters
}

const filterCaseList = computed(() =>
  filter(formModal.value.case_list, i =>
    includes(i.case_name, filterCaseValue.value.case_name || '')
  )
)

const saveCaseScenario = async () => {
  const data = {
    ...formModal.value,
    case_list: map(
      formModal.value.case_list,
      ({ case_id, case_name, is_active, sleep, index }) => ({
        case_id,
        case_name,
        is_active,
        sleep,
        index: isNumber(index) ? index : case_id,
      })
    ),
  }
  if (id) {
    await fetchUpdateCaseScenario(data)
  } else {
    await fetchAddCaseScenario(data)
  }
  message.success('操作成功')
  store.commit('app/delTag', route.fullPath)
  router.push({
    path: '/api-case/scene',
  })
}

watch(
  () => caseListDialogVisible.value,
  visible => !visible && (selectedCase.value = [])
)

onMounted(async () => {
  if (id) {
    formModal.value = await fetchGetCaseScenario(id)
    forEach(formModal.value.case_list, i => {
      i.uuid = ++uuid
    })
  }
})
</script>

<style lang="scss" scoped>
.scene-transfer {
  display: flex;
  flex-direction: row-reverse;
  ::v-deep(.t-transfer__list) {
    flex: 1;
    height: 600px;
    .t-checkbox__label {
      flex: 1;
    }
  }
}

.case-btn {
  position: fixed;
  right: 40px;
  bottom: 60px;
  z-index: 100;
}
</style>
