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
        <t-button @click="addResponseDialogVisible = true">新增</t-button>
      </template>
    </base-table>
    <response-rule-dialog
      v-model:visible="addResponseDialogVisible"
      :data="responseForm"
      @close="responseForm = { ass_json: [] }"
      @save="refresh"
    />
  </PageContainer>
</template>

<script setup lang="jsx">
import { ref, inject, computed } from 'vue'
import ResponseRuleDialog from './component/ResponseRuleDialog.vue'
import { columns } from './variables'
import { fetchGetRespRule, fetchDeleteRespRule } from '@/api/assertion'
import { confirmDialog } from '@/utils/business'

const props = defineProps({
  hasAddBtn: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['add'])

const message = inject('message')

const baseTableRef = ref()

const formModel = ref({
  assertion_type: 'response',
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

const responseForm = ref({
  ass_json: [],
})
const addResponseDialogVisible = ref(false)
const actionOptionList = computed(() => {
  const options = [
    {
      content: '编辑',
      value: 'edit',
      theme: 'primary',
      async onClick({ row }) {
        responseForm.value = await fetchGetRespRule(row.id)
        addResponseDialogVisible.value = true
      },
    },
    {
      content: '删除',
      value: 'close',
      theme: 'danger',
      async onClick({ row }) {
        const dialog = await confirmDialog(
          <div>
            是否删除响应断言规则：<span class="text-warning-6">{row.assert_description}</span>
          </div>
        )
        await fetchDeleteRespRule(row)
        dialog.hide()
        message.success('操作成功')
        refresh()
      },
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
