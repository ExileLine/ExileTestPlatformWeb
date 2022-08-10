<template>
  <page-container>
    <base-table
      :form-model="formModel"
      :field-list="fieldList"
      :columns="columns"
      url="/api/user_page"
    >
      <template #formActions>
        <t-button theme="primary">新增</t-button>
      </template>
    </base-table>
  </page-container>
</template>

<script setup lang="jsx">
import { ref } from 'vue'
const formModel = ref({})
const fieldList = [
  {
    label: '工号',
    value: 'code'
  },
  {
    label: '用户名',
    value: 'username'
  },
  {
    label: '手机号',
    value: 'phone'
  }
]
const columns = [
  {
    colKey: 'id',
    title: 'ID',
    ellipsis: true,
    width: 100
  },
  {
    colKey: 'code',
    title: '工号',
    ellipsis: true,
    width: 100
  },
  {
    colKey: 'username',
    title: '用户名',
    ellipsis: true,
    width: 160
  },
  {
    colKey: 'nickname',
    title: '昵称',
    ellipsis: true,
    width: 140
  },
  {
    colKey: 'phone',
    title: '手机号',
    ellipsis: true,
    width: 140
  },
  {
    colKey: 'mail',
    title: '邮箱',
    ellipsis: true,
    width: 280
  },
  {
    colKey: 'create_time',
    title: '创建时间',
    ellipsis: true,
    width: 200
  },
  {
    colKey: 'remark',
    title: '备注',
    ellipsis: true,
    width: 180
  },
  {
    colKey: 'action',
    title: '操作',
    width: 220,
    fixed: 'right',
    render: (h, { type }) =>
      type !== 'title' && (
        <div>
          <t-button theme="primary" variant="text">
            <t-icon name="edit" />
          </t-button>
          <t-button theme="warning" variant="text">
            <t-icon name="error-circle" />
          </t-button>
          <t-button theme="danger" variant="text">
            <t-icon name="delete" />
          </t-button>
        </div>
      )
  }
]
</script>

<style lang="scss" scoped></style>
