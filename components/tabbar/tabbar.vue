<template>
	<view>
		<u-tabbar :value="tabbarIndex" :placeholder="false" activeColor="#E1251B" inactiveColor='#9C9E9C'
			:border='false'>
			<u-tabbar-item :text="it.text" v-for="(it,i) in list" :key="i" @click='tabclick(it,i)'></u-tabbar-item>
		</u-tabbar>

	</view>
</template>

<script>
	export default {
		name: "tabbar",
		data() {
			return {
				list: [{
						iconPath: "../../static/tab/index.png",
						selectedIconPath: "../../static/tab/index1.png",
						text: 'index.title',
						pagePath: '/pages/tabbar/index'
					},
					{
						iconPath: "../../static/tab/class.png",
						selectedIconPath: "../../static/tab/class1.png",
						text: 'class.title',
						pagePath: '/pages/tabbar/class'
					},
					{
						iconPath: "../../static/tab/shopcart.png",
						selectedIconPath: "../../static/tab/shopcart1.png",
						text: 'shopcart.title',
						pagePath: '/pages/tabbar/shopcart'
					},
					{
						iconPath: "../../static/tab/mine.png",
						selectedIconPath: "../../static/tab/mine1.png",
						text: 'mine.title',
						pagePath: '/pages/tabbar/mine'
					},
				],
			};
		},

		methods: {
			tabclick(it, i) {
				console.log(it)
				console.log(i)
				uni.reLaunch({
					url: this.list[i].pagePath
				});
			}
		},
	};
</script>

<style scoped lang="scss">
	.item-icon1 {
		width: 44rpx;
		height: 44rpx;
	}

	.item-icon2 {
		width: 75px;
		height: 75px;
		position: relative;
		top: -13px;
		// border: 20rpx solid #fff;
		// border-radius: 100%;
	}
</style>
