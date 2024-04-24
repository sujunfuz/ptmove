<template>
	<view class="loginbg">
		<u-navbar leftIcon=' ' :title="$t('forgetpsd.title')" :titleStyle='{"color":"#fff"}' :placeholder='true'
			bgColor="#E1251B" fixed="" @leftClick="leftClick"></u-navbar>
		<view class="formView wxpadB68">
			<u-input v-model='email' :customStyle='inputStyle' :placeholder="$t('common.input')" shape='circle'
				clearable>
				<view slot="prefix" class="color1A inputLeft">{{$t('forgetpsd.input1')}}</view>
			</u-input>
			<view class='marT20'>
				<u-input v-model='emailCode' :customStyle='inputStyle' :placeholder="$t('common.select')" shape='circle'
					clearable>
					<view slot="prefix" class="color1A inputLeft">{{$t('forgetpsd.input2')}}</view>
					<view slot="suffix" class="colorMain"   @click.stop="$u.throttle(getVerifyCode, 1000)">
						{{countdown>0?countdown+'s': $t('login.code')}}
					</view>
				</u-input>
			</view>
			<view class='marT20'>
				<u-input v-model='pwd' :password='ispassword1' :customStyle='inputStyle'
					:placeholder="$t('common.input1')" shape='circle' clearable>
					<view slot="prefix" class="color1A inputLeft">{{$t('forgetpsd.input3')}}</view>
					<image v-if="ispassword1" slot="suffix" class="icon2" :src="ossIconUrl+'/login/biyan.png'"
						mode="scaleToFill" @click="ispassword1=false"></image>
					<image v-else slot="suffix" class="icon2" :src="ossIconUrl+'/login/zhengyan.png'" mode="scaleToFill"
						@click="ispassword1=true"></image>
				</u-input>
			</view>
			<view class='marT20'>
				<u-input v-model='pwd2' :password='ispassword2' :customStyle='inputStyle'
					:placeholder="$t('common.input2')" shape='circle' clearable>
					<view slot="prefix" class="color1A inputLeft">{{$t('forgetpsd.input4')}}</view>
					<image v-if="ispassword2" slot="suffix" class="icon2" :src="ossIconUrl+'/login/biyan.png'"
						mode="scaleToFill" @click="ispassword2=false"></image>
					<image v-else slot="suffix" class="icon2" :src="ossIconUrl+'/login/zhengyan.png'" mode="scaleToFill"
						@click="ispassword2=true"></image>
				</u-input>
			</view>
			<view class="loginbts bgMain colorfff marT60" @click.stop="$u.throttle(requestForgetPass, 1000)">{{$t('common.confirm')}}</view>
		</view>
		<view class="tipstext flex-cc">
			<view @click="goToPage('/pages/login/login')">{{$t('register.bts2')}}</view>
		</view>
	</view>
</template>

<script>
	import loginApi from '@/api/login.js'
	export default {
		data() {
			return {
				email: '',
				emailCode: '',
				pwd: '',
				pwd2: '',
				inputStyle: {
					padding: '25rpx 40rpx 25rpx 40rpx',
					background: '#F6F6F6',
				},
				ispassword1: true,
				ispassword2: true,
				countdown: 0,
				verifyTimer: null
			}
		},
		onLoad() {

		},
		methods: {
			getVerifyCode() {
				if (this.verifyTimer) return
				if (!this.ruleForm1(this.email, this.$t('forgetpsd.input1'))) return
				loginApi.emailVerifyCode({
					email: this.email,
				}).then(res => {
					clearInterval(this.verifyTimer)
					this.verifyTimer = null;
					if (res.code == 200) {
						this.countdown = 60
						this.verifyTimer = setInterval(() => {
							if (this.countdown > 0) {
								this.countdown--
							} else {
								this.countdown=0
							}
						}, 1000)
						if(this.countdown==0){
							clearInterval(this.verifyTimer)
							this.verifyTimer = null;
						}
					} 
				})
			},
			requestForgetPass() {
				if (!this.ruleForm1(this.email, this.$t('forgetpsd.input1'))) return
				if (!this.ruleForm1(this.emailCode, this.$t('forgetpsd.input2'))) return
				if (!this.ruleForm1(this.pwd, this.$t('forgetpsd.input3'))) return
				if (!this.ruleForm1(this.pwd2, this.$t('forgetpsd.input4'))) return
				loginApi.forgetPass({
					email: this.email,
					emailCode: this.emailCode,
					pwd: this.pwd,
					pwd2: this.pwd2
				}).then(res => {
					if (res.code == 200) {
						this.showMsg(res.msg||this.$t('common.operateSuccess'))
						setTimeout(e=>{
							this.goToPage('/pages/login/login')
						},500)
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
			margin: 80rpx auto;

			.inputLeft {
				width: 150rpx;
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

		.tipstext {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 100rpx;
			margin: 0 auto;
			width: 100%;
		}
	}
</style>