import { get, post, put, del } from '@/utils/request'

export const fetchGetCase = id => get(`/api/case/${id}`)
export const fetchAddCase = data => post('/api/case', data)
export const fetchUpdateCase = data => put('/api/case', data)
export const fetchDeleteCase = data => del('/api/case', data)

export const fetchGetCaseList = data => post('/api/case_page', data)

export const fetchBindCase = data => post('/api/case_bind', data)
export const fetchSendCase = data => post('/api/case_send', data)

export const fetchExecute = data => post('/api/case_execute', data)
export const fetchCopyCase = data => post('/api/case_copy', data)
