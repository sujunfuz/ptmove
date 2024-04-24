<template>
	<view class="wrapper">
		<view class="w-top flex">
			<text>{{addressData.userName}}</text>
			<text class="top-txt">{{addressData.mobile}}</text>
		</view>
		<view class="w-mid">{{addrDes}}</view>
		<view class="flex-cb marT20">
			<view class="flex-c">
				<u-checkbox-group v-model="checked" @change="changeSelect" >
					<u-checkbox  
						:disabled="addressData.defaultIs=='YES'"activeColor="#E1251B" labelColor="#9C9E9C":label="$t('common.moren')" name="YES">
					</u-checkbox>
				</u-checkbox-group>
			</view>
			<view class="flex-c">
				<view class="allbtn btn1" @click="goToPage('/pages/mine/addaddress?openType=edit&&id='+addressData.id)">{{$t('common.edit')}}</view>
				<view class="allbtn btn2" @click="deleteAddress">{{$t('common.del')}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			addressData: {
				type: Object,
				default: () => {}
			}
		},
		computed: {
			addrDes() {
				let str = ''
				str += this.addressData.province + this.addressData.city
				if (this.addressData.area) {
					str += this.addressData.area
				}
				str += this.addressData.address
				return str
			}
		},
		watch: {
			addressData: {
				deep: true,
				immediate: true,
				handler(val){
					if(val.defaultIs == 'NO'){
						this.checked = []
					} else if(val.defaultIs == 'YES'){
						this.checked = ['YES']
					}
				}
			}
		},
		data() {
			return {
				checked: []
			}
		},
		methods: {
			deleteAddress(){
				this.$emit('deleteAddress',this.addressData)
			},
			changeSelect() {
				this.$emit('changeDefault', this.addressData)
				this.addressData.defaultIs = 'YES'
			}
		}
	}
</script>

<style scoped lang="scss">
	.wrapper {
		box-sizing: border-box;
		width: 702rpx;
		height: 270rpx;
		padding: 20rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		opacity: 1;
		margin-bottom: 20rpx;

		.w-top {
			font-size: 28rpx;
			font-weight: 500;
			color: #333333;

			.top-txt {
				margin-left: 20rpx;
			}
		}

		.w-mid {
			width: 100%;
			height: 80rpx;
			margin-top: 10rpx;
			padding-bottom: 20rpx;
			font-size: 28rpx;
			font-weight: 500;
			color: #9C9E9C;
			border-bottom: 1rpx solid #E3E4E5;
		}
	}

	.allbtn {
		width: 172rpx;
		height: 60rpx;
		background: #FFFFFF;
		border-radius: 60rpx;
		font-size: 28rpx;
		text-align: center;
		line-height: 60rpx;
	}

	.btn1 {
		border: 1rpx solid #CCCCCC;
		color: #2E2E2E;
	}

	.btn2 {
		margin-left: 20rpx;
		border: 1rpx solid #E02A23;
		color: #E1251B;
	}
</style>