<template>
	<view class="followStorebg">
		<u-navbar leftIconColor='#fff' :title="$t('followStore.title')" :titleStyle='{"color":"#fff"}'
			:placeholder='true' bgColor="#E1251B" fixed="" @leftClick="leftClick"></u-navbar>
		<view style="padding:0 16rpx;">
			<view class="marT20">
				<factoryCards :dataList="dataList" :isRefresh='true' @changeStatus='changeStatus'></factoryCards>
			</view>
			<view style="padding: 20rpx 0;">
				<u-loadmore :status="status" :loadingText="$t('common.loading')" :nomoreText="$t('common.nomore1')" />
			</view>
		</view>
	</view>
</template>

<script>
	import mineApi from '@/api/mine.js'
	import factoryCards from '@/components/factoryCards/factoryCards.vue'
	export default {
		components: {
			factoryCards
		},
		data() {
			return {
				currentPage: 1, //分页1
				pageSize: 10, //每页10条
				dataList: [], //表格数据
				status: 'loading', //状态
			}
		},
		onLoad() {
			this.myCollectList()
		},
		methods: {
			//我的收藏店铺
			myCollectList() {
				mineApi.myCollectList({
					collectType: 'SUPPLIER',
					currentPage: this.currentPage,
					pageSize: this.pageSize
				}).then(res => {
					if (res.code == 200) {
						let resOrderList = res.data.list;
						resOrderList.forEach(e => {
							if(e.productImages){
								e.imgList = e.productImages.split(',')
							}else{
								e.imgList=[]
							}
							if(e.mainProducts){
								e.mainProList = e.mainProducts.split(',')
							}else{
								e.mainProList=[]
							}
						})
						this.dataList = this.dataList.concat(resOrderList);
						this.total = res.data.total;
						if (resOrderList.length < this.pageSize) {
							this.status = 'nomore';
						}
					}
				})
			},
			changeStatus() {
				this.currentPage = 1;
				this.status = 'loading';
				this.dataList = [];
				this.myCollectList();
			}
		},
		onReachBottom() {
			if (this.status == 'nomore') {
				return;
			}
			this.currentPage++;
			this.myCollectList();
		},
	}
</script>

<style lang="scss" scoped>
	.followStorebg {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));
	}
</style>
