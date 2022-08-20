<template>
  <div>
    <div class="mb-10 justify-end">
      <t-tooltip content="选择响应断言">
        <t-button theme="success" @click="getAssertionList">
          <t-icon name="root-list"></t-icon>
        </t-button>
      </t-tooltip>
      <t-tooltip content="新增响应断言">
        <t-button theme="primary" @click="add">
          <t-icon name="add"></t-icon>
        </t-button>
      </t-tooltip>
    </div>
    <t-table bordered esc :data="data" :columns="columns" />
  </div>
</template>

<script setup lang="jsx">
import { genResponseColumns } from './variables'
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})
const emit = defineEmits(['get-assertion-list', 'add', 'edit'])

const type = 'response'

const columns = genResponseColumns({
  type,
  props,
  emit,
})
const getAssertionList = () => {
  emit('get-assertion-list', type)
}
const add = () => {
  emit('add', type)
}
</script>

<style lang="scss" scoped></style>
