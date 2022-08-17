<template>
  <div class="hp-100 flex-col flex-1">
    <base-radio
      :value="bodyType"
      :field="bodyTypeField"
      class="mb-10"
      @change="val => change(val, 'bodyType')"
    />
    <div v-if="bodyType === 'none'" class="ptb-30 flex-center text-gray-6">此请求没有正文</div>
    <json-editor
      v-else
      :modelValue="data"
      :mode="mode"
      :key="mode"
      @changed="val => change(val, 'data')"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { find } from 'lodash'
import BaseRadio from '@/components/CommonForm/components/Radio.vue'
import JsonEditor from '@/components/JsonEditor/index.vue'
import { bodyTypeList } from '@/config/variables'
const props = defineProps({
  bodyType: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:bodyType', 'update:data'])

const bodyTypeField = {
  list: bodyTypeList,
}

const mode = computed(() => find(bodyTypeField.list, { value: props.bodyType })?.mode)

const change = (val, key) => {
  emit(`update:${key}`, val)
}
</script>
