<template>
  <div>
    <div class="mb-10 justify-end">
      <t-tooltip content="选择响应断言">
        <t-button theme="success">
          <t-icon name="root-list"></t-icon>
        </t-button>
      </t-tooltip>
      <t-tooltip content="新增响应断言">
        <t-button theme="primary">
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
const columns = genResponseColumns(props)
</script>

<style lang="scss" scoped></style>
