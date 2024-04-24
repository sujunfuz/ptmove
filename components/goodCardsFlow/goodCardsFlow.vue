<template>
	<view class="waterfall" :style="'background-color:'+bgColor">
		<view v-for="(item, index) in columnData" :key="index" class="column_ul">
			<view class="animationY10" v-for="(item, childIndex) in item" :key="childIndex" @click.stop="click(item)">
				<Cards :isAdd='isAdd' :allData='item'></Cards>
			</view>
		</view>
	</view>
</template>

<script>
	import Cards from './Cards.vue'
	export default {
		components: {Cards},
		props: {
			//数据源
			dataList: {
				type: Array,
				required: true,
				default: []
			},
			//显示列数
			column: {
				type: Number,
				default: 2
			},
			//是否有加购按钮
			isAdd: {
				type: Boolean,
				default: () => true
			},
			//页面背景颜色
			bgColor: {
				type: String,
				default: 'none'
			},
		},
		data() {
			return {
				ossIconUrl: this.$request.ossIconUrl,
				columnData: [],
				columnWidth: 0,
				loading: false,
			};
		},
		watch: {
			dataList: {
				immediate: true,
				deep: true,
				handler(newValue, oldValue) {
					this.$nextTick(() => {
						// this.setColumnWidth()
						this.setData()
					})
				},
			},
		},
		methods: {
			setData() {
				const resultArray = this.dataList.reduce(
					(acc, cur, index) => {
						const targetIndex = index % this.column;
						acc[targetIndex].push(cur);
						return acc;
					},
					Array.from(Array(this.column), () => []),
				);
				this.columnData = resultArray;
			},
			click(item) {
				this.goToPage('/pages/index/shopDetails?id=' + item.id)
			}
		},
	};
</script>

<style scoped lang="scss">
	.waterfall {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		// padding:0 20rpx;

		.column_ul {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 50%;
		}

	}
</style>