import router from '@/router'
import { setToken, getToken, setStorage, clearStorage } from '@/utils/store'
import { fetchGetUser, fetchLogin, fetchLogout } from '@/api/user'

export default {
  namespaced: true,
  state: {
    info: null,
    token: getToken(),
  },
  actions: {
    async getInfo({ commit }) {
      const info = await fetchGetUser()
      commit('SET_INFO', info)
    },
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
    },
    SET_TOKEN(state, token) {
      state.token = token
      setToken(token)
    },
  },
}
