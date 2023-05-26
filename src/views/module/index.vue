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
        <!-- <t-button
          theme="primary"
          @click="
            $router.push({
              path: '/version/add-module',
              query: $route.query,
            })
          "
        >
          新增
        </t-button> -->
        <t-button theme="primary" @click="visible = true">新增</t-button>
      </template>
    </base-table>

    <execute-dialog
      v-model:visible="executeDialogVisible"
      :info="record"
      :execute-name="record.module_name"
      execute-type="module"
    />
    <ui-execute-dialog
      v-model:visible="uiExecuteDialogVisible"
      :info="record"
      :execute-name="record.module_name"
      execute-key="ui_module_all"
      execute-type="ui_module_all"
    />

    <t-dialog v-model:visible="visible" :footer="false" :header="title" @close="close">
      <common-form
        dialog
        label-width="7em"
        :data="addFormModal"
        :rules="rules"
        :field-list="addFieldList"
        confirm-text="确定"
        cancel-text="取消"
        @confirm="updateModule"
        @cancel="close"
      />
    </t-dialog>
  </page-container>
</template>

<script setup lang="jsx">
import { ref, computed, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { cloneDeep } from 'lodash'
import ExecuteDialog from '@view/api-case/components/ExecuteDialog.vue'
import UiExecuteDialog from '@view/ui-case/components/UiExecuteDialog.vue'
import { confirmDialog } from '@/utils/business'
import { fetchDeleteModule, fetchAddModule, fetchUpdateModule } from '@/api/module'
import { validateRequired } from '@/components/validate'

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
const uiExecuteDialogVisible = ref(false)
const record = ref({})

const addFormModal = ref({})
const rules = {
  module_name: [validateRequired('请输入模块名称')],
}

const addFieldList = [
  {
    value: 'module_name',
    label: '模块名称',
  },
  {
    label: '模块编号',
    value: 'module_code',
  },
  {
    value: 'remark',
    label: '备注',
    component: 't-textarea',
  },
]
const visible = ref(false)
const title = computed(() => (addFormModal.value.id ? '编辑模块' : '新增模块'))
function close() {
  visible.value = false
  addFormModal.value = {}
}

async function updateModule() {
  const data = addFormModal.value
  if (data.id) {
    await fetchUpdateModule(data)
  } else {
    await fetchAddModule(data)
  }
  message.success('操作成功')
  close()
  selectChange.change()
}

const actionOptionList = [
  {
    content: '执行API用例',
    value: 'play-circle',
    theme: 'success',
    onClick({ row }) {
      record.value = row
      executeDialogVisible.value = true
    },
  },
  {
    content: '执行UI用例',
    value: 'play-circle',
    theme: 'warning',
    onClick({ row }) {
      record.value = row
      uiExecuteDialogVisible.value = true
    },
  },
  {
    content: '编辑',
    value: 'edit',
    theme: 'primary',
    onClick({ row }) {
      // router.push({
      //   path: '/version/edit-module',
      //   query: {
      //     ...route.query,
      //     id: row.id,
      //   },
      // })
      addFormModal.value = cloneDeep(row)
      visible.value = true
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
