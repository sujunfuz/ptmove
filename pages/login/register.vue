<template>
	<view class="loginbg">
		<u-navbar leftIcon=' ' :title="$t('register.title')" :titleStyle='{"color":"#fff"}' :placeholder='true'
			bgColor="#E1251B" fixed="" @leftClick="leftClick"></u-navbar>
		<view class="formView wxpadB68">
			<u-input v-model='nickName' :customStyle='inputStyle' :placeholder="$t('common.input')" shape='circle'
				clearable>
				<view slot="prefix" class="color1A inputLeft flex-cc">
					<view class="colorRed marR10">*</view>
					<view class="u-line-1">{{$t('register.input1')}}</view>
				</view>
			</u-input>
			<view class='marT20'>
				<u-input v-model='pwd' :password='ispassword1' :customStyle='inputStyle'
					:placeholder="$t('common.input1')" shape='circle' clearable>
					<view slot="prefix" class="color1A inputLeft flex-cc">
						<view class="colorRed marR10">*</view>
						<view class="u-line-1">{{$t('register.input2')}}</view>
					</view>
					<image v-if="ispassword1" slot="suffix" class="icon2" :src="ossIconUrl+'/login/biyan.png'"
						mode="scaleToFill" @click="ispassword1=false"></image>
					<image v-else slot="suffix" class="icon2" :src="ossIconUrl+'/login/zhengyan.png'" mode="scaleToFill"
						@click="ispassword1=true"></image>
				</u-input>
			</view>
			<view class='marT20'>
				<u-input v-model='pwd2' :password='ispassword2' :customStyle='inputStyle'
					:placeholder="$t('common.input2')" shape='circle' clearable>
					<view slot="prefix" class="color1A inputLeft flex-cc">
						<view class="colorRed marR10">*</view>
						<view class="u-line-1">{{$t('register.input3')}}</view>
					</view>
					<image v-if="ispassword2" slot="suffix" class="icon2" :src="ossIconUrl+'/login/biyan.png'"
						mode="scaleToFill" @click="ispassword2=false"></image>
					<image v-else slot="suffix" class="icon2" :src="ossIconUrl+'/login/zhengyan.png'" mode="scaleToFill"
						@click="ispassword2=true"></image>
				</u-input>
			</view>
			<!-- <view class='marT20'>
				<u-input v-model='name' :customStyle='inputStyle' :placeholder="$t('common.select')" shape='circle'
					clearable>
					<view slot="prefix" class="color1A inputLeft">{{$t('register.input4')}}</view>
					<u-icon slot='suffix' name="arrow-down" color="#9C9E9C" size="15"></u-icon>
				</u-input>
			</view> -->
			<view class='marT20'>
				<u-input v-model='companyName' :customStyle='inputStyle' :placeholder="$t('common.input')"
					shape='circle' clearable>
					<view slot="prefix" class="color1A inputLeft flex-cc">
						<view class="colorRed marR10">*</view>
						<view class="u-line-1">{{$t('register.input5')}}</view>
					</view>
				</u-input>
			</view>
			<view class='marT20'>
				<u-input v-model='realName' :customStyle='inputStyle' :placeholder="$t('common.input')" shape='circle'
					clearable>
					<view slot="prefix" class="color1A inputLeft flex-cc">
						<view class="colorRed marR10">*</view>
						<view class="u-line-1">{{$t('register.input6')}}</view>
					</view>
				</u-input>
			</view>
			<view class='marT20'>
				<u-input v-model='mobile' :customStyle='inputStyle' :placeholder="$t('common.input')" shape='circle'
					clearable>
					<view slot="prefix" class="color1A inputLeft flex-cc">
						<view class="colorRed marR10">*</view>
						<view class="u-line-1">{{$t('register.input7')}}</view>
					</view>
				</u-input>
			</view>
			<view class='marT20'>
				<u-input v-model='email' :customStyle='inputStyle' :placeholder="$t('common.input')" shape='circle'
					clearable>
					<view slot="prefix" class="color1A inputLeft flex-cc">
						<view class="colorRed marR10">*</view>
						<view class="u-line-1">{{$t('register.input8')}}</view>
					</view>
				</u-input>
			</view>
			<view class='marT20'>
				<u-input v-model='mobileVerifyCode' :customStyle='inputStyle' :placeholder="$t('common.input')"
					shape='circle' clearable>
					<view slot="prefix" class="color1A inputLeft flex-cc">
						<view class="colorRed marR10">*</view>
						<view class="u-line-1">{{$t('register.input9')}}</view>
					</view>
					<view slot="suffix" class="colorMain" @click.stop="$u.throttle(verificationCode, 1000)">
						{{countdown1>0?countdown1+'s': $t('login.code')}}
					</view>
				</u-input>
			</view>
			<view class='marT20'>
				<u-input v-model='emailVerifyCode' :customStyle='inputStyle' :placeholder="$t('common.input')"
					shape='circle' clearable>
					<view slot="prefix" class="color1A inputLeft flex-cc">
						<view class="colorRed marR10">*</view>
						<view class="u-line-1">{{$t('register.input10')}}</view>
					</view>
					<view slot="suffix" class="colorMain" @click.stop="$u.throttle(getEmailCode, 1000)">
						{{countdown2>0?countdown2+'s': $t('login.code')}}
					</view>
				</u-input>
			</view>
			<view class="marT60 flex-c marL16">
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
			<view class="loginbts bgMain colorfff marT60" @click.stop="register()">{{$t('register.bts1')}}</view>
			<view class="textC color1A marT60" @click.stop="goToPage('/pages/login/login')">{{$t('register.bts2')}}
			</view>
		</view>
	</view>
