<template>
  <page-container>
    <base-table
      :form-model="formModel"
      :field-list="fieldList"
      :columns="columns"
      :action-option-list="actionOptionList"
      url="/api/user_page"
    >
      <template #formActions>
        <t-button theme="primary">新增</t-button>
      </template>
    </base-table>
  </page-container>
</template>

<script setup lang="jsx">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const isMobile = computed(() => store.getters.isMobile)
const formModel = ref({})
const fieldList = [
  {
    label: '工号',
    value: 'code',
  },
  {
    label: '用户名',
    value: 'username',
  },
  {
    label: '手机号',
    value: 'phone',
  },
]

const actionOptionList = [
  {
    content: '编辑',
    value: 'edit',
    theme: 'primary',
    onClick() {
      console.log('编辑')
    },
  },
  {
    content: '禁用',
    value: 'error-circle',
    theme: 'warning',
    onClick() {},
  },
  {
    content: '删除',
    value: 'delete',
    theme: 'danger',
    onClick() {},
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
    colKey: 'code',
    title: '工号',
    ellipsis: true,
    width: 100,
  },
  {
    colKey: 'username',
    title: '用户名',
    ellipsis: true,
    width: 160,
  },
  {
    colKey: 'nickname',
    title: '昵称',
    ellipsis: true,
    width: 140,
  },
  {
    colKey: 'phone',
    title: '手机号',
    ellipsis: true,
    width: 140,
  },
  {
    colKey: 'mail',
    title: '邮箱',
    ellipsis: true,
    width: 280,
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
