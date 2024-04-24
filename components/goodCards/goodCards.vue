<template>
	<view class="good-cards-bg">
		<view class="good-item flex marB30" v-for="(item,index) in list" :key="index"
			@tap.stop="goToPage('/pages/index/shopDetails?id=' + item.id)">
			<view class="left-image marR20">
				<image :src="ImgUrl+substringIndexOf(item.descriptionImgAddr)" mode="aspectFill">
				</image>
			</view>
			<view class="right-info">
				<view class="">
					<view class="title u-line-2 fontbold fontsize28">
						{{item.name}}
					</view>
					<!-- <view class="tag fontsize24 marT10">
						進30天爆賣{{item.saleNum || 0}}件
					</view> -->
				</view>
				<view class="colorE1251B flex-cb ">
					<view class="fontsize32 fontbold">{{globalUnit}}{{item.minimumPrice ||0}}</view>
					<view @click.stop="addshopCart(item)">
						<u-icon name="plus-circle-fill" color="#E1251B" size="25"></u-icon>
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
			}
		},
		data() {
			return {
				addshopCart(item) {
					this.goToPage('/pages/index/shopDetails?isbuy=true&id=' + item.id)
				},
			}
		}
	}
</script>

<style scoped lang="scss">
	.good-cards-bg {
		.good-item {
			flex: 1;
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
				background-color: rgba(225, 37, 27, 0.10);
				color: #E1251B;
				padding: 5rpx;
				border-radius: 4rpx;
			}
		}

		.colorE1251B {
			color: #E1251B;
		}
	}
</style>
