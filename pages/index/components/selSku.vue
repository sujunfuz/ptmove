<template>
	<view class="selSkuObjbg" v-if="showFlag" @touchmove.stop.prevent="()=>{return false}">
		<u-popup :show="show" mode="bottom" :safeAreaInsetTop='false' :safeAreaInsetBottom='false' :round='20' closeable
			@close="colse">
			<view class="popupview">
				<view class=" flex-e">
					<image class="imgselshop" :src="selSkuObj?ImgUrl+selSkuObj.skuImgAddr:ImgUrl+defaultObj.skuImgAddr"
						mode="scaleToFill"></image>
					<view class="">
						<view class="colorMain marT10 flex-e fontbold">
							<view class="fontsize30">{{globalUnit}}</view>
							<view class="fontsize32 marL6">
								{{cartType=='DELIVERY'?defaultObj.agentPrice:selSkuObj?selSkuObj.unitPrice:defaultObj.price}}
							</view>
						</view>
						<view class="flex-c marT10">
							<view class="fontsize24 color9c">{{$t('shopDetails.yixuan2')}}：</view>
							<view class="fontsize24">{{selSkuObj.label||'-'}}</view>
						</view>
					</view>
				</view>
				<view>
					<view class="marT30" v-for="(item,indexs) in GoodsSkuAttrVO" :key='indexs'>
						<view class="fontsize30 fontbold marL10">{{item.title}}</view>
						<view class="flex-c marT20">
							<SpecItem v-for="(it,i) in item.list" @clicksku="clicksku" :diaArr="diaArr" :key="it.label"
								:dimension="dimension" :checkArr="checkArr" :sku-list="skuList" :coordinate="coordinate"
								:index1="indexs" :index2="i" :specData="it"></SpecItem>
						</view>
					</view>
				</view>
				<view class="flex-cb marT20" style="line-height: 80rpx;">
					<view class="fontbold fontsize30 ">{{$t('common.num')}}</view>
					<u-number-box v-model="num" bgColor='#fff' @change='changeNum'>
						<view slot="minus" class="minus">
							<image class="img44 iconnumberbox" :src="ossIconUrl+'/index/jian.png'" mode="scaleToFill">
							</image>
						</view>
						<view slot="plus" class="plus">
							<image class="img44 iconnumberbox" :src="ossIconUrl+'/index/jia.png'" mode="scaleToFill">
							</image>
						</view>
					</u-number-box>
				</view>
				<view class="flex-cc marT100" v-if="btsType=='addCart'">
					<view style="width: 100%;" class="minbts borderMain colorMain" @tap="$u.throttle(addCart, 1000)">
						{{$t('shopDetails.bts1')}}
					</view>
				</view>
				<view class="flex-cc marT100" v-if="btsType=='buy'" @tap="$u.throttle(createOrder, 1000)">
					<view style="width: 100%;" class="minbts borderMain bgMain colorfff">{{$t('shopDetails.bts2')}}
					</view>
				</view>
			</view>
		</u-popup>
		<noLogin :show="noLoginShow" @close='noLoginShow=false'></noLogin>
	</view>
</template>

