<template>
	<view @touchmove.stop.prevent="()=>{return false}">
		<u-popup :show="show" mode="bottom" :safeAreaInsetTop='false' :safeAreaInsetBottom='false' :round='20' closeable
			@close="colse">
			<view class="popupview">
				<view class="more_ul">
					<view class="flex-cb marB30" v-for="(it,i) in dataList" :key='i'>
						<view class="fontsize24 color6e">{{it.attrName}}</view>
						<view class="fontsize24">{{it.attrValue}}</view>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		props: {
			show: {
				type: Boolean,
				default: () => false
			},
			dataList: {
				type: Array,
				default: () => []
			},
		},
		data() {
			return {

			}
		},
		methods: {
			colse() {
				this.$emit('close');
			},
		}
	}
</script>

<style lang="scss" scoped>
	.popupview {
		// height: 608rpx;
		padding: 104rpx 30rpx;

		.more_ul {
			background: #F6F6F6;
			border-radius: 20rpx;
			padding: 30rpx 20rpx;
		}

	}
</style>
