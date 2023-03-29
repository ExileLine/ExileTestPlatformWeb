<template>
  <page-container>
    <base-table
      ref="baseTableRef"
      :form-model="formModel"
      :field-list="fieldList"
      :columns="columns"
      :action-option-list="actionOptionList"
      url="/api/mail_conf_page"
    >
      <template #formActions>
        <t-button theme="primary" @click="mailDialogVisible = true">新增</t-button>
      </template>
    </base-table>

    <t-dialog v-model:visible="mailDialogVisible" :footer="false" :header="title" @close="close">
      <common-form
        dialog
        :data="mailForm"
        :rules="mailRules"
        :field-list="mailFieldList"
        label-width="4em"
        confirm-text="确定"
        cancel-text="取消"
        @confirm="saveMail"
        @cancel="mailDialogVisible = false"
      />
    </t-dialog>
  </page-container>
</template>

<script setup lang="jsx">
import { ref, computed, inject } from 'vue'
import { cloneDeep } from 'lodash'
import { fetchAddMail, fetchUpdateMail, fetchDeleteMail } from '@/api/mail'
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
    label: '邮箱',
    value: 'mail',
  },
  {
    label: '用户',
    value: 'mail_user',
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

const mailDialogVisible = ref(false)
const mailForm = ref({})
const mailFieldList = fieldList.slice(0, 2).concat({
  label: '备注',
  value: 'remark',
})
const mailRules = {
  mail: [validateRequired('请输入邮箱')],
  mail_user: [validateRequired('请输入用户')],
}

const title = computed(() => (mailForm.value.id ? '编辑邮箱' : '新增邮箱'))

const actionOptionList = [
  {
    content: '编辑',
    value: 'edit',
    theme: 'primary',
    onClick({ row }) {
      mailForm.value = cloneDeep(row)
      mailDialogVisible.value = true
    },
  },
  {
    content: '删除',
    value: 'delete',
    theme: 'danger',
    async onClick({ row }) {
      const dialog = await confirmDialog(
        <div>
          是否删除邮箱：
          <span class="text-warning-6">
            {row.name}：{row.mail}
          </span>
        </div>
      )
      await fetchDeleteMail(row)
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
    colKey: 'mail',
    title: '邮箱',
    ellipsis: true,
    width: 300,
  },
  {
    colKey: 'mail_user',
    title: '用户',
    ellipsis: true,
    width: 200,
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
  mailForm.value = {}
}
const saveMail = async () => {
  const data = mailForm.value
  if (data.id) {
    await fetchUpdateMail(data)
  } else {
    await fetchAddMail(data)
  }
  mailDialogVisible.value = false
  close()
  selectChange.change()
  message.success('操作成功')
}
</script>

<style lang="scss" scoped></style>
