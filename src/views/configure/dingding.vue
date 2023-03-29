<template>
  <page-container>
    <base-table
      ref="baseTableRef"
      :form-model="formModel"
      :field-list="fieldList"
      :columns="columns"
      :action-option-list="actionOptionList"
      url="/api/dd_push_conf_page"
    >
      <template #formActions>
        <t-button theme="primary" @click="dingdingDialogVisible = true">新增</t-button>
      </template>
    </base-table>

    <t-dialog
      v-model:visible="dingdingDialogVisible"
      :footer="false"
      :header="title"
      @close="close"
    >
      <common-form
        dialog
        :data="dingdingForm"
        :rules="dingdingRules"
        :field-list="dingdingFieldList"
        label-width="4em"
        confirm-text="确定"
        cancel-text="取消"
        @confirm="saveDingDing"
        @cancel="dingdingDialogVisible = false"
      />
    </t-dialog>
  </page-container>
</template>

<script setup lang="jsx">
import { ref, computed, inject } from 'vue'
import { cloneDeep } from 'lodash'
import { fetchAddDingDing, fetchUpdateDingDing, fetchDeleteDingDing } from '@/api/dingding'
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
    label: '钉钉群名称',
    value: 'title',
  },
  {
    label: '钉钉群url',
    value: 'ding_talk_url',
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

const dingdingDialogVisible = ref(false)
const dingdingForm = ref({})
const dingdingFieldList = fieldList.slice(0, 2).concat({
  label: '备注',
  value: 'remark',
})
const dingdingRules = {
  title: [validateRequired('请输入钉钉群名称')],
  ding_talk_url: [validateRequired('请输入钉钉群url')],
}

const title = computed(() => (dingdingForm.value.id ? '编辑钉钉推送' : '新增钉钉推送'))

const actionOptionList = [
  {
    content: '编辑',
    value: 'edit',
    theme: 'primary',
    onClick({ row }) {
      dingdingForm.value = cloneDeep(row)
      dingdingDialogVisible.value = true
    },
  },
  {
    content: '删除',
    value: 'delete',
    theme: 'danger',
    async onClick({ row }) {
      const dialog = await confirmDialog(
        <div>
          是否删除钉钉推送：
          <span class="text-warning-6">
            {row.name}：{row.title}
          </span>
        </div>
      )
      await fetchDeleteDingDing(row)
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
    colKey: 'title',
    title: '钉钉群名称',
    ellipsis: true,
    width: 200,
  },
  {
    colKey: 'ding_talk_url',
    title: '钉钉群url',
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
  dingdingForm.value = {}
}
const saveDingDing = async () => {
  const data = dingdingForm.value
  if (data.id) {
    await fetchUpdateDingDing(data)
  } else {
    await fetchAddDingDing(data)
  }
  dingdingDialogVisible.value = false
  close()
  selectChange.change()
  message.success('操作成功')
}
</script>

<style lang="scss" scoped></style>
