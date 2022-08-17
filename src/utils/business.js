import { map } from 'lodash'
import { DialogPlugin } from 'tdesign-vue-next'
export function toSelectList(list, key) {
  return map(list, item => ({
    ...item,
    value: item.id,
    label: item[key],
  }))
}

export function sendSelectListTo(list, key) {
  return map(list, ({ value, label }) => ({
    id: value,
    [key]: label,
  }))
}

export function confirmDialog(body) {
  return new Promise(resolve => {
    const confirmDialog = DialogPlugin.confirm({
      header: '提示',
      body,
      onConfirm() {
        resolve(confirmDialog)
      },
    })
  })
}
