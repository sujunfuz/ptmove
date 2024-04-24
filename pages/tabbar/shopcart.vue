<template>
	<view class="shopcartbg">
		<u-navbar leftIcon=' ' leftIconColor='#fff' :leftText="$t(isOperate?'common.complete':'common.manage')"
			:title="$t('shopcart.title')" :titleStyle='{"color":"#fff"}' :placeholder='true' bgColor="#E1251B" fixed=""
			@leftClick="leftClick">
		</u-navbar>
		<view class="fixed-top">
			<u-sticky bgColor="#fff" customNavHeight='160'>
				<u-tabs :scrollable="false" lineColor="#EB1818" :activeStyle="activeStyle"
					:inactiveStyle='inactiveStyle' :current="current" :list="tabsList" @click="clickTab"></u-tabs>
			</u-sticky>
		</view>
		<view class="pad20 contentview">
			<shopOrderCards :isOperate="isOperate" :objIndex="objIndex" v-if="dataList.length>0" :dataList='dataList'
				:type="'shopcart'" @changeIscheck='changeIscheck' @changeNum='changeNum'
				@changeFoldFlag="changeFoldFlag" :skuLength='skuLength'></shopOrderCards>
			<view style="padding: 20rpx 0;">
				<u-loadmore :status="'nomore'" :loadingText="$t('common.loading')" :nomoreText="$t('common.nomore1')" />
			</view>
		</view>

		<view class="fixedView flex-cb">
			<view class="flexnone flex-c" @click="selectAll">
				<image v-if="((!isOperate && num == cusLength) || (isOperate && num == cusLength1)) && cusLength1 != 0 "
					class="img36" :src="ossIconUrl+'/index/xuanze1.png'" mode="scaleToFill" />
				<image v-else-if="num > 0" class="img36" :src="ossIconUrl+'/index/xuanze3.png'" mode="scaleToFill" />
				<image v-else class="img36" :src="ossIconUrl+'/index/weixuanze.png'" mode="scaleToFill">
					<view class="marL10 color9c">{{$t('shopcart.all')}}</view>
			</view>
			<view v-if="isOperate" class="flex-c">
				<view class="btn1" @click="addCollect">移入收藏夹</view>
				<view class="btn2" @click="deleteShopCart">删除</view>
			</view>
			<view v-else class="flex">
				<view>
					<view class="flex-c">
						<view class="flexnone">{{$t('common.heji')}}：</view>
						<view class="fontsize32 colorMain">{{globalUnit}}{{fomatFloat(totalPrice,2)}}</view>
					</view>
					<view class="flex-je fontsize24 color999">
						<view>{{$t('shopDetails.yixuan2')}}</view>
						<view class="colorMain">{{totalNum}}</view>
						<view>{{$t('shopcart.jian')}}</view>
					</view>
				</view>
				<view class="bts bgMain colorfff fontbold fontsize30 " @tap="immediatePayment">{{$t('common.payment')}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import shopcartApi from '@/api/shopcart.js'
	import shopOrderCards from '@/components/shopOrderCards/shopOrderCards.vue'
	import formItem from '../../uni_modules/uview-ui/libs/config/props/formItem'
	export default {
		components: {
			shopOrderCards,
		},
		data() {
			return {
				isOperate: false,
				objIndex: {
					indexs: -1,
					i: -1,
					i2: -1
				},
				cusLength: 0,//记录sku个数,不包括禁用的
				cusLength1: 0,//记录sku个数，包括禁用的
				num: 0,//记录已经勾选的sku个数
				cartIds: [],
				totalPrice: 0,
				totalNum: 0,
				activeStyle: {
					color: '#E1251B'
				},
				inactiveStyle: {
					color: '#1A1A1A'
				},
				tabsList: [{
						name: this.$t("shopDetails.tab1"),
						value: "BATCH_PRODUCE",
					},
					{
						name: this.$t("shopDetails.tab2"),
						value: "DELIVERY",
					}
				],
				cartType: 'BATCH_PRODUCE',
				current: 0,
				dataList: [],
				currentPage: 1, //分页1
				pageSize: 10, //每页10条
				status: 'loading', //状态
				skuLength: 10, //sku个数展开隐藏
			}
		},
		onShow() {
			//进来先调用获取购物测接口
			this.cartList();
		},
		methods: {
			//移入收藏夹
			addCollect() {
				shopcartApi.addCollect({
					cartType: this.cartType,
					ids: [...this.cartIds]
				}).then(res => {
					if (res.code == 200) {
						this.cartList()
						this.showMsg(this.$t('common.operateSuccess'))
					}
				})
			},
			//删除购物车
			deleteShopCart() {
				// console.log(this.cartIds)
				shopcartApi.delcart({
					ids: this.cartIds,
					cartType: this.cartType
				}).then(res => {
					if (res.code == 200) {
						this.cartList()
						this.showMsg(this.$t('common.delSuccess'))
					}
				})
			},
			//立即支付按钮
			immediatePayment() {
				// console.log(this.cartIds)
				// return
				if (this.cartIds.length == 0) {
					this.showMsg(this.$t('shopcart.gouxuan'))
					return
				}
				shopcartApi.cartBilling({
					cartIds: this.cartIds,
					cartType: this.cartType,
					userNo: this.userInfo.userNo
				}).then(res => {
					if (res.code == 200) {
						let orderRs = res.data;
						orderRs.createType = 'shopcart';
						orderRs.cartIds = this.cartIds;
						uni.setStorageSync('orderRs', orderRs)
						this.goToPage('/pages/index/createOrder')
					}
				})
			},
			//切换管理和购物车
			leftClick() {
				this.isOperate = !this.isOperate;
				if (!this.isOperate) {
					//从管理切换到购物车，去除掉不可选中的sku
					for (let a of this.dataList) {
						for (let b of a.spuInfoVOList) {

							if (!b.valid) {
								a.ischeck -= b.ischeck
								this.num -= b.ischeck
								b.ischeck = 0
								for (let c of b.skuInfoVOList) {
									c.ischeck = 0
								}
							}
						}
					}
				}
				this.countAllData()
			},
			//切换批发还是代发
			clickTab(e) {
				this.cartType = e.value;
				this.cartList();
			},
			//改变折叠
			changeFoldFlag(e) {
				this.dataList[e.indexs].spuInfoVOList[e.i].more = !this.dataList[e.indexs].spuInfoVOList[e.i].more;
			},
			// 全选
			selectAll() {
				//这个判断代表没有任何的sku
				if (this.cusLength1 == 0) {
					return
				}
				//已经全选了sku则全部去除
				if ((this.num == this.cusLength && !this.isOperate) || (this.num == this.cusLength1 && this.isOperate)) {
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
				} else { //部分选了或没选则全选
					//如果是管理则用cusLength1，否则用cusLength
					this.num = this.isOperate ? this.cusLength1 : this.cusLength
					this.dataList.forEach(i => {
						i.ischeck = this.isOperate ? i.cusLength1 : i.cusLength
						i.spuInfoVOList.forEach(j => {
							if (j.valid && !this.isOperate) {
								j.ischeck = j.cusLength
								j.skuInfoVOList.forEach(k => {
									k.ischeck = k.cusLength
								})
							} else if(this.isOperate){
								j.ischeck = j.cusLength1
								j.skuInfoVOList.forEach(k => {
									k.ischeck = k.cusLength1
								})
							}

						})
					})
				}

				this.dataList = [...this.dataList]
				this.countAllData()
			},
			//购物车列表
			cartList() {
				if (!uni.getStorageSync('token')) {
					this.showMsg(this.$t('cpnoLogin.text2'))
					return
				}
				let that = this
				shopcartApi.cartList({
					currentPage: 1,
					pageSize: 100,
					cartType: this.cartType
				}).then(res => {
					if (res.code == 200) {
						this.num = 0
						this.cusLength = 0
						this.cusLength1 = 0
						res.data.list.forEach(e => {
							e.cusLength = 0
							e.ischeck = 0 //等同于num，代表店铺下面已选择的sku数量
							e.cusLength1 = 0
							e.spuInfoVOList.forEach(i => {
								let valid = i.valid
								i.cusLength = i.skuInfoVOList.length
								i.cusLength1 = i.skuInfoVOList.length
								if (i.cusLength > this.skuLength) {
									i.more = false;
								} else {
									i.more = true;
								}
								i.ischeck = 0 //等同于num，代表spu下面已选择的sku数量
								i.skuInfoVOList.forEach(j => {
									if (valid) {
										this.cusLength++
										e.cusLength++
									}
									this.cusLength1++
									e.cusLength1++
									j.cusLength = 1
									j.cusLength1 = 1
									j.ischeck = 0
									j.oldNum = j.num
									if (valid) { //如果商品是正常上架状态，计算价格
										j.rangePrice = JSON.parse(j.rangePrice)
										//如果是批发取区间价格，代发取代发价格
										j.totalPrice = this.cartType == 'BATCH_PRODUCE' ?
											this.coutBatchPrice(j) : j.num * j.price
										//j.totalPrice是这个sku的总价格
										if (this.cartType != 'BATCH_PRODUCE') {
											j.unitPrice = j.price
										}
									} else {
										j.rangePrice = [{
											startCount: 1,
											endCount: 10,
											price: 0
										}]
										j.totalPrice = 0
										j.unitPrice = 0
									}

								})
							})
						})
						this.dataList = res.data.list
						this.countAllData()
					}
				})
			},
			//计算批发价格
			coutBatchPrice(j) {
				for (let item of j.rangePrice) {
					if (item.endCount >= j.num) {
						j.unitPrice = item.price
						return j.num * item.price
					}
				}
				j.unitPrice = j.rangePrice[j.rangePrice.length - 1].price
				return j.num * j.rangePrice[j.rangePrice.length - 1].price
			},
			//点击圆圈
			changeIscheck(e) {
				switch (e.type) {
					case 1:
						this.changeSelect(1, e)
						break;
					case 2:
						this.changeSelect(2, e)
						break;
					case 3:
						this.changeSelect(3, e)
						break;
				}
				this.countAllData()
			},
			changeSelect(type, e) {
				//1点击店铺，2是商品，3是sku
				if (type == 1) {
					//all代表全选，none代表不选
					let val = ''
					//gap是判断店铺是否是已经全选了
					let gap = this.isOperate ? this.dataList[e.indexs].cusLength1 - this.dataList[e.indexs].ischeck : this
						.dataList[e.indexs].cusLength - this.dataList[e.indexs].ischeck
					if (gap > 0) {
						//不是全选，选择的数量加上
						this.num += gap
						this.dataList[e.indexs].ischeck = this.isOperate ? this.dataList[e.indexs].cusLength1 : this
							.dataList[e.indexs].cusLength
						val = 'all'
					} else {
						this.num -= this.dataList[e.indexs].ischeck
						this.dataList[e.indexs].ischeck = 0
						val = 'none'
					}
					//遍历店铺下面的spu赋值上值
					for (let item of this.dataList[e.indexs].spuInfoVOList) {
						if (val == 'all' && (item.valid || this.isOperate)) {
							item.ischeck = item.cusLength
						} else {
							item.ischeck = 0
						}
						for (let aitem of item.skuInfoVOList) {
							if (val == 'all' && (item.valid || this.isOperate)) {
								aitem.ischeck = 1
							} else {
								aitem.ischeck = 0
							}
						}
					}
				} else if (type == 2) {
					let val = ''
					if (this.dataList[e.indexs].spuInfoVOList[e.i].ischeck == this.dataList[e.indexs].spuInfoVOList[e.i]
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
				} else if (type == 3) {
					let val = 0
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
				}
				this.dataList = [...this.dataList]
			},
			//计算全部数据，所选择skuId，选择总数、总共价格
			countAllData() {
				let arr = []
				let totalPrice = 0
				let totalNum = 0
				this.dataList.forEach(i => {
					i.spuInfoVOList.forEach(j => {
						j.skuInfoVOList.forEach(k => {
							k.totalPrice = this.cartType == 'BATCH_PRODUCE' ? this.coutBatchPrice(
								k) : k.num * k.price
							if (this.cartType != 'BATCH_PRODUCE') {
								j.unitPrice = j.price
							}
							if (k.ischeck == 1) {
								totalNum += k.num
								totalPrice += k.totalPrice
								arr.push(k.id)
							}
						})
					})
				})
				this.cartIds = arr
				this.totalPrice = totalPrice
				this.totalNum = totalNum
			},
			//改变购物车某个sku所选择的数量
			changeNum(type, e, indexs, i, i2, val = -1) {
				val = parseInt(val)
				switch (type) {
					case 'jian':
						if (e.num == 1) {
							this.showMsg(this.$t('common.minnum'))
							return
						}
						e.num = e.num - 1
						break;
					case 'jia':
						e.num = e.num + 1
						break;
					case 'none':
						break;
				}
				if (val != -1) {
					if (val == e.num) {
						return
					}
					if (val == 0) {
						this.showMsg(this.$t('common.minnum'))
						this.dataList[indexs].spuInfoVOList[i].skuInfoVOList[i2].num = e.oldNum
						e.num = e.oldNum
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
						return
					}
					e.num = val
				}
				uni.showLoading({
					title: 'loading...'
				})
				shopcartApi.editcart({
					id: e.id,
					num: e.num,
					cartType: this.cartType,
					storeNo: this.dataList[indexs].storeNo
				}).then(res => {
					uni.hideLoading()
					if (res.code == 200) {
						this.dataList[indexs].spuInfoVOList[i].skuInfoVOList[i2].num = e.num
						this.dataList[indexs].spuInfoVOList[i].skuInfoVOList[i2].oldNum = e.num
						e.oldNum = e.num
					} else {
						this.dataList[indexs].spuInfoVOList[i].skuInfoVOList[i2].num = e.oldNum
						e.num = e.oldNum
						this.showMsg(this.$t('shopcart.nokucun'))
					}
					if (val != -1) {
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
					}
					this.dataList = [...this.dataList]
					this.countAllData()
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.shopcartbg {

		width: 100%;
		min-height: calc(100vh - var(--window-bottom));

		.contentview {
			padding-top: 88rpx;
			padding-bottom: 138rpx;
		}

		.fixedView {
			position: fixed;
			left: 0;
			z-index: 600;
			bottom: var(--window-bottom);
			background: #fff;
			width: calc(100% - 48rpx);
			padding: 24rpx;
			box-shadow: 0rpx 0rpx 30rpx 0rpx rgba(0, 0, 0, 0.16);

			.bts {
				width: 200rpx;
				height: 70rpx;
				border-radius: 70rpx;
				text-align: center;
				line-height: 70rpx;
				// padding: 15rpx 35rpx;
				margin-left: 20rpx;

			}
		}
	}

	.btn1 {
		box-sizing: border-box;
		width: 200rpx;
		height: 70rpx;
		background: white;
		border-radius: 70rpx;
		border: 1rpx solid #E02A23;
		font-size: 28rpx;
		font-weight: 500;
		color: #E1251B;
		text-align: center;
		line-height: 70rpx;
	}

	.btn2 {
		margin-left: 20rpx;
		width: 200rpx;
		height: 70rpx;
		background: #E1251B;
		border-radius: 70rpx;
		font-size: 28rpx;
		font-weight: 500;
		color: #FFFFFF;
		text-align: center;
		line-height: 70rpx;
	}
</style>
