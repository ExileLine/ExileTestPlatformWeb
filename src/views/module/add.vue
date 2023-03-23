<template>
  <page-container class="hp-100 overflow-y">
    <t-row :gutter="20">
      <t-col :lg="4" :xs="12">
        <div class="mb-20 fs-20 fw-600 mt-10">模块信息</div>
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
      <t-col :lg="4" :xs="6">
        <div class="mb-20 fs-20 fw-600 mt-10 flex-between">
          <span>用例列表</span>
          <t-button theme="danger" @click="deleteSelectedCase('case_list')">删除所选</t-button>
        </div>

        <t-table
          row-key="id"
          :columns="genColumns('case_name')"
          bordered
          :data="filterCaseList"
          :maxHeight="600"
          :selected-row-keys="deleteSelectedCaseList.case_list"
          :filter-value="filterCaseValue.case_name"
          @filter-change="filters => filterChange('case_name', filters)"
          @select-change="idList => deleteSelectedCaseChange('case_list', idList)"
        />
      </t-col>
      <t-col :lg="4" :xs="6">
        <div class="mb-20 fs-20 fw-600 mt-10 flex-between">
          <span>场景列表</span>
          <t-button theme="danger" @click="deleteSelectedCase('scenario_list')">删除所选</t-button>
        </div>

        <t-table
          row-key="id"
          :columns="genColumns('scenario_title')"
          bordered
          :data="filterSceneList"
          :maxHeight="600"
          :selected-row-keys="deleteSelectedCaseList.scenario_list"
          :filter-value="filterCaseValue.scenario_title"
          @filter-change="filters => filterChange('scenario_title', filters)"
          @select-change="idList => deleteSelectedCaseChange('scenario_list', idList)"
        />
      </t-col>
    </t-row>
    <case-list-dialog
      v-model:visible="caseListDialogVisible"
      :component-name="componentName"
      @select-change="selectChange"
      @add="value => addSelectedCase(value, true)"
      @add-selected="addSelectedCase"
    />
    <t-button class="case-btn" size="medium" @click="saveCaseScenario">
      <template #icon><t-icon name="check" /></template>
      提交
    </t-button>
  </page-container>
</template>

