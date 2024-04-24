<template>
	<view class="selAfterSaleShopbg">
		<u-navbar leftIconColor='#fff' :title="$t('selAfterSaleShop.title')" :titleStyle='{"color":"#fff"}'
			:placeholder='true' bgColor="#E1251B" fixed="" @leftClick="leftClick">
		</u-navbar>
		<view class="pad20" style="padding-bottom: 238rpx;">
			<shopOrderCards :objIndex="objIndex" :dataList='dataList' :type="'aftersale'" :skuLength='skuLength'
				@changeIscheck='changeIscheck' @changeNum='changeNum' @changeFoldFlag="changeFoldFlag" :banPlus="true">
			</shopOrderCards>
		</view>
		<view class="fixedView">
			<view class="flex-cb">
				<view class="flexnone flex-c" @click="selectAll">
					<image v-if="num == cusLength" class="img36" :src="ossIconUrl+'/index/xuanze1.png'"
						mode="scaleToFill" />
					<image v-else-if="num > 0" class="img36" :src="ossIconUrl+'/index/xuanze3.png'"
						mode="scaleToFill" />
					<image v-else class="img36" :src="ossIconUrl+'/index/weixuanze.png'" mode="scaleToFill">
						<view class="marL10 color9c">{{$t('shopcart.all')}}</view>
				</view>
				<view class="flex color999">
					<view>{{$t('shopDetails.yixuan2')}}</view>
					<view class="colorMain">{{num}}</view>
					<view>{{$t('common.ge')}}</view>
				</view>
			</view>
			<view class="bts bgMain colorfff fontbold fontsize30" @tap="goselAfterSaleType">
				{{$t('selAfterSaleShop.title')}}
			</view>
		</view>
	</view>
</template>

