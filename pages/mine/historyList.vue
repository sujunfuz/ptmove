<template>
	<view class="historyListbg">
		<u-navbar leftIconColor='#fff' :title="$t('historyList.title')" :titleStyle='{"color":"#fff"}'
			:placeholder='true' bgColor="#E1251B" fixed @leftClick="leftClick"></u-navbar>
		<view class="fixed-top">
			<u-sticky>
				<view class="flex-cb bgfff pad20">
					<view class="color9c">
						{{$t('common.gong')}}{{ total}}{{$t('historyList.num')}}
					</view>
					<view class="flex-c">
						<u-icon @tap="goToPage('/pages/index/search')" size="20" name="search" color="#9C9E9C"></u-icon>
						<view class="color9c marL20 fontsize30" @tap.stop="handleManage">
							{{mode ? $t("common.complete") :$t('common.manage')}}
						</view>
					</view>
				</view>
				<view class="bgfff">
					<u-tabs :list="tabs" @click="tabsClick" keyName='label' lineColor='#E1251B'
						:activeStyle='activeStyle' :inactiveStyle='inactiveStyle' :scrollable='false'></u-tabs>
				</view>
			</u-sticky>
		</view>
		<view class="marT188">
			<view class="record_li" v-for="(it,is) in dataList" :key='is'>
				<view>{{it.date}}</view>
				<view class="flex-c wrap">
					<view class="record_card" v-for="(item,i) in it.viewRecordList" :key='i'
						@click="goshopDetails(item)">
						<view class="left-image">
							<image class="img1 flexnone" :src="ImgUrl+item.spuImg" mode="scaleToFill">
							</image>
							<view class="select-box flex-cc" @tap.stop="handleTap(item.id)" v-if="mode">
								<view class="none-select" v-if="!selectList.includes(item.id)"></view>
								<u-icon name="checkmark-circle-fill" color="#E1251B" size="28" v-else></u-icon>
							</view>
						</view>
						<view class="colorMain marT10 flex-e fontbold">
							<view class="fontsize30">{{globalUnit}}</view>
							<view class="fontsize32 marL6">{{item.spuPrice}}</view>
						</view>
					</view>
				</view>
			</view>
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
			<view class="colorRed fontsize24" @tap.stop="handleConfirmDel">
				{{$t("common.del")}}
			</view>
		</view>
		<view style="padding: 20rpx 0;">
			<u-loadmore :status="status" :loadingText="$t('common.loading')" :nomoreText="$t('common.nomore1')" />
		</view>
	</view>
</template>

<script>
	import mineApi from "@/api/mine.js"
	export default {
		data() {
			return {
				activeStyle: {
					color: '#E1251B'
				},
				inactiveStyle: {
					color: '#1A1A1A'
				},
				current: '1',
				tabs: [{
					label: this.$t('historyList.tab1'),
					value: '1',
					timeType: 'LATEST_3_DAYS'
				}, {
					label: this.$t('historyList.tab2'),
					value: '2',
					timeType: 'LATEST_7_DAYS'
				}, {
					label: this.$t('historyList.tab3'),
					value: '3',
					timeType: 'LATEST_15_DAYS'
				}],
				status: 'nomore',
				dataList: [],
				mode: false,
				// 存 商品id
				selectList: [],
				allSelect: false,
				total: 0,
				timeType: 'LATEST_3_DAYS'
			}
		},
		onLoad() {
			this.getUserViewRecord()
		},

		methods: {
			tabsClick(e) {
				this.timeType = e.timeType
				this.dataList = []
				this.getUserViewRecord()
			},

			handleManage() {
				this.mode = !this.mode
			},
			handleTap(item) {
				const index = this.selectList.findIndex(ele => ele == item)
				if (index < 0) {
					this.selectList.push(item)
					if (this.selectList.length == this.total) {
						this.allSelect = true
					}
				} else {
					this.selectList.splice(index, 1)
					this.allSelect = false
				}
			},
			goshopDetails(item) {
				if (this.mode) return
				this.goToPage('/pages/index/shopDetails?id=' + item.itemId)
			},
			checkboxChange() {
				this.allSelect = !this.allSelect
				if (this.allSelect) {
					const list = this.dataList.reduce((prev, item) => {
						return prev.concat(item.viewRecordList)
					}, []).map(item => item.id)
					this.selectList = [...list]
				} else {
					this.selectList = []
				}
			},
			// 确认删除
			handleConfirmDel() {
				let that = this;
				let content = this.selectList.length == this.total ? that.$t('historyList.delall') : that.$t(
					'historyList.delgou')
				uni.showModal({
					cancelColor: '#999',
					confirmColor: '#E1251B',
					title: that.$t('common.showtitle1'),
					cancelText: that.$t('common.cancel'),
					confirmText: that.$t('common.confirm2'),
					content: content,
					success: async (res) => {
						if (res.confirm) {
							mineApi.delViewRecord({
								ids: this.selectList,
								deleteType: this.allSelect ? 'ALL' : ''
							}).then(res => {
								this.showMsg(this.$t('common.delSuccess'))
								this.selectList = []
								this.dataList = []
								this.getUserViewRecord()
							})
						}
					}
				});
			},
			getUserViewRecord() {
				mineApi.getViewRecord({
					timeType: this.timeType
				}).then(res => {
					if (res.code == 200) {
						let resOrderList = res.data;
						this.dataList = this.dataList.concat(resOrderList);
						this.total = this.dataList.reduce((prev, item) => {
							return prev.concat(item.viewRecordList)
						}, []).length
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.historyListbg {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));

		.record_li {
			padding-left: 12rpx;
			margin-top: 20rpx;

			.record_card {
				margin: 10rpx;

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

				.img1 {
					width: 224rpx;
					height: 224rpx;
					border-radius: 20rpx;
					background: #fff;
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
