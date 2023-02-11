<template>
  <div>
    <div class="mb-10 justify-end">
      <t-tooltip content="选择关系变量">
        <t-button theme="success" @click="getAssertionList">
          <t-icon name="root-list" />
        </t-button>
      </t-tooltip>
      <t-tooltip content="新增关系变量">
        <t-button theme="primary" @click="add">
          <t-icon name="add" />
        </t-button>
      </t-tooltip>
    </div>
    <t-table bordered esc :data="data" :columns="columns" />
  </div>
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router'
import { genVariableColumns } from './variables'

const router = useRouter()
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})
const emit = defineEmits(['get-variable-list', 'add', 'edit'])
const columns = genVariableColumns(props)

const getAssertionList = () => {
  emit('get-variable-list')
}
const add = () => {
  router.push({
    path: '/variable/add',
  })
  // emit('add')
}
</script>

<style lang="scss" scoped></style>
