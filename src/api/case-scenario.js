import { get, post, put, del } from '@/utils/request'

export const fetchGetCaseScenario = id => get(`/api/case_scenario/${id}`)
export const fetchAddCaseScenario = data => post('/api/case_scenario', data)
export const fetchUpdateCaseScenario = data => put('/api/case_scenario', data)
export const fetchDeleteCaseScenario = data => del('/api/case_scenario', data)
export const fetchCopyCaseScenario = data => post('/api/scenario_copy', data)
