<template>
  <page-container>
    <t-row :gutter="20">
      <t-col :md="4" :xs="12">
        <div class="mb-20 fs-20 fw-600 mt-10">场景信息</div>
        <common-form
          label-width="100px"
          :data="formModal"
          :rules="rules"
          :field-list="fieldList"
          confirm-text="保存"
        />
      </t-col>
      <t-col :md="8" :xs="12">
        <div class="mb-20 fs-20 fw-600 mt-10">场景-用例列表</div>
        <t-transfer
          v-model="formModal.case_list"
          search
          :keys="keys"
          :data="caseList"
          :pagination="pagination"
          class="scene-transfer"
          @search="handleSearch"
          @page-change="handlePageChange"
        >
          <template #transferItem="{ data, type }">
            <div class="t-checkbox__label justify-end align-center flex-1">
              <t-tooltip :content="data.case_name" placement="top">
                <span
                  :class="{
                    'w-60': type !== 'source',
                  }"
                  class="ellipsis flex-1 w-0"
                >
                  {{ data.case_name }}
                </span>
              </t-tooltip>

              <template v-if="type !== 'source'">
                <t-input-number theme="normal" placeholder="排序" class="w-80 mr-5" />
                <t-input-number theme="normal" placeholder="执行后等待时间" class="w-150 mr-5" />
                <t-switch :label="caseSwitchLabel" />
              </template>
            </div>
          </template>
          <template #operation="{ direction }">
            <t-icon :name="`${direction === 'left' ? 'chevron-right' : 'chevron-left'}`" />
          </template>
        </t-transfer>
      </t-col>
    </t-row>
  </page-container>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { fetchGetCaseList } from '@/api/api-case'
const formModal = ref({
  case_list: [
    {
      case_id: 8658,
      index: 1,
      sleep: 10,
    },
  ],
})
const switchLabel = ['是', '否']

const extraProps = {
  class: 'w-200',
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
  {
    value: 'is_shared',
    label: '公开执行',
    component: 't-switch',
    extraProps: {
      label: switchLabel,
    },
  },
  {
    value: 'remark',
    label: '备注',
    component: 't-textarea',
    extraProps,
  },
]

// 穿梭框

const caseList = ref([])
const pagination = reactive({
  pageSize: 20,
  current: 1,
})
const caseSwitchLabel = ['开启', '屏蔽']
const keys = {
  label: 'case_name',
  value: 'id',
}

const handlePageChange = page => {}

const handleSearch = ({ query }) => {
  //   caseList.value = []
  //   pagination.current = 1
  //   getList()
  console.log(query)
}

const getList = async (query = '') => {
  const { records } = await fetchGetCaseList({
    query,
    size: 20,
    page: pagination.current,
  })
  caseList.value = records
}

onMounted(async () => {
  await getList()
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
</style>
