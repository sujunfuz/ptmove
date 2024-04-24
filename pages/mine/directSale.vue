<template>
	<view class="directSalebg">

	</view>
</template>

<script>
	import mineApi from '@/api/mine.js'
	export default {
		data() {
			return {
				directNo: "",
				isFirstDirect:uni.getStorageSync('isFirstDirect') || false,
			}
		},
		onLoad(e) {
			this.directNo = e.directNo
		},
		onShow() {
			if(!uni.getStorageSync('isFirstDirect')||this.getPages()){
				uni.showLoading({
					title: 'loading...',
				})
				setTimeout(e => {
					this.bindDirectOrd()
				}, 1000)
			}else{
				this.goToSw('/pages/tabbar/mine')
			}
		},
		methods: {
			//直销订单
			bindDirectOrd() {
				mineApi.bindDirectOrd(this.directNo).then(res => {
					uni.hideLoading()
					if (res.code == 200) {
						let dataList = [];
						dataList.push({
							storeId: res.data.storeNo,
							storeNo: res.data.storeNo,
							storeName: res.data.storeName,
							storeFreightAmout: res.data.freightAmount,
							discountAmount: res.data.discountAmount || 0,
							storeAmount: res.data.skuAmount,
							spuInfoVOList: res.data.spuInfoVOList,
							remark: "",
						})
						let orderRs = {};
						orderRs.dataList = dataList;
						orderRs.createType = 'direct';
						orderRs.storeBatchNo = res.data.storeBatchOrderNo;
						orderRs.type = 'BATCH_PRODUCE'; //批发
						uni.setStorageSync('orderRs', orderRs)
						uni.setStorageSync('isFirstDirect',true)
						this.goToPage('/pages/index/createOrder')
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.directSalebg {
		width: 100%;
		background: #f7f7f7;
		min-height: calc(100vh - var(--window-bottom));
	}
</style>
