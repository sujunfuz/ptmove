<template>
	<view class="shopDetailsbg" v-if='rsStatus'>
		<u-navbar leftIconColor='#fff' :title="$t('shopDetails.title')" :titleStyle='{"color":"#fff"}'
			:placeholder='true' bgColor="#E1251B" fixed="" @leftClick="leftClick"></u-navbar>
		<shopInfo :rs='rs' @changetab='changetab' @changeInfo='goodsDetail' :cartType='cartType' :tabs='tabs'
			@openLoginShow='noLoginShow=true'>
		</shopInfo>
		<view style="padding-bottom: 138rpx;">
			<recommendShop :dataList='dataList'></recommendShop>
			<view style="padding: 20rpx 0;">
				<u-loadmore :status="status" :loadingText="$t('common.loading')" :nomoreText="$t('common.nomore1')" />
			</view>
		</view>
		<view class="footer flex-cb">
			<view style="width: 80rpx;" class="textC flexnone" @tap="skuInventoryList()">
				<image class="img30" :src="ossIconUrl+'/index/qingdang.png'" mode="scaleToFill"></image>
				<view class="fontsize20">{{$t('shopDetails.yixuan')}}</view>
			</view>
			<view style="width: 60rpx;" class="textC marL32 flexnone" @tap="goshopcart">
				<image class="img30" :src="ossIconUrl+'/index/shopcard.png'" mode="scaleToFill"></image>
				<view class="fontsize20">{{$t('shopcart.title')}}</view>
			</view>
			<view style="width: 40rpx;" class="textC marL32 flexnone" @tap="openHotline">
				<image class="img30" :src="ossIconUrl+'/index/imgkefu.png'" mode="scaleToFill"></image>
				<view class="fontsize20">{{$t('shopDetails.kefu')}}</view>
			</view>
			<view style="width: 200rpx;" class="minbts borderMain colorMain marL30" @click="openSku('addCart')">
				{{$t('shopDetails.bts1')}}
			</view>
			<view style="width: 200rpx;" class="minbts bgMain colorfff marL20" @click="openSku('buy')">
				{{$t('shopDetails.bts2')}}
			</view>
		</view>
		<hotline :show="hotlineShow" @close='hotlineShow=false' :hotline="rs.store && rs.store.cusTel"></hotline>
		<selSku v-if="skuShow" :GoodsSkuAttrVO='GoodsSkuAttrVO' :skuList='skuList' :show="skuShow" :btsType='btsType'
			:cartType='cartType' :defaultObj='rs.defaultObj' @close='skuShow=false' @createOrder='createOrder'></selSku>
		<selInventory :show="inventoryShow" :GoodsSkuAttrVO='GoodsSkuAttrVO' :dataList='InventoryList'
			@close='inventoryShow=false' @edit='editInventory' @cartBilling='cartBilling'></selInventory>
		<noLogin :show="noLoginShow" @close='noLoginShow=false'></noLogin>
	</view>
</template>

