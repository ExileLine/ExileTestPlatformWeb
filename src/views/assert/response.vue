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
        <t-button @click="addResponseDialogVisible = true">新增</t-button>
      </template>
    </base-table>
    <add-response-dialog v-model:visible="addResponseDialogVisible" :data="responseForm" />
  </PageContainer>
</template>

<script setup>
import { ref } from 'vue'
import { cloneDeep } from 'lodash'
import AddResponseDialog from './component/AddResponseDialog.vue'
import { columns } from './variables'
const baseTableRef = ref()

const formModel = ref({
  assertion_type: 'response',
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

const responseForm = ref({
  ass_json: [],
})
const addResponseDialogVisible = ref(false)
const actionOptionList = [
  {
    content: '编辑',
    value: 'edit',
    theme: 'primary',
    onClick({ row }) {
      responseForm.value = cloneDeep(row)
      addResponseDialogVisible.value = true
    },
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
