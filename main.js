import Vue from 'vue'
import App from './App'

import VueI18n from 'vue-i18n'// v8.x
Vue.use(VueI18n)
import en from '@/locale/en.json'
import zh  from '@/locale/zh.json'
import cht  from '@/locale/cht.json'
const messages = {
	en,
	'zh': zh,
	'cht': cht
}

let i18nConfig = {
  locale: uni.getLocale(),// 获取已设置的语言
  messages
}
const i18n = new VueI18n(i18nConfig)
Vue.config.productionTip = false //productionTip设置为 false ，可以阻止 vue 在启动时生成生产提示

import store from '@/store/index.js'
Vue.prototype.$store = store

Vue.prototype.$onLaunched = new Promise(resolve => {
	Vue.prototype.$isResolve = resolve
})

//全局request
import request from '@/common/request'
Vue.prototype.$request = request

//通用全局混入
import baseMixin from '@/mixin/baseMixin.js'
Vue.mixin(baseMixin)

// 定义全局变量lang
// Vue.prototype.lang = uni.getStorageSync('lang')||'zh'


import uView from '@/uni_modules/uview-ui'
Vue.use(uView)

App.mpType = 'app'

const app = new Vue({
	store,
	i18n,
	...App
})
app.$mount()
