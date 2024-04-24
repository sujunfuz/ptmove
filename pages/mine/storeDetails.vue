<template>
	<view class="storeDetailsbg">
		<!-- 店铺详情 -->
		<u-navbar leftIconColor='#fff' :title="$t('storeDetails.title')" :titleStyle='{"color":"#fff"}'
			:placeholder='true' bgColor="#E1251B" fixed="" @leftClick="leftClick"></u-navbar>
		<view class="fixed-top">
			<u-sticky bgColor="#f6f6f6">
				<view style="height: 30rpx;width: 100%;"></view>
				<view class="store-nav flex-cb">
					<view class="nav-center flex-c marL20">
						<u-avatar :src="ImgUrl+rs.logo" size="40"></u-avatar>
						<view class="store-info marL20">
							<view class="title fontbold u-line-1">
								{{rs.storeName}}
							</view>
							<view class="color9c9e9c marT10 fontsize24">
								<text class="marR30">{{$t("storeDetails.serve")}}{{rs.serviceScore}}</text>
								<text>{{rs.fansCount}}{{$t("storeDetails.fans")}}</text>
							</view>
						</view>
					</view>
					<view class="nav-right">
						<view v-if="rs.subscribe" class="marL20 guanzhubts flexnone bgfff color9c"
							@click="userCollect()">
							{{$t('cpfactoryCards.followed')}}
						</view>
						<view v-else class="flex-cc flexnone guanzhubts marL20 bgMain" @click.stop="userCollect()">
							<image class="imgguanzhu" :src="ossIconUrl+'/index/guanzhu.png'" mode="scaleToFill"></image>
							<view class="colorfff">{{$t('cpfactoryCards.interest')}}</view>
						</view>
					</view>
				</view>
				<!-- base info -->
				<view class="" v-if="type != 'all'">
					<view class="base-info flex-c bgfff">
						<view class="info-box flex-cb marR20">
							<view class="info-item">
								<view class="fontbold u-line-1">{{rs.foundTimeStr}}</view>
								<view class="color9c9e9c marT10 fontsize24 u-line-1">{{$t('storeDetails.fundTime')}}</view>
							</view>
						</view>
						<view class="info-box flex-cb marR20">
							<view class="info-item">
								<view class="fontbold u-line-1">{{rs.secendGranceRate}}%</view>
								<view class="color9c9e9c marT10 fontsize24 u-line-1">{{$t('storeDetails.turnHead')}}</view>
							</view>
						</view>
						<view class="info-box flex-cb marR20">
							<view class="info-item">
								<view class="fontbold u-line-1">{{rs.employeeCountStr}}</view>
								<view class="color9c9e9c marT10 fontsize24 u-line-1">{{$t('storeDetails.employee')}}</view>
							</view>
						</view>
						<view class="a-right" @tap.stop="goToPage('/pages/mine/storeInfo?merchantNo='+merchantNo)">
							<u-icon name="arrow-right" color="black" size="15"></u-icon>
						</view>
					</view>
					<view class="tabs-wrapper flex-cc bgfff">
						<u-tabs :list="tabList1" lineWidth="0" :activeStyle="{ color: '#E1251B'}" @change="tabsChange">
						</u-tabs>
					</view>
				</view>
				<view class="bgfff marT30" style="padding: 20rpx 20rpx 0 20rpx;" v-else>
					<view class="flex-cc">
						<text class="fontsize32 fontbold">{{$t("storeDetails.all")}}</text>
						<view class="input-style flex-c marL20 marR20 padL20">
							<input v-model='search_val' :customStyle='inputStyle' :placeholder="$t('common.input')"
								placeholder-class="plac-class" class="flex-c" style="line-height: 70rpx;flex:1"
								shape="circle">
							</input>
							<view class="search-btn" @tap.stop="searchGoods">
								<text class="colorfff fontsize28">{{$t("storeDetails.search")}}</text>
							</view>
						</view>
					</view>
					<view class="flex-cb bgfff tabs-box">
						<view class="flex-cc tabs" v-for="(item,index) in tabList2" :key="index"
							@tap="handleTab(index)">
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

		<view class="bgfff pad20" :class="type=='all'?'marT330':'marT360'" v-if="goodslist.length > 0">
			<good-card :list="goodslist" />
		</view>
		<view style="padding: 20rpx 0;">
			<u-loadmore :status="status" :loadingText="$t('common.loading')" :nomoreText="$t('common.nomore1')" />
		</view>
	</view>
</template>

