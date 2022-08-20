<template>
  <div class="assert-list">
    <t-dialog
      :visible="visible"
      :header="dialogTitle"
      width="1400px"
      destroy-on-close
      placement="center"
      :footer="null"
      @close="$emit('update:visible', false)"
    >
      <component :is="currentComponent" has-add-btn @bind="row => $emit('bind', row)" />
    </t-dialog>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import Response from '@/views/assert/response.vue'
import Field from '@/views/assert/field.vue'

const props = defineProps({
  info: {
    type: Object,
    required: true,
  },
  visible: {
    type: Boolean,
    default: false,
  },
  assertionType: {
    type: String,
    required: true,
  },
})
const componentObject = {
  response: Response,
  field: Field,
}
const dataName = computed(() => props.info.data_info.data_name)
const dialogTitle = computed(() =>
  props.assertionType === 'response'
    ? `参数(${dataName.value})添加响应断言`
    : `参数(${dataName.value})添加字段断言`
)
const currentComponent = computed(() => componentObject[props.assertionType])
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
