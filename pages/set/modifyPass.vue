<template>
	<view class="loginbg">
		<u-navbar :title="passType == 'pay' ? $t('modifyPayPass.title') : $t('modifyLoginPass.title')"
			:titleStyle='{"color":"#fff","fontWeight":"bold"}' :placeholder='true' bgColor="#E1251B" fixed="" autoBack
			leftIconColor="white"></u-navbar>
		<view class="formView bgfff bdRadius20 padLR20">
			<view class=''>
				<u-input v-model='pwd' :password='ispassword' :customStyle='inputStyle'
					:placeholder="$t('common.input1')" clearable border="none" :type="passType=='pay'?'number':'text'"
					:maxlength="passType=='pay'?6:-1">
					<view slot="prefix" class="color1A inputLeft">{{inputLabel[0]}}</view>
					<image v-if="ispassword" slot="suffix" class="icon2" :src="ossIconUrl+'/login/biyan.png'"
						mode="scaleToFill" @click="ispassword=false"></image>
					<image v-else slot="suffix" class="icon2" :src="ossIconUrl+'/login/zhengyan.png'" mode="scaleToFill"
						@click="ispassword=true"></image>
				</u-input>
			</view>
			<view class=''>
				<u-input v-model='pwd1' :password='ispassword1' :customStyle='input2Style'
					:placeholder="$t('common.input1')" clearable border="none" :type="passType=='pay'?'number':'text'"
					:maxlength="passType=='pay'?6:-1">
					<view slot="prefix" class="color1A inputLeft">{{inputLabel[1]}}</view>
					<image v-if="ispassword1" slot="suffix" class="icon2" :src="ossIconUrl+'/login/biyan.png'"
						mode="scaleToFill" @click="ispassword1=false"></image>
					<image v-else slot="suffix" class="icon2" :src="ossIconUrl+'/login/zhengyan.png'" mode="scaleToFill"
						@click="ispassword1=true"></image>
				</u-input>
			</view>
			<view class=''>
				<u-input v-model='pwd2' :password='ispassword2' :customStyle='inputStyle'
					:placeholder="$t('common.input2')" clearable border="none" :type="passType=='pay'?'number':'text'"
					:maxlength="passType=='pay'?6:-1">
					<view slot="prefix" class="color1A inputLeft">{{inputLabel[2]}}</view>
					<image v-if="ispassword2" slot="suffix" class="icon2" :src="ossIconUrl+'/login/biyan.png'"
						mode="scaleToFill" @click="ispassword2=false"></image>
					<image v-else slot="suffix" class="icon2" :src="ossIconUrl+'/login/zhengyan.png'" mode="scaleToFill"
						@click="ispassword2=true"></image>
				</u-input>
			</view>

		</view>
		<view class="modifybts bgMain colorfff bdRadius20 marAuto" @tap.stop="requestModifyPass">
			{{$t('common.confirm')}}
		</view>
		<view class="textC marT20 forget-pass" @tap.stop="handleForgetPass">
			{{$t('modifyPass.forgetPass')}}
		</view>
	</view>
</template>

<script>
	import setApi from '@/api/set.js'
	export default {
		data() {
			return {
				// pay | login
				passType: 'pay',
				inputLabel: [],
				pwd: '',
				pwd1: '',
				pwd2: '',
				inputStyle: {
					padding: '35rpx 0 35rpx 0',
				},
				input2Style: {
					padding: '35rpx 0 35rpx 0',
					borderTop: '1px solid #e3e4e5',
					borderBottom: '1px solid #e3e4e5',
				},
				ispassword: true,
				ispassword1: true,
				ispassword2: true,
			}
		},
		onLoad(options) {
			this.passType = options.type
		},
		created() {
			for (let i = 0; i < 3; i++) {
				if (this.passType == 'pay') {
					this.inputLabel[i] = this.$t(`modifyPayPass.input${i+1}`)
				} else {
					this.inputLabel[i] = this.$t(`modifyLoginPass.input${i+1}`)
				}
			}
		},
		methods: {
			requestModifyPass() {
				if (!this.ruleForm1(this.pwd, this.inputLabel[0])) return
				if (!this.ruleForm1(this.pwd1, this.inputLabel[1])) return
				if (!this.ruleForm1(this.pwd2, this.inputLabel[2])) return
				if (this.pwd1.length != 6 && this.passType == 'pay') {
					this.showMsg(this.$t("setPass.numPass6"))
					return
				}
				if (this.pwd2 != this.pwd1) {
					this.showMsg(this.$t("modifyPass.diffPass"))
					return
				}
				setApi.changePwd({
					oldPwd: this.pwd,
					newPwd: this.pwd1,
					confirmPwd: this.pwd2,
					operatorType: this.passType == 'pay' ? 'PAYPWD' : 'PWD'
				}).then(res => {
					if (res.code == 200) {
						this.showMsg(this.$t("common.editSuccess"))
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							});
						}, 1500)
					}
				})
			},
			handleForgetPass() {
				if (this.passType == 'login') {
					this.goToPage('/pages/login/forgetpsd')
				} else {
					this.goToPage('/pages/set/selFindType')
					// this.showMsg(this.$t('common.msg1'))
				}
			}
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
