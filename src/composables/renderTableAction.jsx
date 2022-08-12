import { computed } from 'vue'
import { useStore } from 'vuex'

export const renderAction = actionOptionList => {
  const store = useStore()
  const isMobile = computed(() => store.getters.isMobile)
  if (isMobile.value) {
    return (
      <t-dropdown options={actionOptionList}>
        <t-button variant="outline">更多...</t-button>
      </t-dropdown>
    )
  }
  return (
    <div>
      {actionOptionList.map(i => (
        <t-tooltip content={i.content}>
          <t-button theme={i.theme} variant="text" onClick={() => i.onClick()}>
            <t-icon name={i.value} />
          </t-button>
        </t-tooltip>
      ))}
    </div>
  )
}
