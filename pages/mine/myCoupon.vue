<template>
	<view class="myCouponbg">
		<u-navbar leftIconColor='#fff' :title="$t('myCoupon.title')" :titleStyle='{"color":"#fff"}' :placeholder='true'
			bgColor="#E1251B" fixed="" @leftClick="leftClick"></u-navbar>
		<view class="fixed-top">
			<u-sticky>
				<view class="flex-cc bgfff">
					<u-tabs :list="tabList" @click="clickTabs" keyName='label' lineColor="#E1251B" lineWidth="30"
						itemStyle="padding-left: 80rpx; padding-right: 80rpx; height: 44px;"
						:activeStyle="{'color':'#E1251B'}"></u-tabs>
				</view>
			</u-sticky>
		</view>
		<view v-if="dataList.length>0" class="pad20" style="margin-top: 88rpx;">
			<view class="cards" v-for="(it,i) in dataList" :key='i'>
				<view class="flex-cb">
					<view class="fontbold">夸父科技有限公司</view>
					<view class="flex-c">
						<view class="color80">{{$t('myCoupon.gostore')}}</view>
						<u-icon name="arrow-right" color="#9C9E9C" size="15"></u-icon>
					</view>
				</view>
				<view class="flex-cb bgview">
					<view class="pad20">
						<view class="flex-c">
							<view class="u-line-1">{{$t('myCoupon.dpyhq')}}</view>
							<view class="color80 fontsize20 marL10 u-line-1">{{$t('myCoupon.alluse')}}</view>
						</view>
						<scroll-view scroll-x="true" class="marT18" style="white-space: nowrap;">
							<view class="flex" style="width: 460rpx;">
								<image class="imgshop flexnone" v-for="(it,i) in 5" :key='i'
									:src="ossIconUrl+'/mine/dianpu.png'" mode="heightFix"></image>
							</view>
						</scroll-view>
						<view class="fontsize20 color6e marT10">2023/09/13 15:00:00-2026/10/22 23:59:59</view>
					</view>
					<view class="Coupon_r flex-cc"
						:style="'background-image: url('+ossIconUrl+(type=='UNUSED'?'/mine/keshiyong.png)':'/mine/yishiyong.png)')">
						<view class="">
							<view class="flex-cc">
								<view class="colorfff flex-e fontbold">
									<view class="fontsize30">{{globalUnit}}</view>
									<view class="fontsize32 marL6">8</view>
								</view>
							</view>
							<view class="fontsize20 colorfff marT10 textC">{{$t('myCoupon.man')}}88{{$t('myCoupon.ky')}}
							</view>
							<view class="flex-cc">
								<view class="couponBts" :class="type=='UNUSED'?'colorMain':'color9c'">
									{{type=='UNUSED'?$t('myCoupon.gouse'):type=='USED'?$t('myCoupon.tab2'):$t('myCoupon.tab3')}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-else>
			<view class="flex" style="justify-content: center;">
				<image class="imgnodata" :src="ossIconUrl+'/mine/nodata1.png'"></image>
			</view>
			<view class="flex color9c9e9c fontsize24 marT20" style="justify-content: center;">
				{{$t('myCoupon.nodatatips')}}~
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabList: [{
					label: this.$t('myCoupon.tab1'),
					value: 'UNUSED',
				}, {
					label: this.$t('myCoupon.tab2'),
					value: 'USED',
				}, {
					label: this.$t('myCoupon.tab3'),
					value: 'EXPIRED',
				}],
				dataList: [{}],
				type: "UNUSED"
			}
		},
		onLoad() {

		},
		methods: {
			clickTabs(e) {
				console.log(e)
				this.type = e.value
			},
		}
	}
</script>

<style lang="scss" scoped>
	.myCouponbg {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));

		.cards {
			margin-bottom: 20rpx;
			background: #fff;
			border-radius: 20rpx;
			padding: 20rpx;

			.bgview {
				background: #f6f6f6;
				margin-top: 20rpx;
				border-radius: 10rpx;
				height: 278rpx;

				.imgshop {
					width: 150rpx;
					height: 150rpx;
					margin-right: 10rpx;
				}

				.Coupon_r {
					width: 162rpx;
					height: 100%;
					background-size: 100% 100%;
					background-repeat: no-repeat;

					.couponBts {
						border-radius: 50rpx;
						background: #fff;
						text-align: center;
						width: 124rpx;
						height: 50rpx;
						line-height: 50rpx;
						margin-top: 30rpx;
					}
				}
			}
		}

		.imgnodata {
			margin-top: 88rpx;
			width: 368rpx;
			height: 368rpx;
		}
	}
</style>
