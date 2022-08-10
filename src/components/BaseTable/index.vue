<template>
  <div id="base-table" class="hp-100">
    <common-form
      layout="inline"
      :data="formModel"
      :rules="rules"
      :field-list="fieldList"
      class="mb-20"
      @cancel="getData = true"
      @confirm="getData = true"
    />
    <div ref="tableRef">
      <t-table bordered :data="tableData" :columns="_column" :height="height">
        <!-- <template #empty>
        <div class="flex-col-center">
          <svg-icon icon="no-data" width="10em" height="10em" />
          <div>暂无项目</div>
        </div>
      </template> -->
      </t-table>
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

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { throttle, map } from 'lodash'

const props = defineProps({
  // form数据
  formModel: {
    type: Object
  },
  // 相关字段
  fieldList: {
    type: Array
  },
  // 验证规则
  rules: {
    type: Object
  },
  // 相关的列表
  listInfo: {
    type: Object
  },
  columns: {
    type: Array
  },
  url: {
    type: String
  }
})

const tableData = ref([])
const getData = ref(false)
const height = ref(500)

const _column = computed(() => map(props.columns, i => ({ ...i, align: i.align || 'center' })))

const tableRef = ref()
const paginationRef = ref()

const setTableHeight = () => {
  const { height: bodyHeight } = document.body.getBoundingClientRect()
  const { top } = tableRef.value.getBoundingClientRect()
  const { height: paginationHeight } = paginationRef.value.getBoundingClientRect()
  height.value = bodyHeight - top - paginationHeight - 20 * 3
}
const resize = throttle(setTableHeight, 1000 / 60)
onMounted(() => {
  setTableHeight()
  window.addEventListener('resize', resize)
})
onUnmounted(() => {
  window.removeEventListener('resize', resize)
})
</script>
