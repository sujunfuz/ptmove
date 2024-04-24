<template>
	<view class="flex card-wrapper">
		<image class="card-img" :src="ImgUrl+substringIndexOf(allData.descriptionImgAddr)" mode="scaleToFill"></image>
		<view class="bottom-wrapper">
			<view class="u-line-1 fontbold">{{allData.name}}</view>
			<view class="colorMain marT10 flex-e fontbold">
				<view class="fontsize30">{{globalUnit}}</view>
				<view class="fontsize32 marL6">{{allData.minimumPrice}}</view>
			</view>
			<view class="flex-eb marT10">
				<view class="fontsize22 color999">{{$t('shopDetails.info1')}}{{allData.perMinNum}}{{$t('common.jian')}}
				</view>
				<image v-if="isAdd" class="jia" :src="ossIconUrl+'/index/jia1.png'" mode="scaleToFill"
					@click.stop="addshopCart()"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import commonApi from '@/api/common.js'
	export default {
		props: {
			allData: {
				type: Object,
				default: () => {}
			},
			isAdd: {
				type: Boolean,
				default: () => true
			},
		},
		data() {
			return {
				addshopCart() {
					this.goToPage('/pages/index/shopDetails?isbuy=true&id=' + this.allData.id)
				},
			};
		}
	}
</script>

<style lang="scss" scoped>
	.card-wrapper {
		// overflow: hidden;
		width: 342rpx;
		flex-direction: column;
		background-color: white;
		box-shadow: 0rpx 3rpx 20rpx 1rpx rgba(0, 0, 0, 0.04);
		border-radius: 10rpx 10rpx 10rpx 10rpx;
		margin-bottom: 24rpx;

		.card-img {
			width: 342rpx;
			height: 342rpx;
			// background-color: rgb(255, 88, 90);
			border-radius: 10rpx;
		}

		.bottom-wrapper {
			// box-sizing: border-box;
			padding: 20rpx;

			.jia {
				width: 40rpx;
				height: 40rpx;
			}
		}

	}
</style>
