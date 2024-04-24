<template>
	<view class="myCollectionbg">
		<u-navbar leftIconColor='#fff' :title="$t('myCollection.title')" :titleStyle='{"color":"#fff"}'
			:placeholder='true' bgColor="#E1251B" fixed @leftClick="leftClick"></u-navbar>
		<view class="fixed-top">
			<u-sticky>
				<view class="flex-cb bgfff pad20">
					<view class="color9c">{{$t('common.gong')}}{{total}}{{$t('myCollection.num')}}</view>
					<view class="flex-c">
						<u-icon @tap="goToPage('/pages/index/search')" size="20" name="search" color="#9C9E9C"></u-icon>
						<view class="color9c marL20 fontsize30" @tap.stop="handleManage">
							{{mode ? $t("common.complete") :$t('common.manage') }}
						</view>
					</view>
				</view>
			</u-sticky>
		</view>
		<view class="card_ul">
			<view class="cards flex-c" v-for="(item,i) in dataList" :key='i'>
				<view class="left-image marR20">
					<image class="img1 flexnone" :src="ImgUrl+item.spuImg" mode="scaleToFill">
					</image>
					<view class="select-box flex-cc" @tap.stop="handleTap(item)" v-if="mode">
						<view class="none-select" v-if="!selectList.includes(item.id)"></view>
						<u-icon name="checkmark-circle-fill" color="#E1251B" size="28" v-else></u-icon>
					</view>
				</view>
				<view class="right-wrap">
					<view class="u-line-1 marT6 fontbold fontsize28">{{item.spuName}}</view>
					<view class="colorMain marT24 flex-e">
						<!-- <view class="fontsize24">{{globalUnit}}</view> -->
						<view class="fontsize32 marL6 fontbold">{{globalUnit}}{{item.spuPrice}}</view>
					</view>
					<view class="flex-cb">
						<view class="color999 fontsize24">{{item.collectNum}}{{$t('common.collect')}}</view>
						<view class='addbts' @click="goaddcart(item)">{{$t('common.addcard')}}</view>
					</view>
				</view>
			</view>
		</view>
		<view style="padding: 20rpx 0;">
			<u-loadmore :status="status" :loadingText="$t('common.loading')" :nomoreText="$t('common.nomore1')" />
		</view>
		<view class="bottom-wrapper bgfff padLR20 flex-cb" v-if="mode">
			<view class="flex-cc">
				<u-checkbox-group placement="column" @change="checkboxChange" shape="circle">
					<u-checkbox :checked="allSelect" :label="$t('common.allSelect')" labelSize="14" labelColor="#1a1a1a"
						activeColor="#E1251B">
					</u-checkbox>
				</u-checkbox-group>
				<text class="color999 marL20">{{$t('common.selected')}}<text
						class="colorRed">{{selectList.length}}</text>{{$t('common.unitNum')}}</text>
			</view>
			<view class="colorRed fontsize24" @tap.stop="delCollection">
				{{$t("common.del")}}
			</view>
		</view>
	</view>
</template>

<script>
	import mineApi from "@/api/mine.js"
	export default {
		data() {
			return {
				mode: false,
				selectList: [],
				allSelect: false,
				total: 0,
				currentPage: 1,
				pageSize: 10,
				status: 'loading',
				dataList: [],
			}
		},
		onLoad() {
		},
		created() {
			this.getCollectionList()
		},
		onReachBottom() {
			this.currentPage++;
			this.getCollectionList()
		},
		methods: {
			handleManage() {
				this.mode = !this.mode
			},
			getCollectionList() {
				mineApi.getUserCollect({
					currentPage: this.currentPage,
					pageSize: this.pageSize,
					collectType: 'PRODUCT'
				}).then(res => {
					let resOrderList = res.data.list;
					this.dataList = this.dataList.concat(resOrderList);
					this.total = res.data.total
					if (resOrderList.length < 10) {
						this.status = 'nomore';
					}
				})
			},
			handleTap(item) {
				const index = this.selectList.findIndex(ele => ele == item.id)
				if (index < 0) {
					this.selectList.push(item.id)
					if (this.selectList.length == this.total) {
						this.allSelect = true
					}
				} else {
					this.selectList.splice(index, 1)
					this.allSelect = false
				}
			},
			checkboxChange() {
				this.allSelect = !this.allSelect
				if (this.allSelect) {
					this.selectList = this.dataList.map(item => item.id)
				} else {
					this.selectList = []
				}
			},
			//加入购物车
			goaddcart(item) {
				this.goToPage('/pages/index/shopDetails?isaddcart=true&id=' + item.itemId)
			},
			delCollection() {
				let that = this;
				let content = this.selectList.length == this.total ? that.$t('myCollection.askConfirmDelAll') : that.$t(
					'myCollection.askConfirmDelgou')
				uni.showModal({
					cancelColor: '#999',
					confirmColor: '#E1251B',
					title: that.$t('common.showtitle1'),
					cancelText: that.$t('common.cancel'),
					confirmText: that.$t('common.confirm2'),
					content: content,
					success: async (res) => {
						if (res.confirm) {
							mineApi.delUserCollect({
								ids: this.selectList,
								deleteType: this.allSelect ? 'ALL' : ''
							}).then(res => {
								if (res.code == 200) {
									this.showMsg(this.$t('common.delSuccess'))
									this.selectList = []
									this.currentPage = 1
									this.status = 'loading';
									this.dataList = []
									this.getCollectionList()
								}
							})
						}
					}
				});
			},
		}
	}
</script>

<style lang="scss" scoped>

	.myCollectionbg {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));

		.card_ul {
			margin-top: 88rpx;
			padding: 20rpx;

			.cards {
				background: #fff;
				border-radius: 20rpx;
				padding: 20rpx;
				margin-bottom: 20rpx;

				.left-image {
					position: relative;

					.select-box {
						position: absolute;
						top: 10rpx;
						left: 10rpx;
						width: 43rpx;
						height: 43rpx;
						background-color: #fff;
						border-radius: 20rpx;
						overflow: hidden;

						.none-select {
							background-color: #999;
							width: 36rpx;
							height: 36rpx;
							border-radius: 18rpx;
						}
					}
				}

				.right-wrap {
					flex: 1;
				}

				.img1 {
					width: 150rpx;
					height: 150rpx;
					border-radius: 10rpx;
				}

				.addbts {
					font-size: 28rpx;
					border: 1rpx solid #E2E2E2;
					border-radius: 50rpx;
					padding: 10rpx 24rpx;
					font-weight: 500;
				}
			}
		}

		.bottom-wrapper {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			box-sizing: border-box;
			height: 100rpx;
		}

		/deep/ .u-checkbox__icon-wrap {
			margin-right: 20rpx;
		}
	}
</style>
