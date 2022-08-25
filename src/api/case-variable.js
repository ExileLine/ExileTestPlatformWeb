import { get, post, put, del } from '@/utils/request'

export const fetchAddVariable = data => post('/api/case_variable', data)
export const fetchUpdateVariable = data => put('/api/case_variable', data)
export const fetchDeleteVariable = data => del('/api/case_variable', data)
