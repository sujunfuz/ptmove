<template>
	<view>
		<view class="wrapper" :style="{backgroundColor: bgColor, width: comWidth + '%'}">
			<view class="has-img flex marAuto">
				<view class="img-box" v-for="item ,i in imgList" :key="item"
					:style="{width: imgSize+'rpx',height: imgSize+'rpx'}">
					<image @tap="previewPic(i)" class="upload-img" :src="ImgUrl + item" mode=""></image>
					<!-- <image class="guanbi" @tap="deleteImg(item)"
						:src="ossIconUrl+'/wxshop/static/images/my/evaluateOrder/guanbi.png'" mode="">
					</image> -->
					<view class="guanbi" @tap="deleteImg(item)">
						<u-icon name="close-circle-fill" color='#E1251B' size='20'></u-icon>
					</view>
				</view>
				<view class="img-add" v-if="limitNum != imgList.length" @tap="uploadImage"
					:style="{width: imgSize+'rpx',height: imgSize+'rpx'}">
					<image class="add-img" :src="ossIconUrl+'/mine/photo2.png'" mode="" v-if="imgType == 1">
					</image>
					<image class="add-img" :src="ossIconUrl+'/mine/photo.png'" mode="" v-else></image>
					<view class="marT10">{{$t('cpuploadImage.add')}}</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import config from '@/config.js'
	import commonApi from '@/api/common.js'
	export default {
		props: {
			type: {
				type: String,
				default: 'afSale'
			},
			index: {
				type: Number,
				default: 1
			},
			imgs: {
				type: String,
				default: ''
			},
			comWidth: {
				type: Number,
				default: 92
			},
			bgColor: {
				type: String,
				default: 'transparent'
			},
			limitNum: {
				type: Number,
				default: 1
			},
			imgSize: {
				type: Number,
				default: 150
			},
			// 1 售后（灰色的图） | 0 黑红
			imgType: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				ossIconUrl: this.$request.ossIconUrl,
				imgList: [],
			}
		},
		watch: {
			imgs: {
				immediate: true,
				handler: function(val) {
					this.imgList = [];
					this.echoPicture();
				}
			}
		},
		created() {
			// console.log('imgs', this.imgs)
		},
		methods: {
			echoPicture() {
				if (this.imgs) {
					let arr = []
					arr = this.imgs.split(',')
					this.imgList = [];
					arr.forEach(e => {
						this.imgList.push(e)
					})
				}
			},
			//预览图片
			previewPic(index) {
				let photos = this.imgList.map(item => {
					return this.ImgUrl + item;
				})
				uni.previewImage({
					current: index,
					urls: photos,
				});
			},
			//删除图片
			deleteImg(val) {
				let delImg = ''
				this.imgList = this.imgList.filter(item => {
					if (item == val) {
						delImg = val;
						return false;
					}
					return true;
				})
				this.$emit('changeImg', this.imgList + '');
			},
			//上传、添加图片
			uploadImage() {
				uni.chooseImage({
					count: 1,
					success: (chooseImageRes) => {
						uni.showLoading({
							title: 'loading...',
						})
						const tempFilePaths = chooseImageRes.tempFilePaths;
						const uploadTask = uni.uploadFile({
							url: this.uploadUrl,
							filePath: tempFilePaths[0],
							name: 'file',
							success: (uploadFileRes) => {
								uni.hideLoading()
								uploadFileRes = JSON.parse(uploadFileRes.data)
								if (uploadFileRes.code == 200) {
									this.imgList.push(uploadFileRes.data.fileAdder);
									let obj = {
										imgs: this.imgList + '',
										index: this.index
									}
									this.$emit('changeImg', obj);
								} else {
									this.showMsg(uploadFileRes.msg);
								}
							},
							fail: (e) => {
								// this.showMsg(e.msg);
								this.showMsg(this.$t('common.uploadfail'));
							}
						});

					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wrapper {
		width: 92%;
		margin: auto;

		.none-img {
			flex-direction: column;
			// width: 630rpx;
			height: 250rpx;
			// border: 1px solid #EFF0F4;

			.icon-img {
				width: 54rpx;
				height: 44rpx;
			}

			.icon-title {
				font-size: 24rpx;
			}
		}
	}

	.has-img {
		// width: 630rpx;
		flex-wrap: wrap;
		// border: 1rpx solid #EFF0F4;

		.img-box {
			position: relative;
			margin: 9rpx;
			border-radius: 15rpx;

			.upload-img {
				position: absolute;
				z-index: 5;
				width: 100%;
				height: 100%;
				border-radius: 15rpx;
			}

			.guanbi {
				position: absolute;
				z-index: 100;
				top: -15rpx;
				right: -15rpx;
				width: 38rpx;
				height: 38rpx;
			}
		}

		.img-add {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			margin: 10rpx;
			box-sizing: border-box;
			background: #f6f6f6;
			border-radius: 20rpx;
			border: 1px dashed #9c9e9c;
			color: #9c9e9c;

			.add-img {
				width: 68rpx;
				height: 63rpx;
			}
		}
	}
</style>
