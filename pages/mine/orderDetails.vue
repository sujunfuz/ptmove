<template>
	<view class="orderDetailsbg">
		<u-navbar leftIconColor='#fff' :title="$t('orderDetails.title')" :titleStyle='{"color":"#fff"}'
			:placeholder='true' bgColor="#E1251B" fixed="" @leftClick="leftClick"></u-navbar>
		<view class="pad20">
			<view v-if="rs.queryStatus=='WAITING_PAYMENT'">
				<view class="marT20 color6e flex-cc" v-if="countDownNum >0">
					<view>{{$t('orderDetails.sytime')}}:</view>
					<u-count-down :time="countDownNum" :format="$t('common.countdown1')" autoStart
						@finish='getOrderDetail()'>
					</u-count-down>
				</view>
				<view class="colorMain marT20 flex-cc">
					<view style="position: relative;top: 6rpx;">
						<text
							v-if="rs.payType=='PAY_MORE_THAN_ONCE'&&rs.unPaidAmount>0">{{$t('orderDetails.dbk')}}</text>
						<text class="fontbold">{{globalUnit}}</text>
					</view>
					<view class="marL6 fontsize50 fontbold">{{rs.unPaidAmount}}</view>
				</view>
				<view v-if="rs.payType=='PAY_MORE_THAN_ONCE'" class="textC marT20 fontsize24">{{$t('common.yifu')}}:
					{{globalUnit}}{{rs.paidAmount}}, {{$t('createOrder.realprice')}}:
					{{globalUnit}}{{rs.realAmount}}
				</view>
				<view class="flex-cc marT20">
					<view class="bts1 bgMain colorfff" @click.stop="payAgain()">{{$t('myOrder.jxfk')}}</view>
				</view>
			</view>
			<view class="cards flex-cb"
				v-if="rs.logisticsInfoVO&&rs.logisticsInfoVO.items.length>0&&rs.logisticsInfoVO.items"
				@click="logisticsShow=true">
				<view class="flex-c">
					<image class="img60 flexnone" :src="ossIconUrl+'/mine/wuliuicon.png'" mode="scaleToFill"></image>
					<view class="marL20">
						<view>{{rs.logisticsInfoVO.items[0].status||'-'}}</view>
						<view class="color9c marT10 fontsize24 u-line-1">
							{{rs.logisticsInfoVO.items[0].ftime||'-'}}
						</view>
					</view>
				</view>
				<u-icon name="arrow-right" color="#9C9E9C" size="15"></u-icon>
			</view>
			<view class="cards flex-cb">
				<view class="flex-c">
					<image class="img60 flexnone" :src="ossIconUrl+'/index/dizhi.png'" mode="scaleToFill"></image>
					<view class="marL20">
						<view class="flex-c">
							<view>{{receiveObj.receiveName}}</view>
							<view class="marL20">{{receiveObj.mobile}}</view>
						</view>
						<view class="color9c marT10 fontsize24 u-line-1">
							{{receiveObj.province}}{{receiveObj.city}}{{receiveObj.area}}{{receiveObj.address}}
						</view>
					</view>
				</view>
			</view>
			<shopOrderCards :dataList='dataList' :orderObj='rs' :type="'order'" :skuLength='skuLength'
				@changeFoldFlag='changeFoldFlag'></shopOrderCards>

			<view class="cards marT20" style="margin-bottom: 138rpx;">
				<view class="flex-cb">
					<view>{{$t('createOrder.fksj')}}</view>
					<view>{{rs.payRecords&&rs.payRecords.length>0?rs.payRecords[0].payTimeStr:'-'}}</view>
				</view>
				<view class="flex-cb marT30">
					<view>{{$t('createOrder.xdsj')}}</view>
					<view>{{rs.createTimeStr||'-'}}</view>
				</view>
				<view class="flex-cb marT30" v-if="rs.payRecords&&rs.payRecords.length>0">
					<view>{{$t('createOrder.zffs')}}</view>
					<view>{{rs.payRecords[0].channelName||'-'}}</view>
				</view>
				<view class="flex-cb marT30">
					<view>{{$t('createOrder.zflx')}}</view>
					<view class="flex-c">
						<view v-if="rs.payType=='PAY_MORE_THAN_ONCE'" class=" colorblue marR10" @tap="openPayRecord">
							{{$t('createOrder.payrecord')}}
						</view>
						<view class="marL20">{{rs.payTypeStr||'-'}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="btsView flex-je">
			<!-- <view class="bts bgMain colorfff fontbold fontsize30" @tap="gopayType()">{{$t('common.payment')}}</view> -->
			<!-- <view class="cardfooter flex-je" v-if="queryStatus!='AF'"> -->
			<!-- 售后 -->
			<view v-if="rs.afterSalesTag" class="bts u-line-1 borderC5"
				@click.stop="goToPage(`/pages/aftersale/selAfterSaleShop?storeBatchNo=${rs.storeBatchNo}`)">
				{{$t('myOrder.sqtk')}}
			</view>
			<!-- 取消订单 -->
			<view v-if="rs.queryStatus == 'WAITING_PAYMENT'&&rs.payStatus=='WAITING_PAYMENT'"
				@click.stop="cancelOrder()" class="bts u-line-1 borderC5 marL20">
				{{$t('myOrder.qxdd')}}
			</view>
			<!-- 继续支付 -->
			<view v-if="rs.queryStatus == 'WAITING_PAYMENT'" @click.stop="payAgain()"
				class="bts u-line-1 borderMain colorMain marL20">
				{{$t('myOrder.jxfk')}}
			</view>
			<!-- 确认收货 -->
			<view v-if="rs.queryStatus == 'HAS_SEND_GOODS'" @click.stop="confirmGoods()"
				class="bts u-line-1 bgMain colorfff marL20">{{$t('myOrder.qrsh')}}
			</view>
			<!-- 去评价 -->
			<view v-if="rs.queryStatus == 'HAS_RECEIVE_GOODS'"
				@click.stop="goToPage('/pages/mine/toEvaluate?storeBatchNo='+rs.storeBatchOrderNo)"
				class="bts u-line-1 borderC5 marL20">
				{{$t('myOrder.qpj')}}
			</view>
			<!-- 再次购买 订单详情 -->
			<!-- 	<view v-if="rs.queryStatus=='HAS_RECEIVE_GOODS'" @click.stop="reBuy(item)"
				class="bts u-line-1 borderMain colorMain marL20">
				{{$t('myOrder.zcgm')}}
			</view> -->
		</view>
		<payRecord v-if="rs.payRecords&&countDownNum>0" :remainPayTime="countDownNum" :show="payRecordshow"
			@close='payRecordshow=false' :payList='rs.payRecords'></payRecord>
		<logisticsInfo v-if="rs.logisticsInfoVO" :show="logisticsShow" :logisticsList='logisticsList' :rs='rs'
			@close='logisticsShow=false'>
		</logisticsInfo>
	</view>
</template>

<script>
	import mineApi from '@/api/mine.js'
	import shopOrderCards from '@/components/shopOrderCards/shopOrderCards.vue'
	import logisticsInfo from '@/components/logisticsInfo/logisticsInfo.vue'
	import payRecord from '@/components/payRecord/payRecord.vue'
	export default {
		components: {
			shopOrderCards,
			logisticsInfo,
			payRecord
		},
		data() {
			return {
				dataList: [],
				payRecordshow: false,
				storeBatchNo: '',
				rs: {},
				receiveObj: {},
				logisticsShow: false,
				logisticsList: [],
				skuLength: 10, //sku个数展开隐藏
				countDownNum: 0,

			}
		},
		onLoad(e) {
			this.storeBatchNo = e.storeBatchNo;
			this.getOrderDetail();
		},
		methods: {
			//获取订单详情
			getOrderDetail() {
				mineApi.getOrderDetail(this.storeBatchNo).then(res => {
					if (res.code == 200) {
						this.rs = res.data;
						let tempTime = new Date().getTime()
						if (this.rs.payOnceEndTime > tempTime) {
							this.countDownNum = Number(this.rs.remainPayTime) - tempTime
						}
						this.receiveObj = JSON.parse(this.rs.receiveInfo)
						this.rs.ALLaddress = this.receiveObj.province + this.receiveObj.city + this.receiveObj
							.area + this.receiveObj.address
						this.rs.spuInfoVOList.forEach(i => {
							i.cusLength = i.skuInfoVOList.length
							if (i.cusLength > this.skuLength) {
								this.$set(i, 'more', false)
							} else {
								this.$set(i, 'more', false)
							}
						})
						let arr = [];
						let obj = {
							spuInfoVOList: this.rs.spuInfoVOList,
							storeId: this.rs.storeNo,
							storeNo: this.rs.storeNo,
							storeName: this.rs.storeName,
						}
						this.dataList = [];
						this.dataList.push(obj)
						if (this.rs.logisticsInfoVO) {
							this.logisticsList = this.rs.logisticsInfoVO.items
							this.logisticsList.forEach(e => {
								e.descList = this.selectPhoneNumber(e.context)
							})
						}
					}
				})
			},
			//改变折叠
			changeFoldFlag(e) {
				this.dataList[e.indexs].spuInfoVOList[e.i].more = !this.dataList[e.indexs].spuInfoVOList[e.i].more;
			},
			openPayRecord() {
				let tempTime = new Date().getTime()
				if (this.rs.payOnceEndTime > tempTime) {
					this.countDownNum = Number(this.rs.remainPayTime) - tempTime
				}
				this.payRecordshow = true;
			},
			//确认收货
			confirmGoods() {
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
							mineApi.confirmGoods(that.storeBatchNo).then(res => {
								if (res.code == 200) {
									that.showMsg(res.msg);
									that.getOrderDetail();
								}
							})
						}
					}
				});
			},
			//继续支付
			payAgain() {
				mineApi.payAgain(this.storeBatchNo).then(res => {
					if (res.code == 200) {
						let obj = res.data;
						obj.batchOrdNo = obj.storeOrd
						this.goToPage('/pages/index/payType?data=' + JSON.stringify(obj))
					}
				})
			},
			//取消订单
			cancelOrder() {
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
							mineApi.cancelOrder(that.storeBatchNo).then(res => {
								if (res.code == 200) {
									that.showMsg(res.msg);
									that.getOrderDetail();
								}
							})
						}
					}
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.orderDetailsbg {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));

		.cards {
			background: #fff;
			border-radius: 20rpx;
			padding: 20rpx;
			margin-top: 20rpx;
		}

		.btsView {
			padding: 24rpx;

			.bts {
				padding: 15rpx 35rpx;
				margin-left: 20rpx;
			}
		}
	}
</style>
