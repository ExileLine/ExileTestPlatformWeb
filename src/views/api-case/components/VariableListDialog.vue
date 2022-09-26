<template>
  <div class="assert-list">
    <t-dialog
      :visible="visible"
      header="添加变量"
      width="1400px"
      destroy-on-close
      placement="center"
      :footer="null"
      @close="$emit('update:visible', false)"
    >
      <variable-list has-add-btn @bind="row => $emit('bind', row)" />
    </t-dialog>
  </div>
</template>

<script setup>
import VariableList from '@/views/variable/index.vue'

defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss" scoped>
.assert-list {
  ::v-deep(.t-card) {
    border: none;
    box-shadow: none;
    min-height: 750px;
    .t-card__body {
      padding: 0;
    }
  }
}
</style>
