import { get, post, put, del } from '@/utils/request'

export const fetchAddProject = data => post('/api/project', data)
export const fetchUpdateProject = data => put('/api/project', data)
export const fetchAddVersion = data => post('/api/project_version', data)
export const fetchUpdateVersion = data => put('/api/project_version', data)
