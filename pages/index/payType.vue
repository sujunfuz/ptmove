<template>
	<view class="payTypebg">
		<u-navbar leftIconColor='#fff' :title="$t('payType.title')" :titleStyle='{"color":"#fff"}' :placeholder='true'
			bgColor="#E1251B" fixed="" @leftClick="leftClick"></u-navbar>
		<view class="pad20" style="padding-bottom: 138rpx;">
			<view class="flex-cc marT20">
				<view class="fontsize24 color9c">{{$t('payType.residue')}}: </view>
				<u-count-down :time="countdownNum" :format="$t('common.countdown1')" autoStart>
				</u-count-down>
			</view>
			<view class="flex-cc">
				<view class="colorMain marT20 flex-cc" v-if="data.unPaidAmountShow">
					<view style="position: relative;top: 6rpx;" class="fontbold">{{globalUnit}}</view>
					<view class="marL6 fontsize50 fontbold">{{data.unPaidAmountShow}}</view>
				</view>
				<!-- <view class="colorMain marT20 flex-cc" v-if="globalUnit!='¥'">
					<view style="position: relative;top: 6rpx;" class="fontbold">≈¥</view>
					<view class="marL6 fontsize50 fontbold">{{data.unPaidAmount}}</view>
				</view> -->
			</view>
			<view v-if="data.paidAmount>0" class="textC colorMain marT20">{{$t('common.yifu')}}:
				{{globalUnit}}{{data.paidAmountShow}},
				{{$t('common.zongji')}}: {{globalUnit}}{{data.realAmountShow}}
			</view>
			<view class="marT30">{{$t('payType.selway')}}</view>
			<view class="way_ul">
				<view v-for="(it,i) in payList" :key="i" class="way_li flex-cb"
					@click="channelCode=it.channelCode;channelType=it.channelType">
					<view class="flex-c">
						<image class="img60" :src="ImgUrl+it.channelIcon" mode="scaleToFill">
							<view class="fontbold marL20">{{$t(it.channelName)}}</view>
					</view>
					<image v-if="channelCode==it.channelCode" class="img36" :src="ossIconUrl+'/index/xuanze1.png'"
						mode="scaleToFill">
						<image v-else class="img36" :src="ossIconUrl+'/index/weixuanze.png'" mode="scaleToFill">
				</view>
			</view>
			<view class="marT30">{{$t('payType.seltype')}}</view>
			<view class="typeView">
				<view class="flex-c">
					<view v-for="(it,i) in typeList" :key="i" class="flex-c" style="width: 50%;" @click="selType(it)">
						<image v-if="payType==it.value" class="img36" :src="ossIconUrl+'/index/xuanze2.png'"
							mode="scaleToFill">
							<image v-else class="img36" :src="ossIconUrl+'/index/weixuanze.png'" mode="scaleToFill">
								<view class="marL10">{{$t(it.label)}}</view>
					</view>
				</view>
				<block v-if="payType=='PAY_MORE_THAN_ONCE'">
					<!-- 	<view class="fontsize24 marT32">{{$t('payType.duocitips1')}}（{{$t('payType.duocitips2')}}$100）
					</view> -->
					<view class="marT20">
						<u-input v-model='price1' :customStyle='inputStyle' :placeholder="$t('common.input')" clearable>
							<!-- <view slot="prefix">¥</view> -->
						</u-input>
					</view>
				</block>
			</view>
			<view v-if="signImg" class="flex-cb typeView">
				<image class="img60 borderMain" :src="ImgUrl+signImg" mode="scaleToFill" @click="lookImg">
					<view class="flex-c" @click="signatureshow=true">
						<u-icon name="edit-pen" color="#E1251B" size="18"></u-icon>
						<view class="colorMain marL6">{{$t('common.edit2')}}</view>
					</view>
			</view>
			<view v-else class="flex-cb typeView">
				<view class="">{{$t('payType.shuxie')}}</view>
				<view class="flex-c" @click="signatureshow=true">
					<u-icon name="edit-pen" color="#E1251B" size="18"></u-icon>
					<view class="colorMain marL6">{{$t('common.edit')}}</view>
				</view>
			</view>
		</view>
		<view class="btsView">
			<view class="bts bgMain colorfff fontbold fontsize30" @tap="$u.throttle(confirmPay, 500)">
				{{$t('common.payment2')}}
			</view>
		</view>
		<signature :show="signatureshow" @close='signatureshow=false' @success='signsuccess'></signature>
		<u-modal :show="setPayShow" @confirm="setPayShow=false;goToPage('/pages/set/setPass')" ref="uModal"
			@cancel='setPayShow=false' :cancelText="$t('common.cancel')" :confirmText="$t('common.shezhi')"
			:showCancelButton='true' confirmColor='#E1251B' width='540rpx'>
			<view class="slot-content">
				<view class="textC">{{$t('common.setpaypwdtitle')}}</view>
			</view>
		</u-modal>
		<paypwd v-if="pwdShow" :show="pwdShow" :amount='amount' @close='pwdShow=false;' @finish='pwdOrderPay'></paypwd>
		<!-- <a :href="payUrl">{{payUrl}}</a> -->
	</view>
