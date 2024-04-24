<template>
	<view class="addressListbg">
		<u-navbar leftIconColor='#fff' :title="$t('addressList.title')" :titleStyle='{"color":"#fff"}'
			:placeholder='true' bgColor="#E1251B" fixed="" @leftClick="leftClick"></u-navbar>
		<view class="box">
			<AddressCard @deleteAddress="deleteAddress" @changeDefault="changeDefault" v-for="item in dataList"
				:key="item.id" :address-data="item" />
				<view style="padding: 20rpx 0;">
					<u-loadmore :status="status" :loadingText="$t('common.loading')" :nomoreText="$t('common.nomore1')" />
				</view>
		</view>
		<view class="btsView">
			<view class="bts bgMain colorfff fontbold fontsize30" @click="goToPage('/pages/mine/addaddress?openType=add')">
				{{$t('addaddress.title')}}
			</view>
		</view>
	</view>
</template>

<script>
	import AddressCard from '@/components/AddressCard/AddressCard.vue'
	import mineApi from '@/api/mine.js'
	export default {
		components: {
			AddressCard
		},
		data() {
			return {
				currentPage: 1,
				pageSize: 10,
				total: 0,
				dataList: [],
				status: ''
			}
		},
		onShow() {
			this.dataList = []
			this.currentPage = 1
			this.pageSize = 10
			this.getDataList()
		},
		onReachBottom() {
			if (this.dataList.length == this.total) {
				return
			} else {
				this.status = 'loading'
				this.currentPage++
				this.getDataList()
			}
		},
		methods: {
			getDataList() {
				mineApi.getShippingAddress({
					currentPage: this.currentPage,
					pageSize: this.pageSize
				}).then(res => {
					this.total = res.data.total
					this.dataList = [...this.dataList, ...res.data.list]
					if(this.total == this.dataList){
						this.status = 'nomore'
					}
				})
			},
			deleteAddress(val) {
				mineApi.deleteShippingAddress([val.id]).then(res => {
					if (res.code == 200) {
						this.showMsg(res.msg)
						this.dataList = []
						this.currentPage = 1
						this.getDataList()
					}
				})
			},
			changeDefault(val) {
				// this.dataList.
				// for(let item of this.dataList){
				// 	if(item.defaultIs == 'YES' && item.id != val.id){
				// 		item.defaultIs = 'NO'
				// 		break
				// 	}
				// }
				mineApi.editShippingAddress({
					...val,
					defaultIs: 'YES'
				}).then(res => {
					if (res.code == 200) {
						this.showMsg(res.msg)
						this.dataList = []
						this.currentPage = 1
						this.getDataList()
					}
				})
				// this.dataList = [...this.dataList]

			}
		}
	}
</script>

<style lang="scss" scoped>
	.addressListbg {
		width: 100%;
		// min-height: 100vh;
		min-height: calc(100vh - var(--window-bottom));
	}

	/deep/ .u-checkbox {

		.u-checkbox__icon-wrap--disabled--checked {
			border-color: #E02A23 !important;

			.u-icon--right {
				background-color: #E02A23;
				width: 100%;
				height: 100%;

				.uicon-checkbox-mark {
					color: white !important;
					left: 2px;
				}
			}

		}
	}

	.box {
		box-sizing: border-box;
		width: 100%;
		padding: 20rpx 24rpx;
		padding-top: 20rpx;
		padding-left: 24rpx;
		padding-right: 24rpx;
		// #ifdef H5
		padding-bottom: 160rpx;
		// #endif
		// #ifdef MP-WEIXIN
		padding-bottom: calc(constant(safe-area-inset-bottom)+160rpx);
		padding-bottom: calc(env(safe-area-inset-bottom)+160rpx);
		// #endif
		
	}
</style>