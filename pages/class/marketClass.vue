<template>
	<view class="market-class-bg">
		<u-navbar leftIconColor='#fff' :title="navTitle" :titleStyle='{"color":"#fff"}' :placeholder='true'
			bgColor="#E1251B" fixed="" @leftClick="leftClick"></u-navbar>
	<!-- 	<u-navbar leftIconColor='#fff' :title="navTitle"
			:titleStyle='{"color":"#fff","fontWeight":600,"fontSize":"36rpx"}' bgColor="#E1251B" fixed autoBack>
		</u-navbar> -->
		<view class="fixed-top">
			<u-sticky customNavHeight='160'>
				<view class="positionRelative padT30 search-wrap" @tap="goToPage('/pages/index/search')">
					<u-search bgColor='#fff' :inputStyle='searchStyle' :placeholder="$t('index.search')"
						:showAction='false'>
					</u-search>
				</view>
				<view class="tab bgF6">
					<u-tabs :list="list" @click="handleTab" keyName='label' :activeStyle="{color:'#E1251B'}"
						lineWidth="0" :current='currentIndex'></u-tabs>
				</view>
				<view class="">
					<view class="flex-cb bgfff tabs-box padT20 padB20">
						<view class="flex-cc tabs" v-for="(item,index) in tabList" :key="index"
							@tap="handleOption(index)">
							<text class="marR10" :class="{'active-tab' :activeTab ==index}">{{item.name}}</text>
							<view v-if="index==2">
								<u-icon name="arrow-up-fill" :color="priceMode == 'up' ? '#E1251B' : '#9C9E9C'"
									:size="priceMode == 'up' ? 13 : 8" v-if="priceMode == 'up' || !priceMode"></u-icon>
								<u-icon name="arrow-down-fill" :color="priceMode == 'down' ? '#E1251B' : '#9C9E9C'"
									:size="priceMode == 'down' ? 13 : 8" v-if="priceMode == 'down' || !priceMode">
								</u-icon>
							</view>
						</view>
					</view>
				</view>
			</u-sticky>
		</view>
		<view class="goods-wrapper">
			<view v-if="dataList.length > 0">
				<goodCardsFlow :dataList="dataList"></goodCardsFlow>
			</view>
			<view style="padding: 20rpx 0;">
				<u-loadmore :status="status" :loadingText="$t('common.loading')" :nomoreText="$t('common.nomore1')" />
			</view>
		</view>

	</view>
</template>

<script>
	import commonApi from '@/api/common.js'
	import goodCardsFlow from '@/components/goodCardsFlow/goodCardsFlow.vue'
	export default {
		components: {
			goodCardsFlow
		},
		data() {
			return {
				searchStyle: {
					padding: '5rpx 0',
				},
				level: 2,
				activeTab: 0,
				tabList: [{
					name: this.$t("storeDetails.comprehend")
				}, {
					name: this.$t("storeDetails.saleNum")
				}, {
					name: this.$t("storeDetails.price")
				}],
				priceMode: '',
				field: ['clickNum', 'saleNum', 'minimumPrice'],
				orderByField: 'clickNum',
				currentPage: 1,
				pageSize: 10,
				orderByType: false,
				parentId: '',
				categoryId: '',
				currentIndex: 0,
				list: [], //三级类目list
				navTitle: '',
				dataList: [],
				total: 0,
				status: 'loading', //状态
			}
		},
		onLoad(e) {
			this.parentId = e.parentId;
			if (e.categoryId) {
				this.categoryId = e.categoryId;
				this.level = 3;
			} else {
				this.level = 2;
				this.categoryId = this.parentId;
			}
			this.getSingleCategory();
		},
		onReachBottom() {
			if (this.status == 'nomore') {
				return;
			}
			this.currentPage++;
			this.goodsByCategory()
		},
		methods: {
			handleTab(item) {
				if (item.value == 'ALL') {
					this.level = 2;
					this.categoryId = this.parentId;
				} else {
					this.level = 3;
					this.categoryId = item.value;
				}

				this.currentPage = 1;
				this.status = 'loading'
				this.dataList = []
				this.goodsByCategory()
			},
			handleOption(index) {
				this.orderByField = this.field[index]
				this.activeTab = index;
				this.currentPage = 1;
				this.status = 'loading';
				this.dataList = [];
				if (index == 2) {
					this.priceMode = this.priceMode == 'up' ? 'down' : 'up'
					this.orderByType = this.priceMode == 'up' ? true : false
				} else {
					this.priceMode = ''
					this.orderByType = true
				}
				this.goodsByCategory()
			},
			// 商品类目
			getSingleCategory() {
				commonApi.getSingleCategory({
					categoryId: this.parentId
				}).then(res => {
					if (res.code == 200) {
						this.navTitle = res.data.categoryName
						// children
						console.log(res.data)
						if (res.data.children) {
							this.list = [{
								label: this.$t('myOrder.tab1'),
								value: 'ALL'
							}]
							res.data.children.forEach((e, index) => {
								this.list.push({
									label: e.categoryName,
									value: e.id
								})
								if (this.categoryId) {
									if (e.id == this.categoryId) {
										this.currentIndex = index + 1
									}
								}
							})
						} else {
							this.list = []
						}
						console.log(this.list)
						this.goodsByCategory();
					}
				})
			},
			// 类目商品
			goodsByCategory() {
				let obj = {
					pageSize: this.pageSize,
					currentPage: this.currentPage,
					categoryId: this.categoryId,
					level: this.level,
					orderByField: this.orderByField,
				}
				if (this.orderByField == 'minimumPrice') {
					obj.orderByType = this.orderByType
				}
				commonApi.goodsByCategory(obj).then(res => {
					if (res.code == 200) {
						let resOrderList = res.data.list;
						this.dataList = this.dataList.concat(resOrderList);
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
<style scoped lang="scss">
	.market-class-bg {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));

		.search-wrap {
			background-color: #E1251B;
			padding-bottom: 10rpx;
			padding-left: 20rpx;
			padding-right: 20rpx;
		}

		.tabs-box {
			width: 100%;
			height: 70rpx;
			line-height: 70rpx;
			border-radius: 20rpx 20rpx 0 0;

			.tabs {
				flex: 1;
				position: relative;

				.active-tab {
					color: #E1251B
				}
			}

			.tabs:not(:last-of-type)::after {
				content: "|";
				position: absolute;
				right: 0;
				color: #9C9E9C
			}
		}

		.goods-wrapper {
			margin: 288rpx auto 0;
			/* #ifdef MP-WEIXIN */
			margin: 308rpx auto 0;
			/* #endif */
		}
	}
</style>
