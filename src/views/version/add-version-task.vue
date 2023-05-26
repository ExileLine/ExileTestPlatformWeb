<template>
  <page-container class="hp-100 overflow-y">
    <t-row :gutter="20">
      <t-col :lg="4" :xs="12">
        <div class="mb-20 fs-20 fw-600 mt-10">任务信息</div>
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
      <template v-if="formModal.task_type == 'api_case'">
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
            :filter-value="componentObj.case_name.value"
            @filter-change="filters => filterChange('case_name', filters)"
            @select-change="idList => deleteSelectedCaseChange('case_list', idList)"
          />
        </t-col>
        <t-col :lg="4" :xs="6">
          <div class="mb-20 fs-20 fw-600 mt-10 flex-between">
            <span>场景列表</span>
            <t-button theme="danger" @click="deleteSelectedCase('scenario_list')">
              删除所选
            </t-button>
          </div>

          <t-table
            row-key="id"
            :columns="genColumns('scenario_title')"
            bordered
            :data="filterSceneList"
            :maxHeight="600"
            :selected-row-keys="deleteSelectedCaseList.scenario_list"
            :filter-value="componentObj.scenario_title.value"
            @filter-change="filters => filterChange('scenario_title', filters)"
            @select-change="idList => deleteSelectedCaseChange('scenario_list', idList)"
          />
        </t-col>
      </template>
      <t-col v-else-if="formModal.task_type == 'ui_case'" :lg="8" :xs="12">
        <div class="mb-20 fs-20 fw-600 mt-10 flex-between">
          <span>UI用例列表</span>
          <t-button theme="danger" @click="deleteSelectedCase('ui_case_list')">删除所选</t-button>
        </div>

        <t-table
          row-key="id"
          :columns="genColumns('ui_case_name')"
          bordered
          :data="filterUiCaseList"
          :maxHeight="600"
          :selected-row-keys="deleteSelectedCaseList.ui_case_list"
          :filter-value="componentObj.ui_case_name.value"
          @filter-change="filters => filterChange('ui_case_name', filters)"
          @select-change="idList => deleteSelectedCaseChange('ui_case_list', idList)"
        />
      </t-col>
      <t-col v-else :lg="8" :xs="12">
        <div class="h-600 flex-col-center">
          <base-empty />
        </div>
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
import BaseEmpty from '@/components/BaseEmpty/index.vue'
import { renderAction } from '@/composables/renderTableAction'
import { validateRequired } from '@/components/validate'
import {
  fetchAddVersionTask,
  fetchGetVersionTask,
  fetchUpdateVersionTask,
} from '@/api/version-task'
import { versionTaskTypeList } from '@/config/variables'

const route = useRoute()
const router = useRouter()
const store = useStore()
const { id, version_id } = route.query
const message = inject('message')

const formModal = ref({
  user_list: [],
  task_name: '',
  task_type: '',
  case_list: [],
  scenario_list: [],
  ui_case_list: [],
})

const rules = {
  task_name: [validateRequired('请输入任务名称')],
}

const extraProps = {
  class: 'wp-100',
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
    label: '任务类型',
    value: 'task_type',
    component: 't-select',
    list: versionTaskTypeList,
    extraProps,
  },
  {
    value: 'task_name',
    label: '任务名称',
    extraProps,
  },
  {
    value: 'remark',
    label: '备注',
    component: 't-textarea',
    extraProps,
  },
]

const componentObj = ref({
  case_name: {
    listKey: 'case_list',
    compKey: 'case-list',
    tableKey: 'case_name',
    title: '用例名称',
    value: '', // 用于table筛选
  },
  scenario_title: {
    listKey: 'scenario_list',
    compKey: 'scene-list',
    tableKey: 'scenario_title',
    title: '场景名称',
    value: '',
  },
  ui_case_name: {
    listKey: 'ui_case_list',
    compKey: 'ui-case-list',
    tableKey: 'case_name',
    title: '用例名称',
    value: '',
  },
})
const taskType = ref('case_name')
const currentComp = computed(() => componentObj.value[taskType.value])
const componentName = computed(() => currentComp.value.compKey)

const renderAddAction = tableType => (
  <t-button
    theme="primary"
    variant="text"
    onClick={() => {
      caseListDialogVisible.value = true
      taskType.value = tableType
    }}
  >
    <t-icon name="add" />
  </t-button>
)
const caseListDialogVisible = ref(false)
const dataName = computed(() => currentComp.value.listKey)
const dataList = computed(() => formModal.value[dataName.value])

const actionOptionList = taskType => [
  {
    content: '移除',
    value: 'close',
    theme: 'danger',
    onClick({ rowIndex }) {
      const listKey = componentObj.value[taskType].listKey
      formModal.value[listKey].splice(rowIndex, 1)
    },
  },
]

const genColumns = taskType => {
  const { title, tableKey } = componentObj.value[taskType]
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
      colKey: tableKey,
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
        type == 'title'
          ? renderAddAction(taskType)
          : renderAction(actionOptionList(taskType), rest),
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
  ui_case_list: [],
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

const filterChange = (key, filters) => {
  componentObj.value[key].value = filters[componentObj.value[key].tableKey]
}

function filterForKey(listKey, key) {
  return filter(formModal.value[listKey], i =>
    includes(i[componentObj.value[key].tableKey], componentObj.value[key].value || '')
  )
}

const filterCaseList = computed(() => filterForKey('case_list', 'case_name'))
const filterSceneList = computed(() => filterForKey('scenario_list', 'scenario_title'))
const filterUiCaseList = computed(() => filterForKey('ui_case_list', 'ui_case_name'))

const saveCaseScenario = async () => {
  const data = {
    ...formModal.value,
    version_id,
    case_list: formModal.value.task_type == 'api_case' ? map(formModal.value.case_list, 'id') : [],
    scenario_list:
      formModal.value.task_type == 'api_case' ? map(formModal.value.scenario_list, 'id') : [],
    ui_case_list:
      formModal.value.task_type == 'ui_case' ? map(formModal.value.ui_case_list, 'id') : [],
  }
  if (id) {
    await fetchUpdateVersionTask(data)
  } else {
    await fetchAddVersionTask(data)
  }
  message.success('操作成功')
  store.commit('app/delTag', route.fullPath)
  router.push({
    path: '/version/task',
    query: {
      version_id,
    },
  })
}

watch(
  () => caseListDialogVisible.value,
  visible => !visible && (selectedCase.value = [])
)

onMounted(async () => {
  if (id) {
    formModal.value = await fetchGetVersionTask(id)
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
