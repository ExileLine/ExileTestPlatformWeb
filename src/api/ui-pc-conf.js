import { get, post, put, del } from '@/utils/request'

export const fetchAddUiPcConf = data => post('/api/ui_pc_conf', data)
export const fetchUpdateUiPcConf = data => put('/api/ui_pc_conf', data)
export const fetchDeleteUiPcConf = data => del('/api/ui_pc_conf', data)
