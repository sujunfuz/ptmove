<template>
	<view class="card_ul">
		<view class="cards" v-for="(its,indexs) in dataList" :key='indexs'>
			<view v-if="createType == 'batch'">
				<view class="fontsize32 fontbold">{{$t('common.order')}}{{indexs+1}}</view>
				<view class="flex-cb seladdress">
					<view class="flex-c">
						<image class="img60 flexnone" :src="ossIconUrl+'/index/dizhi.png'" mode="scaleToFill"></image>
						<view class="marL20">
							<view class="flex-c">
								<view>{{its.selAddress.userName}}</view>
								<view class="marL20">{{its.mobile}}</view>
							</view>
							<view class="color9c marT10 fontsize24 u-line-1">
								{{its.selAddress.province}}{{its.selAddress.city}}{{its.selAddress.area}}{{its.selAddress.address}}
							</view>
						</view>
					</view>
					<!-- <u-icon name="arrow-right" color="#9C9E9C" size="15"></u-icon> -->
				</view>
			</view>
			<!-- 店铺名称 -->
			<view v-if="type!='aftersale'" class="flex-c marT20">
				<view v-if="type=='shopcart'" style="width:50rpx;" class="flexnone">
					<image
						v-if="(!isOperate && its.ischeck == its.cusLength && its.cusLength != 0) || (isOperate && its.ischeck == its.cusLength1)"
						@click.stop="selShow(indexs,-1,-1)" class="img36" :src="ossIconUrl+'/index/xuanze1.png'"
						mode="scaleToFill">
						<image v-else-if="its.ischeck > 0" class="img36" @click.stop="selShow(indexs,-1,-1)"
							:src="ossIconUrl+'/index/xuanze3.png'" mode="scaleToFill">
						<image v-else-if="!isOperate && its.cusLength == 0 && type=='shopcart'" class="img36"
								:src="ossIconUrl+'/shopcart/disabledicon.png'" mode="scaleToFill">
							<image v-else class="img36" @click.stop="selShow(indexs,-1,-1)"
								:src="ossIconUrl+'/index/weixuanze.png'" mode="scaleToFill">
				</view>
				<view style="margin-top: -10rpx;" class="flex-c"
					@click.stop="goToPage('/pages/mine/storeDetails?merchantNo='+its.storeNo)">
					<view class="u-line-1 fontbold">{{its.storeName}}</view>
					<u-icon name="arrow-right" color="#9C9E9C" size="15"></u-icon>
				</view>
			</view>
			<!-- 各种spu -->
			<view class="marT30 cover-wrapper" v-for='(it,i) in its.spuInfoVOList' :key='i'>
				<view v-if="(!it.valid && type=='shopcart') && (!isOperate && type=='shopcart')" class="real-cover">
				</view>
				<view class="flex-c">
					<view v-if="type=='shopcart'||type=='aftersale'" style="width:50rpx;" class="flexnone">
						<image v-if=" it.ischeck == it.cusLength" @click.stop="selShow(indexs,i,-1)" class="img36"
							:src="ossIconUrl+'/index/xuanze1.png'" mode="scaleToFill">
							<image v-else-if="it.ischeck > 0" class="img36" @click.stop="selShow(indexs,i,-1)"
								:src="ossIconUrl+'/index/xuanze3.png'" mode="scaleToFill">
								<image v-else-if="!it.valid && !isOperate && type=='shopcart'" class="img36"
									:src="ossIconUrl+'/shopcart/disabledicon.png'" mode="scaleToFill">
									<image v-else class="img36" @click.stop="selShow(indexs,i,-1)"
										:src="ossIconUrl+'/index/weixuanze.png'" mode="scaleToFill">
					</view>
					<view class="flex" @click.stop="goToPage('/pages/index/shopDetails?id='+it.spuId)">
						<view class="img-wrapper">
							<view class="img-shadow" v-if="!it.valid && type=='shopcart'">
								<image class="disabled-img" :src="ossIconUrl+'/shopcart/jinyong.png'"
									mode="scaleToFill"></image>
							</view>
							<image class="img180 flexnone" :src="ImgUrl+it.spuImage" mode="scaleToFill"></image>
						</view>
						<view class="marL20">
							<view class="u-line-1 fontbold fontsize28">{{it.spuName}}</view>
							<!-- <view v-for="(it1,i1) in 1" :key='i1' class="label">
								少貨必賠
							</view> -->
							<view v-if="!it.valid" class="fontsize24 marT10" style="color:#9C9E9C">{{it.status}}</view>
						</view>
					</view>
				</view>
				<!-- 各种sku -->
				<view
					v-if="((!it.more && i2 < skuLength) || it.more) && ((it.valid && type=='shopcart') || type != 'shopcart')"
					v-for="(it2,i2) in it.skuInfoVOList" :key='i2' class="sku_li flex-c">
					<view v-if="type=='shopcart'||type=='aftersale'" style="width:50rpx;" class="flexnone">
						<image v-if="it2.ischeck == it2.cusLength" @click.stop="selShow(indexs,i,i2)" class="img36"
							:src="ossIconUrl+'/index/xuanze1.png'" mode="scaleToFill">
							<image v-else class="img36" @click.stop="selShow(indexs,i,i2)"
								:src="ossIconUrl+'/index/weixuanze.png'" mode="scaleToFill">
					</view>
					<view class="flex-cb real-sku"
						:class="type=='shopcart'||type=='aftersale'?'widthtype1':'widthtype2'">
						<view>
							<view class="color9c">{{it2.skuIndexesVal||it2.ownSpec}}</view>
							<view class="flex marT6 fontsize24">
								<view class="colorMain fontsize24">{{globalUnit}}{{it2.unitPrice}}</view>
								<view class="marL10 color9c fontsize24">
									{{$t('common.heji')}}{{globalUnit}}{{fomatFloat(it2.totalPrice||it2.total,2)}}
								</view>
							</view>
						</view>
						<view v-if="type=='shopcart'||type=='aftersale'" class="flex-cc">
							<image class="img44" :src="ossIconUrl+'/index/jian2.png'" mode="scaleToFill"
								@click="changeNumber('jian',it2,indexs,i,i2)"></image>
							<view style='width: 80rpx;'
								v-if=" (indexs != objIndex.indexs || i != objIndex.i || i2 != objIndex.i2)">
								<u--input type='number' border="none" inputAlign='center' :value="it2.num"
									@blur="(e) => { changeNumber('none',it2,indexs,i,i2,e) }"></u--input>
							</view>
							<image class="img44" :src="ossIconUrl+'/index/jia2.png'" mode="scaleToFill"
								@click="changeNumber('jia',it2,indexs,i,i2)"></image>
						</view>
						<view v-else class="number">×{{it2.num}}</view>
					</view>
				</view>
				<view v-if="it.skuInfoVOList.length>skuLength" @click="changeFoldFlag(indexs,i,it)"
					class="flex-cc marT20">
					<view class="fontsize24 colorblue marR10">
						{{$t('common.gong')}}{{it.skuInfoVOList.length}}{{$t('common.zhong')}}
					</view>
					<u-icon v-if="it.more" name="arrow-up" color="#005DFF" size="15"></u-icon>
					<u-icon v-else name="arrow-down" color="#005DFF" size="15"></u-icon>
				</view>
			</view>
			<block v-if="type=='create'">
				<view class="flex-cb marT30">
					<view>{{$t('createOrder.hpze')}}</view>
					<view class="fontbold">{{globalUnit}}{{fomatFloat(its.storeAmount,2)}}</view>
				</view>
				<view class="flex-cb marT30" v-if="its.discountAmount>0">
					<view>{{$t('createOrder.dpyh')}}</view>
					<view class="fontbold colorMain">{{globalUnit}}{{fomatFloat(its.discountAmount,2)}}</view>
				</view>
				<view class="flex-cb marT30">
					<view>{{$t('createOrder.yunfei')}}</view>
					<view class="flex-c">
						<view class=" colorblue marR10" @tap="freightshow=true">{{$t('createOrder.yunfeitips')}}</view>
						<view class="fontbold marL20">{{globalUnit}}{{fomatFloat(its.storeFreightAmout,2)}}</view>
					</view>
				</view>
				<view class="flex-cb marT30">
					<view>{{$t('createOrder.remark')}}</view>
					<view style='width: 520rpx;'>
						<u--input inputAlign='right' :placeholder="$t('createOrder.remarktips')" border="none"
							@change="changeComment(its,indexs)" v-model="its.remark"></u--input>
					</view>
				</view>
			</block>
			<view v-if="type=='order'">
				<view class="flex-cb marT30">
					<view>{{$t('createOrder.shoptype')}}</view>
					<view>{{orderObj.spuNum}}{{$t('common.zhong')}}</view>
				</view>
				<view class="flex-cb marT30">
					<view>{{$t('createOrder.shoptotal')}}</view>
					<view>{{orderObj.skuNum}}{{$t('common.jian')}}</view>
				</view>
				<view class="flex-cb marT30">
					<view>{{$t('createOrder.shopprice')}}</view>
					<view>{{globalUnit}}{{orderObj.skuAmount}}</view>
				</view>
				<view class="flex-cb marT30">
					<view>{{$t('createOrder.yunfei')}}</view>
					<view class="flex-c">
						<view class=" colorblue marR10" @tap="freightshow=true">{{$t('createOrder.yunfeitips')}}</view>
						<view class="fontbold marL20">{{globalUnit}}{{orderObj.freightAmount}}</view>
					</view>
				</view>
				<view class="flex-cb marT30" v-if="orderObj.discountAmount>0">
					<view>{{$t('createOrder.youhuis')}}</view>
					<view class="fontbold colorMain">-{{globalUnit}}{{orderObj.discountAmount}}</view>
				</view>
				<view class="flex-cb marT30">
					<view>{{$t('createOrder.remark')}}</view>
					<view style="width: 468rpx;" class="textR">{{orderObj.remark||'-'}}</view>
				</view>
				<view class="flex-cb marT30">
					<view>{{$t('createOrder.shifu')}}</view>
					<view class="fontbold fontsize36 colorMain">{{globalUnit}}{{orderObj.realAmount}}</view>
				</view>
			</view>
		</view>
		<freight :show="freightshow" @close='freightshow=false'></freight>
	</view>
