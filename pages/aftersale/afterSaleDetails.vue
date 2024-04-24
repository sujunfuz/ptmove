<template>
	<view>
		<u-navbar leftIconColor='#fff' :title="BarTitle?BarTitle:$t('afterSaleDetails.title')" :titleStyle='{"color":"#fff"}'
			:placeholder='true' bgColor="#E1251B" fixed="" @leftClick="goToPage('/pages/mine/myOrder?type=5')"></u-navbar>
		<!-- 头部 -->
		<view class="wrapper">
			<view class="box">
				<view style="margin-bottom: 40rpx;">
					<view class="title" style="">{{rs.afSalesStatusStr}}</view>
					<!-- 刚申请售后，等待商家操作 -->
					<view
						v-if="rs.closeTimeSeconds>0&&(rs.afSalesStatus=='MER_WAIT_TK'||rs.afSalesStatus=='MER_WAIT_TH_TK')"
						class="flex-c marB10 marT10 color999">
						<u-count-down :time="rs.closeTimeSeconds*1000" :format="$t('common.countdown1')" autoStart
							@finish='afterSalesDetail()'>
						</u-count-down>
						<view>{{$t('afterSaleDetails.text1')}}</view>
					</view>

					<!-- 商家同意退货等待买家寄货-->
					<view v-if="rs.closeTimeSeconds>0&&rs.afSalesStatus=='MER_AGREE_TH_TK'"
						class="flex-c marB10 marT10 color999">
						<view>
							<u-count-down :time="rs.closeTimeSeconds*1000" :format="$t('common.countdown1')" autoStart
								@finish='afterSalesDetail()'>
							</u-count-down>
						</view>
						<view>{{$t('afterSaleDetails.text4')}}</view>
					</view>
					<!-- 商家拒绝 -->
					<block v-if="rs.afSalesStatus=='MER_REFUSE_TK'||rs.afSalesStatus=='MER_REFUSE_TH_TK'">
						<view class="tishi">{{$t('afterSaleDetails.jjyy')}}：{{rs.refuseExplain}}</view>
						<view class="tishi">{{$t('afterSaleDetails.text5')}}!
						</view>
					</block>
					<!-- 平台介入 -->
					<view class="tishi" v-if="rs.afSalesStatus=='SYS_INTERVENE'">{{$t('afterSaleDetails.text6')}}</view>
				</view>
				<!-- 线有三种状态 灰色#ccc 绿色#51B08F 红色#F93920     -->
				<view class="time" v-if="rs.afSalesStatus!='USER_CLOSE_AF'">
					<view :class="{
							'item-gray': item.lineClass == 'item-gray',
							'item-green': item.lineClass == 'item-green',
							'item-red': item.lineClass == 'item-red',
							'item-yellow':item.lineClass == 'item-yellow',
							time_li5: progressVoList.length==5,
							time_li3: progressVoList.length!=5
							
						}" v-for="(item,i) in progressVoList" :key="i">
						<!-- 原有三种颜色 灰色#ccc未到达的状态 绿色#51B08F通过的状态 红色#F93920拒绝的状态 黄色#FFCA4B平台介入状态-->
						<view class="circle" :class="item.circleClass"></view>
						<view class="item-nei">
							<view class="nei-a">{{item.desc}}</view>
							<view class="nei-b">{{ TimeofDate(item.timeStr)}}</view>
							<view class="nei-c">{{TimeofHour(item.timeStr)}}</view>
						</view>
					</view>
				</view>
				<!-- 退货地址 退货说明 -->
				<block v-if="rs.afSalesStatus=='MER_AGREE_TH_TK'&&rs.merReceiveInfoStr">
					<view class="top-article marT20">
						<view class="art-title">{{$t('afterSaleDetails.addtitle')}}</view>
						<!-- 收货人 联系电话 详细地址 -->
						<view class="art-item marT10">
							<view class="art-a">{{$t('afterSaleDetails.receiveName')}}：</view>
							<view class="art-b">{{rs.merReceiveInfoStr.userName}}</view>
						</view>
						<view class="art-item marT10">
							<view class="art-a">{{$t('afterSaleDetails.mobile')}}：</view>
							<view class="art-b">{{rs.merReceiveInfoStr.mobile}}</view>
						</view>
						<view class="art-item marT10">
							<view class="art-a">{{$t('afterSaleDetails.address')}}：</view>
							<view class="art-b">{{rs.merReceiveInfoStr.address}}{{rs.merReceiveInfoStr.detailAddress}}</view>
						</view>
					</view>
					<view class="top-article">
						<view class="art-title">{{$t('afterSaleDetails.thsm')}}</view>
						<!-- 退货退款说明 -->
						<view class="art-item">
							<view class="art-a">{{$t('afterSaleDetails.thsm_title')}}：
								<text class="art-warn">{{$t('afterSaleDetails.thsm_text')}}</text>
							</view>
						</view>
					</view>
				</block>
				<view class="h-foot">
					<view class="h-f-a">{{$t('afterSaleDetails.tkzh')}}</view>
					<view class="h-f-a" style="margin-left: 30rpx;">{{$t('afterSaleDetails.ylth')}}</view>
				</view>
			</view>
		</view>
		<afDetailsFooter v-if="rsStatus" :rs='rs' @changeStatus='afterSalesDetail'></afDetailsFooter>
	</view>
</template>

