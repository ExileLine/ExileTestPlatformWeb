<template>
  <t-select
    v-bind="$attrs"
    :value="value"
    filterable
    remote
    clearable
    :multiple="multiple"
    :value-key="valueKey"
    :options="options"
    :remote-method="getList"
  />
</template>
<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { map } from 'lodash'
import { post } from '@/utils/request'
import { onMounted } from 'vue'

const store = useStore()

const props = defineProps({
  value: null,
  url: String,
  multiple: Boolean,
  valueKey: {
    type: String,
    default: 'id',
  },
  labelKey: {
    type: String,
    default: 'label',
  },
  dataKey: {
    type: String,
    default: '',
  },
})

const options = ref([])

async function getList(value = '') {
  const { url, labelKey, valueKey, dataKey } = props
  const { records } = await post(url, {
    page: 1,
    size: 100,
    project_id: store.getters.project_id,
    [dataKey || labelKey]: typeof value === 'string' ? value : '',
  })
  options.value = map(records, item => ({
    ...item,
    label: item[props.labelKey],
    value: item[props.valueKey],
  }))
}

onMounted(() => {
  getList()
})
</script>
