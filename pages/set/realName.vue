<template>
	<view class="realNamebg">
		<u-navbar leftIconColor='#fff' :title="$t('realName.title')" :titleStyle='{"color":"#fff"}' :placeholder='true'
			bgColor="#E1251B" fixed="" @leftClick="leftClick"></u-navbar>
		<view class="pad20">
			<view class="gyview" :style="'background-image: url('+ossIconUrl+'/index/bg3.png)'">
				<view class="fontsize30 fontbold">{{$t('realName.gy')}}</view>
				<view class="marT20">{{$t('realName.gytips')}}</view>
			</view>
			<view class="formView">
				<view class="fontbold">{{$t('realName.s1')}}</view>
				<view class="marT20 marB30">
					<text>{{$t('common.download')}}</text>
					<text class="colorMain marL6">{{$t('realName.APP')}}</text>
					<text>-{{$t('realName.step2')}}-{{$t('realName.step3')}}</text>
				</view>
				<view class="fontbold topline">{{$t('realName.s2')}}</view>
				<view class="marT20">{{$t('realName.step4')}}</view>
				<view class="marT40">{{$t('realName.input1')}}</view>
				<view class="marT10">
					<u--input :customStyle='inputStyle' :placeholder="$t('common.input')" border="surround" v-model="name"></u--input>
				</view>
				<view class="marT40">{{$t('realName.input2')}}</view>
				<view class="marT10">
					<u--input :customStyle='inputStyle' :placeholder="$t('common.input')" border="surround" v-model="name"></u--input>
				</view>
				<view class="marT40">{{$t('realName.input3')}}</view>
				<view class="marT10">
					<u--input :customStyle='inputStyle' :placeholder="$t('common.input')" border="surround" v-model="name"></u--input>
				</view>
				<view class="modifybts bgMain colorfff bdRadius20 marAuto" @tap.stop="resetPayPwd">
					{{$t('common.confirm3')}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name:'',
				inputStyle: {
					padding: '15rpx 20rpx',
				},
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.realNamebg {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));

		.gyview {
			background-size: 100% 100%;
			background-repeat: no-repeat;
			padding: 30rpx 36rpx;
			border-radius: 20rpx;
		}

		.formView {
			padding: 20rpx;
			background: #fff;
			padding: 30rpx 36rpx;
			margin-top: 20rpx;
			border-radius: 20rpx;

			.topline {
				padding-top: 30rpx;
				border-top: 1rpx solid #E3E4E5;
			}
			.modifybts {
				text-align: center;
				margin-top: 50rpx;
				height: 90rpx;
				line-height: 90rpx;
			}
		}
	}
</style>
