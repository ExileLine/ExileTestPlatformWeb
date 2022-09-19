import { get, post, put, del } from '@/utils/request'

export const fetchAddEnv = data => post('/api/case_env', data)
export const fetchUpdateEnv = data => put('/api/case_env', data)
export const fetchDeleteEnv = data => del('/api/case_env', data)
