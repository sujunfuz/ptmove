<template>
	<view class="shopInfo">
		<view class="swiperView">
			<u-swiper :list="rs.swiperList" @change="(e) => (current = e.current)" height="375" imgMode="scaleToFill"
				indicatorStyle="right: 20px">
				<view v-if="rs.swiperList.length > 0" slot="indicator" class="indicatorbg">
					<view class="indicatortext">{{ current + 1 }}/{{ rs.swiperList.length }}</view>
				</view>
			</u-swiper>
			<image v-if="!rs.spuSubscribe" class="shoucang" :src="ossIconUrl + '/index/nocollect.png'"
				mode="scaleToFill" @click="userCollect('PRODUCT')"></image>
			<image v-else class="shoucang" :src="ossIconUrl + '/index/yicollect.png'" mode="scaleToFill"
				@click="userCollect('PRODUCT')"></image>
		</view>
		<view class="tabsview flex-cc" v-if="rs.defaultSkuDetail.agentDeliver=='YES'">
			<view class="tabs_li" v-for="(it, i) in tabs" :key="i" :class="cartType == it.value ? 'active' : ''"
				@click="onchangeType(it)">
				<view :class="cartType == it.value ? 'acxian' : ''"></view>
				{{ $t(it.label) }}
			</view>
		</view>
		<view class="pad20">
			<!-- 信息 -->
			<view class="cards">
				<view class="flex-c" v-if="cartType == tabs[0].value">
					<view style="width: 33%" class="flex-c" v-for="(it, i) in rs.defaultSkuDetail.rangePriceList"
						:key="i">
						<view v-if="i > 0" class="shu"></view>
						<view>
							<view class="colorMain marT10 flex-e fontbold">
								<view class="fontsize30">{{globalUnit}}</view>
								<view class="fontsize32 marL6">{{ it.price }}</view>
							</view>
							<view class="marT6 u-line-1 color333">
								{{ it.startCount }}-{{ it.endCount}}{{ $t("common.jian") }}
							</view>
						</view>
					</view>
				</view>
				<view v-else class="colorMain marT10 flex-e fontbold">
					<view class="fontsize30">{{globalUnit}}</view>
					<view class="fontsize32 marL6">{{ rs.defaultSkuDetail.agentPrice}}</view>
				</view>
				<view class="fontbold marT20">{{ rs.name }} </view>
			</view>

			<view class="cards marT20" @click="openMore">
				<view class="flex-cb" style="width: 100%">
					<view class="flex-cb" style="width: 88%">
						<view class="flex-c">
							<view class="color9c">{{ $t("shopDetails.info1") }}：</view>
							<view>{{ rs.perMinNum }}{{ $t("common.jian") }}</view>
						</view>
						<view class="flex-c">
							<view class="color9c">{{ $t("shopDetails.info2") }}：</view>
							<view>{{rs.sourceTypeStr||'-'}}</view>
						</view>
					</view>
					<u-icon v-if="rs.goodsAttrList&&rs.goodsAttrList.length>0" name="arrow-right" color="#9C9E9C" size="15"></u-icon>
				</view>
			</view>

			<!-- 	<view class="cards marT20">
				<view class="flex-cb">
					<image class="img30" :src="ossIconUrl + '/index/feiji.png'" mode="scaleToFill"></image>
					<view class="marL20" style="width: 85%">
						<view class="flex-c">
							<view>福建 福州</view>
							<view class="marL30 fontsize24">{{ $t("shopDetails.yfguji") }}：</view>
							<view class="color9c fontsize24">{{$t("shopDetails.seladdress")}}</view>
						</view>
						<view class="flex-c marT20">
							<view class="colorMain fontsize24">{{ $t("shopDetails.chengnuo") }}：</view>
							<view class="marL30 color9c fontsize24">{{$t("shopDetails.yfxieshang")}}</view>
						</view>
					</view>
					<u-icon name="arrow-right" color="#9C9E9C" size="15"></u-icon>
				</view>
			</view> -->

			<view class="cards marT20" v-if="rs.evaluateCount">
				<view>
					<view class="flex-cb" @tap="goToPage('/pages/index/evaluateList?id=' + rs.id)">
						<view class="fontsize30 fontbold">{{ $t("shopDetails.pjtitle") }}({{ rs.evaluateCount }})</view>
						<u-icon name="arrow-right" color="#9C9E9C" size="15"></u-icon>
					</view>
					<view class="bgLRRed"></view>
					<view class="flex">
						<image class="img44 flexnone"
							:src="rs.evaluateEntity.avatar?ImgUrl + rs.evaluateEntity.avatar:ossIconUrl+'/mine/nologin.png'"
							mode="scaleToFill">
						</image>
						<view class="marL20">
							<view>{{ rs.evaluateEntity.userName }}</view>
							<view class="marT18 fontsize24">
								{{ JSON.parse(rs.evaluateEntity.content).text }}
							</view>
							<view class="fontsize20 color9c marT20">{{rs.evaluateEntity.createTimeStr}}</view>
						</view>
					</view>
				</view>
			</view>

			<view class="cards marT20" v-if="rs.store">
				<view>
					<view class="flex-cb">
						<view class="flex">
							<u-avatar :src="ImgUrl + rs.store.logo" shape="square" size="100rpx"></u-avatar>
							<view class="marL20">
								<view class="fontbold u-line-1">{{ rs.store.storeName }}</view>
								<view class="marT20 flex-c">
									<view class="fontsize24 marR10">{{$t("shopDetails.serve")}}</view>
									<block v-if="rs.store.score>0">
										<u-rate readonly count="5" v-model="rs.store.score" activeColor="#FF7700"
											:allowHalf="true"></u-rate>
										<view class="fontsize24 marL10 flexnone">{{ rs.store.score }}</view>
									</block>
									<view v-else class="marL20 color9c9e9c fontsize24">{{$t('shopDetails.noscore')}}</view>
								</view>
							</view>
						</view>
						<view v-if="!rs.storeSubscribe" class="flex-cc flexnone guanzhubts bgMain marL20"
							@click="userCollect('SUPPLIER')">
							<image class="imgguanzhu" :src="ossIconUrl + '/index/guanzhu.png'" mode="scaleToFill">
							</image>
							<view class="colorfff">{{ $t("cpfactoryCards.interest") }}</view>
						</view>
						<view v-else class="marL20 guanzhubts flexnone bgF6 color9c"
							@click="userCollect('SUPPLIER')">{{$t('cpfactoryCards.followed')}}
						</view>
					</view>
					<view class="bgLRRed"></view>
					<view class="flex-cc">
						<view @tap="goToPage('/pages/mine/storeDetails?merchantNo=' + rs.store.merchantNo)">
							{{ $t("shopDetails.look1") }}
						</view>
						<view class="line"></view>
						<view @tap="goToPage('/pages/mine/storeDetails?type=all&merchantNo=' + rs.store.merchantNo)">
							{{ $t("shopDetails.allshop") }}
						</view>
					</view>
				</view>
			</view>

			<view class="flex-cc marT30 tuijianView">
				<image :src="ossIconUrl + '/mine/tuijian1.png'" mode="scaleToFill"></image>
				<view>{{ $t("shopDetails.cpdetails") }}</view>
				<image :src="ossIconUrl + '/mine/tuijian2.png'" mode="scaleToFill"></image>
			</view>

			<view class="cards marT20" style="padding: 30rpx" v-if="rs.goodsAttrList&&rs.goodsAttrList.length>0">
				<view>
					<view class="flex-cb marB30" v-for="(it,i) in rs.goodsAttrList.slice(0,4)" :key='i'>
						<view class="fontsize24 color6e">{{it.attrName}}</view>
						<view class="fontsize24">{{it.attrValue}}</view>
					</view>
				</view>
				<view class="flex-cc" @click="openMore">
					<view class="fontsize24 color6e marR10">{{ $t("shopDetails.look2")}}</view>
					<u-icon name="arrow-right" color="#9C9E9C" size="15"></u-icon>
				</view>
			</view>
			<view class="rich marT30">
				<rich-text :nodes="rs.spuDetail.goodsDetailHtml"> </rich-text>
			</view>

			<!-- <view class="imgdetailsView">
				<image class="imgs" v-for="(it, i) in rs.swiperList" :src="it" mode="widthFix"></image>
			</view> -->
		</view>
		<moreSpecs :show="moreShow" @close="moreShow = false" :rs="rs" :dataList='rs.goodsAttrList'></moreSpecs>
	</view>
