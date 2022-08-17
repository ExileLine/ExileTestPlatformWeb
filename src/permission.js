import { includes } from 'lodash'
import store from './store'
import router from './router'

const whiteList = ['/login', '/401', '/404']

router.beforeEach(async (to, from, next) => {
  if (includes(whiteList, to.path)) {
    return next()
  }
  if (store.getters.token) {
    next()
  } else {
    next({
      path: '/login',
    })
  }
})
