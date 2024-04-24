<template>
	<view class="myOrderbg">
		<u-navbar leftIconColor='#fff' :title="$t('myOrder.title')" :titleStyle='{"color":"#fff"}' :placeholder='true'
			bgColor="#E1251B" fixed="" @leftClick="leftClick"></u-navbar>
		<view class="fixed-top">
			<u-sticky bgColor="#fff" customNavHeight='160'>
				<u-tabs style="margin-left: 3rpx;" lineColor="#EB1818" :activeStyle="activeStyle"
					:inactiveStyle='inactiveStyle' :current="current" :list="tabsList" @click="clickTab"></u-tabs>
			</u-sticky>
		</view>
		<view class="cards">
			<view class="card_li animationY10" v-for=" (item,indexs) in dataList" :key="indexs" @tap="godetails(item)">
				<view class="flex-cb" @click.stop="goToPage('/pages/mine/storeDetails?merchantNo='+item.storeNo)">
					<view class="flex-c">
						<view class="fontbold">{{item.storeName}}</view>
						<u-icon name="arrow-right" color="#9C9E9C" size="15"></u-icon>
					</view>
					<view class="header-right colorMain">
						{{queryStatus=='AF'?item.afSalesTypeStr:item.queryStatusStr}}</view>
				</view>
				<view class="order-body">
					<view class="flex marB20" v-for="(it,i1) in item.goodsVOS||item.goodsEntities" :key='i1'>
						<image class="imgshop flexnone" :src="ImgUrl + it.spuImage" mode="scaleToFill"></image>
						<view class="marL20" style="width: 100%;">
							<view class="flex-cb">
								<view class="u-line-1 fontsize28 fontbold">{{it.spuName}}</view>
								<view class="flex-e flexnone">
									<!-- <view class="fontsize24"></view> -->
									<view class="fontsize32 marL6">{{globalUnit}}{{it.unitPrice}}</view>
								</view>
							</view>
							<!-- 	<view class="flex marT12">
								<view v-for="(it,i2) in 1" :key='i2' class="tag1">破损包赔</view>
							</view> -->
							<view class="marT10 color9c fontsize24" v-if="queryStatus=='AF'">
								{{$t('common.guige')}}：<text>{{it.skuIndexesVal}}</text>；{{$t('common.num')}}：{{it.refundNum}}{{$t('common.jian')}}
							</view>
							<view class="marT10 color9c fontsize24" v-else>
								{{$t('common.guige')}}：<text>{{it.specNum+$t('common.zhong')}}</text>；{{$t('common.num')}}：{{it.num}}{{$t('common.jian')}}
							</view>
							<view class="marT20 colorMain">{{it.afterSaleStatus||''}}</view>
						</view>
					</view>
					<view class="flex-je">
						<view class="color80 fontsize24">{{$t('myOrder.hyf')}}：</view>
						<view>{{$t('myOrder.sfk')}}：</view>
						<view class="colorMain flex-e" style="margin-top: -5rpx;">
							<view class="colorMain flex-e fontbold">
								<view class="fontsize30">{{globalUnit}}</view>
								<view class="fontsize32 marL6">{{ item.realAmount}}</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 支付状态为待补款 -->
				<view class="typeview flex" v-if="item.payStatus=='WAITING_BK'&&item.countDownNum>0">
					<view class="colorMain marR16">{{$t('orderDetails.dbk')}}</view>
					<view>
						<text>{{$t('myOrder.qz')}}</text>
						<u-count-down :time="item.countDownNum" :format="$t('common.countdown1')" autoStart
							@finish="finish(1,indexs)">
						</u-count-down>
						<text>{{$t('myOrder.nzf')}}</text>
						<view class="colorMain">{{globalUnit}}{{item.waitPayAmount}}</view>
					</view>
				</view>
				<!-- 支付状态为 订单异常  -->
				<view class="typeview flex-c" v-if="item.payStatus=='PAY_BUT_EXPIRE'">
					<view>
						<text class="colorMain marR16">{{$t('myOrder.dsjcl')}}</text>
						<text>{{$t('myOrder.ddyc')}}</text>
					</view>
				</view>
				<!-- 售后-->
				<view class="typeview flex-c" v-if="queryStatus=='AF'">
					<view v-if="item.closeTimeSeconds">
						<text class="colorMain marR16">{{item.afSalesStatusStr}}</text>
						<text>{{$t('myOrder.sjcl')}}</text>
						<u-count-down :time="item.closeTimeSeconds*1000" :format="$t('common.countdown1')" autoStart
							@finish="finish(2,indexs)">
						</u-count-down>
						<text>{{$t('myOrder.ncl')}}</text>
					</view>
					<view v-else>
						<text class="colorMain marR16">{{item.briefStatus}}</text>
						<text>{{item.briefDesc}}</text>
					</view>
				</view>
				<view class="cardfooter flex-je" v-if="queryStatus!='AF'">
					<view v-if="item.afterSalesTag" class="btn u-line-1 borderC5"
						@click.stop="goToPage(`/pages/aftersale/selAfterSaleShop?storeBatchNo=${item.storeBatchNo}`)">
						{{$t('myOrder.sqtk')}}
					</view>
					<!-- 订单状态待付款以及支付状态为待支付即可取消 -->
					<view v-if="item.queryStatus == 'WAITING_PAYMENT'&&item.payStatus=='WAITING_PAYMENT' "
						@click.stop="cancelOrder(item.storeBatchNo)" class="btn u-line-1 borderC5 marL20">
						{{$t('myOrder.qxdd')}}
					</view>
					<view v-if="item.queryStatus == 'WAITING_PAYMENT'" @click.stop="payAgain(item)"
						class="btn u-line-1 borderMain colorMain marL20">
						{{$t('myOrder.jxfk')}}
					</view>
					<view v-if="item.queryStatus == 'HAS_SEND_GOODS'" @click.stop="confirmGoods(item.storeBatchNo)"
						class="btn u-line-1 bgMain colorfff marL20">{{$t('myOrder.qrsh')}}
					</view>
					<view v-if="item.queryStatus == 'HAS_RECEIVE_GOODS'"
						@click.stop="goToPage('/pages/mine/toEvaluate?storeBatchNo='+item.storeBatchNo)"
						class="btn u-line-1 borderC5 marL20">
						{{$t('myOrder.qpj')}}
					</view>
					<view v-if="item.queryStatus=='HAS_RECEIVE_GOODS'" @click.stop="reBuy(item)"
						class="btn u-line-1 borderMain colorMain marL20">
						{{$t('myOrder.zcgm')}}
					</view>
				</view>
			</view>
		</view>
		<view style="padding: 40rpx 0;">
			<u-loadmore :status="status" :loadingText="$t('common.loading')" :nomoreText="$t('common.nomore1')" />
		</view>
	</view>
