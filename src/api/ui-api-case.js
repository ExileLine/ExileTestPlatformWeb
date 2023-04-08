import { get, post, put, del } from '@/utils/request'

export const fetchGetUiCase = id => get(`/api/ui_case/${id}`)
export const fetchAddUiCase = data => post('/api/ui_case', data)
export const fetchUpdateUiCase = data => put('/api/ui_case', data)
export const fetchDeleteUiCase = data => del('/api/ui_case', data)

export const fetchGetUiCaseList = data => post('/api/ui_case_page', data)

export const fetchBindUiCase = data => post('/api/ui_case_bind', data)
export const fetchSendUiCase = data => post('/api/ui_case_send', data)

export const fetchExecute = data => post('/api/ui_case_execute', data)

export const fetchGetUiControlList = () => post('/api/ui_control_dict_api')
export const fetchGetUiControlMap = () => get('/api/ui_control_map_api')

export const fetchUiExecute = data => post('/api/ui_case_execute', data)
