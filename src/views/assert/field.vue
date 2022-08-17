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
      <template #formActions>
        <t-button>新增</t-button>
      </template>
    </base-table>
  </PageContainer>
</template>

<script setup>
import { ref } from 'vue'
import { columns } from './variables'
const baseTableRef = ref()

const formModel = ref({
  assertion_type: 'field',
})
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
      change() {
        baseTableRef.value.getData = true
      },
    },
  },
]
const actionOptionList = [
  {
    content: '编辑',
    value: 'edit',
    theme: 'primary',
    onClick({ row }) {},
  },
  {
    content: '删除',
    value: 'close',
    theme: 'danger',
    onClick({ row }) {},
  },
]
</script>

<style lang="scss" scoped></style>
