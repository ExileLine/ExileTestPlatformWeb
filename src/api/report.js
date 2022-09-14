import { get } from '@/utils/request'

export const fetchGetReport = redis_key =>
  get(`/api/case_report/${redis_key}`, null, {
    responseType: 'blob',
  })
