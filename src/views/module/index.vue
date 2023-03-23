<template>
  <page-container>
    <base-table
      ref="baseTableRef"
      :form-model="formModel"
      :field-list="fieldList"
      :columns="columns"
      :action-option-list="actionOptionList"
      url="/api/module_app_page"
    >
      <template #formActions>
        <t-button
          theme="primary"
          @click="
            $router.push({
              path: '/version/add-module',
              query: $route.query,
            })
          "
        >
          新增
        </t-button>
      </template>
    </base-table>

    <execute-dialog
      v-model:visible="executeDialogVisible"
      :info="record"
      :execute-name="record.module_name"
      execute-type="module"
    />
  </page-container>
</template>

<script setup lang="jsx">
import { ref, computed, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ExecuteDialog from '@view/api-case/components/ExecuteDialog.vue'
import { confirmDialog } from '@/utils/business'
import { fetchDeleteModule } from '@/api/module'

const route = useRoute()
const router = useRouter()
const baseTableRef = ref()
const formModel = ref({
  version_id: route.query.version_id,
})
const message = inject('message')

const selectChange = {
  change: () => {
    baseTableRef.value.getData = true
  },
}

const fieldList = [
  {
    label: '模块名称',
    value: 'module_name',
  },
  // {
  //   label: '模块编号',
  //   value: 'module_code',
  // },
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

const executeDialogVisible = ref(false)
const record = ref({})

const actionOptionList = [
  {
    content: '执行',
    value: 'play-circle',
    theme: 'success',
    onClick({ row }) {
      record.value = row
      executeDialogVisible.value = true
    },
  },
  {
    content: '编辑',
    value: 'edit',
    theme: 'primary',
    onClick({ row }) {
      router.push({
        path: '/version/edit-module',
        query: {
          ...route.query,
          id: row.id,
        },
      })
    },
  },
  {
    content: '删除',
    value: 'delete',
    theme: 'danger',
    async onClick({ row }) {
      const dialog = await confirmDialog(
        <div>
          是否删除模块：
          <span class="text-warning-6">{row.module_name}</span>
        </div>
      )
      await fetchDeleteModule(row)
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
    colKey: 'module_name',
    title: '模块名称',
    ellipsis: true,
    width: 300,
  },
  {
    colKey: 'module_code',
    title: '模块编号',
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
</script>

<style lang="scss" scoped></style>