</template>

<script>
	import mineApi from '@/api/mine.js'
	export default {
		data() {
			return {
				activeStyle: {
					color: '#E1251B'
				},
				inactiveStyle: {
					color: '#1A1A1A'
				},
				tabsList: [{
					name: this.$t('myOrder.tab1'),
					value: 'ALL'
				}, {
					name: this.$t('mine.text1'),
					value: 'WAITING_PAYMENT'
				}, {
					name: this.$t('mine.text2'),
					value: 'WAIT_SEND_GOODS'
				}, {
					name: this.$t('mine.text3'),
					value: 'HAS_SEND_GOODS'
				}, {
					name: this.$t('mine.text4'),
					value: 'HAS_RECEIVE_GOODS'
				}, {
					name: this.$t('mine.text5'),
					value: 'AF'
				}],
				current: 0, //头部滑动条所选择当前订单状态
				dataList: [],
				currentPage: 1, //当前页数
				pageSize: 10,
				queryStatus: 'ALL',
				status: 'loading', //分页加载状态
			}
		},
		onLoad(e) {
			if (e.type) {
				this.current = e.type;
				this.queryStatus = this.tabsList[e.type].value;
			}

		},
		onShow() {
			setTimeout(e => {
				this.currentPage = 1;
				this.status = 'loading';
				this.dataList = [];
				this.getMyOrderList();
			}, 1)
		},
		methods: {
			leftClick() {
				this.goToSw('/pages/tabbar/mine')
			},
			finish(type, indexs) {
				switch (type) {
					case 1:
						this.dataList[indexs].payStatus = 'PAY_BUT_EXPIRE';
						break;
					default:
						console.log(indexs)
						break;
				}

			},
			clickTab(item) {
				this.current = item.index
				this.queryStatus = item.value;
				this.status = 'loading';
				this.dataList = [];
				this.currentPage = 1;
				this.getMyOrderList();
			},
			//获取我的订单列表
			getMyOrderList() {
				mineApi.getMyOrder({
					pageSize: this.pageSize,
					currentPage: this.currentPage,
					queryStatus: this.queryStatus,
				}).then(res => {
					let tempTime = new Date().getTime()
					let resOrderList = res.data.list;
					this.dataList = this.dataList.concat(resOrderList);
					this.dataList.forEach(e => {
						if (e.payStatus == 'WAITING_BK') {
							if (e.remainPayTime > tempTime) {
								e.countDownNum = e.remainPayTime - tempTime
							}
						}
					})
					this.total = res.data.total;
					if (resOrderList.length < this.pageSize) {
						this.status = 'nomore';
					}
				})
			},
			godetails(item) {
				if (this.queryStatus == 'AF') {
					this.goToPage('/pages/aftersale/afterSaleDetails?id=' + item.id)
				} else {
					this.goToPage('/pages/mine/orderDetails?storeBatchNo=' + item.storeBatchNo)
				}
			},
			//继续支付
			payAgain(item) {
				mineApi.payAgain(item.storeBatchNo).then(res => {
					if (res.code == 200) {
						let obj = res.data;
						obj.batchOrdNo = obj.storeOrd
						this.goToPage('/pages/index/payType?data=' + JSON.stringify(obj))
					}
				})
			},
			//再次购买
			reBuy(item) {
				mineApi.reBuy({
					storeBatchNo: item.storeBatchNo
				}).then(res => {
					if (res.code == 200) {
						let spuInfoVOList = res.data;
						let skuList = []
						spuInfoVOList.forEach(e => {
							e.skuInfoVOList = e.skuInfoList;
							e.skuInfoVOList.forEach(i => {
								i.totalPrice = i.num * i.unitPrice;
								skuList.push(i.num)
							})
						})
						let dataList = []
						dataList.push({
							storeId: spuInfoVOList[0].storeNo,
							storeNo: spuInfoVOList[0].storeNo,
							storeName: spuInfoVOList[0].storeName,
							storeFreightAmout: 0,
							storeAmount: spuInfoVOList[0].realAmount,
							spuInfoVOList: spuInfoVOList,
						})
						let allSkus = 0;
						skuList.forEach(e => {
							allSkus += Number(e)
						})
						let orderRs = {};
						orderRs.dataList = dataList;
						orderRs.createType = 'reBuy';
						orderRs.type = item.orderType == 'ORD_WHOLESALE' ? 'BATCH_PRODUCE' :
							'DELIVERY '; //订单批发与 下单批发代发字段不同
						uni.setStorageSync('orderRs', orderRs)
						this.goToPage('/pages/index/createOrder')
					}
				})
			},
			//取消订单
			cancelOrder(storeBatchNo) {
				let that = this;
				uni.showModal({
					cancelColor: '#999',
					confirmColor: '#E1251B',
					title: that.$t('common.showtitle1'),
					cancelText: that.$t('common.cancel'),
					confirmText: that.$t('common.confirm2'),
					content: that.$t('common.showcancel'),
					success: async (res) => {
						if (res.confirm) {
							mineApi.cancelOrder(storeBatchNo).then(res => {
								if (res.code == 200) {
									that.showMsg(res.msg);
									that.currentPage = 1;
									that.status = 'loading';
									that.dataList = [];
									that.getMyOrderList();
								}
							})
						}
					}
				});
			},
			//确认收货
			confirmGoods(storeBatchNo) {
				let that = this;
				uni.showModal({
					cancelColor: '#999',
					confirmColor: '#E1251B',
					title: that.$t('common.showtitle1'),
					cancelText: that.$t('common.cancel'),
					confirmText: that.$t('common.confirm2'),
					content: that.$t('common.receipt'),
					success: async (res) => {
						if (res.confirm) {
							mineApi.confirmGoods(storeBatchNo).then(res => {
								if (res.code == 200) {
									that.showMsg(res.msg);
									that.currentPage = 1;
									that.status = 'loading';
									that.dataList = [];
									that.getMyOrderList();
								}
							})
						}
					}
				});
			},
		},
		onReachBottom() {
			if (this.status == 'nomore') {
				return;
			}
			this.currentPage++;
			this.getMyOrderList()
		},
	}
