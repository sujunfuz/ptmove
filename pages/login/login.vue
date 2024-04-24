<template>
	<view class="loginbg">
		<image class="img1" :src="ossIconUrl+'/login/loginbg.png'" mode="scaleToFill">
		</image>
		<view class="popupView">
			<view class="formView">
				<view v-if="isphone">
					<u-input v-model='mobile' :placeholder="$t('login.inputphone')" :customStyle='inputStyle'
						shape='circle' clearable>
						<image slot="prefix" class="icon1" :src="ossIconUrl+'/login/usericon.png'" mode="scaleToFill">
						</image>
					</u-input>
					<view class="marT30" v-if="isphone">
						<u-input v-model='verifyCode' :customStyle='inputStyle' :placeholder="$t('login.inputcode')"
							shape='circle' clearable>
							<view slot="suffix" class="colorMain" @click.stop="$u.throttle(verificationCode, 1000)">
								{{countdown1>0?countdown1+'s': $t('login.code')}}
							</view>
						</u-input>
					</view>
				</view>
				<view v-else>
					<u-input v-model='loginName' :placeholder="$t('login.inputemail')" :customStyle='inputStyle'
						shape='circle' clearable>
						<image slot="prefix" class="icon1" :src="ossIconUrl+'/login/usericon.png'" mode="scaleToFill">
						</image>
					</u-input>
					<view class="marT30">
						<u-input v-model='pwd' :password='ispassword' :customStyle='inputStyle'
							:placeholder="$t('login.inputpsd')" shape='circle' clearable>
							<image slot="prefix" class="icon1" :src="ossIconUrl+'/login/psdicon.png'"
								mode="scaleToFill">
							</image>
							<image v-if="ispassword" slot="suffix" class="icon2" :src="ossIconUrl+'/login/biyan.png'"
								mode="scaleToFill" @click="ispassword=false"></image>
							<image v-else slot="suffix" class="icon2" :src="ossIconUrl+'/login/zhengyan.png'"
								mode="scaleToFill" @click="ispassword=true"></image>
						</u-input>
					</view>
				</view>

				<view class="marT30 flex-c marL16 wrap">
					<u-checkbox-group @change="checkboxChange">
						<u-checkbox v-model="checked" shape='circle' activeColor="#E1251B" name='1'></u-checkbox>
					</u-checkbox-group>
					<view class="marL10 fontsize24 color1A">{{ $t('login.tips1')}}</view>
					<view class="fontsize24 colorMain"
						@click="goToPage(`/pages/login/richText?protocolType=PROTOCOL_TYPE_ENUM_USER_AGREEMENT`)">
						《{{ $t('login.tips2')}}》
					</view>
					<view class="fontsize24 colorMain"
						@click="goToPage(`/pages/login/richText?protocolType=PROTOCOL_TYPE_ENUM_PRIVACY_AGREEMENT`)">
						《{{ $t('login.tips3')}}》
					</view>
				</view>
				<view class="loginbts bgMain colorfff marT60" @click.stop="$u.throttle(login, 1000)">
					{{$t('login.title')}}
				</view>
				<view v-if="isphone" class="loginbts borderC5 marT20" @click="isphone=false">{{$t('login.email')}}
				</view>
				<view v-else class="loginbts borderC5 marT20" @click="isphone=true">{{$t('login.phone')}}</view>

				<view class="tipstext flex-cc">
					<view @click="goToPage('/pages/login/forgetpsd')">{{$t('login.forgetpsd')}}？</view>
					<view class="xian"></view>
					<view @click="goToPage('/pages/login/register')">{{$t('login.register')}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import loginApi from '@/api/login.js'
	export default {
		data() {
			return {
				countdown1: 0,
				mobile: '',
				verifyCode: '',
				loginName: '',
				pwd: '',
				ispassword: true,
				checked: false,
				inputStyle: {
					padding: '25rpx 40rpx 25rpx 40rpx',
					background: '#F6F6F6',
				},
				isphone: false,
				Timer: null,
			}
		},
		onLoad() {},
		methods: {
			verificationCode() {
				if (this.countdown1 > 0) return
				if (!this.ruleForm1(this.mobile, this.$t('register.input7'))) return
				loginApi.verificationCode({
					applicantMobile: this.mobile,
				}).then(res => {
					clearInterval(this.Timer)
					this.Timer = null;
					if (res.code == 200) {
						this.countdown1 = 60
						this.Timer = setInterval(() => {
							this.countdown1--
						}, 1000)
					}
				})
			},
			checkboxChange(e) {
				this.checked = e.length > 0 ? true : false
			},
			login() {
				if (this.isphone) {
					this.phoneLogin();
				} else {
					this.emailLogin();
				}
			},
			//手机号验证码登录
			phoneLogin() {
				if (!this.ruleForm1(this.mobile, this.$t('login.mobile'))) return
				if (!this.ruleForm1(this.verifyCode, this.$t('login.code1'))) return
				if (!this.checked) {
					this.showMsg(this.$t('login.tips1') + this.$t('login.tips2') + this.$t('login.tips3'))
					return
				}
				// #ifdef MP-WEIXIN
				this.wechatLogin('MOBILE')
				// #endif

				// #ifndef MP-WEIXIN
				loginApi.phoneLogin({
					mobile: this.mobile,
					verifyCode: this.verifyCode,
				}).then(res => {
					if (res.code == 200) {
						this.successLogin(res.data)
					}
				})
				// #endif

			},
			//账号登录
			emailLogin() {
				if (!this.ruleForm1(this.loginName, this.$t('login.email'))) return
				if (!this.ruleForm1(this.pwd, this.$t('register.input2'))) return
				if (!this.checked) {
					this.showMsg(this.$t('login.tips1') + this.$t('login.tips2') + this.$t('login.tips3'))
					return
				}
				let obj = {
					loginName: this.loginName,
					pwd: this.pwd,
				}
				// #ifdef MP-WEIXIN
				this.wechatLogin('ACCOUNT')
				// #endif

				// #ifndef MP-WEIXIN
				loginApi.emailLogin(obj).then(res => {
					if (res.code == 200) {
						this.successLogin(res.data)
					}
				})
				// #endif

			},
			//微信账号密码登录 type  MOBILE手机号验证码登录  ACCOUNT账号登录
			wechatLogin(type) {
				let that = this;
				wx.login({
					success: (reswx) => {
						let obj = {
							appId: this.myAppId,
							code: reswx.code,
							loginName: this.loginName,
							pwd: this.pwd,
							mobile: this.mobile,
							verifyCode: this.verifyCode,
							type: type
						}
						console.log(obj)
						loginApi.wechatLogin(obj).then(res => {
							if (res.code == 200) {
								uni.setStorageSync('openId', res.data.openId)
								this.successLogin(res.data)
							}
						})
					}
				})
			},
			successLogin(data) {
				uni.setStorageSync('token', data.tokenInfo)
				uni.setStorageSync('userInfo', data.userInfo)
				let formPath = uni.getStorageSync('formPath')
				if (formPath == '/pages/tabbar/shopcart' || formPath == '/pages/tabbar/mine' || formPath ==
					'/pages/tabbar/index' || formPath == '/pages/tabbar/class') {
					this.goToSw(formPath)
				} else if (!formPath) {
					this.goToSw('/pages/tabbar/index')
				} else {
					this.goToPage(formPath)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.loginbg {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));
		overflow: hidden;
		background: #fff;
		position: relative;

		.img1 {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 598rpx;
		}

		.popupView {
			width: 100%;
			height: 70vh;
			border-radius: 40rpx 40rpx 0px 0px;
			background: #fff;
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 100;

			.formView {
				width: 648rpx;
				margin: 120rpx auto;

				.icon1 {
					width: 40rpx;
					height: 40rpx;
				}

				.icon2 {
					width: 32rpx;
					height: 32rpx;
				}

				.loginbts {
					text-align: center;
					height: 90rpx;
					line-height: 90rpx;
					border-radius: 50rpx;
				}

				.tipstext {
					position: fixed;
					left: 0;
					right: 0;
					bottom: 100rpx;
					margin: 0 auto;
					width: 100%;

					.xian {
						width: 1rpx;
						height: 30rpx;
						background: #C5C5C5;
						margin: 0 30rpx;
					}
				}
			}
		}
	}
</style>
