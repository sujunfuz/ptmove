<template>
	<view class="card_ul">
		<view class="card_li" v-for="(it,i) in dataList" :key='i'
			@tap="goToPage('/pages/mine/storeDetails?merchantNo='+it.storeNo)">
			<view class="flex-cb">
				<view class="u-line-1 fontbold fontsize32 color000">{{it.storeName}}</view>
				<view v-if="it.subscribe" class="marL20 guanzhubts flexnone bgF6 color9c u-line-1"
					@click.stop="userCollect(it.id)">{{$t('cpfactoryCards.followed')}}</view>
				<view v-else class="flex-cc flexnone guanzhubts marL20 bgMain" @click.stop="userCollect(it.id)">
					<image class="imgguanzhu" :src="ossIconUrl+'/index/guanzhu.png'" mode="scaleToFill"></image>
					<view class="colorfff u-line-1">{{$t('cpfactoryCards.interest')}}</view>
				</view>
			</view>
			<view class="flex-c marT32">
				<view style="width: 33%;">
					<view class="color9c fontsize24 u-line-1">{{$t('cpfactoryCards.text1')}}</view>
					<view class="marT6 u-line-1">{{it.employeeCountStr||'-'}}</view>
				</view>
				<view style="width: 33%;" class="flex-c">
					<view class="shu"></view>
					<view>
						<view class="color9c fontsize24 u-line-1">{{$t('cpfactoryCards.text2')}}</view>
						<view class="marT6 u-line-1">{{it.scaleStr||'-'}}</view>
					</view>
				</view>
				<view style="width: 33%;" class="flex-c">
					<view class="shu"></view>
					<view>
						<view class="color9c fontsize24 u-line-1">{{$t('cpfactoryCards.text3')}}</view>
						<view class="marT6 u-line-1">{{it.yearDealAmount||'-'}}</view>
					</view>
				</view>
			</view>
			<scroll-view scroll-x="true" class="marT24" style="white-space: nowrap;" v-if="it.mainProList&&it.mainProList.length>0">
				<view class="flex">
					<view class="category" v-for="(it1,i1) in it.mainProList" :key='i1'>{{it1}}</view>
				</view>
			</scroll-view>
			<scroll-view scroll-x="true" class="marT24" style="white-space: nowrap;" v-if="it.imgList&&it.imgList.length>0">
				<view class="flex" style="height: 124rpx;">
					<image class="img1 flexnone" v-for="(it2,i2) in it.imgList" :key='i2' :src="ImgUrl+it2"
						mode="scaleToFill"></image>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import commonApi from '@/api/common.js'
	export default {
		props: {
			//数据源
			dataList: {
				type: Array,
				default: () => []
			},
			isRefresh: {
				type: Boolean,
				default: () => false
			},
		},
		data() {
			return {

			}
		},
		methods: {
			//收藏  collectType:店铺 SUPPLIER， 商品PRODUCT
			userCollect(id) {
				commonApi.userCollect({
					collectType: 'SUPPLIER',
					itemId: id
				}).then(res => {
					if (res.code == 200) {
						this.showMsg(res.msg)
						if (this.isRefresh) {
							this.$emit('changeStatus');
						} else {
							this.dataList.forEach(e => {
								if (e.id == id) {
									e.subscribe = res.data;
								}
							})
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.card_ul {
		.card_li {
			border-radius: 20rpx;
			background: #fff;
			// background: red;

			padding: 20rpx;
			margin-bottom: 20rpx;

			.shu {
				width: 2rpx;
				height: 57rpx;
				opacity: 1;
				background: #C5C5C5;
				margin-right: 20rpx;
			}

			.category {
				margin-right: 10rpx;
				padding: 2rpx 10rpx;
				border: 2rpx solid #C5C5C5;
				border-radius: 4rpx;
			}

			.img1 {
				width: 124rpx;
				height: 124rpx;
				margin-right: 10rpx;
				border-radius: 4rpx;
			}

		}
	}
</style>
