<template>
  <t-dialog
    :visible="visible"
    :header="record.title"
    width="1000px"
    destroy-on-close
    placement="center"
    :footer="null"
    @close="$emit('update:visible', false)"
  >
    <div class="h-400">
      <json-editor :model-value="record[record.colKey]" read-only />
    </div>
  </t-dialog>
</template>

<script setup>
import JsonEditor from '@/components/JsonEditor/index.vue'
defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  record: {
    type: Object,
    required: true,
  },
})
</script>

<style lang="scss" scoped></style>
