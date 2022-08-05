import router from '@/router'
import { setStorage, getStorage } from '@/utils/store'

const tags = getStorage('tags') || []
const theme = getStorage('theme') || 'light'
export default {
  namespaced: true,
  state: {
    theme,
    currentTags: [...tags], //当前打开的tag
    askingPath: '', // 当前问询是否要关闭页面
    needClosePath: '' //需要关闭的页面
  },

  mutations: {
    delTag(state, path) {
      state.currentTags = state.currentTags.filter(({ fullPath }) => fullPath !== path)
      setStorage('tags', state.currentTags)
    },
    setCurrentTags(state, data) {
      state.currentTags = data
      setStorage('tags', data)
    },
    setAskingPath(state, data) {
      state.askingPath = data
    },
    setProject(state, id) {
      state.project_id = id
      setStorage('project_id', id)
    },
    setProjectName(state, project_name) {
      state.project_name = project_name
      setStorage('project_name', project_name)
    },
    clearNowTag(state, fullPath) {
      state.needClosePath = fullPath ?? router.currentRoute.value.fullPath
    },

    setTheme(state, theme) {
      state.theme = theme
      setStorage('theme', theme)
    }
  }
}
