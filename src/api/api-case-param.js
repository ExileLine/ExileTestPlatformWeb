import { get, post, put, del } from '@/utils/request'

export const fetchGetReqData = id => get(`/api/case_req_data/${id}`)
export const fetchAddReqData = data => post('/api/case_req_data', data)
export const fetchUpdateReqData = data => put('/api/case_req_data', data)
export const fetchDeleteReqData = data => del('/api/case_req_data', data)
