<template>
  <t-table bordered row-key="cid" :data="data" :columns="columns"></t-table>
</template>

<script setup lang="jsx">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { AddIcon } from 'tdesign-icons-vue-next'
import { renderAction } from '@/composables/renderTableAction'

let cid = 0
const store = useStore()
const isMobile = computed(() => store.getters.isMobile)
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

props.data.forEach(i => (i.cid = ++cid))

const genQueryData = () => ({
  cid: ++cid,
  active: true,
  key: '',
  value: '',
  desc: '',
})

const actionOptionList = [
  {
    content: '添加',
    value: 'add',
    theme: 'primary',
    onClick({ rowIndex }) {
      props.data.splice(rowIndex + 1, 0, genQueryData())
    },
  },
  {
    content: '删除',
    value: 'close',
    theme: 'danger',
    onClick({ rowIndex }) {
      props.data.splice(rowIndex, 1)
    },
  },
]
const renderAddAction = () => (
  <t-button theme="primary" variant="text" onClick={() => props.data.push(genQueryData())}>
    <AddIcon />
  </t-button>
)

const columns = [
  {
    colKey: 'active',
    width: 66,
    render: (h, { type, row }) =>
      type !== 'title' && <t-checkbox v-model={row.active}></t-checkbox>,
  },
  {
    colKey: 'key',
    title: '键(KEY)',
    align: 'center',
    render: (h, { type, row }) =>
      type !== 'title' && <t-input v-model={row.key} placeholder="请输入KEY"></t-input>,
  },
  {
    colKey: 'value',
    title: '值(VALUE)',
    align: 'center',
    render: (h, { type, row }) =>
      type !== 'title' && <t-input v-model={row.value} placeholder="请输入VALUE"></t-input>,
  },
  {
    colKey: 'desc',
    title: '描述',
    align: 'center',
    render: (h, { type, row }) =>
      type !== 'title' && <t-input v-model={row.desc} placeholder="请输入描述"></t-input>,
  },
  {
    colKey: 'action',
    title: '操作',
    align: 'center',
    width: isMobile.value ? 120 : 160,
    render: (h, { type, ...rest }) =>
      type == 'title' ? renderAddAction() : renderAction(actionOptionList, rest),
  },
]
</script>

<style lang="scss" scoped></style>
