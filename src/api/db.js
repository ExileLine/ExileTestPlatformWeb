import { get, post, put, del } from '@/utils/request'

export const fetchAddDB = data => post('/api/case_db', data)
export const fetchUpdateDB = data => put('/api/case_db', data)
export const fetchDeleteDB = data => del('/api/case_db', data)

export const fetchDbPing = id => get(`/api/case_db_ping/${id}`)