</template>

<script>
	import loginApi from '@/api/login.js'
	export default {
		data() {
			return {
				nickName: '',
				pwd: '',
				pwd2: '',
				companyName: '',
				realName: '',
				mobile: '',
				email: '',
				mobileVerifyCode: '',
				emailVerifyCode: '',
				countdown1: 0,
				countdown2: 0,
				inputStyle: {
					padding: '25rpx 40rpx 25rpx 40rpx',
					background: '#F6F6F6',
				},
				ispassword1: true,
				ispassword2: true,
				checked: false,
				emailTimer: null,
				verifyTimer: null
			}
		},
		onLoad() {},
		methods: {
			verificationCode() {
				if (!this.ruleForm1(this.mobile, this.$t('register.input7'))) return
				loginApi.verificationCode({
					applicantMobile: this.mobile,
				}).then(res => {
					clearInterval(this.verifyTimer)
					this.verifyTimer = null;
					if (res.code == 200) {
						this.countdown1 = 60
						this.verifyTimer = setInterval(() => {
							if (this.countdown1 <= 0) {
								this.countdown1 = 0
							} else {
								this.countdown1--;
							}
						}, 1000)
						if (this.countdown1 == 0) {
							clearInterval(this.verifyTimer)
							this.verifyTimer = null;
						}
					}
				})
			},
			getEmailCode() {
				if (!this.ruleForm1(this.email, this.$t('register.input7'))) return
				loginApi.emailVerifyCode({
					email: this.email,
				}).then(res => {
					clearInterval(this.emailTimer)
					this.emailTimer = null;
					if (res.code == 200) {
						this.countdown2 = 60
						this.emailTimer = setInterval(() => {
							if (this.countdown2 <= 0) {
								this.countdown2 = 0
							} else {
								this.countdown2--;
							}
						}, 1000)
						if (this.countdown2 == 0) {
							clearInterval(this.emailTimer)
							this.emailTimer = null;
						}
					}
				})
			},
			checkboxChange(e) {
				this.checked = e.length > 0 ? true : false
			},
			register() {
				if (!this.checked) {
					this.showMsg(this.$t('login.tips1') + this.$t('login.tips2') + this.$t('login.tips3'))
					return
				}
				if (!this.ruleForm1(this.nickName, this.$t('register.input1'))) return
				if (!this.ruleForm1(this.pwd, this.$t('register.input2'))) return
				if (!this.ruleForm1(this.pwd2, this.$t('register.input3'))) return
				if (!this.ruleForm1(this.companyName, this.$t('register.input5'))) return
				if (!this.ruleForm1(this.realName, this.$t('register.input6'))) return
				if (!this.ruleForm1(this.mobile, this.$t('register.input7'))) return
				if (!this.ruleForm1(this.email, this.$t('register.input8'))) return
				if (!this.ruleForm1(this.mobileVerifyCode, this.$t('register.input9'))) return
				if (!this.ruleForm1(this.emailVerifyCode, this.$t('register.input10'))) return

				loginApi.register({
					nickName: this.nickName,
					pwd: this.pwd,
					pwd2: this.pwd2,
					companyName: this.companyName,
					realName: this.realName,
					mobile: this.mobile,
					email: this.email,
					mobileVerifyCode: this.mobileVerifyCode,
					emailVerifyCode: this.emailVerifyCode,
				}).then(res => {
					if (res.code == 200) {
						this.showMsg(res.msg || this.$t('common.operateSuccess'))
						setTimeout(e => {
							this.goToPage('/pages/login/login')
						}, 5000)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.loginbg {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));
		background: #fff;

		.formView {
			background: #fff;
			width: 648rpx;
			margin: 30rpx auto;

			.inputLeft {
				width: 168rpx;
				// border-right: 1rpx solid #C5C5C5;
				position: relative;
				text-align: center;
				padding-right: 40rpx;
			}

			.inputLeft::after {
				content: '';
				position: absolute;
				right: 10rpx;
				top: 5rpx;
				background: #C5C5C5;
				width: 1rpx;
				height: 32rpx;
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
		}
	}
</style>
