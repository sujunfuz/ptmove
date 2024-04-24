<template>
	<view class="classbg">
		<u-navbar leftIcon="search" leftIconColor="#fff" leftIconSize="25" :title="$t('class.title')"
			:titleStyle="{ color: '#fff' }" :placeholder="true" bgColor="#E1251B" fixed="" @leftClick="gosearch">
		</u-navbar>
		<view class="main-wrapper">
			<view class="left-fix-first">
				<scroll-view scroll-y="true" style="max-height: 88vh;">
					<view class="first-menu animationY20" v-for="(item, index) in list" :key="index">
						<text class="u-line-1 first-item textC fontsize28"
							:class="{ 'active-first': cateId1 == item.id }"
							@tap.stop="handleFirstCate(item, index)">{{ item.categoryName }}</text>
					</view>
				</scroll-view>
			</view>
			<view class="right-wrapper" v-if="globalType=='PRODUCT'">
				<view class="bgfff bdRadius20 pad20 wrap-box" v-if="secondList&&secondList.length>0">
					<view class="scroll-list bgfff" style="position: fixed;z-index: 100;">
						<view v-for="(item, index) in secondList" :key="index" @tap.stop="scrollToGoods(item, index)">
							<text class="second-item textC"
								:class="{ 'active-second': cateId2 == item.id }">{{item.categoryName}}</text>
						</view>
					</view>
					<view style="height: 100rpx;"></view>
					<scroll-view scroll-y="true" style="height: 82vh;" :scroll-top="ScrollTop"
						:scroll-into-view='scrollIntoView' :scroll-with-animation="true">
						<view>
							<view class="third-item marT20" v-for="(item, index) in secondList" :key="index">
								<view :id="'target'+(index+1)"></view>
								<view style="display: inline-block;margin-top: 1rpx;">
									<view class="title flex" @tap.stop="gomarketClass(item)">
										<text class="fontsize30 fontbold marR10">{{item.categoryName}}</text>
										<u-icon name="arrow-right" color="#1A1A1A" size="18"></u-icon>
									</view>
								</view>
								<view class="flex goods-wrapper wrap marT20">
									<view class="marR20" v-for="(it, index) in item.children" :key="index"
										@tap.stop="gomarketClass(it)">
										<image :src="ImgUrl + it.goodsIcon" mode="aspectFill" class="goods-image">
										</image>
										<text class="u-line-1 textC" style="width:160rpx;">{{ it.categoryName }}</text>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
				<view v-else style="padding: 20rpx 0;">
					<u-loadmore status="nomore" :nomoreText="$t('common.nomore1')" />
				</view>
			</view>
			<view class="right2" v-else>
				<view class="marT20">
					<factoryCards :dataList="dataList"></factoryCards>
				</view>
				<view style="padding: 20rpx 0;">
					<u-loadmore :status="status" :loadingText="$t('common.loading')"
						:nomoreText="$t('common.nomore1')" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import factoryCards from '@/components/factoryCards/factoryCards.vue'
	import indexApi from "@/api/index.js";
	export default {
		components: {
			factoryCards
		},
		data() {
			return {
				globalType: 'PRODUCT', //工厂还是商品
				list: [],
				secondList: [],
				cateId1: '', //分类id 
				cateId2: '', //分类2id 
				currentPage: 1, //分页1
				pageSize: 10, //每页10条
				dataList: [], //表格数据
				status: 'loading', //状态
				total: 0,
				ScrollTop: 0,
				scrollIntoView: '',
				clickIndex: -1
			};
		},
		onShow() {
			this.cateId1 = uni.getStorageSync('cateId1') || '';
			this.globalType = uni.getStorageSync('globalType');
			this.getTreeData();
		},
		methods: {
			gosearch() {
				this.goToPage("/pages/index/search");
			},
			// 商品获取目录
			getTreeData() {
				indexApi.getTree({
					deep: 3,
				}).then((res) => {
					this.list = res.data;
					this.cateId1 = this.cateId1 ? this.cateId1 : this.list[0].id;
					if (this.globalType == 'PRODUCT') {
						this.getAllCategoryChildren(1, this.cateId1);
					} else {
						this.currentPage = 1;
						this.dataList = [];
						this.status = 'loading';
						this.getFactoryByCategory()
					}

				});
			},
			//根据类目id获取全部children
			getAllCategoryChildren(type, categoryId) {
				indexApi.getAllCategoryChildren({
					categoryId: categoryId,
				}).then(res => {
					if (res.code == 200) {
						this.secondList = res.data;
						this.cateId2 = this.secondList ? this.secondList[0].id : '';
					}
				})
			},
			//点击顶部
			scrollToGoods(item, index) {
				this.cateId2 = item.id;
				setTimeout(e => {
					this.scrollIntoView = "target" + (index + 1)
				}, 1)
			},
			//点击左边 获取二级
			handleFirstCate(item) {
				this.cateId1 = item.id;
				uni.setStorageSync('cateId1', this.cateId1)
				if (this.globalType == 'PRODUCT') {
					this.getAllCategoryChildren(1, this.cateId1);
				} else {
					this.currentPage = 1;
					this.dataList = [];
					this.status = 'loading';
					this.getFactoryByCategory()
				}
			},
			gomarketClass(item) {
				console.log(item)
				switch (item.level) {
					case 2:
						this.goToPage("/pages/class/marketClass?parentId=" + item.id);
						break;
					case 3:
						this.goToPage("/pages/class/marketClass?parentId=" + item.parentId + "&categoryId=" + item.id);
						break;
				}
			},
			//工厂 查看
			getFactoryByCategory() {
				indexApi.getFactoryByCategory({
					categoryId: this.cateId1,
					currentPage: this.currentPage,
					pageSize: this.pageSize,
				}).then(res => {
					if (res.code == 200) {
						let resOrderList = res.data.list;
						resOrderList.forEach(e => {
							if (e.productImages) {
								e.imgList = e.productImages.split(',')
							} else {
								e.imgList = []
							}
							if (e.mainProducts) {
								e.mainProList = e.mainProducts.split(',')
							} else {
								e.mainProList = []
							}
						})
						this.dataList = this.dataList.concat(resOrderList);
						this.total = res.data.total;
						if (resOrderList.length < this.pageSize) {
							this.status = 'nomore';
						}
					}
				})
			},
		},
	};