</template>

<script>
	import freight from '@/components/freight/freight.vue'
	export default {
		components: {
			freight,
		},
		props: {
			dataList: {
				type: Array,
				default: () => []
			},
			// create下单  order订单详情  shopcart 购物车  aftersale 售后选择
			type: {
				type: String,
				default: () => 'create'
			},
			//create中的批量下单 样式不对 
			createType: {
				type: String,
				default: () => ''
			},
			orderObj: {
				type: Object,
				default: () => {}
			},
			objIndex: {
				type: Object,
				default: () => {}
			},
			skuLength: {
				type: Number,
				default: () => 10
			},
			isOperate: {
				type: Boolean,
				default: false
			},
		},
		created() {},
		data() {
			return {
				freightshow: false,
				timer: null,
				orderRs: uni.getStorageSync('orderRs')
			}
		},
		methods: {
			changeFoldFlag(indexs, i, it) {
				let e = {
					indexs: indexs,
					i: i,
					it: it,
				}
				this.$emit('changeFoldFlag', e)
			},
			selShow(indexs, i, i2) {
				let obj = {
					indexs: indexs,
					i: i,
					i2: i2,
					type: i2 == -1 && i == -1 ? 1 : i2 == -1 && i != -1 ? 2 : 3
				}
				this.$emit('changeIscheck', obj);
			},
			changeNumber(type, item, indexs, i, i2, val = -1) {
				clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					if (val == -1) {
						this.$emit('changeNum', type, item, indexs, i, i2);
					} else {
						this.$emit('changeNum', type, item, indexs, i, i2, val);
					}
				}, 200)
			},
			changeComment(its, indexs) {
				this.$emit('changeComment', its, indexs)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.img-wrapper {
		position: relative;

		.img-shadow {
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			z-index: 10;
			top: 0rpx;
			bottom: 0rpx;
			left: 0rpx;
			right: 0rpx;
			background-color: rgba(0, 0, 0, 0.3);

			.disabled-img {
				width: 60rpx;
				height: 60rpx;
			}
		}
	}

	.cover-wrapper {
		position: relative;

		.real-cover {
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			z-index: 600;
			background-color: transparent;
			top: 0rpx;
			bottom: 0rpx;
			left: 0rpx;
			right: 0rpx;
			text-align: center;
			line-height: 100rpx;
			border-radius: 4rpx;
		}
	}

	.card_ul {
		// background: #fff;
		// padding: 1rpx 20rpx 20rpx 20rpx;
		border-radius: 20rpx;
		margin-top: 20rpx;

		.cards {
			margin-top: 20rpx;
			background-color: white;
			padding: 20rpx;
			border-radius: 10rpx;

			.seladdress {
				border-bottom: 1rpx solid #E9E9E9;
				border-top: 1rpx solid #E9E9E9;
				padding: 20rpx 0;
				margin: 20rpx 0;
			}

			.widthtype1 {
				width: calc(100% - 50rpx);
			}

			.widthtype2 {
				width: 100%;
			}

			.label {
				border-radius: 8rpx;
				border: 2rpx solid #C5C5C5;
				color: #C5C5C5;
				padding: 4rpx 10rpx;
				margin: 10rpx 20rpx 0 0;
				display: inline-block;
				font-size: 24rpx;
			}

			.sku_li {
				// background: #F6F6F6;
				// padding: 20rpx;
				border-radius: 4rpx;
				margin-top: 20rpx;

				.number {
					background: #fff;
					border-radius: 4rpx;
					padding: 12rpx 33rpx;
					text-align: center;
				}

				.real-sku {
					background: #F6F6F6;
					padding: 20rpx 20rpx 20rpx 18rpx;
					border-radius: 4rpx;
				}
			}
		}

		.cards:first-child {
			margin-top: 0rpx;
		}
	}
</style>