<script>
	import afSalesApi from '@/api/afSales.js'
	import afDetailsFooter from './components/afDetailsFooter.vue'
	export default {
		components: {
			afDetailsFooter
		},
		data() {
			return {
				BarTitle:'',
				popupShow: false,
				id: '', //售后单号
				rs: {}, //退货退款详情
				rsStatus: false,
				progressVoList: [], //进度数组
				// 圆形circleClass circle-green 绿 circle-gray 灰 circle-red 红色
				remark: '',
				uploadImg: "",
			};
		},
		onLoad(e) {
			this.id = e.id;
			this.afterSalesDetail();
		},

		methods: {
			//退款详情
			afterSalesDetail() {
				afSalesApi.afterSalesDetail({
					id: this.id
				}).then(res => {
					if (res.code == 200) {
						this.rs = res.data;
						this.BarTitle=this.rs.afSalesTypeStr;
						if (this.rs.merReceiveInfo) {
							this.rs.merReceiveInfoStr = JSON.parse(this.rs.merReceiveInfo)
						}
						this.rsStatus = true;
						this.progressVoList = this.rs.progressVoList;
						this.getTimeLineStyle();
					}
				})
			},
			//根据协商历史获得时间线的样式
			getTimeLineStyle() {
				this.progressVoList.forEach((e, i) => {
					e.circleClass = 'circle-gray';
					e.lineClass = 'item-gray';
					if (e.status == 'GREY') {
						this.progressVoList[i].circleClass = 'circle-gray';
						this.progressVoList[i].lineClass = 'item-gray';
					}
					if (e.status == 'GREEN') {
						this.progressVoList[i].circleClass = 'circle-green';
						this.progressVoList[i].lineClass = 'item-green';
					}
					if (e.status == 'RED') {
						this.progressVoList[i].circleClass = 'circle-red';
						this.progressVoList[i].lineClass = 'item-red';
					}
					if (e.status == 'YELLOW') {
						this.progressVoList[i].circleClass = 'circle-yellow';
						this.progressVoList[i].lineClass = 'item-yellow';
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	/deep/ .u-count-down {
		display: inline !important;
		width: auto;
		height: auto;
		margin: 0 6rpx;

		.u-count-down__text {
			color: #EB1818;
		}
	}

	.wrapper {
		width: 690rpx;
		margin: 20rpx auto;
		padding: 20rpx 0;
		background: #FFFFFF;
		border-radius: 20rpx;


		.box {
			width: 650rpx;
			margin: 0 auto;

			.title {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
			}

			.tishi {
				margin: 15rpx 0;
				font-size: 24rpx;
				font-weight: 500;
				color: #999999;
			}

			.time {
				width: 100%;
				display: flex;
				justify-content: space-between;

				.time_li3 {
					position: relative;
					width: 100rpx;
					height: 130rpx;
				}

				.time_li3::after {
					content: '';
					position: absolute;
					left: 65rpx;
					display: block;
					width: 246rpx;
					height: 2rpx;
					background: #51B08F;
				}

				.time_li3:last-child::after {
					background: #fff;
					display: none !important;
				}

				.time_li5 {
					position: relative;
					width: 100rpx;
					height: 130rpx;
				}

				.time_li5::after {
					content: '';
					position: absolute;
					left: 65rpx;
					display: block;
					width: 108rpx;
					height: 2rpx;
					background: #51B08F;
				}

				.time_li5:last-child::after {
					background: #fff;
					display: none !important;
				}

				.circle {
					position: absolute;
					left: 38rpx;
					top: -12rpx;
					width: 24rpx;
					height: 24rpx;
					background: #ccc;
					border-radius: 100%;
				}

				.circle-gray {
					background: #ccc !important;
				}

				.circle-green {
					background: #51B08F;
				}

				.circle-red {
					background: #F93920;
				}

				.circle-yellow {
					background: #FFCA4B;
				}

				.item-nei {
					position: absolute;
					bottom: 0rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
					width: 100rpx;
					height: 100rpx;

					.nei-a {
						margin-bottom: 6rpx;
						font-size: 24rpx;
						color: #666;
						max-width: 130rpx;
						text-align: center;
					}

					.nei-b {
						font-size: 24rpx;
						color: #999;
						max-width: 130rpx;
						text-align: center;
					}

					.nei-c {
						font-size: 24rpx;
						color: #999;
						max-width: 130rpx;
						text-align: center;
					}
				}

				.item-gray::after {
					background: #ccc !important;
				}

				.item-green::after {
					background: #51B08F !important;
				}

				.item-yellow::after {
					background: #FFCA4B !important;
				}

				.item-red::after {
					background: #F93920 !important;
				}


			}

			.h-foot {
				display: flex;
				align-items: center;
				padding: 20rpx 0 10rpx 0;
				width: 100%;
				margin-top: 38rpx;
				border-top: 1rpx solid #f2f2f2;

				.h-f-a {
					font-size: 28rpx;
					font-weight: 500;
					color: #333333;
				}
			}

			.top-article {
				.art-title {
					width: 100%;
					height: 70rpx;
					font-size: 28rpx;
					font-weight: bold;
					line-height: 65rpx;
					color: #333333;
				}

				.art-item {
					display: flex;
					align-items: center;

					.art-a {
						font-size: 24rpx;
						color: #666;

						.art-warn {
							font-size: 24rpx;
							color: #EB1818;
						}
					}

					.art-b {
						margin-left: 8rpx;
						font-size: 24rpx;
						color: #333;
						max-width: 500rpx;
					}
				}
			}
		}
	}
</style>
