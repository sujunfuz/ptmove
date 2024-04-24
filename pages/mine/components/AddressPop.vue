<template>
	<view @touchmove.stop.prevent="()=>{return false}">
		<u-popup :show="show" mode="bottom" :safeAreaInsetTop='false' :safeAreaInsetBottom='false' :round='20' closeable
			@close="close">
			<view class="popupview">
				<view class="fontsize30 fontbold">{{$t('common.selszd')}}</view>
				<view class="pop-tabs">
					<u-tabs :list="list" :current="indexflag" keyName='label' lineColor="#E1251B" @click="clickTabs"></u-tabs>
				</view>
				<view class="flex-c marT30" style="font-size: 28rpx;color: #2E2E2E;">
					<view @click="clickHasSelect(item)" v-for="item in hasSelectArea" :key="item.id"
						style="font-weight: 500;" class="marR30">{{item.name}}</view>
					<view v-if="!pleaseFlag" style="font-weight: 500;color:#E1251B;">{{$t('common.select')}}</view>
				</view>
				<!-- <scroll-view :scroll-y="true" class="scrollStyle"> -->
				<!-- 热门城市 -->

				<!-- 选择地址 -->
				<!-- <view class="scrollStyle"> -->
				<u-index-list :index-list="indexList" activeColor="green">
					<!-- 					<view style="width: 100%;height: 1rpx;"></view>
					<view class="hot-box">
						<view class="hot-title">热门城市</view>
						<view class="hot-wrapper">
							<view class="hot-item">中国香港</view>
							<view class="hot-item">中国澳门</view>
							<view class="hot-item">中国台湾</view>
						</view>
					</view> -->
					<template v-for="(item, index) in itemArr">
						<u-index-item>
							<!-- #ifndef APP-NVUE -->
							<u-index-anchor bgColor="white" height="102rpx" style="font-weight: 800;"
								:text="indexList[index]"></u-index-anchor>
							<!-- #endif -->
							<view class="list-cell" @click="clickArea(cell)" v-for="(cell, aindex) in item"
								:key="cell.id">
								{{cell.name}}
							</view>
						</u-index-item>
					</template>
				</u-index-list>
				<!-- </view> -->
				<!-- </scroll-view> -->
			</view>
		</u-popup>
	</view>
</template>

