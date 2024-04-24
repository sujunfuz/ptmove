<template>
	<view @touchmove.stop.prevent="()=>{return false}">
		<u-popup :show="show" mode="bottom" :safeAreaInsetTop='false' :safeAreaInsetBottom='false' :round='20' closeable @close="colse">
			<view class="popupview">
				<view class="fontsize30 fontbold">{{$t('common.lookerror')}}</view>
				<scroll-view scroll-y="true" style="max-height: 80vh;">
				<view v-for="(it,i) in 30" :key='i' class="popup_li">
					<view class="fontbold color333">{{$t('common.order')}}{{i+1}}</view>
					<view class="color6e marT20">{{$t('createOrder.yftext1')}}</view>
				</view>
				</scroll-view>
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
		// height: 368rpx;
		padding: 30rpx 30rpx 58rpx 30rpx;
		.popup_li{
			margin-top: 30rpx;
			border-bottom: 1rpx solid #E3E4E5;
			padding-bottom: 20rpx;
		}
	}
</style>
