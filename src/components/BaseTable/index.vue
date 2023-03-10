<template>
  <div id="base-table" class="hp-100">
    <div class="justify-between flex-wrap">
      <common-form
        layout="inline"
        :data="formModel"
        :rules="rules"
        :field-list="fieldList"
        class="mb-20"
        @cancel="getData = true"
        @confirm="getData = true"
      />
    </div>
    <div class="mb-20 justify-end">
      <slot name="formActions"></slot>
    </div>
    <div ref="tableRef">
      <t-table v-bind="$attrs" bordered :data="tableData" :columns="_column" :max-height="height" />
    </div>
    <div ref="paginationRef">
      <common-pagination
        v-model:do-request="getData"
        v-model:list="tableData"
        :params="formModel"
        :url="url"
      />
    </div>
  </div>
</template>

<script setup lang="jsx">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useStore } from 'vuex'
import { throttle, map, concat, filter } from 'lodash'
import { renderAction } from '@/composables/renderTableAction'

const props = defineProps({
  // form数据
  formModel: {
    type: Object,
  },
  // 相关字段
  fieldList: {
    type: Array,
  },
  // 验证规则
  rules: {
    type: Object,
  },
  // 相关的列表
  listInfo: {
    type: Object,
  },
  columns: {
    type: Array,
  },
  url: {
    type: String,
  },
  actionOptionList: {
    type: Array,
  },
})

const store = useStore()
const isMobile = computed(() => store.getters.isMobile)

const tableData = ref([])

const getData = ref(false)
const height = ref(500)

const _column = computed(() => {
  const { actionOptionList, columns } = props
  const length = actionOptionList?.length
  return filter(
    concat(
      map(columns, i => ({ ...i, align: i.align || 'center' })),
      length && {
        colKey: 'action',
        title: '操作',
        width: isMobile.value ? 120 : length * 48 + 48 + length * 8,
        align: 'center',
        fixed: 'right',
        render: (h, { type, ...rest }) => type !== 'title' && renderAction(actionOptionList, rest),
      }
    )
  )
})

const tableRef = ref()
const paginationRef = ref()

const setTableHeight = () => {
  const { height: bodyHeight } = document.body.getBoundingClientRect()
  const { top } = tableRef.value.getBoundingClientRect()
  const { height: paginationHeight } = paginationRef.value.getBoundingClientRect()
  // 40来自copyright
  height.value = bodyHeight - top - paginationHeight - 20 * 2 - 40
}
const resize = throttle(setTableHeight, 1000 / 60)
onMounted(() => {
  setTableHeight()
  window.addEventListener('resize', resize)
})
onUnmounted(() => {
  window.removeEventListener('resize', resize)
})

defineExpose({
  getData,
})
</script>
