import { get, post, put, del } from '@/utils/request'

export const fetchGetDashboard = () => post('/api/dashboard', {})