<script>
	import goodCard from "@/components/goodCards/goodCards.vue"
	import mineApi from "@/api/mine.js"
	import commonApi from "@/api/common.js"
	export default {
		components: {
			'good-card': goodCard
		},
		data() {
			return {
				type: '', //all全部商品  空为正常展示
				tabList1: [{
					name: this.$t("storeDetails.goods")
				}, {
					name: this.$t("storeDetails.newGoods")
				}],
				tabList2: [{
					name: this.$t("storeDetails.comprehend")
				}, {
					name: this.$t("storeDetails.saleNum")
				}, {
					name: this.$t("storeDetails.price")
				}],
				inputStyle: {},
				priceMode: '',
				activeTab: 0,
				currentPage: 1,
				pageSize: 10,
				merchantNo: '',
				rs: {},
				goodslist: [],
				// serviceScore: 0,
				// fansCount: 0,
				orderByType: true,
				orderByField: '',
				search_val: '',
				status: 'loading',
			}
		},
		onLoad(e) {
			if (e.type) {
				this.type = e.type
			}
			if (e.merchantNo) {
				this.merchantNo = e.merchantNo
			}
			this.getMerchantInfo()
			this.getGoodsList()
		},
		onReachBottom() {
			if (this.status == 'nomore') {
				return;
			}
			this.currentPage++;
			this.getGoodsList()
		},
		methods: {
			searchGoods() {
				this.currentPage = 1;
				this.status = 'loading';
				this.goodslist = []
				this.getGoodsList()
			},
			getMerchantInfo() {
				mineApi.merchantInfo({
					merchantNo: this.merchantNo
				}).then(res => {
					if (res.code == 200) {
						this.rs = res.data;
					}
				})
			},

			//收藏  collectType:店铺 SUPPLIER， 商品PRODUCT
			userCollect() {
				commonApi.userCollect({
					collectType: 'SUPPLIER',
					itemId: this.rs.id
				}).then(res => {
					if (res.code == 200) {
						this.showMsg(res.msg)
						this.getMerchantInfo()
					}
				})
			},

			getGoodsList() {
				const params = {
					currentPage: this.currentPage,
					pageSize: this.pageSize,
					orderByField: this.orderByField,
					orderByType: this.orderByType,
					merchantNo: this.merchantNo,
					name: this.search_val
				}
				mineApi.goodsSearch(params).then(res => {
					if (res.code == 200) {
						let resOrderList = res.data.list;
						this.goodslist = this.goodslist.concat(resOrderList);
						this.total = res.data.total;
						if (resOrderList.length < this.pageSize) {
							this.status = 'nomore';
						}
					}
				})
			},
			tabsChange(tab) {
				this.orderByField = tab.index == 1 ? 'createTime' : ''
				this.currentPage = 1;
				this.status = 'loading';
				this.goodslist = [];
				this.getGoodsList();
			},
			handleTab(index) {
				const field = ['clickNum', 'saleNum', 'minimumPrice']
				this.orderByField = field[index]
				this.activeTab = index;
				if (index == 2) {
					this.priceMode = this.priceMode == 'up' ? 'down' : 'up'
					this.orderByType = this.priceMode == 'up' ? true : false
				} else {
					this.priceMode = ''
					this.orderByType = true
				}
				this.currentPage = 1;
				this.status = 'loading';
				this.goodslist = [];
				this.getGoodsList()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.storeDetailsbg {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));

		.marT330 {
			margin-top: 302rpx;
		}

		.marT360 {
			margin-top: 348rpx;
		}

		.store-nav {
			width: 100%;
			flex: 1;
			padding: 0 30rpx;
			box-sizing: border-box;

			.nav-center {
				flex: 1
			}

			.nav-right {
				.right-box {
					background-color: #E1251B;
					padding: 10rpx 20rpx;
					border-radius: 30rpx;
				}
			}
		}

		.base-info {
			border-radius: 20rpx 20rpx 0 0;
			margin: 30rpx 30rpx 0;
			padding: 40rpx 20rpx 20rpx 20rpx;

			.info-box {
				flex: 1;
			}
		}

		.tabs-wrapper {
			box-shadow: 0 -6rpx 10rpx -2rpx #eee;
		}

		.input-style {
			flex: 1;
			height: 70rpx;
			line-height: 70rpx;
			background-color: rgba(0, 0, 0, 0.05);
			border-radius: 35rpx;

			.search-btn {
				height: 100%;
				background-color: #E1251B;
				border-radius: 35rpx;
				padding: 0 30rpx;
			}
		}



		.plac-class {
			line-height: 70rpx;
			font-size: 24rpx
		}

		.tabs-box {
			width: 100%;
			flex: 1;
			height: 70rpx;
			line-height: 70rpx;
			margin-top: 10rpx;

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


	}
</style>
