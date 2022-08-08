import { createApp } from 'vue'
import TDesign, { MessagePlugin, DialogPlugin } from 'tdesign-vue-next'
// 引入组件库全局样式资源
import 'tdesign-vue-next/es/style/index.css'
import App from './App.vue'
import router from './router'
import store from './store'
import './permission'
import '@style/global.scss'
import CommonForm from '@comp/CommonForm/index.vue'
import PageContainer from '@comp/PageContainer/index.vue'

const app = createApp(App)

app.config.globalProperties.message = MessagePlugin
app.message = MessagePlugin

app.config.globalProperties.dialog = DialogPlugin
app.dialog = DialogPlugin

app
  .use(store)
  .use(router)
  .use(TDesign)
  .provide('message', app.config.globalProperties.message)
  .provide('dialog', app.config.globalProperties.dialog)
  .component('CommonForm', CommonForm)
  .component('PageContainer', PageContainer)
  .mount('#app')
