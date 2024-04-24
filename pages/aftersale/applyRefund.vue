<template>
	<view>
		<u-navbar leftIconColor='#fff' :title="$t('applyRefund.title')" :titleStyle='{"color":"#fff"}'
			:placeholder='true' bgColor="#E1251B" fixed="" @leftClick="leftClick"></u-navbar>
		<view class="wrapper">
			<view class="box">
				<!-- 申请类型 -->
				<view class="pu-item flex-cb" @tap="clickOpenPop(1)">
					<view class="customShadow"></view>
					<view class="pu-l">
						<view class="l-one">{{$t('applyRefund.form1')}}</view>
						<view class="l-two">*</view>
					</view>
					<view class="pu-r">
						<u-input v-model='afSalesTypeStr' disabled disabledColor='#fff'
							:placeholder="$t('common.select')" inputAlign='right' clearable border='none'>
						</u-input>
						<u-icon name="arrow-right" color="#9C9E9C" size="15"></u-icon>
					</view>
				</view>
				<!-- 货物状态 -->
				<view class="pu-item flex-cb" @tap="clickOpenPop(2)" v-if="afSalesType!='EXCHANGE_AND_REFUND'">
					<view class="customShadow"></view>
					<view class="pu-l">
						<view class="l-one">{{$t('applyRefund.form2')}}</view>
						<view class="l-two">*</view>
					</view>
					<view class="pu-r">
						<u-input v-model='goodsStatusStr' disabled disabledColor='#fff'
							:placeholder="$t('common.select')" inputAlign='right' clearable border='none'>
						</u-input>
						<u-icon name="arrow-right" color="#9C9E9C" size="15"></u-icon>
					</view>
				</view>
				<!-- 退款原因 -->
				<view class="pu-item flex-cb" @tap="clickOpenPop(3)">
					<view class="customShadow"></view>
					<view class="pu-l">
						<view class="l-one">{{$t('applyRefund.form3')}}</view>
						<view class="l-two">*</view>
					</view>
					<view class="pu-r">
						<u-input v-model='reasonStr' disabled disabledColor='#fff' :placeholder="$t('common.select')"
							inputAlign='right' clearable border='none'>
						</u-input>
						<u-icon name="arrow-right" color="#9C9E9C" size="15"></u-icon>
					</view>
				</view>

				<!-- 退款金额和修改 -->
				<view class="tui-item">
					<view class="pu-l">
						<view class="l-one">{{$t('applyRefund.form4')}}</view>
						<view class="l-two">*</view>
					</view>
					<view v-if="EditShow" style='width: 60%;margin-left: 10rpx;'>
						<u--input @blur='changerefundAmount' :placeholder="$t('applyRefund.input1')" border="surround"
							v-model="refundAmount" type='number'></u--input>
					</view>
					<view v-else class="tui-mid">
						<view class="tui-a">{{globalUnit}}{{refundAmount}}</view>
						<view class="tui-b" @tap='EditShow=true;'>
							<image class="img44" :src="ossIconUrl+'/mine/edit.png'" mode="scaleToFill" />
							<view class="tui-b-text">{{$t('common.edit2')}}</view>
						</view>
					</view>
					<view class="tui-foot colorRed">
						<text>{{$t('applyRefund.form4tips1')}}{{globalUnit}}{{afRs.isRefundFreight?(refundFreightAmount+refundGoodsAmount):refundGoodsAmount}}</text>
						<text
							v-if="afRs.isRefundFreight">，{{$t('applyRefund.form4tips2')}}{{globalUnit}}{{refundFreightAmount}}</text>
					</view>
				</view>
			</view>

		</view>
		<!-- 补充描述与凭证 -->
		<view class="wrapper">
			<view class="box">
				<view class="buc">
					<view class="pu-l">
						<view class="l-one">{{$t('applyRefund.form5')}}</view>
						<view class="l-two">*</view>
					</view>
					<view class="buc-box">
						<view class="buc-wrapper">
							<u--textarea style="background: rgba(0,0,0,0);" :maxlength="200" v-model="remark"
								:placeholder="$t('applyRefund.form5tips')" border="none" clearable count height='100'>
							</u--textarea>
							<view class="marT20">
								<uploadImage :comWidth="100" :imgSize="175" :limitNum="3" @changeImg="changeImg"
									:imgType="1" :imgs="imgUrl">
								</uploadImage>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 全局按钮 -->
		<view class="allbtn bgMain" @tap="$u.throttle(applyRefund, 1000)">{{$t('common.confirm2')}}</view>
		<!-- 弹出框 -->
		<u-popup :show="popupShow" mode="bottom" :round="20" closeable @close='popupShow=false'>
			<view class="pop-box">
				<view class="pop-top">
					<view class="pop-a">
						{{ clickType == 1 ? $t('applyRefund.form1'):clickType == 2 ? $t('applyRefund.form2'): $t('applyRefund.form3')}}
					</view>
				</view>
				<view class="pop-item" v-for="(item,index) in popupList" :key="index"
					@tap="selValue=item.value;selName=item.label">
					<view class="pop-one">{{item.label}}</view>
					<image v-if='selValue==item.value' class="img36" :src="ossIconUrl+'/index/xuanze1.png'"
						mode="scaleToFill">
						<image v-else class="img36" :src="ossIconUrl+'/index/weixuanze.png'" mode="scaleToFill">
				</view>
				<view style="height: 80rpx;"></view>
				<view @tap="closePop" class="pop-btn">{{$t('common.confirm2')}}</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import afSalesApi from '@/api/afSales.js'
	import commonApi from '@/api/common.js'
	import uploadImage from '@/components/uploadImage/uploadImage.vue'
	export default {
		components: {
			uploadImage
		},
		data() {
			return {
				goodsList: [],
				storeBatchOrderNo: '',
				configRs: '', //所有字典
				afSalesType: "", //售后类型
				afSalesTypeStr: "",
				goodsStatus: "", //货品状态
				goodsStatusStr: "",
				reason: "", //退款原因
				reasonStr: "",
				remark: '',
				imgUrl: '', //上传的图片
				refundAmount: 0, //总退款金额
				refundGoodsAmount: 0, //退款金额
				refundFreightAmount: 0, //运费价格

				clickType: 1, // 1退款类型  2货物状态  3 退款原因
				popupShow: false,
				popupList: [],
				selValue: '', //选择的值
				selName: '', //选择的名字
				EditShow: false,
				editAfId: "",
				afRs: {}
			};
		},
		onLoad() {
			this.dictAll()
			this.afRs = uni.getStorageSync('afRs')
			this.editAfId = this.afRs.id; //修改售后的id
			this.goodsList = this.afRs.goodsList;
			this.storeBatchOrderNo = this.afRs.storeBatchOrderNo;
			this.refundFreightAmount = this.afRs.refundFreightAmount;
			this.refundGoodsAmount = this.afRs.refundGoodsAmount;
			this.refundAmount = this.afRs.isRefundFreight ? (this.refundGoodsAmount + this.refundFreightAmount) : this
				.refundGoodsAmount;
			this.afSalesType = this.afRs.afSalesType;
			this.afSalesTypeStr = this.afRs.afSalesTypeStr;
			this.goodsStatus = this.afRs.goodsStatus;
			this.goodsStatusStr = this.afRs.goodsStatusStr;
			this.reason = this.afRs.reason;
			this.reasonStr = this.afRs.reasonStr;
			this.remark = this.afRs.remark;
			this.imgUrl = this.afRs.imgUrl;
		},
		methods: {
			//字典
			dictAll() {
				commonApi.dictAll().then(res => {
					if (res.code == 200) {
						this.configRs = res.data;
					}
				})
			},
			changerefundAmount() {
				let refundAmount = this.afRs.isRefundFreight ? (this.refundGoodsAmount + this.refundFreightAmount) : this
					.refundGoodsAmount;
				this.refundAmount = this.refundAmount > refundAmount ? refundAmount : this.refundAmount;
				this.EditShow = false
			},
			clickOpenPop(type) {
				this.clickType = type;
				switch (this.clickType) {
					case 1:
						this.popupList = this.configRs.afterSalesTypeEnum;
						this.selValue = this.afSalesType;
						this.selName = this.afSalesTypeStr;
						break;
					case 2:
						this.popupList = this.configRs.goodsStatusEnum;
						this.selValue = this.goodsStatus;
						this.selName = this.goodsStatusStr;
						break;
					case 3:
						this.popupList = this.goodsStatus == 'HAS_RECEIVE_GOODS' ? this
							.configRs.receiveReasonEnum : this.configRs.noReceiveReasonEnum;
						this.selValue = this.reason;
						this.selName = this.reasonStr;
						break;
				}
				this.popupShow = true;
			},
			closePop() {
				switch (this.clickType) {
					case 1:
						this.afSalesType = this.selValue;
						this.afSalesTypeStr = this.selName;
						if (this.afSalesType == 'EXCHANGE_AND_REFUND') {
							this.goodsStatus = 'HAS_RECEIVE_GOODS'
						} else {
							this.goodsStatus = ''
						}
						break;
					case 2:
						this.goodsStatus = this.selValue;
						this.goodsStatusStr = this.selName;
						this.reason = '';
						this.reasonStr = '';
						break;
					case 3:
						this.reason = this.selValue;
						this.reasonStr = this.selName;
						break;
				}
				this.popupShow = false;
			},
			changeImg(e) {
				this.imgUrl = e.imgs
			},
			//申请退款  //修改售后
			applyRefund() {
				let that = this;
				if (!this.ruleForm1(this.afSalesType, this.$t('applyRefund.form1'))) return
				if (this.afSalesType == 'REFUND_ONLY' && !this.goodsStatus) {
					this.showMsg(this.$t('applyRefund.form2') + this.$t('common.cannot'))
					return
				}
				if (!this.ruleForm1(this.reason, this.$t('applyRefund.form3'))) return
				if (!this.ruleForm1(this.remark, this.$t('applyRefund.form5tips2'))) return

				let queryData
				if (this.editAfId) {
					// 修改
					queryData = {
						id: this.editAfId,
						afSalesType: this.afSalesType,
						goodsStatus: this.afSalesType == 'EXCHANGE_AND_REFUND' ? 'HAS_RECEIVE_GOODS' : this
							.goodsStatus,
						reason: this.reason,
						remark: this.remark,
						imgUrl: this.imgUrl,
						refundAmount: this.refundAmount,
					}
					uni.showModal({
						cancelColor: '#999',
						confirmColor: '#E1251B',
						title: that.$t('common.showtitle1'),
						cancelText: that.$t('common.cancel'),
						confirmText: that.$t('common.confirm2'),
						content: that.$t('applyRefund.editsecondtips'),
						success: async (res) => {
							if (res.confirm) {
								afSalesApi.update(queryData).then(res => {
									if (res.code == 200) {
										this.showMsg(res.msg);
										setTimeout(() => {
											this.goToPage('/pages/mine/myOrder?type=5')
										}, 1000)
									}
								})
							}
						}
					});
				} else {
					//申请
					queryData = {
						afSalesType: this.afSalesType,
						goodsStatus: this.afSalesType == 'EXCHANGE_AND_REFUND' ? 'HAS_RECEIVE_GOODS' : this
							.goodsStatus,
						reason: this.reason,
						remark: this.remark,
						imgUrl: this.imgUrl,
						storeBatchOrderNo: this.storeBatchOrderNo,
						goodsList: this.goodsList,
						refundAmount: this.refundAmount,
						refundGoodsAmount: this.refundGoodsAmount,
						refundFreightAmount: 0
					}
					uni.showModal({
						cancelColor: '#999',
						confirmColor: '#E1251B',
						title: that.$t('common.showtitle1'),
						cancelText: that.$t('common.cancel'),
						confirmText: that.$t('common.confirm2'),
						content: that.$t('applyRefund.secondtips'),
						success: async (res) => {
							if (res.confirm) {
								afSalesApi.applyRefund(queryData).then(res => {
									if (res.code == 200) {
										this.showMsg(res.msg);
										setTimeout(() => {
											this.goToPage('/pages/mine/myOrder?type=5')
										}, 1000)
									}
								})
							}
						}
					});
				}


			},
		}

	}
