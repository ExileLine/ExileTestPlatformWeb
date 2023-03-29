import { get, post, put, del } from '@/utils/request'

export const fetchAddDingDing = data => post('/api/dd_push_conf', data)
export const fetchUpdateDingDing = data => put('/api/dd_push_conf', data)
export const fetchDeleteDingDing = data => del('/api/dd_push_conf', data)
