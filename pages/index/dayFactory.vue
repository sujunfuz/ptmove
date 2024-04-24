<template>
	<view class="dayFactorybg">
		<u-sticky style="top:0;z-index:99999">
			<!-- #ifdef H5 -->
			<view class="bg-wrapper"
				:style="{backgroundImage: `url(${ossIconUrl}/index/mrhcbg.png)`,backgroundSize:'cover',height:'430rpx'}">
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<view class="bg-wrapper"
					:style="{backgroundImage: `url(${ossIconUrl}/index/mrhcbg.png)`,backgroundSize:'cover',height:'530rpx'}">
					<!-- #endif -->
					<u-navbar :placeholder='true' bgColor="rgba(0,0,0,0)" fixed="">
						<view class="flex-c" slot="left">
							<view class="marR20" @tap.stop="leftClick">
								<u-icon name="arrow-left" color="#fff" size="20"></u-icon>
							</view>
							<text class="colorfff fontsize36">{{$t('dayFactory.title')}}</text>
						</view>
					</u-navbar>
					<view class="marT20">
						<!-- 	<view class="colorfff fontsize32 marL20 marB20">
							{{$t("dayFactory.topRecommend")}}
						</view> -->
						<view class="cusTitle" :style="{backgroundImage: `url(${ossIconUrl}/index/bgtitle.png)`}">
							<view class="title">{{$t('dayFactory.topRecommend')}}</view>
						</view>
						<view class="srcoll-list">
							<view class="list-item bdRadius20 pad20 bgfff marL20 flex" v-for="(item,index) in list"
								:key="index"
								:style="{backgroundImage:`url(${ossIconUrl}/index/gcbdbg2.png)`,backgroundSize:'cover'}"
								@tap.stop="goToPage('/pages/mine/storeDetails?merchantNo=' + item.merchantNo)">
								<view class="left-box marR20" style="width: 440rpx;">
									<view class="fontbold">
										<text class="title u-line-1">{{item.mainProducts||'-'}}</text>
										<view
											:style="{backgroundImage:`url(${ossIconUrl}/index/hongxian.png)`,backgroundSize:'contain',height:'10rpx',backgroundRepeat:'no-repeat',marginTop:'-10rpx'}">
										</view>
									</view>
									<view style="height: 68rpx;" class="fontsize24 color9c9e9c u-line-2 marT20 marB20">
										{{item.companyProfile || $t('dayFactory.tips')}}
									</view>
									<view class="compony fontsize24 u-line-1">
										{{item.storeName}}
									</view>
								</view>
								<view class="right-box bgfff bdRadius20">
									<image :src="ImgUrl+item.logo" mode="aspectFill"
										style="width: 160rpx;height: 160rpx" class="bdRadius20">
									</image>
									<!-- <view class="price">
										{{'$99'}}
									</view> -->
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="menu-wrap bgfff pad20">
					<view class="menu-item marR10 marL10 flex-cc" v-for="(item,index) in menuList" :key="index"
						:class="{'active-menu':index==active_menu}" @tap.stop="handleTabChange(item,index)"
						:style="{backgroundImage:active_menu == index ? `url(${ossIconUrl}/index/tabactive.png)` : `url(${ossIconUrl}/index/tabno${index == 0 ? 1 : index}.png)`}">
						<image :src="`${ossIconUrl}/index/imgtab${index+1}.png`" mode="aspectFill" class="menu-icon">
						</image>
						<text class="fontsize28"
							:class="{'colorfff fontbold':active_menu == index}">{{item.name}}</text>
					</view>
				</view>
		</u-sticky>
		<view class=" pad20 main-wrapper" style="background-color: #f6f6f6;">
			<view class="marT20">
				<factory-cards :list="dataList" />
			</view>
		</view>
		<view style="padding: 20rpx 0;">
			<u-loadmore :status="status" :loadingText="$t('common.loading')" :nomoreText="$t('common.nomore1')" />
		</view>
	</view>
</template>

<script>
	import commonApi from '@/api/common.js'
	import indexApi from "@/api/index.js"
	import FactoryCards from "./components/factoryCards.vue"
	export default {
		components: {
			'factory-cards': FactoryCards
		},
		data() {
			return {
				list: [],
				menuList: [{
					name: this.$t("dayFactory.recommend"),
					field: 'viewNum'
				}, {
					name: this.$t("dayFactory.hotSale"),
					field: 'saleNum'
				}, {
					name: this.$t("dayFactory.quanlity"),
					field: 'score'
				}, {
					name: this.$t("dayFactory.reBuy"),
					field: 'secendGranceRate'
				}],
				active_menu: 0,
				currentPage: 1,
				pageSize: 10,
				orderByField: 'viewNum',
				dataList: [],
				total:0,
				status: 'loading', //状态
			}
		},
		onLoad() {
			this.getFactoryRecommed()
			this.getFactoryList()
		},
		methods: {
			handleTabChange(item, index) {
				this.active_menu = index;
				this.orderByField = item.field
				this.currentPage = 1;
				this.status = 'loading';
				this.dataList = []
				this.getFactoryList()
			},
			getFactoryRecommed() {
				commonApi.factoryShowRecommend({
					refId: 5,
					pageSize: this.pageSize,
					currentPage: this.currentPage,
				}).then(res => {
					this.list = res.data.list
				})
			},
			getFactoryList() {
				indexApi.factorySearch({
					currentPage: this.currentPage,
					pageSize: this.pageSize,
					orderByField: this.orderByField,
					orderByType: false,
				}).then(res => {
					let resOrderList = res.data.list;
					this.dataList = this.dataList.concat(resOrderList);
					this.dataList.forEach(e=>{
						if (e.mainProducts) {
							e.mainProList = e.mainProducts.split(',')
						} else {
							e.mainProList = []
						}
					})
					this.total = res.data.total;
					if (resOrderList.length < this.pageSize) {
						this.status = 'nomore';
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.cusTitle {
		width: 330rpx;
		height: 90rpx;
		background-size: cover;
		margin-left: 20rpx;
		margin-bottom: -20rpx;
		overflow: hidden;

		.title {
			font-size: 32rpx;
			font-weight: bold;
			color: #FFFFFF;
			margin-left: 20rpx;
			margin-top: 12rpx;
		}
	}

	.dayFactorybg {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));

		.bg-wrapper {
			.srcoll-list {
				display: flex;
				overflow-x: scroll;

				.list-item {
					width: 581rpx;
					// height: 210rpx;
					flex-shrink: 0;

					.left-box {
						.title {
							display: inline-block;
						}
					}

					.right-box {
						position: relative;

						.price {
							position: absolute;
							bottom: -10rpx;
							left: 50%;
							transform: translateX(-50%);
							padding: 5rpx 10rpx;
							background-color: #FCE8E7;
							border-radius: 20rpx;
							color: #E02A23
						}
					}
				}
			}
		}

		.menu-wrap {
			display: flex;
			justify-content: space-between;
			white-space: nowrap;
			overflow-x: scroll;
			border-radius: 20rpx 20rpx 0 0;
			margin-top: -30rpx;
			z-index: 9;
			position: relative;
			padding-top: 60rpx;

			.menu-item {
				padding: 10rpx;
				flex-direction: column;
				width: 168rpx;
				height: 115rpx;
				background-repeat: no-repeat;
				background-size: 100% 100%;
				position: relative;

				.menu-icon {
					width: 100rpx;
					height: 100rpx;
					margin-top: -80rpx;
				}
			}

			.active-menu {
				border-radius: 6rpx;
				font-weight: bold;
				color: white;
			}
		}
	}
</style>