</script>

<style lang="scss" scoped>
	/deep/ .u-count-down {
		display: inline !important;
		width: auto;
		height: auto;
		margin: 0 6rpx;
		font-size: 24rpx;

		.u-count-down__text {
			color: #EB1818;
		}
	}

	.myOrderbg {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));

		.cards {
			width: calc(100% - 48rpx);
			margin: 108rpx auto 0;

			.card_li {
				background: #fff;
				padding: 20rpx;
				border-radius: 20rpx;
				margin-top: 20rpx;

				.order-body {
					width: 100%;
					margin: 20rpx auto 0;

					.imgshop {
						width: 180rpx;
						height: 180rpx;
						border-radius: 10rpx;
					}

					.tag1 {
						margin-right: 10rpx;
						padding: 2rpx 10rpx;
						border: 2rpx solid #9C9E9C;
						color: #9C9E9C;
						border-radius: 4rpx;
					}
				}

				.typeview {
					background: #FAFAFA;
					width: 594rpx;
					padding: 20rpx 30rpx;
					margin: 26rpx 0 10rpx 0;
					border-radius: 10rpx;
				}

				.cardfooter {
					// height: 100rpx;

					.btn {
						text-align: center;
						border-radius: 50rpx;
						margin-top: 23rpx;
						padding: 10rpx 24rpx;
						flex: none;
						max-width: 120rpx;
					}
				}
			}

		}

	}
</style>
