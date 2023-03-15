import { get, post, put, del } from '@/utils/request'

export const fetchGetVersionTask = id => get(`/api/version_task/${id}`)
export const fetchAddVersionTask = data => post('/api/version_task', data)
export const fetchUpdateVersionTask = data => put('/api/version_task', data)
export const fetchDeleteVersionTask = data => del('/api/version_task', data)
