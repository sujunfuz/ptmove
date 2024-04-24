#### 手写签名、电子签名组件，支持APP、微信小程序、H5
 - 支持APP、微信小程序、H5
 ```
本插件为手写签名(电子签名)组件，支持APP、微信小程序、H5三端使用
 ```
 
 - 组件属性说明

 | 序号 | 属性名称|属性说明
 |--|--|--|
 |1 |settings|签名设置项，签名区域宽高、文字颜色等设置
 |2 |base64|是否强制返回图片base64，默认为false，即返回的是临时地址
 
 - settings属性说明
 ```
 { //签名设置
 	width: '750',//签名区域的宽
 	height: '500',//签名区域的高
 	lineWidth:3,//签名时线宽
 	textColor:'#007AFF' //签名文字颜色
 }
 ```
 
 - 组件事件说明
 
 |序号|事件名称|事件说明
 |--|--|--|
 |1|change|点击保存/清除按钮事件，返回图片地址或图片base64（根据base64属性的值返回相应的结果），点击清除按钮是返回 ''
 

 - 使用示例
```
	<template>
		<view>
			<jushi-signature base64 :settings="settings" @change="signatureChange"></jushi-signature>
			<view class="" style="margin-top: 20rpx;">
				<text class="text">保存后的签名图片</text>
				<view class="preview">
					<image :src="imgUrl" mode="" style="width: 100%;"></image>
				</view>
			</view>
		</view>
	</template>
	
	<script>
		export default {
			data() {
				return {
					settings:{ //签名设置
						width: '750',//签名区域的宽
						height: '500',//签名区域的高
						lineWidth:3,//签名时线宽
						textColor:'#007AFF' //签名文字颜色
					},
					imgUrl: ''
				}
			},
			methods: {
				signatureChange(e) {
					this.imgUrl = e
					console.log(e)
				}
			}
		}
	</script>
	
	<style>
		.preview{
			margin: 10rpx;
			border: 1rpx solid #aaaaaa;
			border-radius: 10rpx;
		}
		.text {
			margin: 20rpx;
			color: #aaaaaa;
		}
	</style>
```
 - 备注
 ```
	欢迎来邮件咨询和讨论，邮箱：1052775690@qq.com
 ```
