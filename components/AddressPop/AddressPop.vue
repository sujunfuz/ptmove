<template>
	<view @touchmove.stop.prevent="()=>{return false}">
		<u-popup :show="show" mode="bottom" :safeAreaInsetTop='false' :safeAreaInsetBottom='false' :round='20' closeable
			@close="closePop">
			<view class="popupview">
				<scroll-view scroll-y="true" @scrolltolower="reachBottom" style="height: 68vh;">
					<view style="width: 100%;height: 50rpx;"></view>
					<view class="flex-c card-wrapper" v-for="(item,index) in dataList" :key="item.id">
						<view class="wrapper-b" @click="selectId = item.id"
							:class="selectId == item.id ? 'wrapper-b-active':''">
							<AddressCard @deleteAddress="deleteAddress" @changeDefault="changeDefault"
								:address-data="item" />
						</view>
					</view>
					<view style="padding: 20rpx 0;">
						<u-loadmore :status="status" :loadingText="$t('common.loading')"
							:nomoreText="$t('common.nomore1')" />
					</view>
				</scroll-view>
			</view>

			<view class="btsView flex-c">
				<view style="width: 50%;" class="bts bgMain colorfff fontbold fontsize30"
					@click="goToPage('/pages/mine/addaddress?openType=add')">
					{{$t('addaddress.title')}}
				</view>
				<view style="width: 50%;" class="bts colorMain borderMain fontbold fontsize30 marL20"
					@tap="$u.throttle(submitItem, 500)">
					{{$t('common.confirm2')}}
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import AddressCard from '@/components/AddressCard/AddressCard.vue'
	import mineApi from '@/api/mine.js'
	export default {
		components: {
			AddressCard
		},
		props: {
			show: {
				type: Boolean,
				default: () => false
			},
			changeFlag: {
				type: Boolean,
				default: () => false
			},
			selAddress: {
				type: Object,
				default: () => {}
			},
		},
		created() {
			if (this.selAddress) {
				this.selectId = this.selAddress.id;
			}
		},
		data() {
			return {
				currentPage: 1,
				pageSize: 15,
				total: 0,
				dataList: [],
				selectId: '',
				status: 'nomore'
			}
		},
		watch: {
			changeFlag: {
				immediate: true,
				handler() {
					this.currentPage = 1
					// this.total = 0
					this.dataList = []
					this.$nextTick(() => {
						this.getDataList()
					})
				}
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
					this.status = 'nomore'
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

			},
			closePop() {
				this.$emit('closePop');
			},
			submitItem() {
				if (!this.selectId) {
					this.showMsg(this.$t('common.selectaddress'))
					return
				}
				let selObj = {}
				this.dataList.forEach(e => {
					if (this.selectId == e.id) {
						selObj = e;
					}
				})
				this.$emit('getAddress', selObj)
			},
			reachBottom() {
				if (this.total <= this.dataList.length) return;
				this.status = 'loading'
				this.currentPage++
				this.getDataList()
			}
		},


	}
</script>

<style lang="scss" scoped>
	.card-wrapper {
		width: 100%;
		background-color: white;
		justify-content: space-around;
		border-radius: 4rpx;
		margin-bottom: 20rpx;
		border-radius: 20rpx;
		overflow: hidden;

		.customCheck {
			width: 36rpx;
			height: 36rpx;
		}

		.wrapper-b {
			box-sizing: border-box;
			width: 100%;
			border: 2rpx solid transparent;
			border-radius: 20rpx;
			overflow: hidden;
			// width: calc(100% - 56rpx);
		}

		.wrapper-b-active {
			border: 2rpx solid #E1251B !important;
		}
	}

	.card-wrapper:last-child {
		margin-bottom: calc(constant(safe-area-inset-bottom)+160rpx);
		margin-bottom: calc(env(safe-area-inset-bottom)+160rpx);
	}

	.popupview {
		// height: 368rpx;
		height: 80vh;
		padding: 20rpx 24rpx;
		background-color: #F6F6F6;
		box-sizing: border-box;
		// overflow-y: scroll;

	}

	.addressListbg {
		width: 100%;
		// min-height: 100vh;
		min-height: calc(100vh - var(--window-bottom));
	}

	.box {
		box-sizing: border-box;
		width: 100%;
		padding: 20rpx 24rpx;
	}
</style>
