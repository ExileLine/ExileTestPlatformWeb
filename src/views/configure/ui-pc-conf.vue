<template>
  <page-container>
    <base-table
      ref="baseTableRef"
      :form-model="formModel"
      :field-list="fieldList"
      :columns="columns"
      :action-option-list="actionOptionList"
      url="/api/ui_pc_conf_page"
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
        label-width="6em"
        confirm-text="确定"
        cancel-text="取消"
        @confirm="saveUiPcConf"
        @cancel="envDialogVisible = false"
      />
    </t-dialog>
  </page-container>
</template>

<script setup lang="jsx">
import { ref, computed, inject } from 'vue'
import { cloneDeep } from 'lodash'
import { fetchAddUiPcConf, fetchUpdateUiPcConf, fetchDeleteUiPcConf } from '@/api/ui-pc-conf'
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
    label: '远端名称',
    value: 'ui_pc_name',
  },
  {
    label: '远端ip',
    value: 'ui_pc_ip',
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
  ui_pc_name: [validateRequired('请输入远端名称')],
  ui_pc_ip: [validateRequired('请输入远端ip')],
}

const title = computed(() => (envForm.value.id ? '编辑PC远端配置' : '新增PC远端配置'))

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
          是否删除UI远端配置：
          <span class="text-warning-6">
            {row.name}：{row.ui_pc_ip}
          </span>
        </div>
      )
      await fetchDeleteUiPcConf(row)
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
    colKey: 'ui_pc_name',
    title: '名称',
    ellipsis: true,
    width: 200,
  },
  {
    colKey: 'ui_pc_ip',
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
const saveUiPcConf = async () => {
  const data = envForm.value
  if (data.id) {
    await fetchUpdateUiPcConf(data)
  } else {
    await fetchAddUiPcConf(data)
  }
  envDialogVisible.value = false
  close()
  selectChange.change()
  message.success('操作成功')
}
</script>

<style lang="scss" scoped></style>
