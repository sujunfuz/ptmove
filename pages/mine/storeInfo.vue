<template>
	<view class="storeInfobg">
		<u-navbar leftIconColor='#fff' :title="$t('storeInfo.title')" :titleStyle='{"color":"#fff"}' :placeholder='true'
			bgColor="#E1251B" fixed="" @leftClick="leftClick"></u-navbar>
		<!-- <view>{{$t('storeInfo.title')}}</view> -->
		<view class="">
			<view class="bgfff bdRadius20 pad20">
				<view class="flex">
					<u-avatar :src="ImgUrl+rs.logo" size="40" shape='square'></u-avatar>
					<text class="com-name marL20">
						{{rs.merchantName}}
					</text>
				</view>

				<view class="grid32">
					<view class="merchant-info marT30">
						<view class="fontbold">{{rs.fansCount}}</view>
						<view class="color9c9e9c fontsize24">{{$t("storeInfo.fansNum")}}{{$t('common.dan')}}</view>
						<view class="divid">
							|
						</view>
					</view>
					<view class="merchant-info marT30">
						<view class="fontbold">{{rs.thirtyDaysOrderCount}}</view>
						<view class="color9c9e9c fontsize24">{{$t("storeInfo.30Order")}}{{$t('common.dan')}}</view>
						<view class="divid">
							|
						</view>
					</view>
					<view class="merchant-info marT30">
						<view class="fontbold">{{rs.secondGranceRate}}%</view>
						<view class="color9c9e9c fontsize24">{{$t("storeInfo.returnHead")}}</view>
					</view>
					<!-- <view class="merchant-info marT30">
						<view class="fontbold">{{rs.performanceRate}}</view>
						<view class="color9c9e9c fontsize24">{{$t("storeInfo.fulfill")}}</view>
						<view class="divid">
							|
						</view>
					</view>
					<view class="merchant-info marT30">
						<view class="fontbold">{{rs.responseRate}}</view>
						<view class="color9c9e9c fontsize24">{{$t("storeInfo.answerRate")}}</view>
						<view class="divid">
							|
						</view>
					</view> 
					<view class="merchant-info marT30">
						<view class="fontbold">{{rs.qualityRefundRate}}</view>
						<view class="color9c9e9c fontsize24">{{$t("storeInfo.returnItem")}}</view>
					</view> -->
				</view>
			</view>
			<view class="bgfff bdRadius20 pad20 marT20">
				<view class="fontbold fontsize32">
					{{$t("storeInfo.companyInfo")}}
				</view>
				<view>
					<view class="flex marT20">
						<view class="flexnone color6e marR20">{{$t("storeInfo.fundTime")}}</view>
						<view>{{rs.foundTimeStr||"-"}}</view>
					</view>
					<view class="flex marT20">
						<view class="flexnone color6e marR20">{{$t("storeInfo.scopeBusy")}}</view>
						<view>{{rs.businessScope||"-"}}</view>
					</view>
					<view class="flex marT20">
						<view class=" color6e marR20">{{$t("storeInfo.employee")}}</view>
						<view>{{rs.employeeCountStr||"-"}}</view>
					</view>
					<view class="flex marT20">
						<view class=" color6e marR20">{{$t("storeInfo.scope")}}</view>
						<view>{{rs.scaleStr||"-"}}</view>
					</view>
					<view class="flex marT20">
						<view class="color6e marR20">{{$t("storeInfo.tradeVal")}}</view>
						<view>{{rs.yearDealAmount||"-"}}</view>
					</view>
					<view class="flex marT20">
						<view class=" color6e marR20">{{$t("storeInfo.brandName")}}</view>
						<view>{{rs.brandName||"-"}}</view>
					</view>
					<view class="flex marT20">
						<view class=" color6e marR20">{{$t("storeInfo.mianCustomer")}}</view>
						<view>{{rs.mainCustomers||"-"}}</view>
					</view>

					<view class="flex marT20">
						<view class=" color6e marR20">{{$t("storeInfo.contect")}}</view>
						<view>{{rs.applicantMobile||"-"}}</view>
					</view>
					<block v-if="!fold">
						<view class="flex marT20">
							<view class="flexnone color6e marR20">{{$t("storeInfo.mainPro")}}</view>
							<view>{{rs.mainProductsStr||"-"}}</view>
						</view>
						<view class="marT20">
							<view class=" color6e marB20">{{$t("storeInfo.mineCert")}}</view>
							<view v-if="mineCertList.length==0">-</view>
							<view v-for="(item,index) in mineCertList" :key='index'>
								<image style="width: 100%;" :src="ImgUrl+item" mode="aspectFit"></image>
							</view>
						</view>
					</block>
				</view>
				<view class="view-more marT20 flex-cc" @tap.stop="fold = !fold">
					<text class="colorE1251B marR10">{{$t("storeInfo.viewMore")}}</text>
					<u-icon name="arrow-down" color="#E1251B" size="15" v-if="fold"></u-icon>
					<u-icon name="arrow-up" color="#E1251B" size="15" v-else></u-icon>
				</view>
			</view>
			<view class="bgfff bdRadius20 pad20 marT20">
				<view class="fontbold fontsize32">
					{{$t("storeInfo.evaluateSys")}}
				</view>
				<view class="evaluate marT30">
					<view class="info-item flex-c">
						<view class=" color6e marR20">{{$t("storeInfo.comprehenEva")}}</view>
						<view class="">
							<u-rate count="5" v-model="rs.score" allowHalf readonly activeColor="#FF8C29"
								style="width: 270rpx;"></u-rate>
						</view>
						<view class="marL20 fontbold flexnone">{{rs.score + $t('storeInfo.points')}}</view>
					</view>
					<view class="info-item flex-c marT20">
						<view class=" color6e marR20">
							{{$t("storeInfo.serveAti")}}
						</view>
						<u-line-progress :percentage="rs.serviceScore * 20" :showText="false"
							style="width: 270rpx;flex:none">
						</u-line-progress>
						<view class=" marL20 fontbold">{{rs.serviceScore}}</view>
					</view>
					<view class="info-item flex-c marT20">
						<view class=" color6e marR20">
							{{$t("storeInfo.logi")}}
						</view>
						<u-line-progress :percentage="rs.logisticsScore * 20" :showText="false"
							style="width: 270rpx;flex:none">
						</u-line-progress>
						<view class=" marL20 fontbold">{{rs.logisticsScore}}</view>
					</view>
					<view class="info-item flex-c marT20">
						<view class=" color6e marR20">
							{{$t("storeInfo.descTrue")}}
						</view>
						<u-line-progress :percentage="rs.conformanceScore * 20" :showText="false"
							style="width: 270rpx;flex:none">
						</u-line-progress>
						<view class=" marL20 fontbold">{{rs.conformanceScore}}</view>
					</view>
				</view>
			</view>
			<view class="bgfff bdRadius20 pad20 marT20">
				<view class="fontbold fontsize32">
					{{$t("storeInfo.companyIntro")}}
				</view>
				<view class="content color6e marT30">
					{{rs.companyProfile}}
				</view>
				<view class="img-scroll-list flex-c marT20">
					<view class="" v-for="(item,index) in companyImage" :key="index">
						<image :src="ImgUrl+item" mode="aspectFill" class="intro-image bdRadius20"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import mineApi from "@/api/mine.js"
	export default {
		data() {
			return {
				type: '', //all全部商品 空为正常展示
				fold: true,
				merchantNo: '',
				rs: {},
				mineCertList: [],
				companyImage: []
			}
		},
		onLoad(e) {
			if(e.merchantNo){
				this.merchantNo = e.merchantNo
			}
			this.getMerchantDetailInfo()
		},
		methods: {
			getMerchantDetailInfo() {
				mineApi.merchantDetailInfo({
					merchantNo: this.merchantNo
				}).then(res => {
					if (res.code == 200) {
						this.rs = res.data;
						if(this.rs.certificateImages){
							this.mineCertList = this.rs.certificateImages.split(',')
						}
						if(this.rs.factoryImages){
							this.companyImage = this.rs.factoryImages.split(',')
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.storeInfobg {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));
		padding: 20rpx;
		box-sizing: border-box;

		.grid32 {
			display: grid;
			grid-template-columns: 1fr 1fr 1fr;
			// grid-template-rows: 1fr;
			column-gap: 80rpx;

			.merchant-info {
				display: inline-flex;
				flex-direction: column;
				text-align: center;
				position: relative;

				.divid {
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
					right: -25%;
					color: #DCDCDC;
				}
			}
		}

		.main-quli {
			background: rgba(0, 93, 255, 0.1);
			border-radius: 10rpx;
			padding: 5rpx 20rpx;
			display: inline-flex;
			align-items: center;
			height: 70rpx;
			line-height: 70rpx;

			&>image {
				width: 44rpx;
				height: 44rpx;
			}
		}

		.colorE1251B {
			color: #E1251B
		}

		.img-scroll-list {
			overflow-x: scroll;

			.intro-image {
				width: 350rpx;
				height: 220rpx;
			}
		}

		/deep/.u-line-progress__line {
			background: linear-gradient(205deg, #FF8C29 0%, #E1251B 100%) !important;
		}

		/deep/ .u-line-progress {
			/* #ifdef MP-WEIXIN */
			width: 240rpx !important;
			/* #endif */
			/* #ifndef MP-WEIXIN */
			width: 290rpx !important;
			/* #endif */
			flex: none;
		}

		/deep/.u-rate__content {
			width: 100%;
			display: flex;
			justify-content: space-around;
		}
	}
</style>
