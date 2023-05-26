import MySqlIcon from '@/assets/mysql-icon.png'
import RedisIcon from '@/assets/redis-icon.png'
import PostgresqlIcon from '@/assets/postgresql-icon.png'
import MongodbIcon from '@/assets/mongodb-icon.png'
import SqlServerIcon from '@/assets/sql-server-icon.png'
import OracleIcon from '@/assets/oracle-icon.png'
import EsIcon from '@/assets/es-icon.png'

// 用例
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
    theme: 'default',
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

// 变量参数
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
    label: 'float',
    value: 'float',
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
    label: '当前日期(年月日)',
    value: 'date',
  },
  {
    label: '当前时间(时分秒)',
    value: 'time',
  },
  {
    label: '当前日期(年月日时分秒)',
    value: 'datetime',
  },
  {
    label: '当前时间戳',
    value: 'timestamp',
  },
  {
    label: '短UUID(16位)',
    value: 'uuid_short',
  },
  {
    label: '长UUID(32位)',
    value: 'uuid_long',
  },
]

// 日志相关
export const executeTypeList = [
  {
    group: '单个',
    children: [
      { value: 'case', label: 'API用例' },
      { value: 'scenario', label: 'API场景' },
      { value: 'ui_case', label: 'UI用例' },
    ],
  },
  // {
  //   group: '项目',
  //   children: [
  //     { value: 'project_all', label: '项目API用例场景' },
  //     { value: 'project_case', label: '项目API用例' },
  //     { value: 'project_scenario', label: '项目API场景' },
  //     { value: 'ui_project_all', label: '项目UI用例' },
  //   ],
  // },
  {
    group: '迭代',
    children: [
      { value: 'version_all', label: '迭代API用例场景' },
      { value: 'version_case', label: '迭代API用例' },
      { value: 'version_scenario', label: '迭代API场景' },
      { value: 'ui_version_all', label: '迭代UI用例' },
    ],
  },
  {
    group: '任务',
    children: [
      { value: 'task_all', label: '任务API用例+场景' },
      { value: 'task_case', label: '任务API用例' },
      { value: 'task_scenario', label: '任务API场景' },
      { value: 'ui_task_all', label: '任务UI用例' },
    ],
  },
  {
    group: '模块',
    children: [
      { value: 'module_all', label: '模块API用例+场景' },
      { value: 'module_case', label: '模块API用例' },
      { value: 'module_scenario', label: '模块API场景' },
      { value: 'ui_module_all', label: '模块UI用例' },
    ],
  },
]

export const triggerTypeList = [
  { value: 'user_execute', label: '用户触发' },
  { value: 'timed_execute', label: '定时任务' },
]

export const executeStatusList = [
  {
    label: '成功',
    value: 1,
    theme: 'success',
  },
  {
    label: '失败',
    value: 0,
    theme: 'danger',
  },
]

export const dbTypeList = [
  {
    value: 'mysql',
    label: 'MySQL',
    url: MySqlIcon,
  },
  {
    value: 'redis',
    label: 'Redis',
    url: RedisIcon,
  },
  {
    value: 'postgresql',
    label: 'PostgreSql',
    url: PostgresqlIcon,
  },
  {
    value: 'mongodb',
    label: 'mongoDB',
    url: MongodbIcon,
  },
  {
    value: 'sqlserver',
    label: 'SqlServer',
    url: SqlServerIcon,
  },
  {
    value: 'oracle',
    label: 'Oracle',
    url: OracleIcon,
  },
  {
    value: 'es',
    label: 'Elasticsearch',
    url: EsIcon,
  },
]

export const versionTaskTypeList = [
  {
    value: 'api_case',
    label: 'API自动化测试',
  },
  {
    value: 'ui_case',
    label: 'UI自动化测试',
  },
  {
    value: 'performance_case',
    label: '性能测试',
  },
  {
    value: 'safe_case',
    label: '安全测试',
  },
]

export const expTip = '对象获取：obj.get("key") 数组列表获取：obj.get("key")[0]'
