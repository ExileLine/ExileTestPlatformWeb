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
        <t-button @click="addFieldialogVisible = true">新增</t-button>
      </template>
    </base-table>

    <field-rule-dialog
      v-model:visible="addFieldialogVisible"
      :data="fieldForm"
      @close="fieldForm = { ass_json: [], version_list: [] }"
      @save="refresh"
    />
  </PageContainer>
</template>
<script setup lang="jsx">
import { confirmDialog } from '@/utils/business'
import { ref, computed, inject } from 'vue'
import FieldRuleDialog from './component/FieldRuleDialog.vue'
import { fetchGetFieldRule, fetchDeleteFieldRule } from '@api/assertion'
import { columns } from './variables'

const props = defineProps({
  hasAddBtn: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['bind'])
const message = inject('message')
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

const addFieldialogVisible = ref(false)
const fieldForm = ref({
  ass_json: [],
  version_list: [],
})
const actionOptionList = computed(() => {
  const options = [
    {
      content: '编辑',
      value: 'edit',
      theme: 'primary',
      async onClick({ row }) {
        fieldForm.value = await fetchGetFieldRule(row.id)
        !fieldForm.value.version_list && (fieldForm.value.version_list = [])
        addFieldialogVisible.value = true
      },
    },
    {
      content: '删除',
      value: 'close',
      theme: 'danger',
      async onClick({ row }) {
        const dialog = await confirmDialog(
          <div>
            是否删除字段断言规则：<span class="text-warning-6">{row.assert_description}</span>
          </div>
        )
        await fetchDeleteFieldRule(row)
        dialog.hide()
        refresh()
        message.success('操作成功')
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
