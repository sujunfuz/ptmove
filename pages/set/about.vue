<template>
	<view class="about-bg">
		<u-navbar :title="$t('about.title')" :titleStyle='{"color":"#fff","fontWeight":"bold"}' :placeholder='true'
			bgColor="#E1251B" @leftClick="leftClick" fixed autoBack leftIconColor="white"></u-navbar>
		<view class="signal-wrapper flex-cc">
			<image src="../../static/tab/mine1.png" mode="aspectFill"></image>
			<view class="fontsize60 marT30">
				BUNNY
			</view>
			<view class="fontsize24 marT10">
				Version1.0.1
			</view>
		</view>
		<view class="service-wrapper bgfff bdRadius20 pad20 marAuto">
			<view class="flex-cb desc-item" v-for="(item,index) in list" :key="index">
				<view class="label flex-cc">
					<text class="marL10">{{item.label}}</text>
				</view>
				<view class="flex-cc">
					<u-icon name="arrow-right" color="#999" size="15"></u-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
					label: this.$t("baseInfo.toEvaluate"),
					url: ''
				}, {
					label: this.$t("baseInfo.verUpdate"),
					url: ''
				}],
			}
		},
		methods: {
		}
	}
</script>

<style scoped lang="scss">
	.about-bg {
		.signal-wrapper {
			flex-direction: column;
			height: 600rpx;
			width: 100%;

			&>image {
				width: 230rpx;
				height: 230rpx;
				border-radius: 40rpx;
				background-color: #fff;
			}
		}

		.service-wrapper {
			width: 702rpx;
			box-sizing: border-box;

			.desc-item:not(:first-of-type) {
				border-top: 1px solid #E3E4E5;
			}

			.desc-item:first-of-type {
				padding-top: 20rpx;
			}

			.desc-item:last-of-type {
				padding-bottom: 20rpx;
			}

			.desc-item {
				padding: 35rpx 0;
			}
		}



	}
</style>