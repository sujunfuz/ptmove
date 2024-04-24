<template>
	<view class="setPayPassbg">
		<u-navbar leftIconColor='#fff' :title="$t('setPayPass.title')" :titleStyle='{"color":"#fff"}'
			:placeholder='true' bgColor="#E1251B" fixed="" @leftClick="leftClick"></u-navbar>
		<view class="formView bgfff bdRadius20 padLR20">
			<view class=''>
				<u-input v-model='payPwd1' :password='ispassword2' :customStyle='inputStyle'
					:placeholder="$t('setPass.numPass6')" clearable border="none" type="number">
					<view slot="prefix" class="color1A inputLeft">{{$t('modifyPayPass.input2')}}</view>
					<image v-if="ispassword2" slot="suffix" class="icon2" :src="ossIconUrl+'/login/biyan.png'"
						mode="scaleToFill" @click="ispassword2=false"></image>
					<image v-else slot="suffix" class="icon2" :src="ossIconUrl+'/login/zhengyan.png'" mode="scaleToFill"
						@click="ispassword2=true"></image>
				</u-input>
			</view>
			<view class=''>
				<u-input v-model='payPwd2' :password='ispassword1' :customStyle='input2Style'
					:placeholder="$t('common.input2')" clearable border="none" type="number">
					<view slot="prefix" class="color1A inputLeft">{{$t('modifyPayPass.input3')}}</view>
					<image v-if="ispassword1" slot="suffix" class="icon2" :src="ossIconUrl+'/login/biyan.png'"
						mode="scaleToFill" @click="ispassword1=false"></image>
					<image v-else slot="suffix" class="icon2" :src="ossIconUrl+'/login/zhengyan.png'" mode="scaleToFill"
						@click="ispassword1=true"></image>
				</u-input>
			</view>
		</view>
		<view class="modifybts bgMain colorfff bdRadius20 marAuto" @tap.stop="resetPayPwd">
			{{$t('common.confirm')}}
		</view>
	</view>
</template>

<script>
	import setApi from '@/api/set.js'
	export default {
		data() {
			return {
				payPwd1: '',
				payPwd2: '',
				inputStyle: {
					padding: '35rpx 0 35rpx 0',
				},
				input2Style: {
					padding: '35rpx 0 35rpx 0',
					borderTop: '1px solid #e3e4e5',
					borderBottom: '1px solid #e3e4e5',
				},
				ispassword2: false,
				ispassword1: false,
			}
		},
		onLoad() {

		},
		methods: {
			resetPayPwd() {
				if (this.payPwd1.length != 6) {
					this.showMsg(this.$t("setPass.numPass6"))
					return
				}
				if (this.payPwd1 != this.payPwd2) {
					this.showMsg(this.$t("modifyPass.diffPass"))
					return
				}
				setApi.resetPayPwd({
					payPwd1: this.payPwd1,
					payPwd2: this.payPwd2
				}).then(res => {
					if (res.code == 200) {
						this.showMsg(this.$t(res.msg))
						setTimeout(() => {
							uni.navigateBack({
								delta: 3
							});
						}, 1500)
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.setPayPassbg {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));

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
	}
</style>
