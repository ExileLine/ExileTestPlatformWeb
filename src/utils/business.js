import { find, map, has } from 'lodash'
import { DialogPlugin } from 'tdesign-vue-next'
export function toSelectList(list, key) {
  return map(list, item => ({
    ...item,
    value: item.id,
    label: item[key],
  }))
}

export function sendSelectListTo(list, key) {
  return map(list, ({ value, label, ...rest }) => ({
    ...rest,
    value,
    label,
    id: value,
    [key]: label,
  }))
}

export function addVersionList(object) {
  object.version_list = sendSelectListTo(object.version_list, 'version_name')
  return object
}

export function addModuleList(object) {
  object.module_list = sendSelectListTo(object.module_list, 'module_name')
  return object
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

export const isEmptyValKey = list => {
  return find(list, ({ var_get_key }) => !var_get_key)
}

export const isOpenExpression = list => {
  return find(list, assert => {
    const is_expression = assert.is_expression
    let expression
    if (has(assert, 'expression')) {
      expression = assert.expression
    } else {
      expression = assert.python_val_exp
    }
    return is_expression && !expression
  })
}
