<template>
  <t-select v-bind="$attrs" :value="value" clearable>
    <t-option v-for="item in options" v-bind="item" :key="item.value" />
  </t-select>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps(['field', 'value', 'listInfo'])

const options = computed(() => {
  const { field, listInfo } = props
  if (Array.isArray(field.list)) return field.list
  return listInfo?.[field.list] || []
})
</script>