<script>
	import indexApi from '@/api/index.js'
	import shopcartApi from '@/api/shopcart.js'
	import commonApi from '@/api/common.js'
	import shopInfo from './components/shopInfo.vue'
	import selSku from './components/selSku.vue'
	import selInventory from './components/selInventory.vue'
	import recommendShop from '@/components/recommendShop/recommendShop.vue'
	import hotline from '@/components/hotline/hotline.vue'
	import noLogin from '@/components/noLogin/noLogin.vue'
	export default {
		components: {
			shopInfo,
			selSku,
			selInventory,
			recommendShop,
			hotline,
			noLogin
		},
		data() {
			return {
				tabs: [{
						label: "shopDetails.tab1",
						value: "BATCH_PRODUCE",
					},
					{
						label: "shopDetails.tab2",
						value: "DELIVERY",
					},
				],
				cartType: "BATCH_PRODUCE",//设置批发
				rsStatus: false,
				goodsId: '',
				rs: {},
				hotlineShow: false,
				skuShow: false, //sku弹窗
				btsType: 'addCart', // addCart 加入购物车  buy 立即下单
				inventoryShow: false, //已选清单
				skuList: [],
				GoodsSkuAttrVO: [],
				currentPage: 1, //分页1
				pageSize: 10, //每页10条
				dataList: [], //表格数据
				status: 'loading', //状态
				InventoryList: [],
				noLoginShow: false,
				isbuy: false, //是否直接弹起立即订购
				isaddcart: false, //是否唤起加入购物车
				isball: false //判断是否要弹
			}
		},
		onLoad(e) {
			uni.setStorageSync('cartType', this.cartType) //设置批发
			if (e.id) {
				this.goodsId = e.id;
			}
			if (e.isbuy) {
				this.isbuy = e.isbuy;
				this.isball = true;
			}

			if (e.isaddcart) {
				this.isaddcart = e.isaddcart;
				this.isball = true;
			}
			this.goodsDetail();
			this.goodsShowRecommend(); // 好物推荐
		},
		methods: {
			changetab(e) {
				this.cartType = e;
				uni.setStorageSync('cartType', e)
			},
			//商品详情
			goodsDetail() {
				indexApi.goodsDetail({
					goodsId: this.goodsId,
				}).then(res => {
					if (res.code == 200) {
						let str = res.data;
						let swiperList = [];
						str.swipers = res.data.descriptionImgAddr.split(',');
						str.swipers.forEach(e => {
							swiperList.push(this.ImgUrl + e)
						})
						str.swiperList = swiperList;
						str.defaultSkuDetail.rangePriceList = JSON.parse(str.defaultSkuDetail.rangePrice)
						str.spuDetail.goodsDetailHtml = this.richTextImg(str.spuDetail.goodsDetail)
						this.rs = str
						this.getdefaultSkuDetail()
						this.goodsSkuInventory()
					}
				})
			},
			//处理默认数据
			getdefaultSkuDetail() {
				let startprice = this.rs.defaultSkuDetail.rangePriceList[0].price
				let endprice = this.rs.defaultSkuDetail.rangePriceList[this.rs.defaultSkuDetail.rangePriceList
					.length - 1].price;
				let rangePrice = startprice < endprice ? startprice + '-' + endprice : endprice + '-' +
					startprice;
				let price = startprice == endprice ? startprice : rangePrice;
				this.rs.defaultObj = {
					specCode: this.rs.defaultSkuDetail.specCode,
					spuId: this.goodsId,
					skuImgAddr: this.rs.swipers[0] || '',
					price: price,
					rangePriceList: this.rs.defaultSkuDetail.rangePriceList,
					agentPrice: this.rs.defaultSkuDetail.agentPrice
				}
			},
			goodsSkuInventory() {
				indexApi.goodsSkuInventory({
					spuId: this.goodsId,
				}).then(res => {
					this.GoodsSkuAttrVO = res.data.GoodsSkuAttrVO;
					this.skuList = res.data.skuList;
					this.rsStatus = true;
					if (this.isbuy && this.isball) {
						this.isball = false;
						this.openSku('buy')
					}
					if (this.isaddcart && this.isball) {
						this.isball = false;
						this.openSku('addCart')
					}
				})
			},
			//商品推荐   新品上架1   首页商品推荐2  商品详情推荐3    我的页面推荐4 
			goodsShowRecommend() {
				commonApi.goodsShowRecommend({
					refId: 3,
					pageSize: this.pageSize,
					currentPage: this.currentPage,
				}).then(res => {
					if (res.code == 200) {
						let resOrderList = res.data.list;
						resOrderList.forEach(e => {
							e.imgList = e.descriptionImgAddr.split(',')
						})
						this.dataList = this.dataList.concat(resOrderList);
						this.total = res.data.total;
						if (resOrderList.length < this.pageSize) {
							this.status = 'nomore';
						}
					}
				})
			},
			// 立即订购
			createOrder(e) {
				let skuInfoVOList = []
				skuInfoVOList.push({
					skuId: e.skuId,
					num: e.num,
					unitPrice: e.selSkuObj.unitPrice,
					totalPrice: e.selSkuObj.unitPrice * e.num,
					skuIndexesVal: e.selSkuObj.label,
				});
				let spuInfoVOList = []
				spuInfoVOList.push({
					skuInfoVOList: skuInfoVOList,
					spuName: this.rs.name,
					spuImage: this.substringIndexOf(e.selSkuObj.skuImgAddr),
					spuId: this.goodsId
				})
				let dataList = []
				dataList.push({
					storeId: this.rs.store.id,
					storeNo: this.rs.storeNo,
					storeName: this.rs.store.storeName,
					storeFreightAmout: 0,
					storeAmount: e.selSkuObj.unitPrice * e.num,
					spuInfoVOList: spuInfoVOList,
				})
				let orderRs = {};
				orderRs.dataList = dataList;
				orderRs.createType = 'details';
				orderRs.type = uni.getStorageSync('cartType');
				uni.setStorageSync('orderRs', orderRs)
				this.goToPage('/pages/index/createOrder')
			},
			// 已选清单
			skuInventoryList() {
				if (!uni.getStorageSync('token')) {
					this.noLoginShow = true;
					return
				}
				indexApi.skuInventoryList({
					type: uni.getStorageSync('cartType'),
					spuId: this.goodsId,
					storeId: this.rs.store.id
				}).then(res => {
					if (res.code == 200) {
						this.InventoryList = res.data;
						this.inventoryShow = true
					}
				})
			},
			//编辑已选清单
			editInventory(e) {
				shopcartApi.editcart({
					id: e.cartId,
					num: e.type == 'del' ? 0 : e.num,
					cartType: uni.getStorageSync('cartType'),
					storeNo: this.rs.storeNo
				}).then(res => {
					if (res.code == 200) {
						// this.showMsg(res.msg)
						this.skuInventoryList()
					}
				})
			},
			//已选清单确认
			cartBilling() {
				let cartIds = []
				this.InventoryList.forEach(e => {
					cartIds.push(e.cartId)
				})
				shopcartApi.cartBilling({
					cartIds: cartIds,
					cartType: uni.getStorageSync('cartType'),
				}).then(res => {
					if (res.code == 200) {
						let orderRs = res.data;
						orderRs.createType = 'shopcart';
						orderRs.cartIds = cartIds;
						uni.setStorageSync('orderRs', orderRs)
						this.goToPage('/pages/index/createOrder')
					}
				})
			},
			goshopcart() {
				if (!uni.getStorageSync('token')) {
					this.noLoginShow = true;
					return
				}
				this.goToSw('/pages/tabbar/shopcart')
			},
			openSku(type) {
				if (!uni.getStorageSync('token')) {
					this.noLoginShow = true;
					return
				}
				this.getdefaultSkuDetail();
				this.btsType = type;
				this.skuShow = true
			},
			openHotline() {
				if (this.rs?.store?.cusTel) {
					this.hotlineShow = true
				} else {
					this.showMsg(this.$t('common.noTelNumber'))
				}
			}

		},
		onReachBottom() {
			if (this.status == 'nomore') {
				return;
			}
			this.currentPage++;
			this.goodsShowRecommend();
		},
	}
</script>

<style lang="scss" scoped>
	.shopDetailsbg {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));

		.footer {
			width: calc(100% - 48rpx);
			background: #fff;
			padding: 24rpx;
			position: fixed;
			bottom: 0;
			left: 0;
		}
	}
</style>
