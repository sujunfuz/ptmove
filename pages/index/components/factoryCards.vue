<template>
	<view class="good-cards-bg">
		<view class="good-item flex marB20" v-for="(item,index) in list" :key="index"
			@tap="goToPage('/pages/mine/storeDetails?merchantNo='+item.merchantNo)">
			<view class="left-image marR20">
				<image :src="ImgUrl + item.logo" mode="aspectFill">
				</image>
			</view>
			<view class="right-info">
				<view>
					<view style="width: 400rpx;" class="u-line-2 fontbold">{{item.storeName }}</view>
					<view class="color999 fontsize24 marT10 flex-c">
						<view class="" v-for="(it,index) in item.mainProList" :key="index">
							<text>{{it}}</text>
							<text class="marL10 marR10" v-if="index < item.mainProList.length-1">|</text>
						</view>
					</view>
					<!-- <view class="fontsize24 marT10">
						<view class="tag marR10" v-for="(item,index) in tagList" :key="index">
							進30天爆賣{{item.saleNum || 0}}件
						</view>
					</view> -->
				</view>
				<view class="colorE1251B flex-cb scroll-box">
					<view class="scroll-list">
						<view class="marR10 img-item" v-for="(img,index) in transToArray(item.productImages)"
							:key="index">
							<image :src="ImgUrl+img" mode="aspectFill" style="width:100%;height: 100%;">
							</image>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			list: {
				type: Array,
				default: () => []
			},
			descList: {
				type: Array,
				default: () => []
			},
			tagList: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {}
		},
		methods: {
			transToArray(str) {
				if (str) {
					return str.split(',')
				} else {
					return []
				}
			},
		}
	}
</script>

<style scoped lang="scss">
	.good-cards-bg {
		width: 100%;
		// background-color: #F6F6F6 ;
		.good-item {
			width: 100%;
			overflow: hidden;
			box-sizing: border-box;
			padding: 20rpx;
			border-radius: 20rpx;
			background-color: white;
		}

		.left-image {
			flex-shrink: 0;
			width: 270rpx;
			height: 270rpx;
			overflow: hidden;
			border-radius: 10rpx;

			&>image {
				width: 100%;
				height: 100%;
			}
		}

		.right-info {
			display: flex;
			flex: 1;
			flex-direction: column;
			justify-content: space-between;

			.tag {
				display: inline-block;
				background-color: rgba(223, 150, 39, 0.1);
				color: #DF9627;
				padding: 5rpx;
				border-radius: 4rpx;
			}

			.scroll-box {
				flex: 1;

				.scroll-list {
					display: flex;
					overflow: scroll;
					width: 900rpx;

					.img-item {
						border-radius: 4rpx;
						overflow: hidden;
						width: 135rpx;
						height: 135rpx;
						flex-shrink: 0;
					}
				}
			}


		}



		.colorE1251B {
			color: #E1251B;
		}

	}
</style>