<template>
  <div class="json-editor">
    <textarea ref="codemirrorRef" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, nextTick } from 'vue'
import { useStore } from 'vuex'
// 引入CodeMirror和基础样式
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/idea.css'
import 'codemirror/theme/material-darker.css'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/lint/lint.css'

// 支持代码折叠
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/brace-fold'
// 搜索功能的依赖
import 'codemirror/addon/dialog/dialog'
// 支持搜索功能
import 'codemirror/addon/search/search'
import 'codemirror/addon/search/searchcursor'
// 支持括号自动匹配
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/closebrackets'
// JSON代码高亮需要由JavaScript插件支持
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/xml/xml'
import 'codemirror/mode/sql/sql'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/mode/python/python'

// JSON错误检查
import 'codemirror/addon/lint/lint'
// 需要依赖全局的jsonlint，不是很优雅
import 'codemirror/addon/lint/json-lint'

// 引入jsonlint
import jsonlint from 'jsonlint-mod'
window.jsonlint = jsonlint

const props = defineProps({
  modelValue: [String, Number, Object, Array],
  readOnly: [Boolean],
  mode: {
    type: String,
    default: 'application/json',
  },
})

const emit = defineEmits(['changed', 'update:modelValue'])

const store = useStore()
const theme = computed(() => store?.getters?.theme ?? 'light')

let jsonEditor
const codemirrorRef = ref()

// 监听是否数据改变，随时更新json数据
watch(
  () => props.modelValue,
  value => {
    nextTick(() => {
      const editorValue = jsonEditor.getValue()
      if (value !== editorValue) {
        setValue()
      }
    })
  }
)

watch(
  () => props.mode,
  mode => {
    jsonEditor.setOption('mode', mode)
  }
)
watch(
  () => theme.value,
  val => {
    nextTick(() => {
      jsonEditor.setOption('theme', val === 'dark' ? 'material-darker' : 'idea')
    })
  },
  {
    immediate: true,
  }
)

const setValue = () => {
  const { modelValue } = props
  if (typeof modelValue === 'string') {
    jsonEditor.setValue(modelValue)
  } else {
    jsonEditor.setValue(JSON.stringify(modelValue || {}, null, 2))
  }
}
onMounted(() => {
  const { readOnly } = props
  // CodeMirror的配置项，搜官网看这里的配置项配置
  jsonEditor = CodeMirror.fromTextArea(codemirrorRef.value, {
    smartIndent: true, // 是否智能缩进
    styleActiveLine: true, // 当前行高亮
    lineNumbers: true, // 是否显示行数
    indentUnit: 2, // 缩进单位，默认2
    mode: props.mode,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
    theme: 'idea',
    lint: true,
    readOnly,
    foldGutter: true,
    matchBrackets: true, // 括号匹配显示
    autoCloseBrackets: true, // 输入和退格时成对
    autoRefresh: true,
  })
  setValue()
  jsonEditor.on('change', cm => {
    emit('changed', cm.getValue())
    emit('update:modelValue', cm.getValue())
  })
})
</script>
<style lang="scss" scoped>
.json-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;

  ::v-deep(.CodeMirror) {
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;

    .CodeMirror-scroll {
      flex: 1;
    }

    .CodeMirror-vscrollbar {
      &::-webkit-scrollbar {
        width: 8px;
        height: 8px;
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        border-radius: var(--td-radius-medium);
        border: 2px solid transparent;
        background-clip: content-box;
        background-color: var(--td-scrollbar-color);
      }
    }
  }
}
</style>
