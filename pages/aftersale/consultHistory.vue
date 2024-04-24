<template>
	<view class="consultHistory">
		<u-navbar leftIconColor='#fff' :title="$t('consultHistory.title')" :titleStyle='{"color":"#fff"}'
			:placeholder='true' bgColor="#E1251B" fixed="" @leftClick="leftClick"></u-navbar>
		<view class="ul">
			<view class="li" v-for="(it,i) in dataList" :key="i">
				<view class="flex-c">
					<u-avatar
					  :src="ImgUrl + it.avatar"
					  size="30"
					></u-avatar>
					<view class="marL16">
						<view class="color333">{{it.afSalesStatusText}}</view>
						<view class="fontsize24 marT10 color999">{{it.createTime}}</view>
					</view>
				</view>
				<view v-html="it.content" class="marT30"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import uploadImage from '@/components/uploadImage/uploadImage.vue'
	export default {
		components: {
			uploadImage
		},
		data() {
			return {
				dataList: []
			}
		},
		onLoad(e) {
			let arr = JSON.parse(decodeURIComponent(e.dataList))
			let imgStr = "style='width:80px;height:80px;margin:0 10px 10px 0;' src='" + this.ImgUrl + "/shopmp"
			arr.forEach(e => {
				e.content = e.content.replaceAll("src='/shopmp", imgStr)
			})
			this.dataList = arr;
		},

		methods: {
		}
	}
</script>

<style lang="scss" scoped>
	.consultHistory {
		width: 100%;
		min-height: 100vh;
		background: #f5f5f5;

		.ul {
			padding: 30rpx;

			.li {
				background: #fff;
				border-radius: 20rpx;
				padding: 30rpx 20rpx;
				margin-bottom: 20rpx;

				.imghead {
					width: 60rpx;
					height: 60rpx;
					border-radius: 50%;
				}

				.pzImg {
					width: 100rpx;
					height: 100rpx;
				}
			}
		}
	}
</style>