import { includes } from 'lodash'
import store from './store'
import router from './router'

const whiteList = ['/login', '/401', '/404']

router.beforeEach(async (to, from, next) => {
  if (includes(whiteList, to.path)) {
    return next()
  }
  const { token, info } = store.getters
  if (token) {
    if (!info) {
      await store.dispatch('user/getInfo')
    }
    next()
  } else {
    next({
      path: '/login',
    })
  }
})
