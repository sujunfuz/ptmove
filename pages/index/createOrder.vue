<template>
	<view class="createOrderbg">
		<u-navbar leftIconColor='#fff' :title="$t('createOrder.title')" :titleStyle='{"color":"#fff"}'
			:placeholder='true' bgColor="#E1251B" fixed="" @leftClick="leftClick"></u-navbar>
		<view class="pad20">
			<view class="cards" v-if="orderRs.createType == 'batch'">
				<view class="flex">
					<u-icon size='18' name="error-circle" color="#E1251B"></u-icon>
					<view class="marL20">{{$t('common.tips1')}}<text
							class="colorMain">{{orderRs.successNum}}</text>{{$t('common.unitNum')}}{{$t('common.order')}}，{{$t('common.error2')}}<text
							class="colorMain">{{orderRs.errorNum}}</text>{{$t('common.unitNum')}}，{{$t('common.error3')}}<text
							class="colorMain">{{orderRs.createErrorNum}}</text>{{$t('common.unitNum')}}</view>
				</view>
				<view class="flex marT20" style="margin-left: 48rpx;" v-if="orderRs.errorList.length>0">
					<view>{{$t('common.lookerror')}}</view>
					<view class="marL20 colorMain" @click="failShow=true">{{$t('common.look')}}</view>
				</view>
			</view>
			<view class="cards" v-else>
				<view class="flex-cb" @click="addressShow=true">
					<view class="flex-c">
						<image class="img60 flexnone" :src="ossIconUrl+'/index/dizhi.png'" mode="scaleToFill"></image>
						<view v-if="addresses.length>1" class="marL20">
							{{$t('createOrder.singletips1')}}{{addresses.length}}{{$t('createOrder.singletips2')}}
						</view>
						<block v-else>
							<view class="marL20" v-if="selAddress.id">
								<view class="flex-c">
									<view>{{selAddress.userName}}</view>
									<view class="marL20">{{selAddress.mobile}}</view>
								</view>
								<view class="color9c marT10 fontsize24 u-line-1">
									{{selAddress.province}}{{selAddress.city}}{{selAddress.area}}{{selAddress.address}}
								</view>
							</view>
							<view v-else class="marL20">{{$t('common.selectaddress')}}</view>
						</block>
					</view>
					<u-icon name="arrow-right" color="#9C9E9C" size="15"></u-icon>
				</view>
				<view v-if="isMultiple&&orderRs.type == 'DELIVERY'&&nums>1" class="colorblue marT20 fontsize24"
					style="margin-left: 80rpx;" @click.stop="multipleShow=true">
					{{$t('createOrder.multiplebts')}}
				</view>
				<!-- 	<view v-else class="colorblue marT20 fontsize24" style="margin-left: 80rpx;"
					@click.stop="addressShow=true">{{$t('createOrder.singlebts')}}</view> -->
			</view>
			<shopOrderCards v-if="dataList.length>0" :dataList='dataList' :type="'create'" :skuLength='skuLength'
				@changeFoldFlag='changeFoldFlag' @changeComment='changeComment' :createType='orderRs.createType'>
			</shopOrderCards>

			<view class="cards marT20" style="margin-bottom: 138rpx;" v-if="dataList.length>0">
				<view class="fontbold">{{$t('common.zongji')}}</view>
				<view class="flex-cb marT30">
					<view>{{$t('createOrder.shoptype')}}</view>
					<view>{{allSpus}}{{$t('common.zhong')}}</view>
				</view>
				<view class="flex-cb marT30">
					<view>{{$t('createOrder.shoptotal')}}</view>
					<view>{{allSkus}}{{$t('common.jian')}}</view>
				</view>
				<view class="flex-cb marT30">
					<view>{{$t('createOrder.yunfei')}}</view>
					<view>{{globalUnit}}{{allFreightAmount}}</view>
				</view>
				<view class="flex-cb marT30" v-if="allDiscountAmount>0">
					<view>{{$t('createOrder.youhuis')}}</view>
					<view class="colorMain">-{{globalUnit}}{{allDiscountAmount}}</view>
				</view>
				<view class="flex-cb marT30">
					<view>{{$t('createOrder.hpze')}}</view>
					<view class="fontbold fontsize32 colorMain">{{globalUnit}}{{allAmount}}</view>
				</view>
			</view>
			<view v-else style="padding: 20rpx 0;">
				<u-loadmore status="momore" :nomoreText="$t('common.nomore1')" />
			</view>
		</view>
		<view class="btsView flex-je">
			<view>{{$t('common.gong')}}{{allSkus}}{{$t('common.jian')}}</view>
			<view class="marL20">{{$t('common.heji')}}:</view>
			<view class="fontsize32 colorMain">
				{{globalUnit}}{{fomatFloat(allAmount + allFreightAmount-allDiscountAmount,2)}}
			</view>
			<view v-if="!Paying" class="bts bgMain colorfff fontbold fontsize30 marL20" @tap="createOrder()">
				{{$t('common.payment')}}</view>
			<view v-else class="bts bgc5 fontbold fontbold fontsize30 marL20">{{$t('common.orderbalance')}}...</view>
		</view>
		<view @touchmove.stop.prevent="()=>{return false}">
			<AddressPop v-if="addressShow" :changeFlag="changeFlag" @getAddress="getAddress"
				@closePop="addressShow=false" :show="addressShow" :selAddress='selAddress'>
			</AddressPop>
		</view>
		<view @touchmove.stop.prevent="()=>{return false}">
			<address-reco v-if="multipleShow" @closePop="multipleShow=false" @complete='complete' :show="multipleShow"
				:spuId='spuId' :skuId='skuId' :nums='nums'>
			</address-reco>
		</view>
		<failReason :errorList='orderRs.errorList' :show="failShow" @close='failShow=false'></failReason>
	</view>
