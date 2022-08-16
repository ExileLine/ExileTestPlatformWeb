<template>
  <div>
    <div class="mb-10 justify-end">
      <t-tooltip content="选择关系变量">
        <t-button theme="success">
          <t-icon name="root-list"></t-icon>
        </t-button>
      </t-tooltip>
      <t-tooltip content="新增关系变量">
        <t-button theme="primary">
          <t-icon name="add"></t-icon>
        </t-button>
      </t-tooltip>
    </div>
    <t-table bordered esc :data="data" :columns="columns" />
  </div>
</template>

<script setup lang="jsx">
import { genVariableColumns } from './variables'
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})
const columns = genVariableColumns(props)
</script>

<style lang="scss" scoped></style>
