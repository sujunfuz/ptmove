<template>
	<view class="html3dbg">
		<u-navbar leftIconColor='#fff' title=" " :titleStyle='{"color":"#fff"}' :placeholder='true' bgColor="#E1251B"
			fixed="" @leftClick="leftClick"></u-navbar>
		<view>
			<image class="img1" :src="ossIconUrl+'/index/html3dicon.png'" mode="scaleToFill"></image>
			<view class="textC marT20">{{$t('common.viewtips')}}</view>
			<view class="textC marT36" v-html="form"></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {}
			}
		},
		onLoad(e) {
			this.form = e.form
		},
	}
</script>

<style scoped lang="scss">
	.html3dbg {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));

		.img1 {
			width: 103rpx;
			height: 123rpx;
			margin: 88rpx auto 0;
			display: block;
		}

	}
</style>
