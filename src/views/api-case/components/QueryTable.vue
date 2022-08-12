<template>
  <t-table bordered :data="tableData" :columns="columns"></t-table>
</template>

<script setup lang="jsx">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { values } from 'lodash'
import { renderAction } from '@/composables/renderTableAction'

const store = useStore()
const isMobile = computed(() => store.getters.isMobile)
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

const tableData = computed(() => values(props.data))
const actionOptionList = [
  {
    content: '添加',
    value: 'add',
    theme: 'primary',
    onClick() {
      console.log('添加')
    },
  },
  {
    content: '删除',
    value: 'close',
    theme: 'danger',
    onClick() {},
  },
]

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
    render: (h, { type, row }) => type !== 'title' && <t-input v-model={row.key}></t-input>,
  },
  {
    colKey: 'value',
    title: '值(VALUE)',
    align: 'center',
    render: (h, { type, row }) => type !== 'title' && <t-input v-model={row.value}></t-input>,
  },
  {
    colKey: 'desc',
    title: '描述',
    align: 'center',
    render: (h, { type, row }) => type !== 'title' && <t-input v-model={row.desc}></t-input>,
  },
  {
    colKey: 'action',
    title: '操作',
    align: 'center',
    width: isMobile.value ? 120 : 160,
    render: (h, { type }) => type !== 'title' && renderAction(actionOptionList),
  },
]

// "": {
// key: 'token'
//                 "active": true,
//                 "value": "123456",
//                 "desc": "token"
//             }
</script>

<style lang="scss" scoped></style>
