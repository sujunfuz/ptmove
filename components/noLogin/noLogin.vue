<template>
	<view class="hotlinebg" @touchmove.stop.prevent="()=>{return false}">
		<u-popup :show="show" :safeAreaInsetBottom='false' mode="center" round="20" @close='colse'>
			<view class="hotlineView"
				:style="'background-image: url('+ossIconUrl+'/wxshop/index/goodsDetail/couponbg3.png)'">
				<image class="imgkefu" :src="ossIconUrl+'/index/nologinbg.png'" mode="scaleToFill"></image>
				<image class="imgicon" :src="ossIconUrl+'/index/nologinicon.png'" mode="scaleToFill"></image>
				<view class="kefucontent">
					<view class="linetitle">{{$t("cpnoLogin.text1")}}</view>
					<view class="linetel">{{$t('cpnoLogin.text2')}}。</view>
					<view class="flex-cc" style="margin-top: 58rpx;">
						<view class="telbts bgMain colorfff marL20" style="padding: 2rpx;" @tap="isgoLogin()">
							{{$t("cpnoLogin.bts")}}
						</view>
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
		},
		data() {
			return {
			}
		},
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
	.hotlinebg {
		.hotlineView {
			width: 550rpx;
			height: 500rpx;
			border-radius: 20rpx;
			position: relative;

			.imgkefu {
				position: absolute;
				left: 0;
				top: 0;
				width: 550rpx;
				height: 500rpx;
				z-index: 1;
			}


			.imgicon {
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				top: -280rpx;
				width: 673rpx;
				height: 497rpx;
				z-index: 20;
			}

			.kefucontent {
				position: absolute;
				width: 100%;
				height: 422rpx;
				left: 0;
				bottom: 0;
				border-radius: 20rpx;
				z-index: 10;

				.linetitle {
					margin-top: 120rpx;
					font-size: 30rpx;
					text-align: center;
				}

				.linetel {
					font-size: 30rpx;
					text-align: center;
					margin-top: 30rpx;
				}

				.telbts {
					text-align: center;
					width: 256rpx;
					height: 76rpx;
					line-height: 76rpx;
					border-radius: 50rpx;
				}
			}
		}

	}
</style>
