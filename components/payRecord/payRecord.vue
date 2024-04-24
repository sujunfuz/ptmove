<template>
	<view @touchmove.stop.prevent="()=>{return false}">
		<u-popup :show="show" mode="bottom" :safeAreaInsetTop='false' :safeAreaInsetBottom='false' :round='20' closeable
			@close="colse">
			<view class="popupview">
				<view class="fontsize30 textC fontbold">{{$t('createOrder.payrecord')}}</view>
				<view v-if="remainPayTime != -1" class="title">{{$t('myOrder.qz')}}<text class="title-time flex-c" style="display: inline-block">
						<u-count-down :time="remainPayTime" :format="$t('common.countdown1')" autoStart>
						</u-count-down>
						</text>{{$t('myOrder.nzf')}}</view>
				<scroll-view class="marT30" style="height: 45vh;" :scroll-y="true">
					<view v-for="(it,index) in payList" :key="index" class="item">
						<view class="flex-c top">
							<image v-if="index==0" class="top-img" :src="ossIconUrl+'/index/xuanze2.png'"
								mode="scaleToFill">
								<image v-else class="top-img" :src="ossIconUrl+'/index/weixuanze2.png'"
									mode="scaleToFill">
									<view v-if="index == 0" class="top-txt">{{$t('cppayRecord.dbqwk')}}：${{it.unPaidAmount}}</view>
									<view v-if="index != 0" class="flex-cb wrapper">
										<view class="flex-c marL20">
											<text class="fontbold color333">{{$t('common.di')}}{{payList.length - index}}{{$t('common.ci')}}</text>
											<text
												class="marL20 color333">{{$t('cppayRecord.jd')}}{{(it.paidAmount / it.batchOrdAmount * 100 ).toFixed(2)}}%</text>
										</view>
										<text class="color9c fontsize24">{{it.editTimeStr}}</text>
									</view>
						</view>
						<view class="body">
							<view v-if="index != 0">
								<view class="fontbold color333">{{it.channelName || '-'}}</view>
								<view class="color9c marT10 fontsize24">{{$t('cppayRecord.jylsh')}}：{{it.trxNo}}</view>
								<view class="marT20"><text class="fontbold color333">{{$t('cppayRecord.yfk')}}：</text><text
										class="fontbold colorMain">{{globalUnit}}{{it.channelAmount}}</text>
								</view>
								<view class="marT20"><text class="fontbold color333">{{$t('cppayRecord.dbqwk')}}：</text><text
										class="fontbold colorMain">{{globalUnit}}{{it.unPaidAmount}}</text></view>
							</view>
						</view>
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
			remainPayTime: {
				type: Number,
				default: -1
			},
			payList: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {}
		},
		methods: {
			colse() {
				this.$emit('close');
			},
		}
	}
</script>

<style lang="scss" scoped>
	.btn {
		margin-top: 20rpx;
		width: 100%;
		height: 70rpx;
		background: #E02A23;
		border-radius: 80rpx 80rpx 80rpx 80rpx;
		text-align: center;
		line-height: 70rpx;
		color: white;
	}

	.popupview {
		max-height: 58vh;
		min-height: 30vh;
		padding: 30rpx 30rpx 58rpx 30rpx;
	}

	.title {
		font-size: 28rpx;
		font-weight: 500;
		color: #333333;

		.title-time {
			color: #E1251B;
			font-weight: bold;
		}
	}

	.item {
		width: 100%;

		.top {
			width: 100%;

			.wrapper {
				width: calc(100% - 50rpx);
			}

			.top-img {
				width: 30rpx;
				height: 30rpx;
			}

			.top-txt {
				margin-left: 20rpx;
				font-size: 28rpx;
				font-weight: bold;
				color: #E1251B;
			}
		}

		.body {
			margin-left: 15rpx;
			width: 100%;
			box-sizing: border-box;
			padding-top: 20rpx;
			padding-bottom: 20rpx;
			padding-left: 30rpx;
			border-left: 2rpx dotted #C5C5C5;
		}

	}

	.item:last-child {
		.body {
			border-left: none;
		}
	}
</style>