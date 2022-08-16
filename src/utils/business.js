import { map } from 'lodash'
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
