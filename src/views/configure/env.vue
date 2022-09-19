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
        <t-button theme="primary" @click="envDialogVisible = true">新增</t-button>
      </template>
    </base-table>

    <t-dialog v-model:visible="envDialogVisible" :footer="false" :header="title" @close="close">
      <common-form
        dialog
        :data="envForm"
        :rules="envRules"
        :field-list="envFieldList"
        label-width="4em"
        confirm-text="确定"
        cancel-text="取消"
        @confirm="saveEnv"
        @cancel="envDialogVisible = false"
      />
    </t-dialog>
  </page-container>
</template>

<script setup lang="jsx">
import { ref, computed, inject } from 'vue'
import { cloneDeep } from 'lodash'
import { fetchAddEnv, fetchUpdateEnv, fetchDeleteEnv } from '@/api/env'
import { validateRequired } from '@/components/validate'
import { confirmDialog } from '@/utils/business'

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

const envDialogVisible = ref(false)
const envForm = ref({})
const envFieldList = fieldList.slice(0, 2).concat({
  label: '备注',
  value: 'remark',
})
const envRules = {
  env_name: [validateRequired('请输入名称')],
  env_url: [validateRequired('请输入地址')],
}

const title = computed(() => (envForm.value.id ? '编辑环境' : '新增环境'))

const actionOptionList = [
  {
    content: '编辑',
    value: 'edit',
    theme: 'primary',
    onClick({ row }) {
      envForm.value = cloneDeep(row)
      envDialogVisible.value = true
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
  {
    content: '删除',
    value: 'delete',
    theme: 'danger',
    async onClick({ row }) {
      const dialog = await confirmDialog(
        <div>
          是否删除环境：
          <span class="text-warning-6">
            {row.name}：{row.env_url}
          </span>
        </div>
      )
      await fetchDeleteEnv(row)
      dialog.hide()
      selectChange.change()
      message.success('操作成功')
    },
  },
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

function close() {
  envForm.value = {}
}
const saveEnv = async () => {
  const data = envForm.value
  if (data.id) {
    await fetchUpdateEnv(data)
  } else {
    await fetchAddEnv(data)
  }
  envDialogVisible.value = false
  close()
  selectChange.change()
  message.success('操作成功')
}
</script>

<style lang="scss" scoped></style>