</template>

<script>
	import indexApi from '@/api/index.js'
	import mineApi from '@/api/mine.js'
	import shopcartApi from '@/api/shopcart.js'
	import AddressPop from '@/components/AddressPop/AddressPop.vue'
	import shopOrderCards from '@/components/shopOrderCards/shopOrderCards.vue'
	import AddressReco from "@/components/addressReco/addressReco.vue"
	import failReason from "./components/failReason.vue"
	import set from '../../api/set'
	export default {
		components: {
			AddressPop,
			shopOrderCards,
			AddressReco,
			failReason
		},
		data() {
			return {
				addressShow: false,
				changeFlag: false,
				selAddress: {},
				dataList: [],
				addresses: [], //下单地址
				skuId: '',
				spuId: '',
				nums: '',
				orderRs: '', //缓存数据
				createType: '', //shopcart 购物车下单   details详情自己下单   direct直销订单  reBuy再次购买 
				skuLength: 10, //sku个数展开隐藏
				multipleShow: false, //是否多地址
				skuInfos: "", //非购物车算运费
				failShow: false,
				isMultiple: false, //是否开启多地址
				Paying:false
			}
		},
		computed: {
			//总共件数
			allSkus() {
				let skuList = []
				this.dataList.forEach(e => {
					e.spuInfoVOList.forEach(i => {
						i.skuInfoVOList.forEach(i => {
							skuList.push(i)
						})
					})
				})
				let nums = 0;
				skuList.forEach(e => {
					nums += Number(e.num)
				})
				return nums
			},
			//货品种类
			allSpus() {
				let spuList = []
				this.dataList.forEach(e => {
					e.spuInfoVOList.forEach(i => {
						spuList.push(i)
					})
				})
				return spuList.length
			},
			//总运费
			allFreightAmount() {
				let allFreightAmount = 0;
				this.dataList.forEach(e => {
					allFreightAmount += Number(e.storeFreightAmout)
				})
				return this.fomatFloat(Number(allFreightAmount), 2)
			},
			//总优惠
			allDiscountAmount() {
				let DiscountAmount = 0;
				this.dataList.forEach(e => {
					DiscountAmount += Number(e.discountAmount)
				})
				return this.fomatFloat(Number(DiscountAmount), 2) || 0
			},
			//货品总额
			allAmount() {
				let allAmount = 0;
				this.dataList.forEach(e => {
					allAmount += Number(e.storeAmount)
				})
				return this.fomatFloat(Number(allAmount), 2)
			}
		},
		onLoad() {
			this.orderRs = uni.getStorageSync('orderRs')
			this.dataList = this.orderRs.dataList;
			this.setdataList();
			if (this.orderRs.createType != 'batch') {
				setTimeout(e => {
					this.getShippingAddress(); //默认地址
				}, 1)
			}
		},
		onShow() {
			this.changeFlag = !this.changeFlag //控制刷新
		},
		methods: {
			//处理dataList
			setdataList() {
				let skuList = []
				this.dataList.forEach(e => {
					this.$set(e, 'remark', '')
					e.spuInfoVOList.forEach(i => {
						i.cusLength = i.skuInfoVOList.length;
						if (i.cusLength > this.skuLength) {
							this.$set(i, 'more', false)
						} else {
							this.$set(i, 'more', false)
						}
						i.skuInfoVOList.forEach(j => {
							skuList.push(j)
						})
					})
				})
				if ((this.orderRs.createType == 'details' || this.orderRs.createType == 'shopcart') && skuList.length ==
					1) {
					this.isMultiple = true;
					this.spuId = this.dataList[0].spuInfoVOList[0].spuId;
					this.skuId = this.dataList[0].spuInfoVOList[0].skuInfoVOList[0].skuId;
					this.nums = this.dataList[0].spuInfoVOList[0].skuInfoVOList[0].num;
				}
			},
			//改变折叠
			changeFoldFlag(e) {
				this.dataList[e.indexs].spuInfoVOList[e.i].more = !this.dataList[e.indexs].spuInfoVOList[e.i].more;
			},
			//写入备注
			changeComment(its, indexs) {
				this.dataList[indexs].remark = its.remark
			},

			//是否默认地址
			getShippingAddress() {
				mineApi.getShippingAddress({
					currentPage: 1,
					pageSize: 1000
				}).then(res => {
					if (res.code == 200) {
						res.data.list.forEach(e => {
							if (e.defaultIs == 'YES') {
								this.seladd(e)
							}
						})
					}
				})
			},
			//选择单地址
			getAddress(e) {
				this.dataList = this.orderRs.dataList;
				this.seladd(e)
				this.addressShow = false;
			},
			// 选择多地址
			complete(e) {
				let that = this;
				that.addresses = e;
				let newdataList = []
				let numList = []
				that.addresses.forEach(e => {
					numList.push({
						num: e.num
					})
					that.orderRs.dataList.forEach(i => {
						newdataList.push(JSON.stringify(i))
					})
				})
				numList.forEach((e, index) => {
					newdataList[index] = JSON.parse(newdataList[index])
					newdataList[index].spuInfoVOList[0].skuInfoVOList[0].num = e.num;
					newdataList[index].spuInfoVOList[0].skuInfoVOList[0].totalPrice = e.num * newdataList[index]
						.spuInfoVOList[0].skuInfoVOList[0].unitPrice;
					newdataList[index].storeAmount = newdataList[index].spuInfoVOList[0].skuInfoVOList[0]
						.totalPrice;
				})
				that.dataList = newdataList;
				that.multipleShow = false;
				that.computedfreight();
			},
			//选择地址
			seladd(e) {
				this.selAddress = e;
				let obj = {
					num: this.nums,
					province: this.selAddress.province,
					city: this.selAddress.city,
					area: this.selAddress.area,
					detail: this.selAddress.address,
					mobile: this.selAddress.mobile,
					receiveName: this.selAddress.userName,
				}
				this.addresses = []
				this.addresses.push(obj)
				this.computedfreight();
			},
			//计算运费
			computedfreight() {
				switch (this.orderRs.createType) {
					case 'shopcart':
						this.cartBilling()
						break;
					case 'direct':
						console.log('直销单不计算地址')
						break;
					default:
						this.orderfreight2()
						break;
				}
			},

			//除开批量下单  获取参数 [address,emark,skuInfos]
			getparame() {
				let arr = []
				let obj
				let skuInfos = {}
				this.addresses.forEach(e => {
					obj = {
						address: {
							...e
						},
						skuInfos: { //一件多发的情况
							[this.skuId]: e.num
						},
					}
					arr.push(obj)
				})

				this.dataList.forEach((e, index) => {
					arr[index].remark = e.remark
				})

				if (this.orderRs.createType != 'details') {
					this.dataList.forEach(e => {
						e.spuInfoVOList.forEach(i => {
							i.skuInfoVOList.forEach(i => {
								skuInfos[i.skuId] = i.num; //多种sku的情况
							})
						})
					})
					arr[0].skuInfos = skuInfos;
				}
				return arr
			},
			//批量下单 获取参数 [address,emark,skuInfos]
			getparame2() {
				let arr = []
				let obj = {}
				this.dataList.forEach((e, index) => {
					e.spuInfoVOList.forEach(i => {
						i.skuInfoVOList.forEach(i => {
							e.skuId = i.skuId;
						})
					})
					obj = {
						address: e.selAddress,
						skuInfos: {
							[e.skuId]: e.skuNum
						},
					}
					arr.push(obj)
					arr[index].remark = e.remark
				})
				return arr
			},
			// 通用算运费
			orderfreight2() {
				indexApi.orderfreight2(this.orderRs.type, this.getparame()).then(res => {
					if (res.code == 200) {
						let list = res.data;
						list.forEach((e, index) => {
							this.dataList[index].storeFreightAmout = Number(Object.values(e).join());
						})
					}
				})
			},
			// 购物车下单算运费
			cartBilling() {
				shopcartApi.cartBilling({
					addressId: this.selAddress.id,
					cartIds: this.orderRs.cartIds,
					cartType: this.orderRs.type,
					userNo: this.userInfo.userNo
				}).then(res => {
					if (res.code == 200) {
						setTimeout(e => {
							this.dataList = res.data.dataList;
							this.setdataList()
						}, 1)
					}
				})
			},
			//支付方式下单   购物车下单以外,直销码下单  都用通用下单接口
			createOrder() {
				switch (this.orderRs.createType) {
					case 'shopcart':
						this.cartCreateOrd()
						break;
					case 'direct':
						this.updateDirectOrd();
						break;
						// case 'batch':
						// 	// console.log(this.dataList)
						// 	this.getparame2();
						// 	break;
					default:
						this.commonSettle()
						break;
				}
			},
			// 购物车下单
			cartCreateOrd() {
				if (!this.selAddress.id) {
					this.showMsg(this.$t('common.selectaddress'))
					return
				}
				let remarks = {}
				this.dataList.forEach(e => {
					remarks[e.storeNo] = e.remark
				})
				remarks = JSON.stringify(remarks)
				let obj = {
					addressId: this.selAddress.id,
					cartIds: this.orderRs.cartIds,
					type: this.orderRs.type,
					remarks: remarks
				}
				console.log(obj)
				this.Paying = true;
				indexApi.cartCreateOrd(obj).then(res => {
					this.Paying = false;
					if (res.code == 200) {
						this.goDelPage('/pages/index/payType?data=' + JSON.stringify(res.data))
					}
				})
			},
			// 直销码下单
			updateDirectOrd() {
				if (!this.selAddress) {
					this.showMsg(this.$t('common.selectaddress'))
					return
				}
				let obj = {
					province: this.selAddress.province,
					city: this.selAddress.city,
					area: this.selAddress.area,
					detail: this.selAddress.address,
					mobile: this.selAddress.mobile,
					receiveName: this.selAddress.userName,
					storeBatchNo: this.orderRs.storeBatchNo,
					type: this.orderRs.type,
					remark: this.dataList[0].remark
				}
				console.log(obj)
				this.Paying = true;
				indexApi.updateDirectOrd(obj).then(res => {
					this.Paying = false;
					if (res.code == 200) {
						this.goDelPage('/pages/index/payType?data=' + JSON.stringify(res.data))
					}
				})
			},
			// 通用下单模块
			commonSettle() {
				if (this.addresses.length == 0 && this.orderRs.createType != 'batch') {
					this.showMsg(this.$t('common.selectaddress'))
					return
				}
				if (!this.selAddress && this.orderRs.createType == 'batch') {
					this.showMsg(this.$t('common.selectaddress'))
					return
				}
				let obj = this.orderRs.createType == 'batch' ? this.getparame2() : this.getparame()
				console.log(obj)
				this.Paying = true;
				indexApi.commonSettle(this.orderRs.type, obj).then(res => {
					this.Paying = false;
					if (res.code == 200) {
						this.goDelPage('/pages/index/payType?data=' + JSON.stringify(res.data))
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	/deep/ .wrapper {
		.w-mid {
			min-height: 70rpx;
		}
	}

	/deep/ .u-checkbox {

		.u-checkbox__icon-wrap--disabled--checked {
			border-color: #E02A23 !important;

			.u-icon--right {
				background-color: #E02A23;
				width: 100%;
				height: 100%;

				.uicon-checkbox-mark {
					color: white !important;
					left: 2px;
				}
			}

		}
	}

	.createOrderbg {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));

		.cards {
			background: #fff;
			border-radius: 20rpx;
			padding: 20rpx;
			margin-top: 20rpx;
		}

	}
</style>
