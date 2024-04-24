<template>
	<view class="tabbarmine">
		<view>vuex的使用</view>
		<view>{{username}}</view>
		<u-button type="primary" text="改变" @click="changevuex()"></u-button>
	</view>
</template>

 <script>
	// import store from '@/store/index.js'; //第一种直接引入 需要引入store
	import {
		mapState,
		mapGetters,
		mapActions,
		mapMutations
	} from 'vuex'  //第二种直接引入 需要引入store
	export default {
		data() {
			return {

			}
		},
		computed: {
			...mapState([
				'loginAuth', 'loginInfo', 'username'
			])
		},
		onLoad() {
			console.log(this.$store.state)// mine.js 挂在了Vue.prototype.$store = store 可以直接打印
		},
		methods: {
			changevuex() {
				this.$store.commit('setusername', '最新的vuex的username') //更新vuex内的数据
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tabbarmine {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));
		background: #fff;
	}
</style>
