<template>
	<view class="recommendShop">
		<view class="flex-cc marT30 tuijianView">
			<image :src="ossIconUrl+'/mine/tuijian1.png'" mode="scaleToFill"></image>
			<view>{{$t('mine.goodProductRecommend')}}</view>
			<image :src="ossIconUrl+'/mine/tuijian2.png'" mode="scaleToFill"></image>
		</view>
		<view style="padding:0 12rpx;">
			<view class="marT20">
				<goodCardsFlow :dataList="dataList" :isAdd='false'></goodCardsFlow>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			dataList: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
				
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.recommendShop {}
</style>
