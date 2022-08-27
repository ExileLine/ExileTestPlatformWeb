import { computed } from 'vue'
import { useStore } from 'vuex'

export const renderAction = (actionOptionList, row) => {
  const store = useStore()
  const isMobile = computed(() => store.getters.isMobile)
  if (isMobile.value && actionOptionList.length > 1) {
    return (
      <t-dropdown options={actionOptionList}>
        <t-button variant="outline">更多...</t-button>
      </t-dropdown>
    )
  }
  return (
    <div>
      {actionOptionList.map(i => (
        <t-tooltip content={i.content} attach="#main-container">
          <t-button theme={i.theme} variant="text" onClick={() => i.onClick(row)}>
            <t-icon name={i.value} />
          </t-button>
        </t-tooltip>
      ))}
    </div>
  )
}
