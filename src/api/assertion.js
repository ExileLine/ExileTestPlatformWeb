import { get, post, put, del } from '@/utils/request'

export const fetchGetRespRule = id => get(`/api/resp_ass_rule/${id}`)
export const fetchAddRespRule = data => post('/api/resp_ass_rule', data)
export const fetchUpdateRespRule = data => put('/api/resp_ass_rule', data)
export const fetchDeleteRespRule = data => del('/api/resp_ass_rule', data)

export const fetchGetFieldRule = id => get(`/api/field_ass_rule/${id}`)
export const fetchAddFieldRule = data => post('/api/field_ass_rule', data)
export const fetchUpdateFieldRule = data => put('/api/field_ass_rule', data)
export const fetchDeleteFieldRule = data => del('/api/field_ass_rule', data)
