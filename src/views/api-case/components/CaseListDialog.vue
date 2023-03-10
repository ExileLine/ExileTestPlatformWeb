<template>
  <div class="dialog-list">
    <t-dialog
      :visible="visible"
      header="添加用例"
      width="1400px"
      destroy-on-close
      placement="center"
      :footer="null"
      @close="$emit('update:visible', false)"
    >
      <case-list
        has-add-btn
        @add="row => $emit('add', row)"
        @add-selected="row => $emit('add-selected', row)"
        @select-change="(...rest) => $emit('select-change', ...rest)"
      />
    </t-dialog>
  </div>
</template>

<script setup>
import CaseList from '@/views/api-case/index.vue'

defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss" scoped>
@import './dialog.scss';
</style>
