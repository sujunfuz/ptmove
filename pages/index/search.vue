<template>
	<view class="searchbg">
		<u-navbar leftIconColor='#fff' :title="$t('search.title')" :titleStyle='{"color":"#fff"}' :placeholder='true'
			bgColor="#E1251B" fixed="" @leftClick="leftClick"></u-navbar>
		<view class="flex-c bgWhite marL20 marR20 marT20">
			<u-search bgColor='#fff' v-model="search" :inputStyle='searchStyle' :placeholder="$t('index.search')"
				:showAction='false' @input="getVagueResult()" @focus="flag = true"></u-search>
			<view class="btn" @tap="searchGoods()">{{$t('search.title')}}</view>
		</view>
		<view v-if="!visible" class="marL20 marR20">
			<view v-if="showRecode">
				<view v-if="historyData.length != 0">
					<view class="marT18 title flex-b" style="width: 100%;">{{$t('search.jilu')}}
						<u-icon name="trash" color="red" labelPos="bottom" @tap="delALL()"></u-icon>
					</view>
					<view class="history-bottom">
						<view class="bottom-tag" v-for="(item, i) in historyData" :key="i" @click="clickhistory(item)">
							{{ item }}
						</view>
					</view>
				</view>
			</view>

			<view v-else>
				<view v-if="dataList.length != 0">
					<view class="marT20" v-if="type=='PRODUCT'">
						<goodCardsFlow :dataList="dataList"></goodCardsFlow>
					</view>

					<view class="marT20" v-else>
						<factoryCards :dataList="dataList"></factoryCards>
					</view>
					<view style="padding: 20rpx 0;">
						<u-loadmore :status="status" :loadingText="$t('common.loading')"
							:nomoreText="$t('common.nomore1')" />
					</view>
				</view>
				<view v-else>
					<view class="flex" style="justify-content: center;">
						<image class="image" :src="ossIconUrl+'/index/nodataicon.png'"></image>
					</view>
					<view class="flex" style="justify-content: center;">{{$t('common.nodata')}}~</view>
				</view>

			</view>
		</view>

		<view v-else>
			<scroll-view class="vagueScroll" v-if="vagueRes.length != 0">
				<view @click="clickVagueBlock(item)" v-for="(item, i) in vagueRes" :key="i" class="vagueBlock"
					v-html="item">
				</view>
			</scroll-view>
			<view v-else>
				<view class="flex" style="justify-content: center;">
					<image class="image" :src="ossIconUrl+'/index/nodataicon.png'"></image>
				</view>
				<view class="flex" style="justify-content: center;">{{$t('common.nodata')}}~</view>
			</view>
		</view>
	</view>

</template>

<script>
	import searchApi from '@/api/search.js'
	import goodCardsFlow from '@/components/goodCardsFlow/goodCardsFlow.vue'
	import factoryCards from '@/components/factoryCards/factoryCards.vue'
	export default {
		components: {
			goodCardsFlow,
			factoryCards
		},
		data() {
			return {
				searchStyle: {
					padding: '5rpx 0',
				},
				flag: true,
				search: '',
				vagueRes: [],
				visible: false, //是否展示模糊查询结果
				showRecode: true, //是否展示历史记录
				currentPage: 1, //分页1
				pageSize: 10, //每页10条
				dataList: [], //表格数据
				type: uni.getStorageSync('globalType'),
				historyData: uni.getStorageSync("historyData") || [],
				list: []
			}
		},
		onLoad() {

		},
		onReachBottom() {
			if (this.status == 'nomore') {
				return;
			}
			this.currentPage++;
			this.getGoodsCard()
		},
		methods: {
			clickhistory(item) {
				this.flag = false
				this.search = item;
				this.visible = false
				this.showRecode = false
				this.getGoodsCard();
			},
			// 搜索商品
			searchGoods() {
				this.currentPage = 1;
				this.dataList = [];
				this.getGoodsCard();
				if (this.search) {
					this.historyData.push(this.search);
					this.historyData = this.unique(this.historyData);
					uni.setStorageSync("historyData", this.historyData);
				}
			},
			getGoodsCard() {
				if (this.type == 'PRODUCT') {
					searchApi
						.goodsSearch({
							currentPage: this.currentPage,
							pageSize: this.pageSize,
							name: this.search
						})
						.then((res) => {
							if (res.code == 200) {
								let resOrderList = res.data.list;
								this.dataList = this.dataList.concat(resOrderList);
								this.total = res.data.total;
								if (resOrderList.length < this.pageSize) {
									this.status = 'nomore';
								}
							}
						});
				} else {
					searchApi
						.factorySearch({
							currentPage: this.currentPage,
							pageSize: this.pageSize,
							storeName: this.search
						})
						.then((res) => {
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
								console.log(this.dataList)
							}
						});
				}
				this.visible = false
				this.showRecode = false
			},
			clickVagueBlock(val) {
				this.flag = false
				let temp = val.split("<span style=\"color:#d8382c;\">").join("");
				let res = temp.split("</span>").join("");
				this.search = res
				this.searchGoods()
			},
			// 获取模糊查询数据结果
			getVagueResult() {
				if (this.search != "") {
					if (this.flag) {
						this.visible = true
					}
					if (this.type == 'PRODUCT') {
						searchApi
							.goodsRelationSearch({
								param: this.search
							})
							.then((res) => {
								if (res.code == 200) {
									this.vagueRes = res.data
								}
							});
					} else {
						searchApi
							.factoryRelationSearch({
								param: this.search
							})
							.then((res) => {
								if (res.code == 200) {
									this.vagueRes = res.data
								}
							});
					}
				} else {
					this.visible = false
				}
			},
			delALL() {
				let that = this;
				uni.showModal({
					cancelColor: '#999',
					confirmColor: '#E1251B',
					title: that.$t('common.showtitle1'),
					cancelText: that.$t('common.cancel'),
					confirmText: that.$t('common.confirm2'),
					confirmText: that.$t('storeDetails.delAllbts'),
					content: that.$t('storeDetails.delAlltext'),
					success: async (res) => {
						if (res.confirm) {
							that.historyData = [];
							uni.removeStorageSync("historyData");
						}
					},
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.searchbg {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));
	}

	.btn {
		border-radius: 20px;
		width: 70px;
		font-size: 15px;
		line-height: 33px;
		text-align: center;
		background-color: #e1251b;
		color: #fff;
	}

	/deep/ .u-search__content__input {
		paddding-right: 30px;
	}

	.bgWhite {
		background-color: #fff;
		border-radius: 20px;
	}

	.title {
		font-size: 15px;
		margin-left: 5px;
	}

	.history-bottom {
		display: flex;
		flex-wrap: wrap;
		width: 100%;

		.bottom-tag {
			padding: 10rpx 14rpx;
			margin-right: 10rpx;
			margin-top: 10rpx;
			background-color: rgb(240, 240, 240);
			color: #2b2b2b;
			font-size: 24rpx;
			border-radius: 6rpx;
		}
	}

	.vagueScroll {
		height: calc(100vh - 150rpx);
		padding-top: 10rpx;
	}

	.vagueBlock {
		padding-top: 20rpx;
		padding-bottom: 20rpx;
		font-size: 28rpx;
		padding-left: 5rpx;
		border-bottom: #f2f2f2 solid 1px;
		background-color: #fff;
		padding-left: 20px;
	}

	.image {
		width: 240px;
		text-align: center;
	}
</style>
