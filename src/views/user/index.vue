<template>
  <page-container>
    <base-table
      ref="baseTableRef"
      :form-model="formModel"
      :field-list="fieldList"
      :columns="columns"
      :action-option-list="actionOptionList"
      url="/api/user_page"
    >
      <template #formActions>
        <t-button theme="primary" @click="userDialogVisible = true">新增</t-button>
      </template>
    </base-table>

    <user-dialog
      v-model:visible="userDialogVisible"
      :data="userForm"
      @save="baseTableRef.getData = true"
      @close="userForm = {}"
    />
  </page-container>
</template>

<script setup lang="jsx">
import { ref, computed, inject } from 'vue'
import { cloneDeep } from 'lodash'
import UserDialog from './components/UserDialog.vue'
import { fetchDeleteUser } from '@/api/user'
import { confirmDialog } from '@/utils/business'

const baseTableRef = ref()
const formModel = ref({})
const message = inject('message')
const fieldList = [
  {
    label: '工号',
    value: 'code',
  },
  {
    label: '用户名',
    value: 'username',
  },
  {
    label: '手机号',
    value: 'phone',
  },
]

const userDialogVisible = ref(false)
const userForm = ref({})

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

const updateUserStatus = async (status, row) => {
  const dialog = await confirmDialog(
    <div>
      是否{status === 99 ? '禁用' : '启用'}用户：<span class="text-warning-6">{row.username}</span>
    </div>
  )
  await fetchDeleteUser({
    ...row,
    status,
  })
  baseTableRef.value.getData = true
  dialog.hide()
  message.success('操作成功')
}

const columns = computed(() => [
  {
    colKey: 'id',
    title: 'ID',
    ellipsis: true,
    width: 100,
  },
  {
    colKey: 'code',
    title: '工号',
    ellipsis: true,
    width: 100,
  },
  {
    colKey: 'username',
    title: '用户名',
    ellipsis: true,
    width: 160,
  },
  {
    colKey: 'nickname',
    title: '昵称',
    ellipsis: true,
    width: 140,
  },
  {
    colKey: 'phone',
    title: '手机号',
    ellipsis: true,
    width: 140,
  },
  {
    colKey: 'mail',
    title: '邮箱',
    ellipsis: true,
    width: 280,
  },
  {
    colKey: 'status',
    title: '状态',
    ellipsis: true,
    width: 100,
    render(h, { type, row }) {
      if (type === 'title') return
      return (
        <t-switch
          value={row.status}
          customValue={[1, 99]}
          label={['启用', '禁用']}
          onChange={val => updateUserStatus(val, row)}
        ></t-switch>
      )
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
</script>

<style lang="scss" scoped></style>
