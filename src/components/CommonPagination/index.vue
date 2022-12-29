<template>
  <div
    v-show="!noPaging"
    class="flex-between flex-wrap"
    style="display: flex; justify-content: center; margin-top: 20px"
  >
    <t-pagination-mini v-if="isMobile" showCurrent :disabled="jumperDisabled" @change="handleJumperChange" />
    <t-pagination
      v-else
      v-bind="{
        layout: 'total, sizes, prev, pager, next, jumper',
        'page-size-options': [1, 5, 10, 20, 30, 50, 100],
        ...otherProps,
      }"
      show-jumper
      :current="page"
      :page-size="size"
      :total="total"
      @page-size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script setup>
import { ref, onMounted, watch, computed, onActivated } from 'vue'
import { useStore } from 'vuex'
import { debounce } from 'lodash'
import request from '@/utils/request'
const props = defineProps({
  url: String,
  params: {
    type: Object,
    default: () => ({}),
  },
  doRequest: {
    type: Boolean,
    default: false, // post
  }, //true的时候主动更新数据
  list: {
    type: Array,
    default: () => [],
  },
  type: {
    type: String,
    default: 'post', // post
  },
  noPaging: {
    //不分页设置未true
    type: Boolean,
    defalut: false,
  },
  unLoad: {
    //是否初始不加载
    type: Boolean,
    defalut: false,
  },
  otherProps: {
    type: Object,
    default: () => {},
  },
  pageSize: {
    type: Number,
    default: 20, // post
  },
})
const emit = defineEmits(['confirm', 'update:list'])
const store = useStore()
const page = ref(1)
const size = ref(10)
const total = ref(10)
const isMobile = computed(() => store.getters.isMobile)

const getList = debounce(() => {
  if (!props.url) return
  const params = {
    page: page.value,
    size: size.value,
    ...props.params,
  }
  transParams(params)
  request[props.type.toLocaleLowerCase()](props.url, params).then(res => {
    emit('update:list', res.records)
    total.value = +res.total
  })
})

const handleSizeChange = s => {
  size.value = s
  getList()
}

const handleCurrentChange = p => {
  page.value = p
  getList()
}

const jumperDisabled = computed(() => ({
  prev: page.value === 1,
  next: page.value > Math.ceil(total / size),
}))

const handleJumperChange = ({ trigger }) => {
  if (trigger === 'prev') {
    page.value -= 1
    getList()
  } else if (trigger === 'next') {
    page.value += 1
    getList()
  }
}
watch(
  () => props.doRequest,
  n => {
    if (n) {
      getList()
      emit('update:doRequest', false)
    }
  }
)
watch(
  () => props.pageSize,
  n => {
    size.value = n || 20
  },
  {
    immediate: true,
  }
)
watch(
  () => props.params,
  () => {
    page.value = 1
  },
  {
    deep: true,
  }
)

onActivated(() => {
  getList()
})
onMounted(() => {
  getList()
})
function transParams(params) {
  const obj = {}
  for (let key in params) {
    if (params[key] === '') {
      delete params[key]
    }
    if (typeof params[key] === 'object') {
      transParams(params[key])
    }
  }
}
</script>
