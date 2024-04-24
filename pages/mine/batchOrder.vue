<template>
	<view class="batchOrderbg pad20">
		<u-navbar leftIconColor="#fff" :title="$t('batchOrder.title')" :titleStyle="{ color: '#fff' }"
			:placeholder="true" bgColor="#E1251B" fixed="" @leftClick="leftClick"></u-navbar>
		<view class="bgfff bdRadius20 main-wrapper marAuto pad20">
			<view class="title-tips padB20">
				{{$t("batchOrder.tipsTitle")}}
			</view>
			<view class="text-class marB20">
				<u--textarea v-model="text" :placeholder="$t('batchOrder.placeholder1')" border="none" height="200"
					maxlength="-1"></u--textarea>
			</view>
			<view class="">
				<u-button @click="batchOrd" :text="$t('batchOrder.btnTips')" shape="circle" color="#E1251B"></u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import mineApi from '@/api/mine.js'
	export default {
		components: {},
		data() {
			return {
				text:'',
				// text: '张三，1885917698，臺灣省，臺北市，中正區，紫光科技園B3A，1，9a875de4970c5aec6db87f2a284ef085；张三，1885917698，臺灣省，臺北市，中正區，紫光科技園B3A，1，a9a075bfeed42e5258d89016a12d1e32；'
			};
		},
		onLoad() {},
		onShow() {},
		methods: {
			//批量下单
			batchOrd() {
				if (!this.ruleForm1(this.text, this.$t('mine.msg'))) return
				mineApi.batchOrd(this.text).then(res => {
					if (res.code == 200) {
						let errorList = []
						errorList = res.data.errorTextList.concat(res.data.resultErrorDatas)
						let list = res.data.storeOrdList;
						list.forEach(e => {
							e.storeAmount = e.goodsAmount;
							e.storeFreightAmout = e.freightAmount;
							e.selAddress = JSON.parse(e.receiveInfo);
							e.selAddress.userName = e.selAddress.receiveName;
							e.selAddress.address = e.selAddress.detail;
						})
						let orderRs = {};
						orderRs.dataList = list;
						orderRs.errorList = errorList;
						orderRs.createErrorNum = res.data.resultErrorDatas.length||0;
						orderRs.errorNum = res.data.errorNum;
						orderRs.successNum = Number(res.data.allItem) - Number(res.data.errorNum);
						orderRs.createType = 'batch';
						orderRs.type = 'BATCH_PRODUCE'; //批发
						uni.setStorageSync('orderRs', orderRs)
						this.goToPage('/pages/index/createOrder')
					}
				})
			},
		},
	};
</script>
<style lang="scss" scoped>
	/deep/ .u-checkbox {
		.u-checkbox__icon-wrap--disabled--checked {
			border-color: #e02a23 !important;

			.u-icon--right {
				background-color: #e02a23;
				width: 100%;
				height: 100%;

				.uicon-checkbox-mark {
					color: white !important;
					left: 2px;
				}
			}
		}
	}

	/deep/ .u-textarea {
		padding: 20rpx 0;
	}

	.batchOrderbg {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));
		box-sizing: border-box;

		.main-wrapper {

			.title-tips {
				border-bottom: 1px solid #e3e4e5;
			}

			.text-class {
				height: 500rpx;
			}
		}
	}
</style>
