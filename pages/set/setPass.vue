<template>
	<view class="loginbg">
		<u-navbar :title=" $t('setPass.title')" :titleStyle='{"color":"#fff","fontWeight":"bold"}' :placeholder='true'
			bgColor="#E1251B" fixed="" autoBack leftIconColor="white"></u-navbar>
		<view class="formView bgfff bdRadius20 padLR20">
			<view class=''>
				<u-input v-model='pwd1' :password='ispassword1' :customStyle='input2Style'
					:placeholder="$t('setPass.numPass6')" clearable border="none" type="number" :maxlength='6'>
					<view slot="prefix" class="color1A inputLeft">{{$t("setPass.title")}}</view>
					<image v-if="ispassword1" slot="suffix" class="icon2" :src="ossIconUrl+'/login/biyan.png'"
						mode="scaleToFill" @click="ispassword1=false"></image>
					<image v-else slot="suffix" class="icon2" :src="ossIconUrl+'/login/zhengyan.png'" mode="scaleToFill"
						@click="ispassword1=true"></image>
				</u-input>
			</view>
			<view class=''>
				<u-input v-model='pwd2' :password='ispassword2' :customStyle='inputStyle'
					:placeholder="$t('setPass.numPass6')" clearable border="none" type="number" :maxlength='6'>
					<view slot="prefix" class="color1A inputLeft">{{$t("setPass.confPayPass")}}</view>
					<image v-if="ispassword2" slot="suffix" class="icon2" :src="ossIconUrl+'/login/biyan.png'"
						mode="scaleToFill" @click="ispassword2=false"></image>
					<image v-else slot="suffix" class="icon2" :src="ossIconUrl+'/login/zhengyan.png'" mode="scaleToFill"
						@click="ispassword2=true"></image>
				</u-input>
			</view>

		</view>
		<view class="modifybts bgMain colorfff bdRadius20 marAuto" @tap.stop="requestModifyPass">
			{{$t('setPass.confirmSet')}}
		</view>
	</view>
</template>

<script>
	import setApi from '@/api/set.js'
	export default {
		data() {
			return {
				pwd1: '',
				pwd2: '',
				inputStyle: {
					padding: '35rpx 0 35rpx 0',
				},
				input2Style: {
					padding: '35rpx 0 35rpx 0',
					borderBottom: '1px solid #e3e4e5',
				},
				ispassword1: true,
				ispassword2: true,
			}
		},
		onLoad(options) {},
		created() {},
		methods: {
			requestModifyPass() {
				if (!this.ruleForm1(this.pwd1, this.$t("setPass.title"))) return
				if (!this.ruleForm1(this.pwd2, this.$t("setPass.confPayPass"))) return
				if (this.pwd1.length != 6) {
					this.showMsg(this.$t("setPass.numPass6"))
					return
				}
				if (this.pwd2 != this.pwd1) {
					this.showMsg(this.$t("modifyPass.diffPass"))
					return
				}
				setApi.changePwd({
					oldPwd: '',
					newPwd: this.pwd1,
					confirmPwd: this.pwd2,
					operatorType: 'PAYPWD'
				}).then(res => {
					if (res.code == 200) {
						const userInfo = uni.getStorageSync('userInfo')
						uni.setStorageSync('userInfo', {
							...userInfo,
							payPwd: true
						})
						this.showMsg(this.$t("common.operateSuccess"))
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							});
						}, 1500)
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.loginbg {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));
		background: #f6f6f6;

		.formView {
			width: 702rpx;
			margin: 20rpx auto;
			box-sizing: border-box;

			.inputLeft {
				width: 168rpx;
				position: relative;
				text-align: center;
				padding-right: 30rpx;
			}

			// .inputLeft::after {
			// 	content: '';
			// 	position: absolute;
			// 	right: 10rpx;
			// 	top: 5rpx;
			// 	background: #C5C5C5;
			// 	width: 1rpx;
			// 	height: 32rpx;
			// }

			.icon2 {
				width: 32rpx;
				height: 32rpx;
			}


		}

		.modifybts {
			text-align: center;
			width: 702rpx;
			height: 90rpx;
			line-height: 90rpx;
		}

		.tipstext {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 100rpx;
			margin: 0 auto;
			width: 100%;
		}

		.forget-pass {
			color: #005DFF;
		}
	}
</style>