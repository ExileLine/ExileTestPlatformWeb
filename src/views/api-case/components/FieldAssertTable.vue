<template>
  <div>
    <div class="mb-10 justify-end">
      <t-tooltip content="选择字段断言">
        <t-button theme="success">
          <t-icon name="root-list"></t-icon>
        </t-button>
      </t-tooltip>
      <t-tooltip content="新增字段断言">
        <t-button theme="primary">
          <t-icon name="add"></t-icon>
        </t-button>
      </t-tooltip>
    </div>
    <t-table bordered esc :data="data" :columns="columns" />
  </div>
</template>

<script setup lang="jsx">
import { genFieldColumns } from './variables'
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

const columns = genFieldColumns(props)
</script>

<style lang="scss" scoped></style>
