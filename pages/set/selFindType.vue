<template>
	<view class="selFindTypebg">
		<u-navbar leftIconColor='#fff' :title="$t('selFindType.title')" :titleStyle='{"color":"#fff"}'
			:placeholder='true' bgColor="#E1251B" fixed="" @leftClick="leftClick"></u-navbar>
		<view class="ul">
			<view class="cards bgfff flex-cb" v-for="(it,i) in tabList" :key='i' @click="goToPage('/pages/set/verifyFind?type='+it.value)">
				<view class="flex-c">
					<image class="img1" :src="ossIconUrl+it.bg" mode="aspectFill">
					</image>
					<view class="marL20">
						<view class="fontsize32">{{it.title}}</view>
						<view class="color6e fontsize24 marT6">{{it.tip}}</view>
					</view>
				</view>
				<u-icon  name="arrow-right" color="#9C9E9C" size="15"></u-icon>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabList: [{
					bg: '/set/email.png',
					title: this.$t('selFindType.tab1'),
					tip: this.$t('selFindType.tab1tips'),
					value:'EMAIL'
				}, {
					bg: '/set/phone.png',
					title: this.$t('selFindType.tab2'),
					tip: this.$t('selFindType.tab2tips'),
					value:'MOBILE'
				}]
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.selFindTypebg {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));

		.ul {
			padding: 20rpx 24rpx;
			.cards {
				padding: 30rpx;
				margin-bottom: 20rpx;
				border-radius: 20rpx;
				.img1{
					width: 100rpx;
					height: 100rpx;
				}
			}
		}
	}
</style>
