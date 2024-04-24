<template>
	<view @touchmove.stop.prevent="()=>{return false}">
		<u-popup :show="show" mode="bottom" :safeAreaInsetTop='false' :safeAreaInsetBottom='false' :round='20' closeable
			@close="colse">
			<view class="popoeview">
				<view class="cards">
					<view class="flex">
						<image class="imglogsispu flexnone" :src="ImgUrl+rs.spuInfoVOList[0].spuImage"
							mode="scaleToFill">
						</image>
						<view class="marL20 fontsize24" style="width: 100%;">
							<view class="flex-cb">
								<view class="flex-c">
									<view class="color999" style="max-width: 180rpx;">
										{{rs.logisticsInfoVO.logisticsCodeStr}}：</view>
									<view style="width: 238rpx;">{{rs.logisticsInfoVO.logisticsNo}}</view>
								</view>
								<view class="copybts flexnone">{{$t('common.copy')}}</view>
							</view>
							<view class="flex marT20">
								<view class="color999 flexnone">{{$t('createOrder.bianhao')}}：</view>
								<view style="width: 350rpx;">{{rs.storeBatchOrderNo}}</view>
							</view>
						</view>
					</view>
					<view class="flex marT20">
						<u-icon name="map" color="#333" size="23"></u-icon>
						<view class="marL10">{{rs.ALLaddress}}</view>
					</view>
				</view>
				<!--  @tap="copyText('2222')" -->
				<scroll-view scroll-y="true" style="height: 60vh;">
					<view class="popup_ul">
						<view class="shuline"></view>
						<view class="popup_li" v-for="(it,i) in logisticsList" :key='i'>
							<view class="popup_text">
								<view class="flex-c titleview" :class="i==0?'active':''">
									<view class="color80 fontbold" :class="i==0?'active':''">{{it.status}}</view>
									<view class="color80 marL10 fontsize26" :class="i==0?'active':''">
										{{timeShift(it.ftime)}}
									</view>
								</view>
								<view class="marT10">
									<text v-for="(e,i1) in it.descList" :key='i1'
										:class="e.type=='phone'?'colorMain':''"
										@tap="callPhone(e.type=='phone'?e.val:'')">{{e.val}}</text>
								</view>
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
			logisticsList: {
				type: Array,
				default: () => []
			},
			rs: {
				type: Object,
				default: () => {}
			},
		},
		data() {
			return {

			}
		},
		created() {},
		onLoad() {

		},
		methods: {
			colse() {
				this.$emit('close');
			},
		}
	}
</script>

<style lang="scss" scoped>
	.popoeview {
		padding: 50rpx 30rpx;
		height: 80vh;

		.cards {
			background: #fff;
			border-radius: 20rpx;
			padding: 20rpx;

			.imglogsispu {
				width: 150rpx;
				height: 150rpx;
				border-radius: 20rpx;
			}

			.copybts {
				border: 1rpx solid #CCCCCC;
				border-radius: 50rpx;
				padding: 2rpx 6rpx;
				font-size: 24rpx;
				margin-left: 10rpx;
			}
		}

		.popup_ul {
			position: relative;

			.shuline {
				position: absolute;
				width: 4rpx;
				height: calc(100% - 20rpx);
				left: 12rpx;
				background: #B3B3B3;
				top: 15rpx;
			}

			.popup_li {
				margin-top: 30rpx;
				width: 640rpx;

				.popup_text {
					padding-left: 42rpx;

					.titleview {
						position: relative;

						::after {
							content: '';
							position: absolute;
							left: -40rpx;
							top: 10rpx;
							width: 20rpx;
							height: 20rpx;
							border-radius: 50%;
							background: #B3B3B3;
							z-index: 1;
						}
					}

					.active {
						color: #EB1818;

						::after {
							background: #EB1818;
						}
					}
				}

			}
		}

	}
</style>
