<template>
  <t-radio-group v-bind="$attrs" :value="value">
    <t-radio v-for="item in options" :value="item.value" :key="item.value">
      {{ item.label }}
    </t-radio>
  </t-radio-group>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps(['field', 'value', 'listInfo'])

const options = computed(() => {
  const { field, listInfo } = props
  if (Array.isArray(field.list)) return field.list
  return listInfo && listInfo[field.list]
})
</script>
