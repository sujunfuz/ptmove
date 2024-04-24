<template>
	<view class="pt-notice-bg bgfff">
		<u-navbar leftIconColor='#fff' :title="$t('ptNotice.title')" :titleStyle='{"color":"#fff"}'
			bgColor="#E1251B" @leftClick="leftClick" placeholder fixed>
		</u-navbar>
		<view class="main-wrapper pad20">
			<view class="title fontsize32 fontbold">
				{{data.title}}
			</view>
			<view class="flex marT20">
				<view class="fontsize24 color80">{{data.createTimeStr}}</view>
				<!-- #ifdef MP-WEIXIN -->
				<view v-if="data.fileUrl&&data.fileName" class="marL30 fontsize24 colorblue" @click="open">{{data.fileName}}</view>
				<!-- #endif -->
				<!-- #ifndef MP-WEIXIN -->
				<a v-if="data.fileUrl&&data.fileName" class="marL30 fontsize24 colorblue" :href="ImgUrl + data.fileUrl">{{data.fileName}}</a>
				<!-- #endif -->
			</view>
			<u-divider text=" "></u-divider>
			<view class="content-wrapper fontsize28">
				<view class="marB10">{{data.subTitle}}</view>
				<view class="marB10">{{data.remark}}</view>
				<image :src="ImgUrl+data.images" mode="widthFix"></image>
			</view>
		</view>
		<!-- <view class="image-wrapper">
			<image :src="ImgUrl+data.images" mode="widthFix"></image>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data: '',
			}
		},
		onLoad(e) {
			this.data = JSON.parse(e.data)
		},
		methods: {
			open() {
				let that=this;
				wx.downloadFile({
					url: that.ImgUrl + that.data.fileUrl, // 示例 url，并非真实存在
					success: function(res) {
						const filePath = res.tempFilePath
						wx.openDocument({
							filePath: filePath,
							success: function(res) {
								// that.showMsg(that.$t('common.operateSuccess'))
							},
							fail: function(res) {
								that.showMsg(that.$t('common.error'))
							}
						})
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.pt-notice-bg {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));

		.content-wrapper {
			image {
				width: 100%;
				border-radius: 20rpx;
			}

			img {
				width: 100%;
				border-radius: 20rpx;
			}
		}

		.image-wrapper {
			width: 100%;

			&>image {
				width: 100%;
			}
		}
	}
</style>