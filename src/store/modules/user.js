import router from '@/router'
import { setToken, getToken, setStorage, getStorage, clearStorage } from '@/utils/store'
import { fetchLogin, fetchLogout } from '@/api/user'

export default {
  namespaced: true,
  state: {
    info: getStorage('info'),
    token: getToken(),
  },
  actions: {
    async login({ commit }, data) {
      const info = await fetchLogin(data)
      commit('SET_TOKEN', info.token)
      commit('SET_INFO', info)
    },
    async logout() {
      await fetchLogout()
      clearStorage()
      router.push({
        path: '/login',
      })
    },
  },
  mutations: {
    SET_INFO(state, info) {
      state.info = info
      setStorage('info', info)
    },
    SET_TOKEN(state, token) {
      state.token = token
      setToken(token)
    },
  },
}
