<template>
	<view  :style="{color: disabledFlag ? '#9C9E9C ': ''}" :class="checkArr[index1] == index2 ? 'sku3': 'sku1'" @click='clicksku'>{{specData.label}}</view>
</template>

<script>
	export default {
		props: {
			coordinate: {
				type: Number,
				default: 0
			},
			//index1代表是第几个维度 属性的位置
			index1: {
				type: Number,
				default: 0
			},
			//index2代表它是在index1这个维度的第几个 值的位置
			index2: {
				type: Number,
				default: 0
			},
			specData: {
				type: Object,
				default: () => {}
			},
			//总共有几个维度
			dimension: {
				type: Number,
				default: 0
			},
			//已选择的维度
			checkArr: {
				type: Array,
				default: () => []
			},
			//全部的sku数据
			skuList: {
				type: Array,
				default: () => []
			},
			//记录每个维度长度是多少
			diaArr: {
				type: Array,
				default: () => []
			}
		},
		data(){
			return {
				disabledFlag: false,
				timer: null
			}
		},
		watch:{
			//选择sku的数组 
			checkArr: {
				immediate: true,
				handler: function(val){
					clearTimeout(this.timer)
					this.timer =  setTimeout(() => {
						this.judgeDisabled(this.index1, this.index2)
					},200)
					// console.log(val)
				},
			}	
		},
		methods: {
			clicksku(){
				this.$emit('clicksku',this.index1, this.index2)
			},
			//判断是否有库存
			judgeDisabled(indexs, it) {
				let stock = 0
				//如果当前的specItem就是第一维度的，则用自己，否则看是否已经有选中的则用选中的
				let i = indexs == 0 ? it : (this.checkArr[0] != -1 ? this.checkArr[0] : 0)
				//iFlag，就是判断是否有已经选中的，如果当前是相同维度的则看成这个维度选择的是当前
				let iFlag = indexs == 0 ? true : (this.checkArr[0] != -1 ? true : false)
				for (; i < this.diaArr[0]; i++) {
					if (this.dimension > 1) {
						let j = indexs == 1 ? it : (this.checkArr[1] != -1 ? this.checkArr[1] : 0)
						let jFlag = indexs == 1 ? true : (this.checkArr[1] != -1 ? true : false)
						for (; j < this.diaArr[1]; j++) {
			
							if (this.dimension > 2) {
								let z = indexs == 2 ? it : (this.checkArr[2] != -1 ? this.checkArr[2] : 0)
								let zFlag = indexs == 2 ? true : (this.checkArr[2] != -1 ? true : false)
								for (; z < this.diaArr[2]; z++) {
									stock += this.skuList[i][j][z].realInventory
									if (zFlag) {
										break
									}
								}
							} else {
								stock += this.skuList[i][j].realInventory
							}
							if (jFlag) {
								break;
							}
						}
					} else {
						stock += this.skuList[i].realInventory
					}
					if (iFlag) {
						break;
					}
				}
				console.log(stock)
				if (stock == 0) {
					this.disabledFlag = true
				} else {
					this.disabledFlag = false
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.sku1 {
		background: #F6F6F6;
		border: 2rpx solid #F6F6F6;
		padding: 10rpx 30rpx;
		border-radius: 50rpx;
		margin-right: 20rpx;
	}
	
	.sku2 {
		background: #F6F6F6;
		color: #9C9E9C;
		border: 2rpx solid #F6F6F6;
		padding: 10rpx 30rpx;
		border-radius: 50rpx;
		margin-right: 20rpx;
	}
	
	.sku3 {
		background: #FCE8E7;
		color: #E1251B;
		border: 2rpx solid #E1251B;
		padding: 10rpx 30rpx;
		border-radius: 50rpx;
		margin-right: 20rpx;
	}
</style>