</template>

<script>
	import paypwd from '@/components/paypwd/paypwd.vue'
	import indexApi from '@/api/index.js'
	import commonApi from '@/api/common.js'
	import signature from '@/components/signature/signature.vue'
	export default {
		components: {
			signature,
			paypwd
		},
		data() {
			return {
				inputStyle: {
					padding: '20rpx 30rpx',
				},
				payList: [],
				channelCode: 'WEIXIN',
				typeList: [],
				payType: '', //一次，多次
				price1: '', //多次金额
				signatureshow: false,
				signImg: '',
				data: '', //上个页面来的数据
				countdownNum: 0, //单次倒计时
				setPayShow: false,
				amount: 0,
				pwdShow: false,
				payUrl: '',
				channelType: ''
			}
		},
		onLoad(e) {
			if (e.data) {
				this.data = JSON.parse(e.data);
			}
			this.dictAll();
			this.getChannel();
			this.getcountdown();
		},
		methods: {
			//计算倒计时
			getcountdown() {
				let now = Date.now()
				this.countdownNum = this.data.remainPayTime - now;
			},
			dictAll() {
				commonApi.dictAll().then(res => {
					if (res.code == 200) {
						this.typeList = res.data.payType;
						this.payType = this.typeList[0].value;
					}
				})
			},
			getChannel() {
				let sceneTypel

				// #ifdef MP-WEIXIN
				sceneTypel = 'WECHAT_MP'
				// #endif

				// #ifdef H5
				sceneTypel = 'H5'
				// #endif

				// #ifdef APP
				sceneTypel = 'APP'
				// #endif

				commonApi.getChannel(sceneTypel).then(res => {
					if (res.code == 200) {
						this.payList = res.data;
						this.channelCode = this.payList[0].channelCode;
						this.channelType = this.payList[0].channelType;
					}
				})
			},
			selType(item) {
				this.payType = item.value;
			},
			signsuccess(e) {
				this.signImg = e;
				this.signatureshow = false
			},
			//预览图片
			lookImg() {
				let arr = [this.ImgUrl + this.signImg];
				arr.push()
				uni.previewImage({
					current: 0,
					urls: arr,
				});
			},
			gocreateFill() {
				this.goToPage('/pages/index/createFill')
			},

			// 弹窗确认支付
			confirmPay() {
				if (this.payType == 'PAY_MORE_THAN_ONCE' && !this.price1) {
					this.showMsg(this.$t('common.price') + this.$t('common.cannot'))
					return
				}
				if (!this.ruleForm1(this.signImg, this.$t('payType.shuxie'))) return
				this.amount = this.payType == 'PAY_MORE_THAN_ONCE' ? this.price1 : this.data.unPaidAmount +
					''; //多次支付和单次不一样

				// #ifdef MP-WEIXIN

				switch (this.channelType) {
					case 'WECHAT':
						this.orderPayWX();
						break;
					default:
						this.showMsg(this.$t('common.msg1'))
						break;
				}
				// #endif

				// #ifndef MP-WEIXIN
				if (!this.userInfo.payPwd) {
					this.setPayShow = true;
					return
				}
				let payObj = {
					batchOrdNo: this.data.batchOrdNo,
					channelCode: this.channelCode,
					payType: this.payType,
					signImage: this.signImg,
					amount: this.amount,
				}
				switch (this.channelType) {
					case 'VISA':
						// console.log('信用卡支付')
						this.goToPage('/pages/index/createFill?payObj=' + JSON.stringify(payObj))
						break;
					case 'UNION_PAY':
						// console.log('聚合支付')
						this.goToPage('/pages/index/createFill?channelType=UNION_PAY&&payObj=' + JSON.stringify(payObj))
						break;
					default:
						this.pwdShow = true;
						break;
				}
				// #endif
			},


			pwdOrderPay(e) {
				let that = this;
				this.pwdShow = false;
				let payObj = {
					batchOrdNo: this.data.batchOrdNo,
					channelCode: this.channelCode,
					payType: this.payType,
					signImage: this.signImg,
					amount: this.amount,
					pwd: e,
					sceneType: 'H5'
				}
				console.log(payObj)
				indexApi.orderPay(payObj).then(res => {
					if (res.code == 200) {
						//目前H5  只有微信和支付宝支付。
						// #ifdef H5
						this.payUrl = res.data.payUrl;
						console.log(this.payUrl)
						window.location.href = this.payUrl;
						// #endif

						// uni.getProvider({
						// 	service: 'payment',
						// 	success: function(res) {
						// 		uni.requestPayment({
						// 			"provider": this.channelCode, //固定值为 支付宝还是微信
						// 			"orderInfo": res.data.payUrl, //此处为服务器返回的订单信息字符串
						// 			success: function(res) {
						// 				console.log(res);
						// 			},
						// 			fail: function(err) {
						// 				console.log(err);
						// 			}
						// 		});
						// 	}
						// });
					}
				})
			},

			//微信小程序支付
			orderPayWX() {
				let that = this;
				indexApi.orderPay({
					batchOrdNo: this.data.batchOrdNo,
					channelCode: this.channelCode,
					payType: this.payType,
					signImage: this.signImg,
					amount: this.amount,
					openId: uni.getStorageSync('openId'),
					sceneType: 'WECHAT_MP'
				}).then(res => {
					if (res.code == 200) {
						wx.requestPayment({
							timeStamp: res.data.timeStamp,
							nonceStr: res.data.nonceStr,
							package: res.data.package,
							signType: res.data.signType,
							paySign: res.data.paySign,
							success: wxres => {
								that.showMsg(res.msg || that.$t('common.operateSuccess'))
								setTimeout(e => {
									that.goDelPage('/pages/mine/myOrder')
								}, 1000)
							},
							fail: err => {
								that.showMsg(that.$t('common.cancelpay'), 'error');
								setTimeout(e => {
									that.goDelPage('/pages/mine/myOrder?type=1')
								}, 1000)
							}
						})
					}
				})
			},

		}
	}
</script>

<style lang="scss" scoped>
	/deep/ .u-count-down {
		.u-count-down__text {
			font-size: 24rpx;
			color: #9C9E9C;
			margin: 5rpx 5rpx 0 5rpx;
		}
	}

	.payTypebg {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));

		.yuan {
			width: 36rpx;
			height: 36rpx;
			border-radius: 50%;
			border: 2px solid #C5C5C5;
		}

		.way_ul {
			margin-top: 20rpx;
			background: #fff;
			padding: 0 30rpx;
			border-radius: 20rpx;

			.way_li {
				border-bottom: 1rpx solid #E3E4E5;
				padding: 40rpx 0;
			}

			.way_li:last-child {
				border: none;
			}
		}

		.typeView {
			background: #fff;
			padding: 40rpx 30rpx;
			border-radius: 20rpx;
			margin-top: 20rpx;
		}

	}
</style>
