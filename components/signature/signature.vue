<template>
	<view @touchmove.stop.prevent="()=>{return false}">
		<u-popup :show="show" mode="bottom" :safeAreaInsetTop='false' :safeAreaInsetBottom='false' :round='20' closeable
			@close="colse">
			<view class="popupview">
				<view class="fontsize30 fontbold">{{$t('cpsignature.title')}}</view>
				<view class="marT30 signatureView">
					<!-- <view class="preview" v-if="imgUrl">
						<image :src="imgUrl" mode="" style="width: 100%;"></image>
						<view class="resignbts colorMain" @click="imgUrl=''">{{$t('cpsignature.bts3')}}</view>
					</view> -->
					<jushi-signature :settings="settings" @change="signatureChange"></jushi-signature>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		props: {
			show: {
				type: Boolean,
				default: () => false
			},
		},
		data() {
			return {
				settings: { //签名设置
					width: '690', //签名区域的宽
					height: '500', //签名区域的高
					lineWidth: 3, //签名时线宽
					textColor: '#E1251B' //签名文字颜色
				},
				imgUrl: ''
			}
		},
		methods: {
			colse() {
				this.$emit('close');
			},
			blobToFile(blob, fileName) { // blob转file
				blob.lastModifiedDate = new Date();
				blob.name = fileName;
				return blob;
			},
			signatureChange(e) {
				console.log(e)
				if(!e) return
				let that = this;
				uni.showLoading({
					title: that.$t('common.loading'),
				})
				// #ifndef MP-WEIXIN
				uni.request({
					url: e,
					method: 'GET',
					responseType: 'arraybuffer',
					success(res) {
						if (res.data) {
							let blob = new Blob([res.data], {
								type: 'image/jpeg'
							})
							uni.uploadFile({
								url: that.uploadUrl,
								file: blob,
								name: 'file',
								success: (uploadFileRes) => {
									uploadFileRes = JSON.parse(uploadFileRes.data)
									that.resultImg(uploadFileRes);
								},
								fail: (err) => {
									uni.hideLoading()
									that.showMsg(that.$t('common.uploadfail'));
								},
							});
						}
					}
				})
				// #endif

				// #ifdef MP-WEIXIN
				
				this.imgUrl=e;
				uni.uploadFile({
					url: that.uploadUrl,
					filePath: this.imgUrl,
					name: 'file',
					success: (uploadFileRes) => {
						uploadFileRes = JSON.parse(uploadFileRes.data)
						that.resultImg(uploadFileRes);
					},
					fail: (err) => {
						uni.hideLoading()
						that.showMsg(that.$t('common.uploadfail'));
					},
				});
				// #endif
			},

			resultImg(e) {
				uni.hideLoading()
				if (e.code == 200) {
					this.$emit('success',e.data.fileAdder);
				} else {
					that.showMsg(that.$t('common.uploadfail'));
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.popupview {
		height: 708rpx;
		padding: 30rpx 30rpx 58rpx 30rpx;
		background: #F6F6F6;

		.signatureView {
			.preview {
				margin: 10rpx;
				// border: 1rpx solid #aaaaaa;
				border-radius: 10rpx;

				.resignbts {
					margin-top: 10rpx;
					text-align: center;
					height: 70rpx;
					line-height: 70rpx;
					border-radius: 2rpx solid #FCE8E7;
				}
			}
		}
	}
</style>
