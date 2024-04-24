<template>
	<view class="selSkubg" @touchmove.stop.prevent="()=>{return false}">
		<u-popup :show="show" mode="bottom" :safeAreaInsetTop='false' :safeAreaInsetBottom='false' :round='20' closeable
			@close="colse">
			<view class="popupview">
				<view class="marB32">{{$t('shopDetails.yixuan')}}</view>
				<scroll-view scroll-y="true" style="max-height: 60vh;">
					<view class="flex-cb color6e tableView">
						<scroll-view scroll-x="true" class="tableLeft" style="white-space: nowrap;">
							<view class="flex tableLeft">
								<view class="flex-c table_th">
									<view class="td_li color6e u-line-1" v-for="(it, i) in GoodsSkuAttrVO" :key='i'>
										{{it.title}}
									</view>
								</view>
							</view>
							<view class="flex tableLeft table_td" v-for="(its, is) in dataList" :key='is'>
								<view class="flex-c">
									<view class="td_li u-line-1" v-for="(it, i) in its.specList" :key='i'>{{it}}</view>
								</view>
							</view>
						</scroll-view>
						<view style="width: 248rpx">
							<view class="flex table_th">
								<view class="flex-cc tableRight1">
									{{$t('common.num')}}
								</view>
								<view class="flex-cc tableRight2"></view>
							</view>
							<view class="flex table_td" v-for="(its, is) in dataList" :key='is'>
								<view class="flex-cc tableRight1">
									<image class="img44" :src="ossIconUrl+'/index/jian.png'" mode="scaleToFill"
										@click="changeNumber('jian',its)"></image>
									<!-- <text class="marL20 marR20" style="width: 50rpx;text-align: center;">{{its.num}}</text> -->
									<u--input type='number' style='width: 80rpx;' border="none" inputAlign='center' v-model="its.num"
										@blur="changeNumber('none',it2)"></u--input>
									<image class="img44" :src="ossIconUrl+'/index/jia.png'" mode="scaleToFill"
										@click="changeNumber('jia',its)"></image>
								</view>
								<view class="flex-cc tableRight2" @tap="edit(its)">
									<u-icon name="minus-circle-fill" color="#E1251B" size='22'></u-icon>
								</view>
							</view>
						</view>
					</view>
					<view v-if="dataList.length==0" style="padding: 40rpx 0;">
						<u-loadmore status="nomore" :nomoreText="$t('common.nomore1')" />
					</view>
				</scroll-view>
				<view class="flex-cc marT100" v-if="dataList.length>0">
					<view style="width: 100%;" class="minbts borderMain bgMain colorfff" @click="cartBilling">
						{{$t('shopDetails.bts2')}}
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		props: {
			show: {
				type: Boolean,
				default: () => false
			},
			btsType: {
				type: String,
				default: () => 'addCart'
			},
			GoodsSkuAttrVO: {
				type: Array,
				default: () => []
			},
			dataList: {
				type: Array,
				default: () => []
			},
		},
		data() {
			return {
				value: 1,
			}
		},
		methods: {
			colse() {
				this.$emit('close');
			},
			changeNumber(type, item) {
				switch (type) {
					case 'jian':
						item.num--
						break;
					case 'jia':
						item.num++
						break;
					case 'none':
						console.log(item)
						break;
				}
				this.$emit('edit', item);
			},
			edit(item) {
				item.type = 'del';
				this.$emit('edit', item);
			},
			cartBilling() {
				this.$emit('cartBilling');
			}
		}
	}
</script>

<style lang="scss" scoped>
	.selSkubg {

		.popupview {
			padding: 30rpx 30rpx 88rpx 30rpx;

			.tableView {
				line-height: 60rpx;
				width: 100%;

				.table_th {
					height: 100rpx;
				}

				.table_td {
					height: 80rpx;
				}

				.tableLeft {
					width: calc(100% - 268rpx);

					.td_li {
						width: 180rpx;
						padding: 0 10rpx;
					}
				}

				.tableRight1 {
					width: 220rpx;
				}

				.tableRight2 {
					width: 80rpx;
				}

			}

		}

	}
</style>