<script setup lang="jsx">
import { onMounted, ref, reactive, inject, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { filter, includes, find, some, map } from 'lodash'
import CaseListDialog from '@/views/api-case/components/CaseListDialog.vue'
import { renderAction } from '@/composables/renderTableAction'

import { validateRequired } from '@/components/validate'
import { fetchAddModule, fetchGetModule, fetchUpdateModule } from '@/api/module'

const route = useRoute()
const router = useRouter()
const store = useStore()
const { id } = route.query
const message = inject('message')

const formModal = ref({
  user_list: [],
  module_name: '',
  module_code: '',
  case_list: [],
  scenario_list: [],
})

const rules = {
  module_name: [validateRequired('请输入模块名称')],
}

const extraProps = {
  class: 'w-300',
}
const fieldList = [
  {
    label: '用户列表',
    value: 'user_list',
    component: 'remote-select',
    extraProps: {
      url: '/api/user_page',
      labelKey: 'username',
      multiple: true,
      ...extraProps,
    },
  },
  {
    label: '模块编号',
    value: 'module_code',
    extraProps,
  },
  {
    value: 'module_name',
    label: '模块名称',
    extraProps,
  },
  {
    value: 'remark',
    label: '备注',
    component: 't-textarea',
    extraProps,
  },
]

const componentName = ref('case-list')
const renderAddAction = isCase => (
  <t-button
    theme="primary"
    variant="text"
    onClick={() => {
      caseListDialogVisible.value = true
      componentName.value = isCase ? 'case-list' : 'scene-list'
    }}
  >
    <t-icon name="add" />
  </t-button>
)
const caseListDialogVisible = ref(false)
const isCase = computed(() => componentName.value === 'case-list')
const dataList = computed(() =>
  isCase.value ? formModal.value.case_list : formModal.value.scenario_list
)
const actionOptionList = isCase => [
  {
    content: '移除',
    value: 'close',
    theme: 'danger',
    onClick({ rowIndex }) {
      if (isCase) {
        formModal.value.case_list.splice(rowIndex, 1)
      } else {
        formModal.value.scenario_list.splice(rowIndex, 1)
      }
    },
  },
]

const genColumns = type => {
  const isCase = type === 'case_name'
  const title = isCase ? '用例名称' : '场景名称'
  return [
    {
      colKey: 'row-select',
      type: 'multiple',
      width: 50,
      align: 'center',
    },
    {
      colKey: 'id',
      title: 'ID',
      ellipsis: true,
      width: 100,
      align: 'center',
    },
    {
      colKey: type,
      title,
      ellipsis: true,
      minWidth: 200,
      align: 'center',
      // 输入框过滤配置
      filter: {
        type: 'input',
        resetValue: '',
        confirmEvents: ['onEnter'],
        props: { placeholder: `请输入${title}` },
        showConfirmAndReset: true,
      },
    },
    {
      colKey: 'operation',
      title: '操作',
      width: 80,
      align: 'center',
      render: (h, { type, ...rest }) =>
        type == 'title' ? renderAddAction(isCase) : renderAction(actionOptionList(isCase), rest),
      fixed: 'right',
    },
  ]
}

const selectedCase = ref([])

const addSelectedCase = (value, isSingle) => {
  const data = dataList.value
  if (isSingle) {
    if (find(data, i => i.id === value.id)) {
      return message.warning('存在重复的用例或场景')
    }
    dataList.value.push(value)
  } else {
    if (!selectedCase.value?.length) return message.warning('请先勾选')
    if (
      find(selectedCase.value, selectedObj =>
        some(data, caseData => caseData.id === selectedObj.id)
      )
    ) {
      return message.warning('存在重复的用例或场景')
    }
    dataList.value.push(...selectedCase.value)
  }
  message.success('加入成功')
}

const deleteSelectedCaseList = reactive({
  case_list: [],
  scenario_list: [],
})
const deleteSelectedCaseChange = (key, idList) => {
  deleteSelectedCaseList[key] = idList
}
const deleteSelectedCase = key => {
  if (!deleteSelectedCaseList[key]?.length) return message.warning('请先勾选')
  formModal.value[key] = filter(
    formModal.value[key],
    i => !includes(deleteSelectedCaseList[key], i.id)
  )
}

const selectChange = (keys, { selectedRowData }) => {
  selectedCase.value = selectedRowData
}

const filterCaseValue = reactive({
  case_name: '',
  scenario_title: '',
})
const filterChange = (key, filters) => {
  filterCaseValue[key] = filters[key]
}

const filterKey = key => (key == 'case_list' ? 'case_name' : 'scenario_title')
function filterForKey(key) {
  return filter(formModal.value[key], i =>
    includes(i[filterKey(key)], filterCaseValue[filterKey(key)] || '')
  )
}
const filterCaseList = computed(() => filterForKey('case_list'))
const filterSceneList = computed(() => filterForKey('scenario_list'))

const saveCaseScenario = async () => {
  const data = {
    ...formModal.value,
    case_list: map(formModal.value.case_list, 'id'),
    scenario_list: map(formModal.value.scenario_list, 'id'),
  }
  if (id) {
    await fetchUpdateModule(data)
  } else {
    await fetchAddModule(data)
  }
  message.success('操作成功')
  store.commit('app/delTag', route.fullPath)
  router.push({
    path: '/version/module',
  })
}

watch(
  () => caseListDialogVisible.value,
  visible => !visible && (selectedCase.value = [])
)

onMounted(async () => {
  if (id) {
    formModal.value = await fetchGetModule(id)
    formModal.value.user_list = map(formModal.value.user_list, 'id')
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