</script>

<style lang="scss" scoped>
	/deep/ .u-textarea__count {
		background: rgba(0, 0, 0, 0) !important;
	}

	.allbtn {
		position: fixed;
		left: 30rpx;
		bottom: 30rpx;
		width: 690rpx;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		font-size: 28rpx;
		color: #FFFFFF;
		font-weight: bold;
		border-radius: 80rpx;
	}

	.wrapper {
		width: 690rpx;
		padding: 20rpx 0;
		margin: 20rpx auto;
		background-color: white;
		border-radius: 20rpx;

		.box {
			width: 630rpx;
			margin: 0 auto;
		}
	}

	.pu-item {
		width: 100%;
		height: 100rpx;
		border-bottom: 1px solid #EFF0F4;
		position: relative;

		.customShadow {
			position: absolute;
			z-index: 20;
			left: 0%;
			top: 0%;
			right: 0%;
			bottom: 0%;
		}

		.pu-l {
			display: flex;
			align-items: center;

			.l-one {
				font-size: 26rpx;
				color: #333333;
			}

			.l-two {
				margin-top: 12rpx;
				margin-left: 4rpx;
				font-size: 28rpx;
				color: #EF1818;
			}
		}

		.pu-r {
			display: flex;
			align-items: center;

			.pu-two {
				margin-left: 12rpx;
				width: 9rpx;
				height: 14rpx;
			}
		}

	}

	.tui-item {
		width: 100%;

		.pu-l {
			display: flex;
			align-items: center;
			width: 100%;
			height: 100rpx;

			.l-one {
				font-size: 26rpx;
				color: #333333;
			}

			.l-two {
				margin-top: 12rpx;
				margin-left: 4rpx;
				font-size: 28rpx;
				color: #EF1818;
			}
		}

		.tui-mid {
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;

			.tui-a {
				font-size: 30rpx;
				font-weight: 500;
				color: #EB1818;
			}

			.tui-b {
				display: flex;
				align-items: center;

				.tui-b-text {
					margin-left: 12rpx;
					font-size: 28rpx;
					font-weight: 500;
					color: #666666;
				}
			}
		}

		.tui-foot {
			margin-top: 12rpx;
			font-size: 24rpx;
			font-weight: 500;
			color: #999999;
		}
	}

	.buc {
		width: 100%;

		.pu-l {
			display: flex;
			align-items: center;
			width: 100%;
			height: 100rpx;

			.l-one {
				font-size: 28rpx;
				color: #333333;
				font-weight: bold;
			}

			.l-two {
				margin-top: 12rpx;
				margin-left: 4rpx;
				font-size: 28rpx;
				color: #EF1818;
			}
		}

		.buc-box {
			width: 100%;
			margin: 0 auto;
			padding: 30rpx 0;
			background-color: rgb(246, 247, 249);
			border-radius: 15rpx;

			.buc-wrapper {
				width: 570rpx;
				margin: 0 auto;

				.buc-foot {
					display: flex;
					align-items: center;
					width: 100%;

					.buc-img {
						width: 120rpx;
						height: 120rpx;
						margin-right: 15rpx;
					}

					.buc-up {
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: space-around;
						width: 120rpx;
						height: 120rpx;
						border: 1px dashed #666;

						.buc-load {
							width: 36rpx;
							height: 35rpx;
						}

						.buc-a {
							font-size: 18rpx;
							font-weight: 500;
							color: #666666;
						}

						.buc-b {
							font-size: 18rpx;
							font-weight: 500;
							color: #666666;
						}
					}
				}
			}
		}
	}

	.pop-box {
		width: 690rpx;
		margin: 0 auto;
		padding-bottom: 60rpx;
		position: relative;

		.pop-top {
			position: relative;
			height: 80rpx;
			width: 630rpx;

			.pop-a {
				position: absolute;
				left: 215rpx;
				width: 200rpx;
				height: 80rpx;
				font-size: 30rpx;
				color: #333333;
				font-weight: bold;
				text-align: center;
				line-height: 80rpx;
			}

			.pop-b {
				position: absolute;
				right: 0rpx;
				top: 27rpx;
				width: 25rpx;
				height: 25rpx;
			}
		}

		.pop-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;
			height: 75rpx;
			border-bottom: 1px solid #EFF0F4;

			.pop-one {
				font-size: 28rpx;
				color: #333333;
			}
		}

		.pop-btn {
			width: 690rpx;
			height: 80rpx;
			margin-top: 30rpx;
			font-size: 28rpx;
			color: white;
			text-align: center;
			line-height: 80rpx;
			background: linear-gradient(45deg, #F35935, #DD2424);
			border-radius: 70rpx;
			position: absolute;
			bottom: 10rpx;
		}
	}

	.goods-two {
		width: 100%;

		.two-title {
			margin: 20rpx 0;
			font-size: 28rpx;
			font-weight: bold;
			color: #333333;
		}

		.two-wrapper {
			display: flex;
			flex-wrap: wrap;
			width: 100%;

			.size-item {
				height: 70rpx;
				padding: 0 20rpx;
				margin-right: 10rpx;
				margin-bottom: 10rpx;
				font-size: 28rpx;
				font-weight: 500;
				color: #E81515;
				text-align: center;
				line-height: 70rpx;
				background-color: rgba(245, 9, 9, 0.1);
				border: 1rpx solid rgb(245, 9, 9);
				border-radius: 4rpx;
			}
		}
	}

	.goods-three {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 104rpx;
		margin-top: 20rpx;
		border-top: 1px solid #f2f2f2;

		.three-title {
			font-size: 28rpx;
			font-weight: bold;
			color: #333333;
		}

	}
</style>
