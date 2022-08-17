export const requestMethodList = [
  {
    label: 'GET',
    value: 'GET',
    theme: 'success',
  },
  {
    label: 'POST',
    value: 'POST',
    theme: 'warning',
  },
  {
    label: 'PUT',
    value: 'PUT',
    theme: 'primary',
  },
  {
    label: 'DELETE',
    value: 'DELETE',
    theme: 'danger',
  },
  {
    label: 'PATCH',
    value: 'PATCH',
    theme: 'default',
  },
  {
    label: 'OPTION',
    value: 'OPTION',
    theme: 'default',
  },
]

export const caseStatusList = [
  {
    label: '已完成',
    value: 'active',
    theme: 'success',
  },
  {
    label: '开发中',
    value: 'dev',
    theme: 'info',
  },
  {
    label: '调试中',
    value: 'debug',
    theme: 'warning',
  },
  {
    label: '弃用',
    value: 'over',
    theme: 'danger',
  },
]

// <!-- response_body, response_headers   -->
export const varSourceList = [
  {
    label: '响应体',
    value: 'response_body',
  },
  {
    label: '响应头',
    value: 'response_headers',
  },
]

export const bodyTypeList = [
  { value: 'none', label: 'none' },
  { value: 'form-data', label: 'form-data', mode: 'application/json' },
  { value: 'x-form-data', label: 'x-form-data', mode: 'application/json' },
  { value: 'json', label: 'json', mode: 'application/json' },
  { value: 'text', label: 'text', mode: 'text/plain' },
  { value: 'html', label: 'html', mode: 'text/html' },
  { value: 'xml', label: 'xml', mode: 'application/xml' },
]

export const ruleList = [
  {
    label: '==',
    value: '==',
  },
  {
    label: '<',
    value: '<',
  },
  {
    label: '>',
    value: '>',
  },
  {
    label: '<=',
    value: '<=',
  },
  {
    label: '>=',
    value: '>=',
  },
  {
    label: '!=',
    value: '!=',
  },
  {
    label: 'in',
    value: 'in',
  },
  {
    label: 'not in',
    value: 'not in',
  },
]
