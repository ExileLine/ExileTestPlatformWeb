<template>
  <div class="dialog-list">
    <t-dialog
      :visible="visible"
      :header="header"
      width="1400px"
      destroy-on-close
      placement="center"
      :footer="null"
      @close="$emit('update:visible', false)"
    >
      <component
        :is="componentObject[componentName]"
        has-add-btn
        @add="row => $emit('add', row)"
        @add-selected="row => $emit('add-selected', row)"
        @select-change="(...rest) => $emit('select-change', ...rest)"
      />
    </t-dialog>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { includes } from 'lodash'
import CaseList from '@/views/api-case/index.vue'
import SceneList from '@/views/api-case/scene.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  componentName: {
    type: String,
    default: 'CaseList',
  },
})

const componentObject = {
  CaseList: CaseList,
  SceneList: SceneList,
  'case-list': CaseList,
  'scene-list': SceneList,
}

const caseListCompNameList = ['CaseList', 'case-list']

const header = computed(() =>
  includes(caseListCompNameList, props.componentName) ? '添加用例' : '添加场景'
)
</script>

<style lang="scss" scoped>
@import './dialog.scss';
</style>
