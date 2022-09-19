<template>
  <page-container>
    <base-table
      ref="baseTableRef"
      :form-model="formModel"
      :field-list="fieldList"
      :columns="columns"
      :action-option-list="actionOptionList"
      url="/api/case_env_page"
    >
      <template #formActions>
        <t-button theme="primary" @click="userDialogVisible = true">新增</t-button>
      </template>
    </base-table>
  </page-container>
</template>

<script setup lang="jsx">
import { ref, computed, inject } from 'vue'
import { cloneDeep } from 'lodash'

const baseTableRef = ref()
const formModel = ref({})
const message = inject('message')

const selectChange = {
  change: () => {
    baseTableRef.value.getData = true
  },
}

const fieldList = [
  {
    label: '名称',
    value: 'env_name',
  },
  {
    label: '地址',
    value: 'env_url',
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

// const userDialogVisible = ref(false)
// const userForm = ref({})

const actionOptionList = [
  {
    content: '编辑',
    value: 'edit',
    theme: 'primary',
    onClick({ row }) {
      userForm.value = cloneDeep(row)
      userDialogVisible.value = true
    },
  },
  // {
  //   content: '禁用',
  //   value: 'error-circle',
  //   theme: 'warning',
  //   async onClick({ row }) {
  //     const dialog = await confirmDialog(
  //       <div>
  //         是否删除用户：<span class="text-warning-6">{row.username}</span>
  //       </div>
  //     )
  //     await fetchDeleteUser(row)
  //     baseTableRef.value.getData = true
  //     dialog.hide()
  //     message.success('操作成功')
  //   },
  // },
  // {
  //   content: '删除',
  //   value: 'delete',
  //   theme: 'danger',
  //   onClick() {},
  // },
]

const columns = computed(() => [
  {
    colKey: 'id',
    title: 'ID',
    ellipsis: true,
    width: 100,
  },
  {
    colKey: 'env_name',
    title: '名称',
    ellipsis: true,
    width: 200,
  },
  {
    colKey: 'env_url',
    title: '地址',
    ellipsis: true,
    width: 300,
  },
  {
    colKey: 'creator',
    title: '创建者',
    ellipsis: true,
    width: 120,
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
</script>

<style lang="scss" scoped></style>
