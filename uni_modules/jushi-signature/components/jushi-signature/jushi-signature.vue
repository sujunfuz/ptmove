<template>
	<view class="container">
		<view class="center" id="center">
			<text class="sign-area">{{$t('cpsignature.text')}}</text>
			<canvas canvas-id="jushiSignature" :style="{width:`${settings.width}rpx`,height:`${settings.height}rpx`}"
				disable-scroll="true" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend"></canvas>
		</view>
		<view class="btn-view">
			<view class="clear" @click="clear()">{{$t('cpsignature.bts1')}}</view>
			<view class="save" @click="save()">{{$t('cpsignature.bts2')}}</view>
		</view>
	</view>
</template>

<script>
	import {
		pathToBase64,
		base64ToPath
	} from '../image-tools/index.js'
	var ctx = null
	var tempPoint = [] //存放当前画纸上的轨迹点
	export default {
		props: {
			settings: { //签名设置
				type: Object,
				default: () => {
					return {
						width: '750', //签名区域的宽
						height: '500', //签名区域的高
						lineWidth: 4, //签名时线宽
						textColor: '#000000' //签名文字颜色
					}
				}
			},
			base64: { //是否强制返回base64
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				points: [], //路径点
				canvasWidth: 0,
				canvasHeight: 0
			};
		},
		created() {
			//微信小程序 需传第二个参数 this才生效
			ctx = uni.createCanvasContext('jushiSignature', this)
			this.setPaintStyle()
		},
		onReady() {
			// #ifdef MP-WEIXIN
			const query = uni.createSelectorQuery().in(this);
			query.select('#center').boundingClientRect(data => {
				this.canvasWidth = data.width
				this.canvasHeight = data.height
				this.setCanvasBg()
			}).exec();
			// #endif
		},
		methods: {
			setPaintStyle() { //画笔样式
				ctx.lineWidth = this.settings.lineWidth
				ctx.lineCap = "round"
				ctx.lineJoin = "round"
				ctx.setStrokeStyle(this.settings.textColor)
			},
			touchstart(e) {
				const startX = e.changedTouches[0].x
				const startY = e.changedTouches[0].y
				let startPoint = {
					X: startX,
					Y: startY
				}
				this.points.push(startPoint)
				//每次触摸开始，开启新的路径
				ctx.beginPath()
			},
			touchmove(e) {
				let moveX = e.changedTouches[0].x
				let moveY = e.changedTouches[0].y
				let movePoint = {
					X: moveX,
					Y: moveY
				}
				this.points.push(movePoint); //存点
				if (this.points.length >= 2) {
					this.draw() //绘制路径
				}
				tempPoint.push(movePoint)
			},
			touchend() { // 清空未绘制的点避免对后续路径产生干扰
				this.points = []
			},
			/*
			 *   绘制笔迹
			 *   1.移动的同时绘制笔迹，保证实时显示
			 *   2.从路径中取两个点作为起点（moveTo）和终点(lineTo)保证笔迹连续性
			 *   3.把上一次的终点作为下一次绘制的起点（即清除第一个点）
			 * */
			draw() {
				let p1 = this.points[0]
				let p2 = this.points[1]
				this.points.shift()
				ctx.moveTo(p1.X, p1.Y)
				ctx.lineTo(p2.X, p2.Y)
				ctx.stroke()
				ctx.draw(true)
			},
			clear() { //清空画布
				let that = this
				uni.getSystemInfo({
					success: function(res) {
						ctx.clearRect(0, 0, res.windowWidth, res.windowHeight)
						ctx.draw(true)
						// #ifdef MP-WEIXIN
						that.setCanvasBg()
						// #endif
						that.setPaintStyle()
					},
				})
				tempPoint = []
				that.emit('')
			},
			save() { //保存
				let that = this
				if (tempPoint.length == 0) {
					uni.showToast({
						title:this.$t('cpsignature.tips'),
						icon: 'none',
						duration: 2000
					});
					return
				}
				uni.canvasToTempFilePath({
					canvasId: 'jushiSignature',
					fileType: 'jpg',
					quality: 1,
					success: function(res) {
						//强制返回base64
						if (that.base64) {
							if (res.tempFilePath.startsWith('data:image/jpeg;base64')) {
								that.emit(res.tempFilePath)
							} else {
								pathToBase64(res.tempFilePath).then(e => {
									that.emit(e)
								}).catch(e => {
									console.log(JSON.stringify(e))
								})
							}
						} else {
							if (res.tempFilePath.startsWith('data:image/jpeg;base64')) {
								base64ToPath(res.tempFilePath).then(e => {
									that.emit(e)
								}).catch(e => {
									console.log(JSON.stringify(e))
								})
							} else {
								that.emit(res.tempFilePath)
							}
						}
					},
					fail(e) {
						console.log(JSON.stringify(e))
					}
				}, this)
			},
			emit(tempFilePath) {
				this.$emit('change', tempFilePath)
			},
			setCanvasBg() { //设置canvas背景色  不设置  导出的canvas的背景为黑色
				ctx.rect(0, 0, this.canvasWidth, this.canvasHeight)
				ctx.setFillStyle('#ffffff')
				ctx.fill()
				ctx.draw()
			}
		}
	};
</script>

<style lang="scss">
	.center {
		background-color: #ffffff;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.btn-view {
		margin-top: 30rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	.save {
		width: 320rpx;
		height: 70rpx;
		justify-content: center;
		flex-direction: row;
		display: flex;
		align-items: center;
		border-radius: 50rpx;
		text-align: center;
		color: #fff;
		background: #E1251B;
	}

	.clear {
		width: 335rpx;
		height: 70rpx;
		justify-content: center;
		flex-direction: row;
		display: flex;
		align-items: center;
		border-radius: 50rpx;
		text-align: center;
		background: #FCE8E7;
		border: 2rpx solid #E1251B;
		color: #E1251B;
	}

	// .save,
	// .clear {
	// 	height: 70rpx;
	// 	width: 200rpx;
	// 	text-align: center;
	// 	font-weight: bold;
	// 	color: white;
	// 	border-radius: 5rpx;
	// 	align-items: center;
	// 	justify-content: center;
	// 	flex-direction: row;
	// 	display: flex;
	// }

	// .save {
	// 	background: #E1251B;
	// }

	// .clear {
	// 	background: #FCE8E7;
	// 	border: 2rpx solid #E1251B;
	// 	color: #E1251B;
	// }

	.sign-area {
		position: absolute;
		top: 40%;
		left: 15%;
		color: #eeeeee;
		font-size: 130rpx;
		transform: rotate(-20deg);
	}
</style>
