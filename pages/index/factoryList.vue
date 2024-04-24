<template>
	<view class="factoryListbg">
		<u-sticky style="top:0;z-index:99999">
			<view class="bg-wrapper"
				:style="{backgroundImage: `url(${ossIconUrl}/index/gcbdbg.png)`,backgroundSize:'cover',height:'820rpx',backgroundRepeat:'no-repeat'}">
				<u-navbar :placeholder='true' bgColor="rgba(0,0,0,0)" fixed="">
					<view class="flex-c" slot="left">
						<view class="marR20" @tap.stop="leftClick">
							<u-icon name="arrow-left" color="#fff" size="20"></u-icon>
						</view>
						<!-- <text class="colorfff fontsize36">{{$t('newShop.title')}}</text> -->
					</view>
					<!-- <view class="flex-c search-icon" slot="center">
							<u-icon name="search" color="#fff" size="20"></u-icon>
						</view> -->
				</u-navbar>
				<view class="empty-wrap"></view>
				<view class="menu-wrap pad20">
					<view class="menu-box flex-c">
						<view class="menu-item marR10 marL10 flex-cc bgfff" v-for="(item,index) in menuList"
							:key="index" :class="{'active-menu':index==active_menu}"
							@tap.stop="handleTapMenu(item,index)">
							<text class="fontsize32">{{item.categoryName}}</text>
						</view>
					</view>
				</view>
			</view>
		</u-sticky>

		<view class="company-wrapper pad20">
			<view class="bgfff bdRadius20 com-item marB20" v-for="(item,index) in dataList" :key="index"
				@tap.stop="goToPage('/pages/mine/storeDetails?merchantNo=' + item.merchantNo)">
				<view class="rank fontsize32 textL padL10"
					:style="{backgroundImage: `url(${ossIconUrl}/index/gcbdtag.png)`}">
					{{"TOP"+(index < 9 ? `0${index+1}` : index+1)}}
				</view>
				<view class="img-desc flex-e"
					:style="{backgroundImage: `url(${ImgUrl+item.logo})`,backgroundSize:'cover',height:'300rpx',backgroundRepeat:'no-repeat'}">
					<view class="desc colorfff u-line-1">{{item.remarks||'-'}}</view>
				</view>
				<view class="pad20">
					<view class="flex-c">
						<text class="fontsize32 fontbold marR20">{{item.storeName}}</text>
						<!-- <text class="fontsize24 color9c9e9c">21年 | 户外品牌打造</text> -->
					</view>
					<view class="tag-wrap marT20">
						<text class="tag">{{$t("factoryList.rebuyRate")}}{{item.secendGranceRate}}%</text>
						<text class="tag">{{item.fansCount}}{{$t("factoryList.fansCount")}}</text>
					</view>
					<view class="marT20 scroll-img-list">
						<view class="marR10" v-for="(img,index) in transToArray(item.productImages)" :key="index">
							<image :src="ImgUrl+img" mode="aspectFill" class="img-item">
							</image>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view style="padding: 20rpx 0;color:#fff">
			<u-loadmore status="nomore" :nomoreText="$t('common.nomore1')" />
		</view>
	</view>
</template>

<script>
	import commonApi from '@/api/common.js'
	export default {
		data() {
			return {
				active_menu: 0,
				menuList: [],
				dataList: [],
				level: 0,
				id: 0,
			}
		},
		onLoad() {
			this.getCategoryMenu()
		},
		methods: {
			transToArray(str) {
				if (str) {
					return str.split(',').slice(0, 4)
				} else {
					return []
				}
			},
			handleTapMenu(item, index) {
				this.level = item.lev;
				this.id = item.id
				this.active_menu = index;
				this.factoryListCategory()
			},
			// 工厂类目
			getCategoryMenu() {
				commonApi.goodsCategoryMenu().then(res => {
					if (res.code == 200) {
						console.log(res, 'res')
						this.menuList = res.data
						this.level = this.menuList[0].lev
						this.id = this.menuList[0].id
						this.factoryListCategory()
					}
				})
			},
			// 工厂榜单
			factoryListCategory() {
				commonApi.factoryCategoryMenu({
					level: this.level,
					categoryId: this.id,
					refId: 6
				}).then(res => {
					if (res.code == 200) {
						let resOrderList = res.data;
						this.dataList = resOrderList;
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.factoryListbg {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));

		.empty-wrap {
			/* #ifdef H5 */
			height: 620rpx;
			/* #endif */
			/* #ifdef MP-WEIXIN */
			height: 520rpx;
			/* #endif */
		}



		.menu-wrap {
			.menu-box {
				width: calc(750rpx - 40rpx);
				overflow: scroll;

				.menu-item {
					white-space: nowrap;
					padding: 15rpx 30rpx;
					border-radius: 40rpx;
				}

				.active-menu {
					background-color: #FFEED5;
					color: #987020;
					font-weight: bold;
				}
			}
		}


		.company-wrapper {
			padding-top: 0;
			background-color: #101529;
			min-height: calc(100vh - var(--window-bottom) - 840rpx);

			.com-item {
				position: relative;

				.rank {
					position: absolute;
					top: 30rpx;
					left: -10rpx;
					background-size: contain;
					width: 138rpx;
					height: 50rpx;
					background-repeat: no-repeat;
					color: #987020;
				}

				.img-desc {
					border-radius: 20rpx 20rpx 0 0;
					overflow: hidden;

					.com-img {
						width: 100%;
						height: 300rpx;
					}

					.desc {
						width: 100%;
						height: 60rpx;
						line-height: 60rpx;
						background-color: #000;
						opacity: 0.6;
						padding: 0 20rpx;
					}
				}

				.tag-wrap {
					.tag:not(:last-of-type) {
						margin-right: 10rpx;
					}

					.tag {
						color: #DF9627;
						background-color: rgba(223, 150, 39, 0.1);
						border-radius: 10rpx;
						padding: 5rpx;
					}
				}

				.scroll-img-list {
					display: flex;
					width: 100%;
					overflow: scroll;

					.img-item {
						flex-shrink: 0;
						width: 160rpx;
						height: 160rpx;
						border-radius: 10rpx
					}

					.img-item:not(:last-of-type) {
						margin-right: 10rpx;
					}
				}
			}
		}
	}
</style>