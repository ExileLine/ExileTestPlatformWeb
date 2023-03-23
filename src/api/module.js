import { get, post, put, del } from '@/utils/request'

export const fetchGetModule = id => get(`/api/module_app/${id}`)
export const fetchAddModule = data => post('/api/module_app', data)
export const fetchUpdateModule = data => put('/api/module_app', data)
export const fetchDeleteModule = data => del('/api/module_app', data)
