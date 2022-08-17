import { get, post, put, del } from '@/utils/request'

export const fetchLogin = data => post('/api/login', data)
export const fetchLogout = () => del('/api/login')

export const fetchTourist = () => get('/api/tourist')
export const fetchResetPwd = data => post('/api/user_pwd', data)

export const fetchGetUser = () => get('/api/auth')
export const fetchAddUser = data => post('/api/user', data)
export const fetchUpdateUser = data => put('/api/user', data)
export const fetchDeleteUser = data => del('/api/user', data)
