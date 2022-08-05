import { get, post, del } from '@/utils/request'

export const fetchLogin = data => post('/api/login', data)
export const fetchLogout = () => del('/api/login')

export const fetchTourist = () => get('/api/tourist')
export const fetchResetPwd = data => post('/api/user_pwd', data)
