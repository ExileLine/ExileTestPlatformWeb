import { get, post, put, del } from '@/utils/request'

export const fetchAddMail = data => post('/api/mail_conf', data)
export const fetchUpdateMail = data => put('/api/mail_conf', data)
export const fetchDeleteMail = data => del('/api/mail_conf', data)