<script>
	import mineApi from '@/api/mine.js'
	export default {
		props: {
			show: {
				type: Boolean,
				default: () => false
			},
			openType: {
				type: String,
				default: ''
			},
			fatherSelect: {
				type: Array,
				default: () => []
			},
			fatherEmpty: {
				type: Array,
				default: () => []
			},
			selectFlag: {
				type: Number,
				default: 0
			}
		},
		created() {
			this.list.forEach(e => {
				e.label = this.$t(e.name)
			})
		},
		mounted() {
			if (this.openType == 'add') {
				this.init()
			}
		},
		data() {
			return {
				indexflag: 0,//0代表中国内地（大陆） 1代表港澳台
				hasSelectArea: [],//里面一次push选中的每一级地区信息
				emptyArr: [],//里面一次push进每一级地区是否有下一级的true false，false一定出现在最后一位
				list: [
					{
						name: 'addaddress.tabs1',
						label: '',
					}, {
						name: 'addaddress.tabs2',
						label: '',
					},
				],
				indexList: [],//用来存索引字符A B ...
				itemArr: [],//用来存每个对应索引的地区信息
				currentCell: null, //用来记录当前点击的地理信息
				firstFlag: false //用来判断编辑是不是第一次进来然后，fatherSelect监听器会判断这个第一次进来进行编辑初始化
			}
		},
		watch: {
			indexflag: {
				handler() {
					if (this.openType == 'edit' && !this.firstFlag) {
						return
					}
					this.hasSelectArea = []
					this.currentCell = null
					this.emptyArr = []
					this.init()
				}
			},
			fatherSelect: {
				immediate: true,
				handler() {
					if (this.openType == 'edit' && this.fatherSelect.length > 0 && !this.firstFlag) {
						this.indexflag = this.selectFlag
						this.$nextTick(() => {
							this.firstFlag = true
							this.hasSelectArea = [...this.fatherSelect]
							this.emptyArr = [...this.fatherEmpty]
							this.currentCell = this.hasSelectArea[this.hasSelectArea.length - 1]
							this.editInit()
						})
					}
				}
			}
		},
		computed: {
			//用于判断请选择按钮是否出现，通过判断emptyArr最后一个是否为false，为false代表输入满了不用出现
			pleaseFlag() {

				if (this.emptyArr.length == 0) {
					return false
				} else {
					return this.emptyArr[this.emptyArr.length - 1]
				}
			}
		},
		methods: {
			//编辑时会通过监听器调用该方法初始化，获取这一级下面展示的地区信息
			editInit() {
				mineApi.getListRegion({
					inland: this.indexflag == 0 ? 'YES' : 'NO',
					level: this.hasSelectArea[this.hasSelectArea.length - 2].level + 1,
					parentId: this.hasSelectArea[this.hasSelectArea.length - 2].id
				}).then(res => {
					this.indexList = []
					this.itemArr = []
					res.data.records.forEach(item => {
						this.indexList.push(item.letter)
						this.itemArr.push(item.sysRegionVOS)
					})
				})
			},
			//新增时通过mounted调用该方法初始化获取下面最高一级的地址信息，也可以用来获取点击的下一级地址信息
			init() {
				let parentId = !this.currentCell ? '' : (this.currentCell.level - 1 == this.hasSelectArea.length ? this
					.currentCell.id : this.currentCell.parentId)
				let level = !this.currentCell ? 1 : (this.currentCell.level - 1 == this.hasSelectArea.length ? this
					.currentCell.level + 1 : this.currentCell.level)
				if (level == 1) {
					level = 2
				}
				if (level == 2) {
					parentId = ''
				}
				if (level == 5 && this.emptyArr[level - 2]) {
					level -= 1
					parentId = this.currentCell.parentId
				}
				mineApi.getListRegion({
					inland: this.indexflag == 0 ? 'YES' : 'NO',
					level: level,
					parentId
				}).then(res => {
					// console.log('res',res)
					this.emptyArr[level - 2] = res.data.empty
					this.emptyArr = [...this.emptyArr]
					// console.log('emptyArr',this.emptyArr)//判断是否还有下一级
					if (res.data.empty) {
						this.close()
						return;
					}
					this.indexList = []
					this.itemArr = []
					res.data.records.forEach(item => {
						this.indexList.push(item.letter)
						this.itemArr.push(item.sysRegionVOS)
					})
				})
			},
			//点击已经选过的地址，会查询这一级的地址信息
			clickHasSelect(cell) {
				if (this.currentCell && this.currentCell.id == cell.id) return
				this.currentCell = cell
				// console.log(this.currentCell)
				this.init()
			},
			//点击没选过的地址会根据它相应的级别赋值到hasSelectArea响应的位置，并把它后面的信息全部删除
			clickArea(cell) {
				if (this.currentCell && this.currentCell.id == cell.id) return;
				this.currentCell = cell
				// console.log(this.currentCell)
				this.hasSelectArea[cell.level - 2] = cell
				this.hasSelectArea = this.hasSelectArea.filter((item, index) => index < (cell.level - 1))
				this.emptyArr = this.emptyArr.filter((item, index) => index < (cell.level - 1))
				this.init()
			},
			//关闭弹窗，把选中的信息返回给页面
			close() {
				this.$emit('closePop', this.hasSelectArea, this.emptyArr, this.indexflag);
			},
			//转变内陆和港澳台
			clickTabs(val) {
				this.indexflag = val.index
			}
		}
	}
</script>

<style lang="scss" scoped>
	.popupview {
		// height: 368rpx;
		height: 60vh;
		padding: 30rpx 30rpx 58rpx 30rpx;
	}

	.pop-tabs {
		margin-left: -20rpx;
	}

	.scrollStyle {
		// min-height: 50vh;
		// max-height: 60vh;
		// height: 1000rpx;
		// width: 100%;
		height: calc(100% - 128rpx);
	}

	.list-cell {
		padding: 20rpx 0rpx;
		font-size: 28rpx;
		font-weight: 500;
		color: #2E2E2E;
	}

	.hot-box {
		width: 100%;
		margin-top: 60rpx;
		margin-bottom: 50rpx;

		.hot-title {
			font-size: 28rpx;
			font-weight: 500;
			color: #999999;
		}

		.hot-wrapper {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			margin-top: 30rpx;
			font-size: 28rpx;
			font-weight: 500;
			color: #2E2E2E;

			.hot-item {
				width: 112rpx;
				padding-left: 28rpx;
				padding-right: 28rpx;
				text-align: center;
			}
		}
	}
</style>
