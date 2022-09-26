import axios from 'axios'
import { assign } from 'lodash'
import store from '@/store'
import router from '@/router'
import { LoadingPlugin, MessagePlugin } from 'tdesign-vue-next'
import { getToken, removeToken } from './store'
import { errorStatus } from './variables'

// 全局loading，这里以element-ui为例

let loadingNum = 0 // 在加载中的页面
let globalLoading = null
const setLoading = () => {
  loadingNum += 1
  if (loadingNum === 1) {
    globalLoading = LoadingPlugin({
      fullscreen: true,
      attach: 'body',
      preventScrollThrough: false,
    })
  }
}
const deleteLoading = () => {
  loadingNum -= 1
  if (loadingNum === 0) {
    // 关闭loading
    globalLoading?.hide && globalLoading?.hide()
    // 手动释放
    globalLoading = null
  }
}

const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:7878/',
  // withCredentials: true,
  timeout: 1000 * 60,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Toast提示，根据不同的ui库来
const errorHandler = error => {
  deleteLoading()
  const status = error?.response?.status + ''

  error.message = errorStatus[status] || '未知错误'
  if (!window.navigator.onLine) {
    error.message = '网络异常，请检查'
  }
  MessagePlugin.error(error.message)
  return Promise.reject(error)
}

service.interceptors.request.use(
  config => {
    const { loading, params, data } = config
    const project_id = store.getters.project_id
    if (typeof loading === 'undefined' || loading === true) {
      setLoading()
    }
    if (store.getters.token) {
      config.headers.token = getToken()
    }
    params && assign(params, { project_id })
    data && assign(data, { project_id })
    // config.cancelToken = store.getters.source.token
    return config
  },
  error => errorHandler(error)
)

service.interceptors.response.use(
  response => {
    const { data, config } = response
    const { loading, responseType, message } = config
    if (typeof loading === 'undefined' || loading === true) {
      deleteLoading()
    }
    if (responseType === 'blob') return data

    if (data.code >= 200 && data.code < 300) {
      return data.data
    }
    if (data.code == 401) {
      removeToken()
      router.replace('/login')
      MessagePlugin.closeAll()
    }
    if (typeof message === 'undefined' || message === true) {
      MessagePlugin.error(data.message)
    }

    return Promise.reject(new Error(data.message || 'Error'))
  },
  error => {
    if (error instanceof axios.Cancel) return
    return errorHandler(error)
  }
)

export function post(url, ...config) {
  return service.post(url, ...config)
}
export function put(url, ...config) {
  return service.put(url, ...config)
}
export function del(url, data, config) {
  return service.delete(url, {
    data,
    ...config,
  })
}
export function get(url, params, config) {
  return service.get(url, {
    params,
    ...config,
  })
}

export default service