</template>

<script>
	import commonApi from '@/api/common.js'
	import moreSpecs from "./moreSpecs.vue";
	export default {
		components: {
			moreSpecs,
		},
		props: {
			rs: {
				type: Object,
				default: () => {},
			},
			cartType: {
				type: String,
				default: () => '',
			},
			tabs: {
				type: Array,
				default: () => [],
			},
		},
		data() {
			return {
				current: 0,
				moreShow: false,
			};
		},
		created() {},
		onLoad() {},
		methods: {
			openMore(){
				if(this.rs.goodsAttrList&&this.rs.goodsAttrList==0) return
				this.moreShow=true;
			},
			onchangeType(it) {
				this.$emit("changetab", it.value);
			},
			//收藏  collectType:店铺 SUPPLIER， 商品PRODUCT
			userCollect(type) {
				if (!uni.getStorageSync('token')) {
					this.$emit("openLoginShow");
					return
				}
				commonApi.userCollect({
					collectType: type,
					itemId: type=='PRODUCT'?this.rs.id:this.rs.store.id
				}).then(res => {
					if (res.code == 200) {
						this.showMsg(res.msg)
						this.$emit("changeInfo");
					}
				})
			},
		},
	};
</script>

<style lang="scss" scoped>
	.shopInfo {
		width: 100%;

		.swiperView {
			.indicatorbg {
				height: 40rpx;
				line-height: 35rpx;
				padding: 0 20rpx;
				background-color: rgba(0, 0, 0, 0.35);
				border-radius: 50rpx;
				display: flex;
				justify-content: center;

				.indicatortext {
					color: #ffffff;
					font-size: 24rpx;
				}
			}
		}

		.swiperView {
			position: relative;

			.indicatorbg {
				height: 40rpx;
				line-height: 35rpx;
				padding: 0 20rpx;
				background-color: rgba(0, 0, 0, 0.35);
				border-radius: 50rpx;
				display: flex;
				justify-content: center;

				.indicatortext {
					color: #ffffff;
					font-size: 24rpx;
				}
			}

			.shoucang {
				width: 44rpx;
				height: 44rpx;
				position: absolute;
				right: 30rpx;
				top: 30rpx;
			}
		}

		.tabsview {
			position: relative;
			height: 88rpx;

			.tabs_li {
				color: #6e6e6e;
			}

			.tabs_li:last-child {
				margin-left: 150rpx;
			}

			.active {
				font-weight: bold;
				position: relative;
				color: #333;
			}

			.acxian {
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				bottom: -20rpx;
				width: 40rpx;
				height: 4rpx;
				background: #333;
				border-radius: 12rpx;
			}
		}

		.cards {
			background: #fff;
			padding: 20rpx;
			border-radius: 20rpx;

			.shu {
				width: 2rpx;
				height: 79rpx;
				opacity: 1;
				background: #c5c5c5;
				margin-right: 20rpx;
			}

			.line {
				margin: 0 120rpx;
				width: 2rpx;
				height: 30rpx;
				background: #ffc2bf;
			}
		}
		.rich{
			/deep/.richTextImg{
				max-width: 100%;
			}
		}
		
		.imgdetailsView {
			width: 100%;
			margin-top: 20rpx;

			.imgs {
				width: 100%;
				vertical-align: bottom;
			}
		}
	}
</style>
