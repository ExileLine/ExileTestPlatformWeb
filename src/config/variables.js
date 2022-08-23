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

export const valTypeList = [
  {
    label: 'int',
    value: 'int',
  },
  {
    label: 'str',
    value: 'str',
  },
  {
    label: 'bool',
    value: 'bool',
  },
  {
    label: 'json',
    value: 'json',
  },
  {
    label: 'json_str',
    value: 'json_str',
  },
]

export const variableTypeList = [
  ...valTypeList,
  {
    label: '随机整数',
    value: 'random_int',
  },
  {
    label: '随机字符串',
    value: 'random_str',
  },
  {
    label: '随机字符串数字',
    value: 'random_str_number',
  },
  {
    label: '随机布尔值',
    value: 'random_bool',
  },
  {
    label: '日期(年月日)',
    value: 'date',
  },
  {
    label: '时间(时分秒)',
    value: 'time',
  },
  {
    label: '日期(年月日时分秒)',
    value: 'datetime',
  },
  {
    label: '时间戳',
    value: 'timestamp',
  },
  {
    label: '短UUID',
    value: 'uuid_short',
  },
  {
    label: '长UUID',
    value: 'uuid_long',
  },
]

export const expTip = '对象获取：obj.get("key") 数组列表获取：obj.get("key")[0]'
