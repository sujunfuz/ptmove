import Vue from 'vue'

import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		//公共的变量，这里的变量不能随便修改，只能通过触发mutations的方法才能改变
		username: 'vuex的username',
		loginAuth: false, // 用户权限
		userInfo: {} // 用户信息
	},
	mutations: {
		//相当于同步的操作
		setusername(state, val) {
			state.username = val
		},
		setuserInfo(state, val) {
			state.userInfo = val
		},
	},
	actions: {
		//相当于异步的操作,不能直接改变state的值，只能通过触发mutations的方法才能改变
		
	}
})
export default store
