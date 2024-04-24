<template>
	<view class="hotlinebg" @touchmove.stop.prevent="()=>{return false}">
		<u-popup :show="show" :safeAreaInsetBottom='false' mode="center" round="20" @close='colse'>
			<view class="hotlineView">
				<image class="imgkefu" :src="ossIconUrl+'/mine/kefubg.png'" mode="scaleToFill"></image>
				<image class="imgicon" :src="ossIconUrl+'/mine/kefuicon.png'" mode="scaleToFill"></image>
				<view class="kefucontent">
					<view class="linetitle">{{$t("mine.text10")}}</view>
					<view class="linetel">{{hotline.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')}}</view>
					<view class="flex-cc" style="margin-top: 58rpx;">
						<view class="telbts borderC5 color80" @click="colse">{{$t("common.cancel")}}</view>
						<view class="telbts bgMain colorfff marL20" style="padding: 2rpx;" @tap="callPhone(hotline)">
							{{$t("mine.call")}}
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
			hotline: {
				type: String,
				default: "400-1234-1244"
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
	.hotlinebg {
		.hotlineView {
			width: 600rpx;
			height: 548rpx;
			background: #fff;
			border-radius: 20rpx;
			position: relative;

			.imgkefu {
				width: 100%;
				height: 200rpx;
			}

			.imgicon {
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				top: 13rpx;
				width: 250rpx;
				height: 230rpx;
				z-index: 20;
			}

			.kefucontent {
				position: absolute;
				width: 100%;
				height: 422rpx;
				left: 0;
				bottom: 0;
				background: #fff;
				border-radius: 20rpx;
				z-index: 10;

				.linetitle {
					margin-top: 120rpx;
					font-size: 30rpx;
					font-weight: bold;
					text-align: center;
				}

				.linetel {
					font-size: 42rpx;
					font-weight: bold;
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