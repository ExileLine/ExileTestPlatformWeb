<template>
  <page-container>
    <base-table
      ref="baseTableRef"
      :form-model="formModel"
      :field-list="fieldList"
      :columns="columns"
      :action-option-list="actionOptionList"
      url="/api/case_db_page"
    >
      <template #formActions>
        <t-button theme="primary" @click="dbDialogVisible = true">新增</t-button>
      </template>
    </base-table>

    <t-dialog v-model:visible="dbDialogVisible" :footer="false" :header="title" @close="close">
      <common-form
        dialog
        ref="dbFormRef"
        :data="dbForm"
        :rules="dbRules"
        :field-list="dbFieldList"
        label-width="6em"
        confirm-text="确定"
        cancel-text="取消"
        @confirm="saveDB"
        @cancel="dbDialogVisible = false"
      />
    </t-dialog>

    <json-editor-dialog v-model:visible="jsonViewVisible" :record="record" />
  </page-container>
</template>

<script setup lang="jsx">
import { ref, computed, inject } from 'vue'
import { forIn, find, cloneDeep } from 'lodash'
import { dbTypeList } from '@/config/variables'
import JsonEditorDialog from '@/components/JsonEditorDialog/index.vue'
import { validateRequired } from '@/components/validate'
import { fetchAddDB, fetchUpdateDB, fetchDeleteDB, fetchDbPing } from '@/api/db'
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
    value: 'name',
  },
  {
    label: '类型',
    value: 'db_type',
    component: 't-select',
    list: dbTypeList,
    on: selectChange,
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

const dbDialogVisible = ref(false)
const dbForm = ref({})
const dbFormRef = ref()
const dbFieldList = computed(() => {
  return fieldList.slice(0, 2).concat([
    {
      label: 'Host',
      value: 'host',
    },
    {
      label: 'Port',
      value: 'port',
      component: 't-input-number',
      extraProps: {
        theme: 'normal',
        type: 'tel',
        class: 'wp-100',
      },
    },
    dbForm.value.db_type !== 'redis'
      ? {
          label: 'User',
          value: 'user',
        }
      : {
          label: 'db',
          value: 'db',
        },
    {
      label: 'Password',
      value: 'password',
    },
    {
      label: '备注',
      value: 'remark',
    },
  ])
})
const dbRules = {
  name: [validateRequired('请输入名称')],
  db_type: [validateRequired('请选择类型')],
  host: [validateRequired('请输入Host')],
  port: [validateRequired('请输入Port')],
  user: [validateRequired('请输入User')],
  db: [validateRequired('请输入db')],
  password: [validateRequired('请输入Password')],
}

const title = computed(() => (dbForm.value.id ? '编辑数据库连接配置' : '新增数据库连接配置'))

const actionOptionList = [
  {
    content: '编辑',
    value: 'edit',
    theme: 'primary',
    onClick({ row }) {
      dbForm.value = cloneDeep(row)
      forIn(row.db_connection, (value, key) => {
        dbForm.value[key] = row.db_connection[key]
      })
      dbDialogVisible.value = true
    },
  },
  {
    content: 'Ping',
    value: 'link',
    theme: 'success',
    async onClick({ row }) {
      await fetchDbPing(row.id)
      message.success('Ping成功')
    },
  },
  {
    content: '删除',
    value: 'delete',
    theme: 'danger',
    async onClick({ row }) {
      const dialog = await confirmDialog(
        <div>
          是否删除数据库连接配置：
          <span class="text-warning-6">{row.name}</span>
        </div>
      )
      await fetchDeleteDB(row)
      dialog.hide()
      selectChange.change()
      message.success('操作成功')
    },
  },
]
const record = ref({})
const jsonViewVisible = ref(false)

const showJsonDetail = row => {
  record.value = row
  jsonViewVisible.value = true
}
const renderJson = row => (
  <t-button variant="text" shape="circle" onClick={() => showJsonDetail(row)}>
    <t-icon name="browse">查看</t-icon>
  </t-button>
)

const renderColumn = (h, { row, col, type }) =>
  type !== 'title' && renderJson({ ...row, title: col.title, colKey: col.colKey })

const columns = computed(() => [
  {
    colKey: 'id',
    title: 'ID',
    ellipsis: true,
    width: 100,
  },
  {
    colKey: 'name',
    title: '名称',
    ellipsis: true,
    width: 200,
  },
  {
    colKey: 'db_type',
    title: '类型',
    ellipsis: true,
    width: 160,
    render: (h, { row, type }) => {
      if (type !== 'title') {
        const dbType = find(dbTypeList, { value: row.db_type })
        return dbType?.label
      }
    },
  },
  {
    colKey: 'db_connection',
    title: '连接信息',
    width: 120,
    render: renderColumn,
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
  dbForm.value = {}
  dbFormRef.value.cancel()
}
const saveDB = async () => {
  const data = dbForm.value
  const db_connection = {
    host: data.host,
    port: data.port,
    password: data.password,
  }
  if (data.db_type === 'redis') {
    db_connection.db = data.db
  } else {
    db_connection.user = data.user
  }
  if (data.id) {
    await fetchUpdateDB({ ...data, db_connection })
  } else {
    await fetchAddDB({ ...data, db_connection })
  }
  close()
  dbDialogVisible.value = false
  selectChange.change()
  message.success('操作成功')
}
</script>

<style lang="scss" scoped></style>
