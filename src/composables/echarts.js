import { ref, watch, nextTick, onUnmounted, computed } from 'vue'
import { useStore } from 'vuex'
import * as echarts from 'echarts/core'
import {
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  PictorialBarChart,
  RadarChart,
  GaugeChart,
} from 'echarts/charts'
import {
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  ToolboxComponent,
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { useElementSize } from '@vueuse/core'

echarts.use([
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  ToolboxComponent,
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  PictorialBarChart,
  RadarChart,
  GaugeChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
])

/**
 * Echarts hooks函数
 * @param options - 图表配置
 * @param renderFun - 图表渲染函数(例如：图表监听函数)
 * @description 按需引入图表组件，没注册的组件需要先引入
 */
export function useEcharts(options, renderFun) {
  const store = useStore()
  const theme = computed(() => store.getters.theme)
  const domRef = ref(null)

  const initialSize = { width: 0, height: 0 }
  const { width, height } = useElementSize(domRef, initialSize)

  let chart = null

  function canRender() {
    return initialSize.width > 0 && initialSize.height > 0
  }

  function isRendered() {
    return Boolean(domRef.value && chart)
  }

  function update(updateOptions) {
    if (isRendered()) {
      chart?.setOption({ ...updateOptions, backgroundColor: 'transparent' })
    }
  }

  async function render() {
    if (domRef.value) {
      const chartTheme = theme.value
      await nextTick()
      chart = echarts.init(domRef.value, chartTheme)
      if (renderFun) {
        renderFun(chart)
      }
      update(options.value)
    }
  }

  function resize() {
    chart?.resize()
  }

  function destroy() {
    chart?.dispose()
  }

  function updateTheme() {
    destroy()
    render()
  }

  const stopSizeWatch = watch([width, height], ([newWidth, newHeight]) => {
    initialSize.width = newWidth
    initialSize.height = newHeight
    if (canRender()) {
      if (!isRendered()) {
        render()
      } else {
        resize()
      }
    }
  })

  const stopOptionWatch = watch(options, newValue => {
    update(newValue)
  })

  const stopDarkModeWatch = watch(
    () => theme.value,
    () => {
      updateTheme()
    }
  )

  onUnmounted(() => {
    destroy()
    stopSizeWatch()
    stopOptionWatch()
    stopDarkModeWatch()
  })

  return {
    domRef,
  }
}
