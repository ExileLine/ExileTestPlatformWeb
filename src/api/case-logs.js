import { get, post, put, del } from '@/utils/request'

export const fetchGetCaseLog = data => post('/api/case_execute_logs', data)
