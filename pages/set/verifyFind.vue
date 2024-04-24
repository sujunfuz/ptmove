<template>
	<view class="verifyFindbg">
		<u-navbar leftIconColor='#fff' :title="title" :titleStyle='{"color":"#fff"}' :placeholder='true'
			bgColor="#E1251B" fixed="" @leftClick="leftClick"></u-navbar>
		<view>
			<image class="img1" :src="type=='EMAIL'?ossIconUrl+'/set/email.png':ossIconUrl+'/set/phone.png'"
				mode="aspectFill">
			</image>
			<view class="marT20 textC">{{$t('verifyFind.dj')}}</view>
			<view class="fontsize44 fontbold marT20 textC">{{type=='EMAIL'?userInfo.email:userInfo.mobile}}</view>
			<view v-if="!isfirst" class="flex-cc marT60">
				<u-code-input dot v-model="verifyCode" :maxlength="6" @finish='finish'></u-code-input>
			</view>
			<view class="viewbts">
				<view class="bts bgMain colorfff" @click="sendVerifyCode">
					<text
						v-if="!isfirst&&countdown>0">{{countdown}}s</text>{{isfirst?$t('verifyFind.bts1'):$t('verifyFind.bts2')}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import set from '@/api/set.js';
	import setApi from '@/api/set.js'
	export default {
		data() {
			return {
				type: '',
				title: '',
				isfirst: true,
				verifyCode: "",
				Timer: null,
				countdown: 0
			}
		},
		onLoad(e) {
			this.type = e.type;
			this.title = this.type == 'EMAIL' ? this.$t('verifyFind.title1') : this.$t('verifyFind.title2')
		},
		methods: {
			sendVerifyCode() {
				setApi.sendVerifyCode({
					verifyType: this.type,
				}).then(res => {
					this.showMsg(this.$t(res.msg))
					this.isfirst = false;
					clearInterval(this.Timer)
					this.Timer = null;
					if (res.code == 200) {
						this.countdown = 60
						this.Timer = setInterval(() => {
							this.countdown--
						}, 1000)
					}
				})
			},
			finish(e) {
				setApi.checkVerifyCode({
					verifyCode: e,
					verifyType: this.type,
				}).then(res => {
					this.verifyCode = ''
					if (res.code == 200) {
						setTimeout(e => {
							this.goToPage('/pages/set/setPayPass')
						}, 500)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.verifyFindbg {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));

		.img1 {
			display: block;
			width: 100rpx;
			height: 100rpx;
			margin: 100rpx auto 0;
		}

		.viewbts {
			text-align: center;

			.bts {
				padding: 20rpx 100rpx;
				border-radius: 20rpx;
				margin-top: 80rpx;
				display: inline-block;
				text-align: center;
			}
		}
	}
</style>