<script>
	import indexApi from '@/api/index.js'
	import commonApi from '@/api/common.js'
	import SpecItem from './specItem.vue'
	import noLogin from '@/components/noLogin/noLogin.vue'
	export default {
		components: {
			SpecItem,
			noLogin
		},
		props: {
			show: {
				type: Boolean,
				default: () => false
			},
			btsType: {
				type: String,
				default: () => 'addCart'
			},
			defaultObj: {
				type: Object,
				default: () => {}
			},
			cartType: {
				type: String,
				default: () => '',
			},
			GoodsSkuAttrVO: {
				type: Array,
				default: () => []
			},
			skuList: {
				type: Array,
				default: () => []
			},
		},
		data() {
			return {
				diaArr: [],
				realArr: [],
				checkArr: [],
				dimension: 0,
				showFlag: false,
				skuId: '',
				selSkuObj: '',
				num: 1,
				noLoginShow: false,
			}
		},
		mounted() {
			this.dimension = this.GoodsSkuAttrVO.length
			this.GoodsSkuAttrVO.forEach(item => {
				this.diaArr.push(item.list.length)
				this.checkArr.push(-1)
			})
			this.checkArr = this.defaultObj.specCode.split(',')
			this.assignment()
			this.showFlag = true
		},
		computed: {
			//这个没用到
			coordinate() {
				let sum = 0
				for (let i = 0; i < this.dimension; i++) {
					if (this.checkArr[i] != -1) {
						if (i == 0) {
							sum += 1
						} else if (i == 1) {
							sum += 3
						} else if (i == 2) {
							sum += 5
						}
					}
				}
				return sum
			}
		},
		methods: {
			colse() {
				this.$emit('close');
			},
			//点击sku 位置
			clicksku(indexs, i) {
				// console.log(indexs)
				// console.log(i)
				// console.log(this.checkArr)
				// return
				if (this.checkArr[indexs] == i) {
					this.checkArr[indexs] = -1
				} else {
					this.checkArr[indexs] = i
				}
				this.checkArr = [...this.checkArr]
				if (this.checkArr.includes(-1)) {
					this.selSkuObj = '';
					this.skuId = '';
				} else {
					this.assignment()
				}
			},
			assignment() {
				switch (this.diaArr.length) {
					case 1:
						this.selSkuObj = this.skuList[this.checkArr[0]];
						this.skuId = this.selSkuObj.id;
						this.selSkuObj.specList = this.selSkuObj.specCode.split(',')
						this.selSkuObj.label = this.GoodsSkuAttrVO[0].list[this.selSkuObj.specList[0]].label
						break;
					case 2:
						this.selSkuObj = this.skuList[this.checkArr[0]][this.checkArr[1]];
						this.skuId = this.selSkuObj.id;
						this.selSkuObj.specList = this.selSkuObj.specCode.split(',')
						this.selSkuObj.label = this.GoodsSkuAttrVO[0].list[this.selSkuObj.specList[0]].label + ';' +
							this.GoodsSkuAttrVO[1].list[this.selSkuObj.specList[1]].label
						break;
					case 3:
						this.selSkuObj = this.skuList[this.checkArr[0]][this.checkArr[1]][this.checkArr[2]];
						this.skuId = this.selSkuObj.id;
						this.selSkuObj.specList = this.selSkuObj.specCode.split(',')
						this.selSkuObj.label = this.GoodsSkuAttrVO[0].list[this.selSkuObj.specList[0]].label + ';' +
							this
							.GoodsSkuAttrVO[1].list[this.selSkuObj.specList[1]].label + ';' + this.GoodsSkuAttrVO[2]
							.list[
								this.selSkuObj.specList[2]].label
						break;
				}
				this.selprice();
			},
			// 加入购物车
			addCart() {
				if (!uni.getStorageSync('token')) {
					this.$emit('close');
					this.noLoginShow = true;
					return
				}
				if (!this.skuId) {
					this.showMsg(this.$t('common.selectsku'))
					return
				}
				if (this.num > this.selSkuObj.realInventory) {
					this.showMsg(this.$t('shopDetails.zuiduo') + this.selSkuObj.realInventory + this.$t('common.jian'))
					return
				}
				indexApi.addCart({
					cartType: this.cartType,
					spuId: this.defaultObj.spuId,
					skuId: this.skuId,
					num: this.num
				}).then(res => {
					if (res.code == 200) {
						this.showMsg(res.msg)
					}
				})
			},
			createOrder() {
				if (!uni.getStorageSync('token')) {
					this.$emit('close');
					this.noLoginShow = true;
					return
				}
				if (!this.skuId) {
					this.showMsg(this.$t('common.selectsku'))
					return
				}
				commonApi.checkUserStatus({
					spuId:this.defaultObj.spuId,
				}).then(res => {
					if (res.code == 200) {
						let startCountList = []
						this.defaultObj.rangePriceList.forEach(e => {
							startCountList.push(e.startCount)
						})
						let min = Math.min(...startCountList);
						if (this.cartType == 'BATCH_PRODUCE' && this.num < min) {
							this.showMsg(this.$t('common.nocreat'))
							return
						}
						let obj = {
							skuId: this.skuId,
							num: this.num,
							selSkuObj: this.selSkuObj
						}
						this.selSkuObj.unitPrice = this.cartType == 'BATCH_PRODUCE' ? this.selSkuObj.unitPrice :
							this.defaultObj
							.agentPrice
						this.$emit('createOrder', obj);
					}
				})
			},
			changeNum(e) {
				this.num = e.value;
				this.selprice();
			},
			selprice() {
				let minList = [];
				let maxList = [];
				let priceList = [];
				if (this.cartType == 'BATCH_PRODUCE') {
					this.defaultObj.rangePriceList.forEach(e => {
						if (this.num >= e.startCount && this.num <= e.endCount) {
							this.selSkuObj.unitPrice = e.price
						}
						minList.push(e.startCount)
						maxList.push(e.endCount)
						priceList.push(e.price)
					})
				} else {
					this.selSkuObj.unitPrice = this.defaultObj.agentPrice
				}
				let minCount = Math.min(...minList);
				let maxCount = Math.max(...maxList);
				let minprice = Math.min(...priceList);
				let maxprice = Math.max(...priceList);
				if (this.num < minCount) {
					this.selSkuObj.unitPrice = maxprice;
				}
				if (this.num > maxCount) {
					this.selSkuObj.unitPrice = minprice;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.selSkuObjbg {
		.popupview {
			padding: 30rpx 30rpx 88rpx 30rpx;
			background-color: white;

			.imgselshop {
				width: 180rpx;
				height: 180rpx;
				border-radius: 4rpx;
				margin-right: 30rpx;
			}

			.sku1 {
				background: #F6F6F6;
				border: 2rpx solid #F6F6F6;
				padding: 10rpx 30rpx;
				border-radius: 50rpx;
				margin-right: 20rpx;
			}

			.sku2 {
				background: #F6F6F6;
				color: #9C9E9C;
				border: 2rpx solid #F6F6F6;
				padding: 10rpx 30rpx;
				border-radius: 50rpx;
				margin-right: 20rpx;
			}

			.sku3 {
				background: #FCE8E7;
				color: #E1251B;
				border: 2rpx solid #E1251B;
				padding: 10rpx 30rpx;
				border-radius: 50rpx;
				margin-right: 20rpx;
			}

		}

	}
</style>
