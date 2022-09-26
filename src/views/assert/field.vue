<template>
  <PageContainer>
    <base-table
      ref="baseTableRef"
      :form-model="formModel"
      :field-list="fieldList"
      :columns="columns"
      :action-option-list="actionOptionList"
      url="/api/assertion_page"
    >
      <template v-if="!hasAddBtn" #formActions>
        <t-button>新增</t-button>
      </template>
    </base-table>
  </PageContainer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { columns } from './variables'

const props = defineProps({
  hasAddBtn: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['bind'])

const baseTableRef = ref()

const formModel = ref({
  assertion_type: 'field',
})
const refresh = () => {
  baseTableRef.value.getData = true
}
const fieldList = [
  {
    label: '断言描述',
    value: 'assert_description',
  },
  {
    label: '创建者',
    value: 'creator_id',
    component: 'remote-select',
    extraProps: {
      url: '/api/user_page',
      labelKey: 'username',
    },
    on: {
      change: refresh,
    },
  },
]
const actionOptionList = computed(() => {
  const options = [
    {
      content: '编辑',
      value: 'edit',
      theme: 'primary',
      async onClick({ row }) {},
    },
    {
      content: '删除',
      value: 'close',
      theme: 'danger',
      async onClick({ row }) {},
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
</script>

<style lang="scss" scoped></style>
