<template>
	<view class="newShopbg">
		<u-sticky style="top:0;z-index:99999">
			<!-- #ifdef H5 -->
			<view class="bg-wrapper"
				:style="{backgroundImage: `url(${ossIconUrl}/index/xpsjbg.png)`,backgroundSize:'cover',height:'430rpx'}">
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<view class="bg-wrapper"
					:style="{backgroundImage: `url(${ossIconUrl}/index/xpsjbg.png)`,backgroundSize:'cover',height:'530rpx'}">
					<!-- #endif -->
					<u-navbar :placeholder='true' bgColor="rgba(0,0,0,0)" fixed="">
						<view class="flex-c" slot="left">
							<view class="marR20" @tap.stop="leftClick">
								<u-icon name="arrow-left" color="#fff" size="20"></u-icon>
							</view>
							<text class="colorfff fontsize36">{{$t('newShop.title')}}</text>
						</view>
						<!-- <view class="flex-c search-icon" slot="center">
							<u-icon name="search" color="#fff" size="20"></u-icon>
						</view> -->
					</u-navbar>
					<view class="srcoll-list marT20">
						<view class="list-item bdRadius20 pad20 bgfff marL20 flex" v-for="(item,index) in dataList"
							:key="index" @click="goToPage('/pages/index/shopDetails?id='+item.id)"
							:style="{backgroundImage:`url(${ossIconUrl}/index/mrhcbg2.png)`,backgroundSize:'cover'}">
							<view class="left-box marR20">
								<view class="fontbold fontsize28">
									<text class="title">{{item.name}}</text>
									<view
										:style="{backgroundImage:`url(${ossIconUrl}/index/lvxian.png)`,backgroundSize:'cover',height:'10rpx',backgroundRepeat:'no-repeat',marginTop:'-10rpx'}">
									</view>
								</view>
								<!-- <view class="fontsize20 desc marT10">{{item.remark || '-'}}</view> -->
								<view class="flex-c marT20">
									<text class="fontsize24 fontbold">{{$t("newShop.freshPrice")}}</text>
									<text class="fontsize30 fontbold colorMain">{{globalUnit}}</text>
									<text class="fontsize32 fontbold colorMain">{{item.minimumPrice}}</text>
								</view>
								<view class="color6e fontsize20 marT10">
									{{$t("newShop.sold")}}{{item.saleNum}}+{{$t("common.jian")}}
								</view>
							</view>
							<view class="right-box bgfff bdRadius20">
								<image :src="ImgUrl+item.descriptionImgAddr" mode="aspectFill"
									style="width: 160rpx;height: 160rpx" class="bdRadius20">
								</image>
							</view>
						</view>
					</view>
					<view class="tag-box flex-cs marT20 marB20">
						<view class="tag-item colorfff flex-c" v-for="(item,index) in tagList" :key="index">
							<image :src="`${ossIconUrl}/index/xpsjyd.png`" mode="aspectFill"
								style="width: 42rpx;height: 42rpx;"></image>
							<text class="marL10">{{item}}</text>
						</view>
					</view>
				</view>
				<view class="menu-wrap bgfff pad20">
					<view class="menu-item marR30" v-for="(item,index) in list" :key="index"
						:class="{'active-menu':index==activeMenu}" @tap.stop="handleTapMenu(item,index)">
						<text class="fontsize32">{{item.categoryName}}</text>
					</view>
				</view>
		</u-sticky>
		<view class="bgfff pad20 main-wrapper">
			<view class="marT20">
				<good-card :list="goodsList" />
			</view>
		</view>
		<view style="padding: 20rpx 0;">
			<u-loadmore :status="status" :loadingText="$t('common.loading')" :nomoreText="$t('common.nomore1')" />
		</view>

	</view>
</template>

<script>
	import commonApi from '@/api/common.js'
	import indexApi from '@/api/index.js'
	import goodCard from "@/components/goodCards/goodCards.vue"
	export default {
		components: {
			'good-card': goodCard
		},
		data() {
			return {
				navTopShow: false,
				list: ['女生衣著', '男生衣著', '運動健身', '居家生活', '女鞋'],
				activeMenu: 0,
				tagList: [this.$t("newShop.tag1"), this.$t("newShop.tag2"), this.$t("newShop.tag3")],
				currentPage: 1, //分页1
				pageSize: 10, //每页10条
				total: 0,
				dataList: [], //表格数据
				status: 'loading', //状态
				level: 0,
				id: 0,
				goodsList: []
			}
		},
		onPageScroll(e) {
			this.navTopShow = e.scrollTop > 88 ? true : false;
		},
		onLoad() {
			this.getLevOneCategoryByGoods()
			this.goodsShowRecommend()
		},
		onReachBottom() {
			if (this.status == 'nomore') {
				return;
			}
			this.currentPage++;
			this.getGoodsByCategoryLevOne()
		},
		methods: {
			// 菜单切换
			handleTapMenu(item, index) {
				this.level = item.lev;
				this.id = item.id
				this.activeMenu = index;
				this.currentPage = 1;
				this.status = 'loading';
				this.goodsList = []
				this.getGoodsByCategoryLevOne()
			},
			// 获取拥有商品的所有一级类目
			getLevOneCategoryByGoods() {
				indexApi.getLevOneCategoryByGoods().then(res => {
					if (res.code == 200) {
						this.list = res.data
						this.level = this.list[0].lev
						this.id = this.list[0].id
						this.getGoodsByCategoryLevOne()
					}
				})
			},
			//商品推荐
			goodsShowRecommend() {
				commonApi.goodsShowRecommend({
					refId: 1,
					pageSize: 100,
					currentPage: 1,
				}).then(res => {
					if (res.code == 200) {
						let resOrderList = res.data.list;
						this.dataList = this.dataList.concat(resOrderList);
					}
				})
			},
			// 根据一级类目id获取所有商品
			getGoodsByCategoryLevOne() {
				indexApi.getGoodsByCategoryLevOne({
					pageSize: this.pageSize,
					currentPage: this.currentPage,
					categoryId: this.id,
					level: this.level
				}).then(res => {
					if (res.code == 200) {
						let resOrderList = res.data.list;
						this.goodsList = this.goodsList.concat(resOrderList);
						this.total = res.data.total;
						if (resOrderList.length < this.pageSize) {
							this.status = 'nomore';
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.newShopbg {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));
		position: relative;

		.srcoll-list {
			display: flex;
			overflow-x: scroll;

			.list-item:last-of-type {
				margin-right: 20rpx;
			}

			.list-item {
				flex-shrink: 0;
				background-color: linear-gradient(90deg, #DFFFCC 0%, #FFFFFF 100%);

				.left-box {
					.title {
						display: inline-block;
					}

					.desc {
						color: #3C9409;
					}
				}
			}
		}

		.menu-wrap {
			display: flex;
			white-space: nowrap;
			overflow-x: scroll;
			border-radius: 20rpx 20rpx 0 0;
			margin-top: -30rpx;
			z-index: 9;
			position: relative;

			.menu-item {
				padding: 10rpx;
			}

			.active-menu {
				background-color: #EBF4E5;
				color: #3C9409;
				border-radius: 6rpx;
				font-weight: bold;
			}
		}

		.main-wrapper {
			position: relative;
			z-index: 1;
			margin-top: -30rpx;
			border-radius: 30rpx;


		}
	}
</style>
