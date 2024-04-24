<template>
	<view>
		<!-- 填写快递单号  商家同意，待买家退货-->
		<view class="wrapper" v-if="rs.afSalesStatus == 'MER_AGREE_TH_TK'">
			<view class="box">
				<view class="xies">
					<view class="xie-l" style="width: 188rpx">
						<view class="xie-txt">{{ $t("afterSaleDetails.wyjc") }}</view>
					</view>
					<view class="flex-cb" style="width: 100%" @tap="fillPopup = true">
						<view class="colorMain">{{ $t("afterSaleDetails.txdh") }}</view>
						<u-icon name="arrow-right" color="#9C9E9C" size="15"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<!-- 买家寄出，待商家同意退货 -->
		<view class="wrapper" v-if="rs.afSalesStatus == 'USER_SEND_WAIT_MER_TK'">
			<view class="box">
				<view class="xies">
					<view class="xie-l">
						<view class="xie-txt flexnone">{{ $t("afterSaleDetails.wyjc") }}</view>
						<view class="marL20">{{rs.refundLogisticsCodeStr}}</view>
						<view class="marL10">{{rs.refundLogisticsNo}}</view>
						<view class="copy-txt flexnone" @tap="copyText(rs.refundLogisticsNo)">{{ $t("common.copy")}}</view>
					</view>
					<!-- <u-icon name="arrow-right" color="#9C9E9C" size="15"></u-icon> -->
				</view>
			</view>
		</view>
		<!-- 协商 查看 -->
		<view class="wrapper" @tap="goconsultHistory()">
			<view class="box">
				<view class="xies">
					<view class="xie-l">
						<view class="xie-txt">{{ $t("afterSaleDetails.xsls") }}</view>
						<view class="xie-txt" style="margin-left: 30rpx">{{
              $t("afterSaleDetails.ckqb")
            }}</view>
					</view>
					<u-icon name="arrow-right" color="#9C9E9C" size="15"></u-icon>
				</view>
			</view>
		</view>
		<!-- 退款信息 -->
		<view class="wrapper" style="padding: 20rpx 0">
			<view class="box">
				<view class="card-top">{{ $t("afterSaleDetails.shxx") }}</view>
				<view class="card-body" v-for="(item, index) in rs.afSalesGoodsDetailVOS" :key="index">
					<image class="c-img" :src="ImgUrl + item.skuImage" mode="scaleToFill"></image>
					<view class="card-mid">
						<view class="mid-one">{{ item.spuName }}</view>
						<view class="mid-two">{{ item.skuIndexesVal }}</view>
					</view>
					<view class="card-r">
						<view class="r-one">{{globalUnit}}{{ item.unitPrice }}</view>
						<view class="r-two">x{{ item.refundNum }}</view>
					</view>
				</view>
				<view class="card-foot">
					<view class="card-txt">
						<view class="txt-a">{{ $t("afterSaleDetails.shdh") }}{{ rs.afterSalesNo }}</view>
						<text class="copy-txt" @tap="copyText(rs.afterSalesNo)">{{$t("common.copy")}}</text>
					</view>
					<view class="card-txt">
						<view class="txt-a">{{ $t("applyRefund.form3") }}</view>
						<view class="txt-b">{{ rs.remark }}</view>
					</view>
					<view class="card-txt">
						<view class="txt-a">{{ $t("applyRefund.form4") }}</view>
						<view class="txt-b">{{globalUnit}}{{ rs.refundAmount }}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部全局按钮 -->
		<view class="allbtn">
			<!--   平台介入 -->
			<view v-if="
          rs.afSalesStatus == 'MER_REFUSE_TK' ||
          rs.afSalesStatus == 'MER_REFUSE_TH_TK' ||
          rs.afSalesStatus == 'MER_REFUSE_TK_WAIT_USER'
        " class="gray-btn" @tap="$u.throttle(applyPlatform, 1500)">{{$t('afterSaleDetails.ptjr')}}</view>
			<!-- 撤销申请 -->
			<view v-if="
          rs.afSalesStatus == 'MER_WAIT_TK' ||
          rs.afSalesStatus == 'MER_REFUSE_TK' ||
          rs.afSalesStatus == 'MER_WAIT_TH_TK' ||
          rs.afSalesStatus == 'MER_REFUSE_TH_TK' ||
          rs.afSalesStatus == 'MER_AGREE_TH_TK' ||
          rs.afSalesStatus == 'MER_REFUSE_TK_WAIT_USER'||
          rs.afSalesStatus == 'SYS_INTERVENE'
        " class="gray-btn" @tap="$u.throttle(revoke, 1500)">{{$t('afterSaleDetails.cxsq')}}</view>

			<!-- 补充描述 -->
			<view v-if="rs.afSalesStatus == 'SYS_INTERVENE'"
				@click="uploadImg = rs.imgUrl;remark = rs.remark;popupShow = true; " class="gray-btn">
				{{$t('afterSaleDetails.bcms')}}</view>
			<!-- 修改申请 -->
			<view @click="editapply()" v-if="
          rs.afSalesStatus == 'MER_REFUSE_TK' ||
          rs.afSalesStatus == 'MER_REFUSE_TH_TK' ||
          rs.afSalesStatus == 'MER_REFUSE_TK_WAIT_USER' ||
          rs.afSalesStatus == 'MER_REFUSE_HH' ||
          rs.afSalesStatus == 'MER_RECEIVE_REFUSE_HH_WAIT_USER'
        " class="gray-btn" style="border: 1rpx solid #eb1818; color: #eb1818">{{$t('afterSaleDetails.xgsq')}}</view>
		</view>
		<u-popup :show="popupShow" mode="center" :round="20" closeable @close="popupShow = false">
			<view class="popupview">
				<view class="flex-c headview marB32">
					<view class="fontbold">{{$t('afterSaleDetails.bcmstitle')}}</view>
					<view class="colorRed">*</view>
				</view>
				<view style="background: #fafafa">
					<view>
						<u--textarea v-model="remark" :height="200" :maxlength="200"
							:placeholder="$t('afterSaleDetails.bcmstips')" count></u--textarea>
					</view>
					<view class="marB20 marT20">
						<uploadImage :comWidth="100" :imgSize="180" :limitNum="3" @changeImg="changeImg"
							:imgs="uploadImg" :imgType="1"></uploadImage>
					</view>
				</view>
				<view class="bts1 bgLRMain marT36 colorfff" @click="addDescription">{{$t('common.confirm3')}}</view>
			</view>
		</u-popup>
		<!-- 物流弹窗 -->
		<u-popup :show="fillPopup" mode="center" :round="20">
			<view class="pop-wrapper">
				<view class="pop-box">
					<view class="pop-header">{{ $t("afterSaleDetails.txdhtitle") }}</view>
					<view class="pop-input" :class="!logisticsCode?'zhi':''" @tap="pickerShow = true">
						{{logisticsCode?logisticsName:$t('afterSaleDetails.txdhsel')}}
					</view>
					<input v-model="logisticsNo" type="text" placeholder-style="padding-left: 15rpx;"
						:placeholder="$t('afterSaleDetails.txdhinput')" class="pop-input" />
					<view class="pop-all-btn">
						<view class="left-btn" @tap="fillPopup = false;pickerShow = false;">{{ $t("common.cancel") }}
						</view>
						<view class="right-btn" @tap="submitLogistics()">{{$t("common.confirm3")}}</view>
					</view>
				</view>
			</view>
		</u-popup>
		<!-- 选择物流 -->
		<u-popup :show="pickerShow" mode="bottom" :round="20" closeable @close='pickerShow=false'>
			<view style="padding: 30rpx;">
				<view class="fontsize30 fontbold textC marB30">{{$t('afterSaleDetails.txdhsel')}}</view>
				<u-search v-model='keyword' :inputStyle='searchStyle' :placeholder="$t('index.search')"
					:showAction='false' @change="search">
				</u-search>
				<scroll-view scroll-y="true" style="height: 70vh;">
					<view class="flex-cb marT30" v-for="(item,index) in logisticsCodeList" :key="index"
						@tap="selValue=item.value;selName=item.label">
						<view>{{item.label}}</view>
						<image v-if="selValue==item.value" class="img36" :src="ossIconUrl+'/index/xuanze1.png'"
							mode="scaleToFill">
							<image v-else class="img36" :src="ossIconUrl+'/index/weixuanze.png'" mode="scaleToFill">
					</view>
				</scroll-view>
				<view class="flex-cb marT40">
					<view class="minbts borderC5" @click="pickerShow=false;selValue= '';selName='';">
						{{$t('common.cancel')}}</view>
					<view class="minbts marL20 borderMain bgMain colorfff" @click="pickerconfirm">
						{{$t('common.confirm2')}}
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import commonApi from "@/api/common.js";
	import afSalesApi from "@/api/afSales.js";
	export default {
		props: {
			rs: {
				type: Object,
				default: () => {},
			},
		},
		data() {
			return {
				searchStyle: {
					padding: '5rpx 0',
				},
				popupShow: false,
				afSalesNo: "", //售后单号
				remark: "",
				uploadImg: "",
				fillPopup: false,
				keyword:'',//搜索条件
				ALLlogisticsCodeList:[],
				logisticsCodeList: [],
				logisticsName: "",
				logisticsCode: "",
				logisticsNo: "",
				pickerShow: false,
				selValue: "",
				selName: "",
			};
		},
		created() {
			this.dictAll();
		},
		methods: {
			dictAll() {
				commonApi.dictAll().then((res) => {
					if (res.code = 200) {
						this.ALLlogisticsCodeList = res.data.logisticsCompanyEnum;
						this.logisticsCodeList =this.ALLlogisticsCodeList;
					}
				});
			},
			//协商历史的查看
			goconsultHistory() {
				this.goToPage(
					"/pages/aftersale/consultHistory?dataList=" +
					encodeURIComponent(JSON.stringify(this.rs.afterSalesConsultDetailVOS))
				);
			},
			pickerconfirm() {
				if (!this.selValue) {
					this.showMsg(this.$t('afterSaleDetails.txdhsel'))
					return
				}
				this.logisticsCode = this.selValue;
				this.logisticsName = this.selName;
				this.pickerShow = false;
			},
			changeImg(e) {
				this.uploadImg = e.imgs;
			},
			//补充描述
			addDescription() {
				afSalesApi
					.addDescription({
						id: this.rs.id,
						imgUrl: this.uploadImg,
						remark: this.remark,
					})
					.then((res) => {
						if (res.code == 200) {
							this.showMsg(res.msg);
							this.popupShow = false;
							this.uploadImg = "";
							this.remark = "";
							setTimeout((e) => {
								this.$emit("changeStatus");
							}, 1500);
						}
					});
			},
			search(){
				this.logisticsCodeList =this.ALLlogisticsCodeList.filter(it => it.label.indexOf(this.keyword) != -1);
			},
			//填写单号
			submitLogistics() {
				afSalesApi.submitLogistics({
						id: this.rs.id,
						logisticsCode: this.logisticsCode,
						logisticsNo: this.logisticsNo,
					})
					.then((res) => {
						if (res.code == 200) {
							this.showMsg(res.msg);
							this.fillPopup = false;
							this.logisticsCode = "";
							this.logisticsName = "";
							this.logisticsNo = "";
							this.pickerShow = false;
							setTimeout((e) => {
								this.$emit("changeStatus");
							}, 1500);
						}
					});
			},
			//修改申请
			editapply() {
				let afRs = {
					id: this.rs.id,
					refundFreightAmount: this.rs.freightAmount,
					refundGoodsAmount: this.rs.refundGoodsAmount,
					imgUrl: this.rs.imgUrl,
					remark: this.rs.remark,
					afSalesType: this.rs.afSalesType,
					afSalesTypeStr: this.rs.afSalesTypeStr,
					goodsStatus: this.rs.goodsStatus,
					goodsStatusStr: this.rs.goodsStatusStr,
					reason: this.rs.reason,
					reasonStr: this.rs.reasonStr,
				}
				uni.setStorageSync('afRs', afRs)
				this.goToPage("/pages/aftersale/applyRefund");
			},
			//撤销申请
			revoke() {
				let that = this;
				uni.showModal({
					cancelColor: "#999",
					confirmColor: "#E1251B",
					title: that.$t("common.showtitle1"),
					cancelText: that.$t("common.cancel"),
					confirmText: that.$t("common.confirm2"),
					content: that.$t("afterSaleDetails.cxsetips"),
					success: async (res) => {
						if (res.confirm) {
							afSalesApi
								.revoke({
									id: that.rs.id,
								})
								.then((res) => {
									if (res.code == 200) {
										that.showMsg(res.msg);
										setTimeout((e) => {
											that.$emit("changeStatus");
										}, 1500);
									}
								});
						}
					},
				});
			},
			//平台介入
			applyPlatform() {
				let that = this;
				uni.showModal({
					cancelColor: "#999",
					confirmColor: "#E1251B",
					title: that.$t("common.showtitle1"),
					cancelText: that.$t("common.cancel"),
					confirmText: that.$t("common.confirm2"),
					content: that.$t("afterSaleDetails.ptjrtips"),
					success: async (res) => {
						if (res.confirm) {
							afSalesApi
								.applyPlatform({
									id: that.rs.id,
								})
								.then((res) => {
									if (res.code == 200) {
										that.showMsg(res.msg);
										setTimeout((e) => {
											that.$emit("changeStatus");
										}, 1500);
									}
								});
						}
					},
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.wrapper {
		width: 690rpx;
		margin: 20rpx auto;
		background: #ffffff;
		border-radius: 20rpx;

		.box {
			width: 650rpx;
			margin: 0 auto;

			.title {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
			}
		}
	}

	// 协商历史
	.xies {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		height: 86rpx;

		.xie-l {
			display: flex;
			align-items: center;

			.xie-txt {
				font-size: 28rpx;
				font-weight: 500;
				color: #333333;
			}

			.copy-txt {
				margin-left: 10rpx;
				font-size: 24rpx;
				font-weight: 500;
				border: 1px solid #999999;
				border-radius: 4rpx;
				padding: 3rpx 6rpx;
			}
		}

		.xie-img {
			width: 9rpx;
			height: 18rpx;
		}
	}

	//退款信息
	.card-top {
		margin-bottom: 30rpx;
		font-size: 28rpx;
		font-weight: bold;
	}

	.card-body {
		display: flex;
		justify-content: space-between;
		width: 100%;
		height: 150rpx;
		margin-bottom: 10rpx;

		.c-img {
			width: 150rpx;
			height: 150rpx;
			border-radius: 10rpx;
		}

		.card-mid {
			.mid-one {
				width: 350rpx;
				height: 40rpx;
				font-size: 28rpx;
				font-weight: 500;
				color: #1a1a1a;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.mid-two {
				margin-top: 12rpx;
				font-size: 24rpx;
				font-weight: 500;
				color: #999999;
			}
		}

		.card-r {
			display: flex;
			align-items: flex-end;
			flex-direction: column;

			.r-one {
				font-size: 28rpx;
				font-weight: 500;
				color: #1a1a1a;
			}

			.r-two {
				font-size: 28rpx;
				font-weight: 500;
				color: #999999;
			}
		}
	}

	.card-foot {
		width: 100%;
		margin-top: 20rpx;

		.card-txt {
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			height: 50rpx;

			.txt-a {
				font-size: 28rpx;
				font-weight: 500;
				color: #333333;
			}

			.txt-b {
				font-size: 28rpx;
				font-weight: 500;
				color: #999999;
			}

			.copy-txt {
				margin-left: 10rpx;
				font-size: 22rpx;
				font-weight: 500;
				border: 1px solid #999999;
				border-radius: 4rpx;
				padding: 3rpx 6rpx;
			}
		}
	}

	.popupview {
		width: 632rpx;
		padding: 30rpx 20rpx;
	}

	// 弹出层填写单号
	.pop-wrapper {
		width: 630rpx;
		height: 456rpx;
		background: #ffffff;
		border-radius: 20rpx;

		.pop-box {
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			width: 570rpx;
			height: 100%;
			margin: 0 auto;

			.pop-header {
				width: 100%;
				height: 80rpx;
				font-size: 36rpx;
				font-weight: bold;
				text-align: center;
				line-height: 80rpx;
				color: #000000;
			}

			.pop-input {
				width: 100%;
				height: 66rpx;
				line-height: 66rpx;
				margin-bottom: 20rpx;
				background: #f2f2f2;
				border-radius: 4rpx;
				padding-left: 15rpx;
			}

			.zhi {
				padding-left: 30rpx;
				color: grey;
				width: calc(100% - 20rpx);
			}

			.pop-all-btn {
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 100%;
				height: 110rpx;

				.left-btn {
					width: 270rpx;
					height: 70rpx;
					border: 1px solid #808080;
					border-radius: 70rpx;
					font-size: 28rpx;
					font-weight: 500;
					color: #1a1a1a;
					text-align: center;
					line-height: 70rpx;
				}

				.right-btn {
					width: 270rpx;
					height: 70rpx;
					font-size: 28rpx;
					font-weight: 500;
					color: #ffffff;
					text-align: center;
					line-height: 70rpx;
					background: linear-gradient(90deg, #f35935 0%, #dd2424 100%);
					border-radius: 70rpx;
				}
			}
		}
	}

	//底部按钮
	.allbtn {
		position: fixed;
		bottom: 0;
		display: flex;
		justify-content: flex-end;
		width: calc(100% - 40rpx);
		// padding-bottom: constant(safe-area-inset-bottom);
		// /*兼容 IOS<11.2*/
		// padding-bottom: env(safe-area-inset-bottom);
		// /*兼容 IOS>11.2*/
		background-color: white;
		padding: 0 20rpx;

		.gray-btn {
			border: 1px solid #999999;
			border-radius: 50rpx;
			padding: 10rpx 20rpx;
			margin: 20rpx 0 20rpx 20rpx;
		}
	}
</style>
