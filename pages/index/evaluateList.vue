<template>
	<view class="evaluateListbg">
		<u-navbar leftIconColor="#fff" :title="$t('evaluateList.title')" :titleStyle="{ color: '#fff' }"
			:placeholder="true" bgColor="#E1251B" fixed="" @leftClick="leftClick"></u-navbar>
		<!-- <view>{{$t('evaluateList.title')}}</view> -->
		<u-sticky bgColor="#f6f6f6">
			<u-tabs :list="tabList" @click="clickTabs" :activeStyle="{ color: '#E1251B', fontWeight: 'bold',}"
				lineWidth="0" itemStyle="height:44px;margin-right:30rpx"></u-tabs>
		</u-sticky>
		<view class="main-wrapper">
			<view class="evaluate-item bgfff pad20" v-for="(item, index) in dataList" :key="index">
				<view class="flex-c">
					<u-avatar :src="ImgUrl + item.avatar" size="35"></u-avatar>
					<view class="marL20">
						<text>{{ item.userName }}</text>
						<view class="flex">
							<text class="fontsize24 color9c9e9c marR10">{{item.createTimeStr}}</text>
							<u-rate :count="5" v-model="item.score" activeColor="#FF7700" allowHalf readonly></u-rate>
						</view>
					</view>
				</view>
				<view class="marT20 marB20 fontsize24 color9c9e9c">
					{{ $t("common.bought") }}：{{ item.orderNum }}{{ $t("common.jian") }}
				</view>
				<view class="fontsize24content-wrapper">{{item.text}}</view>
				<view class="image-list marT20" v-if="item.imgList">
					<view v-for="(it, i) in item.imgList.slice(0, 4) || []" :key="i"
						@click="openViewImage(i,item.imgList)">
						<image :src="ImgUrl+it" mode="aspectFill" class="image-item">
						</image>
					</view>
				</view>
				<view class="textR color6e fontsize24 marT10" v-if="item.imgList&&item.imgList.length>4">
					{{ $t("common.gong") }}{{ item.imgList.length}}{{ $t("common.piecePic") }}
				</view>
			</view>
		</view>
		<view style="padding: 20rpx 0">
			<u-loadmore :status="status" :loadingText="$t('common.loading')" :nomoreText="$t('common.nomore1')" />
		</view>
	</view>
</template>

<script>
	import indexApi from "@/api/index.js";
	export default {
		data() {
			return {
				tabList: [{
						name: this.$t("evaluateList.tab1"),
						field: "",
					},
					{
						name: this.$t("evaluateList.tab2"),
						field: "containImages",
					},
					{
						name: this.$t("evaluateList.tab3"),
						field: "score",
					},
					{
						name: this.$t("evaluateList.tab4"),
						field: "repurchase",
					},
					{
						name: this.$t("evaluateList.tab5"),
						field: "createTime",
					},
				],
				dataList: [],
				currentPage: 1,
				pageSize: 10,
				orderByField: "",
				spuId: "",
				status: "loading",
			};
		},
		onLoad(e) {
			if (e.id) {
				// 商品id
				this.spuId = e.id;
			}
			this.getTabNum();
			this.getEvaluateList();
		},
		methods: {
			openViewImage(curIndex, imgList) {
				let arr = []
				imgList.forEach(e => {
					arr.push(this.ImgUrl + e)
				})
				uni.previewImage({
					current: curIndex,
					urls: arr,
					indicator: "number",
				});
			},
			handleToggle(index) {
				this.dataList[index].toggle = !this.dataList[index].toggle;
				this.dataList = [...this.dataList];
			},
			clickTabs(e) {
				this.orderByField = e.field;
				this.currentPage = 1;
				this.status = 'loading';
				this.dataList = [];
				this.getEvaluateList();
			},
			getTabNum() {
				indexApi.getEvaluateTab({
						spuId: this.spuId,
					})
					.then((res) => {
						if (res.data.totalCount > 0) {
							this.tabList[0].name = `${this.tabList[0].name}(${res.data.totalCount})`;
						}
						if (res.data.imageCount > 0) {
							this.tabList[1].name = `${this.tabList[1].name}(${res.data.imageCount})`;
						}
						if (res.data.goodsScoreCount > 0) {
							this.tabList[2].name = `${this.tabList[2].name}(${res.data.goodsScoreCount})`;
						}
						if (res.data.repurchaseCount > 0) {
							this.tabList[3].name = `${this.tabList[3].name}(${res.data.repurchaseCount})`;
						}
					});
			},
			getEvaluateList() {
				indexApi.getEvaluateList({
						currentPage: this.currentPage,
						orderByField: this.orderByField,
						pageSize: this.pageSize,
						spuId: this.spuId,
					})
					.then((res) => {
						let resOrderList = res.data.list;
						this.dataList = this.dataList.concat(resOrderList);
						this.dataList.forEach(e => {
							e.imgList = JSON.parse(e.content).images;
							e.text = JSON.parse(e.content).text;
						})
						if (resOrderList.length < this.pageSize) {
							this.status = 'nomore';
						}
					});
			},
		},
		onReachBottom() {
			if (this.status == 'nomore') {
				return;
			}
			this.currentPage++;
			this.getEvaluateList()
		},
	};
</script>

<style lang="scss" scoped>
	.evaluateListbg {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));

		.image-list {
			margin-left: 5rpx;
			display: grid;
			grid-template-columns: 346rpx 346rpx;
			gap: 15rpx;
			overflow: hidden;

			.image-item {
				width: 346rpx;
				height: 346rpx;
				border-radius: 10rpx;
				overflow: hidden;
			}
		}

		.content-wrapper {
			line-height: 33rpx;
		}

		.u-tabs__wrapper__nav__item::after {
			content: "5555";
		}
	}
</style>