</script>

<style lang="scss" scoped>
	.classbg {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));

		.main-wrapper {
			width: 100%;
			box-sizing: border-box;
		}

		.left-fix-first {
			position: fixed;
			/* #ifndef H5 */
			top: calc(128rpx + var(--status-bar-height));
			/* #endif */
			/* #ifdef H5 */
			top: 88rpx;
			/* #endif */
			left: 0;
			width: 150rpx;

			.first-item {
				overflow-y: scroll;
				height: 100rpx;
				line-height: 100rpx;
			}

			.active-first {
				color: #e1251b;
				font-weight: bold;
			}
		}

		.right2 {
			width: calc(100% - 180rpx);
			margin-left: 168rpx;
		}

		.right-wrapper {
			width: calc(100% - 210rpx);
			margin-left: 150rpx;
			padding: 30rpx 0;

			.wrap-box {
				width: 100%;
			}

			.scroll-list {
				display: flex;
				// width: 100%;
				width: 538rpx !important;
				overflow-x: scroll;
				padding: 10rpx 0;

				.second-item {
					background-color: #f6f6f6;
					line-height: 60rpx;
					padding: 6rpx 30rpx;
					display: inline-block;
					white-space: nowrap;
					border-radius: 50rpx;
				}

				.second-item {
					margin-right: 20rpx;
				}

				.active-second {
					background-color: rgba(225, 37, 27, 0.1);
					color: #e1251b;
				}
			}

			.third-wrapper {
				width: 100%;

				.third-item {
					width: 100%;

					.title {
						color: #1a1a1a;
					}
				}

				.third-item:not(:first-of-type) {
					margin-top: 30rpx;
				}

				.goods-wrapper {
					width: 100%;
					// display: flex;
					// flex-wrap: wrap;
					display: grid;
					grid-template-columns: 1fr 1fr 1fr;
					grid-gap: 10rpx;
				}

				.goods-item {
					margin: 10rpx;
					flex-direction: column;
				}
			}
		}

		.goods-image {
			width: 160rpx;
			height: 160rpx;
			background: #f6f6f6;
			border-radius: 10rpx;
		}
	}
</style>