<script>
	import afSalesApi from '@/api/afSales.js'
	import shopOrderCards from '@/components/shopOrderCards/shopOrderCards.vue'
	export default {
		components: {
			shopOrderCards,
		},
		data() {
			return {
				storeBatchNo: '',
				dataList: [],
				skuLength: 10, //sku折叠展开个数
				objIndex: {
					indexs: -1,
					i: -1,
					i2: -1
				},
				cartIds: [],
				cusLength: 0,
				num: 0,
				freightAmount: 0,
				amount: 0, //货品总金额
			}
		},
		onLoad(e) {
			this.storeBatchNo = e.storeBatchNo;
			this.getOrderGoods();
		},
		methods: {
			//获取订单所有商品
			getOrderGoods() {
				afSalesApi.getOrderGoods({
					storeBatchNo: this.storeBatchNo,
				}).then(res => {
					if (res.code == 200) {
						this.freightAmount = res.data.freightAmount;
						this.amount = res.data.amount;
						this.num = 0;
						this.cusLength = 0;
						let spuInfoVOList = res.data.spuVOS;
						spuInfoVOList.forEach(i => {
							i.skuInfoVOList = i.skuVOS;
							i.cusLength = i.skuInfoVOList.length
							if (i.cusLength > this.skuLength) {
								i.more = false;
							} else {
								i.more = true;
							}
							i.ischeck = 0
							i.skuInfoVOList.forEach(j => {
								this.cusLength++
								j.cusLength = 1
								j.ischeck = 0
								j.oldNum = j.num
								j.totalPrice = j.amount
							})
						})
						this.dataList = [];
						this.dataList.push({
							spuInfoVOList: spuInfoVOList
						})
					}
				})
			},
			//改变折叠
			changeFoldFlag(e) {
				this.dataList[e.indexs].spuInfoVOList[e.i].more = !this.dataList[e.indexs].spuInfoVOList[e.i].more;
			},
			//点击圆圈
			changeIscheck(e) {
				let val
				switch (e.type) {
					case 2:
						val = ''
						if (this.dataList[e.indexs].spuInfoVOList[e.i].ischeck == this.dataList[e.indexs].spuInfoVOList[e
								.i]
							.cusLength) {
							this.num -= this.dataList[e.indexs].spuInfoVOList[e.i].cusLength
							this.dataList[e.indexs].ischeck -= this.dataList[e.indexs].spuInfoVOList[e.i].cusLength
							this.dataList[e.indexs].spuInfoVOList[e.i].ischeck = 0
							val = 'none'
						} else if (this.dataList[e.indexs].spuInfoVOList[e.i].ischeck >= 0) {
							this.num += (this.dataList[e.indexs].spuInfoVOList[e.i].cusLength - this
								.dataList[e.indexs].spuInfoVOList[e.i].ischeck)
							this.dataList[e.indexs].ischeck += (this.dataList[e.indexs].spuInfoVOList[e.i].cusLength - this
								.dataList[e.indexs].spuInfoVOList[e.i].ischeck)
							this.dataList[e.indexs].spuInfoVOList[e.i].ischeck = this.dataList[e.indexs].spuInfoVOList[e.i]
								.cusLength
							val = 'all'
						}
						for (let item of this.dataList[e.indexs].spuInfoVOList[e.i].skuInfoVOList) {
							if (val == 'none') {
								item.ischeck = 0
							} else {
								item.ischeck = 1
							}
						}
						break;
					case 3:
						val = 0
						if (this.dataList[e.indexs].spuInfoVOList[e.i].skuInfoVOList[e.i2].ischeck == 1) {
							this.dataList[e.indexs].spuInfoVOList[e.i].skuInfoVOList[e.i2].ischeck = 0
							val = -1
						} else {
							this.dataList[e.indexs].spuInfoVOList[e.i].skuInfoVOList[e.i2].ischeck = 1
							val = 1
						}
						this.dataList[e.indexs].spuInfoVOList[e.i].ischeck += val
						this.dataList[e.indexs].ischeck += val
						this.num += val
						break;
				}
				this.countAllData()
			},
			// 改变价格
			changeNum(type, e, indexs, i, i2, val = -1) {
				let tempNum = 0
				switch (type) {
					case 'jian':
						tempNum = e.num > 1 ? e.num - 1 : e.num
						break;
					case 'jia':
						tempNum = e.num + 1
						break;
					case 'none':
						break;
				}
				tempNum = tempNum > e.oldNum ? e.oldNum : tempNum < 1 ? 1 : tempNum;

				if (val != -1) {
					if (val == e.num) {
						return
					}
					e.num = val
					this.dataList[indexs].spuInfoVOList[i].skuInfoVOList[i2].num = val
				} else {
					e.num = tempNum
					this.dataList[indexs].spuInfoVOList[i].skuInfoVOList[i2].num = tempNum
				}
				this.countAllData()
				this.objIndex = {
					indexs,
					i,
					i2
				}
				this.$nextTick(() => {
					this.objIndex = {
						indexs: -1,
						i: -1,
						i2: -1
					}
				})
			},

			//计算全部数据
			countAllData() {
				let arr = []
				this.dataList.forEach(i => {
					i.spuInfoVOList.forEach(j => {
						j.skuInfoVOList.forEach(k => {
							k.totalPrice = k.num * k.unitPrice
							if (k.ischeck == 1) {
								arr.push(k.goodsOrderNo)
							}
						})
					})
				})
				this.cartIds = arr
			},
			// 全选
			selectAll() {
				if (this.num == this.cusLength) {
					this.num = 0
					this.dataList.forEach(i => {
						i.ischeck = 0
						i.spuInfoVOList.forEach(j => {
							j.ischeck = 0
							j.skuInfoVOList.forEach(k => {
								k.ischeck = 0
							})
						})
					})
				} else {
					this.num = this.cusLength
					this.dataList.forEach(i => {
						i.ischeck = i.cusLength
						i.spuInfoVOList.forEach(j => {
							j.ischeck = j.cusLength
							j.skuInfoVOList.forEach(k => {
								k.ischeck = k.cusLength
							})
						})
					})
				}

				this.dataList = [...this.dataList]
				this.countAllData()
			},
			goselAfterSaleType() {
				let afShopList = [];
				this.dataList.forEach(i => {
					i.spuInfoVOList.forEach(j => {
						j.skuInfoVOList.forEach(k => {
							if (k.ischeck) {
								afShopList.push({
									goodsOrderNo: k.goodsOrderNo,
									num: k.num,
									total: k.num * k.unitPrice
								})
							}
						})
					})
				})
				if (afShopList.length == 0) {
					this.showMsg(this.$t('selAfterSaleShop.sel'))
					return
				}
				let totals = []
				afShopList.forEach(e => {
					totals.push(e.total)
				})
				let refundGoodsAmount = 0;
				totals.forEach(e => {
					refundGoodsAmount += e
				})
				let afRs = {
					goodsList: afShopList,
					refundGoodsAmount: refundGoodsAmount,
					refundFreightAmount: this.freightAmount,
					storeBatchOrderNo: this.storeBatchNo,
					isRefundFreight: refundGoodsAmount == this.amount ? true : false, //全退可退运费 没全退 不可退
				}
				uni.setStorageSync('afRs', afRs)
				this.goToPage('/pages/aftersale/applyRefund')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.selAfterSaleShopbg {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));

		.fixedView {
			position: fixed;
			left: 0;
			z-index: 10000;
			bottom: var(--window-bottom);
			background: #fff;
			width: calc(100% - 48rpx);
			padding: 24rpx;
			box-shadow: 0rpx 0rpx 30rpx 0rpx rgba(0, 0, 0, 0.16);

			.bts {
				margin-top: 38rpx;
				border-radius: 50rpx;
				text-align: center;
				padding: 15rpx 35rpx;
				margin-left: 20rpx;
			}
		}
	}
</style>
