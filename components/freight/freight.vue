<template>
	<view @touchmove.stop.prevent="()=>{return false}">
		<u-popup :show="show" mode="bottom" :safeAreaInsetTop='false' :safeAreaInsetBottom='false' :round='20' closeable @close="colse">
			<view class="popupview">
				<view class="fontsize30 fontbold">{{$t('createOrder.yunfeitips')}}</view>
				<view class="marT60 color6e">{{$t('createOrder.yftext1')}}</view>
				<view class="marT30 color6e">{{$t('createOrder.yftext2')}}</view>
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
		height: 368rpx;
		padding: 30rpx 30rpx 58rpx 30rpx;

		
	}
</style>
