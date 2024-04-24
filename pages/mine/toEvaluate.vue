<template>
	<view class="toEvaluatebg pad20">
		<u-navbar leftIconColor="#fff" :title="$t('toEvaluate.title')" :titleStyle="{ color: '#fff' }"
			:placeholder="true" bgColor="#E1251B" fixed="" @leftClick="leftClick"></u-navbar>
		<view class="bgfff bdRadius20 main-wrapper marAuto pad20">
			<view class="title-tips padB20">
				<view>{{$t('toEvaluate.orderNum')}}：{{rs.storeBatchNo}}</view>
				<view class="marT20 fontsize24 color9c9e9c">{{$t("toEvaluate.orderTime")}}：{{rs.createTime}}</view>
			</view>
			<view class="list-wrapper marB30">
				<view class="" v-for="(item,index) in rs.goodsInfoVOS" :key="index">
					<view class="marT20 flex-c">
						<image :src="ImgUrl+item.spuImage" mode="aspectFill"
							class="marR20 bdRadius20 image-class marB20">
						</image>
						<view class="">
							<view class="title fontsize28 fontbold u-line-2">
								{{item.spuName}}
							</view>
							<view class="sku marT20 color6e fontsize28">
								{{item.skuIndexesVal}}
							</view>
						</view>
					</view>
					<!-- 商品评分 -->
					<view class="flex-c">
						<text class="fontbold marR20">{{$t("toEvaluate.goodsRate")}}</text>
						<u-rate count="5" v-model="item.score" activeColor="#FF7700" :allowHalf="true" size="23">
						</u-rate>
					</view>
					<view class="text-class marB20 marT20">
						<u--textarea v-model="item.text" :placeholder="$t('toEvaluate.textAreaPlac')" maxlength="100"
							count></u--textarea>
					</view>
					<uploadImage :index='index' :comWidth='100' :imgSize='150' :limitNum='8' @changeImg="changeImg">
					</uploadImage>
				</view>
			</view>
			<view class="rate-wrapper">
				<view class="fontbold marT20">
					{{ $t("toEvaluate.factoryRate")}}
				</view>
				<view class="flex-c marT30">
					<text class="fontbold marR20 ">{{$t("toEvaluate.serveRate")}}</text>
					<u-rate count="5" v-model="serviceScore" activeColor="#FF7700" :allowHalf="true" size="23"></u-rate>
				</view>
				<view class="flex-c">
					<text class="fontbold marR20 marT20">{{$t("toEvaluate.logiRate")}}</text>
					<u-rate count="5" v-model="logisticsScore" activeColor="#FF7700" :allowHalf="true" size="23">
					</u-rate>
				</view>
				<view class="flex-c">
					<text class="fontbold marR20 marT20">{{$t("toEvaluate.descRate")}}</text>
					<u-rate count="5" v-model="conformanceScore" activeColor="#FF7700" :allowHalf="true" size="23">
					</u-rate>
				</view>
			</view>
			<view class="flex-cb">
				<view class="">
					<u-checkbox-group @change="checkboxChange">
						<u-checkbox v-model="anonymous" shape='circle' activeColor="#E1251B" name='1'
							:label="$t('toEvaluate.hiddenName')" labelColor="#000" labelSize="17" size="20">
						</u-checkbox>
					</u-checkbox-group>
					<view class="color9c9e9c fontsize24 marT10">
						{{$t("toEvaluate.hiddenTips")}}
					</view>
				</view>
				<view class="flex-cc pub-btn" @tap="$u.throttle(evaluate, 1000)">
					<image :src="ossIconUrl+'/mine/fabu.png'" mode="aspectFill" class="pub-icon marR10"></image>
					<text class="fontsize32 fontbold colorfff">{{$t('toEvaluate.publish')}}</text>
				</view>
			</view>
			<!-- <view class="">
				<u-button :text="$t('batchOrder.btnTips')" shape="circle" color="#E1251B"></u-button>
			</view> -->
		</view>
	</view>
</template>

<script>
	import mineApi from '@/api/mine.js'
	export default {
		data() {
			return {
				storeBatchNo: '',
				rs: '',
				serviceScore: 0, //服务态度
				logisticsScore: 0, //物流体验
				conformanceScore: 0, //描述相符
				anonymous: false, // 是否匿名
			};
		},
		onLoad(e) {
			this.storeBatchNo = e.storeBatchNo;
			this.getEvaluateOrder();
		},
		onShow() {},
		methods: {
			checkboxChange() {
				this.anonymous = !this.anonymous
			},
			changeImg(e) {
				let imgList = []
				if (e.imgs) {
					imgList = e.imgs.split(',')
				}
				this.rs.goodsInfoVOS[e.index].images = imgList
			},
			getEvaluateOrder() {
				mineApi.getEvaluateOrder({
					storeBatchNo: this.storeBatchNo,
				}).then(res => {
					if (res.code == 200) {
						this.rs = res.data
						this.rs.goodsInfoVOS.forEach(e => {
							e.score = 0;
							e.text = '';
							e.images = [];
						})
					}
				})
			},
			evaluate() {
				mineApi.evaluate({
					storeBatchNo: this.storeBatchNo,
					serviceScore: this.serviceScore,
					logisticsScore: this.logisticsScore,
					conformanceScore: this.conformanceScore,
					anonymous: this.anonymous,
					evaluateGoodsDTOS: this.rs.goodsInfoVOS,
				}).then(res => {
					if (res.code == 200) {
						this.showMsg(res.msg);
						setTimeout(e => {
							this.leftClick()
						}, 500)
					}
				})
			},
		},
	};
</script>
<style lang="scss" scoped>
	/deep/ .u-checkbox {
		.u-checkbox__icon-wrap--disabled--anonymous {
			border-color: #e02a23 !important;

			.u-icon--right {
				background-color: #e02a23;
				width: 100%;
				height: 100%;

				.uicon-checkbox-mark {
					color: white !important;
					left: 2px;
				}
			}
		}
	}

	/deep/ .u-textarea {
		padding: 20rpx;
		height: 300rpx;
	}

	/deep/ .u-textarea__count {
		color: #9c9e9c;
		font-size: 28rpx;
		right: 10rpx;
		bottom: 10rpx;
	}

	.toEvaluatebg {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));
		box-sizing: border-box;

		.main-wrapper {

			.title-tips {
				border-bottom: 1px solid #e3e4e5;
			}

		}

		.image-class {
			width: 150rpx;
			height: 150rpx;
			flex-shrink: 0;
		}


		.rate-wrapper {
			border-top: 1px solid #e3e4e5;
			margin-bottom: 50rpx;
		}

		.pub-btn {
			background-color: #E1251B;
			border-radius: 40rpx;
			padding: 20rpx 40rpx;
		}

		.pub-icon {
			width: 28rpx;
			height: 28rpx;
		}
	}
</style>
