import { get, post, put, del } from '@/utils/request'

export const getRespRule = id => get(`/api/resp_ass_rule/${id}`)
export const addRespRule = data => post('/api/resp_ass_rule', data)
export const updateRespRule = data => put('/api/resp_ass_rule', data)
export const deleteRespRule = data => del('/api/resp_ass_rule', data)

export const addFieldRule = data => post('/api/field_ass_rule', data)
export const updateFieldRule = data => put('/api/resp_ass_rule', data)
export const deleteFieldRule = data => del('/api/resp_ass_rule', data)
