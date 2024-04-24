<template>
	<view @touchmove.stop.prevent="()=>{return false}">
		<u-popup :show="show" mode="bottom" :safeAreaInsetTop='false' :safeAreaInsetBottom='false' :round='20' closeable
			@close="closePop">
			<view class="pad20" style="height: 90vh;background-color: #f6f6f6;">
				<view class="" style="height: 40rpx;"></view>
				<view class="bdRadius20 main-wrapper marAuto bgfff pad20 marT20">
					<view class="title-tips padB20">
						{{$t("batchOrder.tipsTitle")}}
					</view>
					<view class="text-class marB20">
						<u--textarea v-model="text" :placeholder="$t('cpaddressReco.placeholder1')" border="none"
							height="100" maxlength="-1"></u--textarea>
					</view>
					<view class="" @click.stop="addressRecognize">
						<u-button :text="$t('batchOrder.btnTips')" shape="circle" color="#E1251B"></u-button>
					</view>
				</view>
				<view class="marT20 ">
					<view class="title-desc marB20 fontsize28" v-if="identifyList.length>0">
						{{$t('cpaddressReco.nowImport')}}{{identifyList.length}}{{$t('cpaddressReco.numAddress')}}，{{$t('cpaddressReco.selectNum')}}{{nums}}{{$t('common.jian')}}
					</view>
					<scroll-view scroll-y="true" class="popupview" style="height: 60vh;">
						<view class="card-wrapper" v-for="(item,index) in identifyList" :key="index">
							<view class="flex-cb">
								<view class="flex">
									<image class="img60 flexnone" :src="ossIconUrl+'/index/dizhi.png'"
										mode="scaleToFill" style="width: 60rpx;height: 60rpx;"></image>
									<view class="marL30">
										<view class="fontsize28 u-line-1">
											<text class="marR30">{{item.receiveName}}</text>
											<text>{{item.mobile}}</text>
										</view>
										<view class="marT20 color9c9e9c fontsize24 u-line-1">
											{{item.addrValue}}{{item.detail}}
										</view>
										<view class="marT20">
											<u-number-box v-model="item.num" bgColor='#fff'>
												<view slot="minus" class="minus">
													<image class="img44 iconnumberbox"
														:src="ossIconUrl+'/index/jian.png'" mode="scaleToFill">
													</image>
												</view>
												<view slot="plus" class="plus">
													<image class="img44 iconnumberbox"
														:src="ossIconUrl+'/index/jia.png'" mode="scaleToFill">
													</image>
												</view>
											</u-number-box>
										</view>
									</view>
								</view>
								<view class="option-btn flex">
									<image :src="ossIconUrl+'/mine/edit.png'" mode="scaleToFill"
										style="width: 42rpx;height: 42rpx; margin-right: 10rpx;" @tap="clickEdit(item)">
									</image>
									<u-icon @tap="deldata(index)" name="trash-fill" color="#E1251B" size="23"></u-icon>
								</view>
							</view>

							<view class="wrapper" v-if="item.editShow">
								<view class="container flex-cb">
									<view class="w-txt">{{$t('addaddress.form1')}}</view>
									<view class="w-input">
										<u--input v-model="item.receiveName" border="none"
											:placeholder="$t('addaddress.form1tips')">
										</u--input>
									</view>
								</view>
								<view class="container flex-cb">
									<view class="w-txt">{{$t('addaddress.form3')}}</view>
									<view class="w-input">
										<u--input v-model="item.mobile" border="none"
											:placeholder="$t('addaddress.form3tips')"></u--input>
									</view>
								</view>
								<view class="container flex-cb" @click="openAddress(index)">
									<view class="customShadow"></view>
									<view class="w-txt">{{$t('addaddress.form4')}}</view>
									<view class="w-input flex-c">
										<view style="width: 480rpx;">
											<u--input disabledColor="#ffffff" border="none" v-model="item.addrValue"
												disabled :placeholder="$t('common.select')"></u--input>
										</view>
										<img class="input-img" :src="ossIconUrl+'/mine/locate.png'" alt="">
									</view>
								</view>
								<view class="container flex-cb">
									<view class="w-txt">{{$t('addaddress.form5')}}</view>
									<view class="w-input">
										<u--input disabledColor="#ffffff" v-model="item.detail" border="none"
											:placeholder="$t('addaddress.form5tips')"></u--input>
									</view>
								</view>
							</view>
						</view>
						<view style="padding: 20rpx 0;">
							<u-loadmore :status="status" :loadingText="$t('common.loading')"
								:nomoreText="$t('common.nomore1')" />
						</view>
						<view style="height:138rpx;width: 100%;"></view>
					</scroll-view>
				</view>
				<view class="fixbtsview">
					<u-button :text="$t('common.complete')" shape="circle" color="#E1251B" @click="complete">
					</u-button>
				</view>
			</view>
		</u-popup>
		<AddressPop v-if="popshow"  :father-empty="emptyArr[currentIndex]" :open-type="emptyArr[currentIndex].length > 0 ? 'edit': 'add'" :select-flag="indexflag[currentIndex]" :father-select="hasSelectArea[currentIndex]"
			@closePop="closeAddressPop" :show="popshow" />
	</view>
</template>

<script>
	import AddressPop from '@/pages/mine/components/AddressPop.vue'
	import indexApi from '@/api/index.js'
	export default {
		components: {
			AddressPop
		},
		props: {
			show: {
				type: Boolean,
				default: () => false
			},
			skuId: {
				type: String,
				default: () => ''
			},
			spuId: {
				type: String,
				default: () => ''
			},
			nums: {
				type: Number,
				default: () => 0
			},
		},
		mounted() {},
		data() {
			return {
				currentIndex: 0,//当前是打开哪个地址
				total: 0,
				identifyList: [], //notDistributionArea 是否可配送
				selectIndex: -1,
				status: 'nomore',
				text: '',
				count: 1,
				indexflag: [],
				popshow: false,
				hasSelectArea: [],
				emptyArr: [],
			}
		},
		watch: {},
		methods: {
			closePop() {
				this.$emit('closePop');
			},
			addressRecognize() {
				// let obj = {
				// 	num: 2,
				// 	province: '台湾省',
				// 	city: '台中市',
				// 	area: '正平区',
				// 	detail: '紫光科技',
				// 	mobile: '13200132000',
				// 	receiveName: '苏大大',
				// }
				// let obj1 = {
				// 	num: 2,
				// 	province: '台湾省',
				// 	city: '台中市',
				// 	area: '正平区',
				// 	detail: '紫光科技1',
				// 	mobile: '13200132000',
				// 	receiveName: '苏大大1',
				// }
				// this.identifyList.push(obj);
				// this.identifyList.push(obj1);

				indexApi.addressRecognize({
					skuId: this.skuId,
					spuId: this.spuId,
					text: this.text
				}).then(res => {
					if (res.code == 200) {
						this.text = '';
						this.identifyList = res.data.addressList;
						this.identifyList.forEach(e => {
							this.emptyArr = [...this.emptyArr,[]]
							this.hasSelectArea = [...this.hasSelectArea,[]]
							this.indexflag = [...this.indexflag,0]
							// this.emptyArr.push([])
							// this.hasSelectArea.push([])
							// this.indexflag.push(0)
							this.$set(e, 'editShow', false)
							e.remark = '';
							e.addrValue = e.province + e.city + e.area
						})
					}
				})
			},
			clickEdit(item) {
				item.editShow = !item.editShow;
			},
			deldata(index) {
				this.identifyList.splice(1, index)
			},
			complete() {
				let newnums = 0;
				this.identifyList.forEach(e => {
					newnums += Number(e.num)
				})
				if (newnums != this.nums) {
					this.showMsg(this.$t('cpaddressReco.tips1'))
					return
				}
				this.$emit('complete', this.identifyList);
			},
			closeAddressPop(val, vala, valc) {
				if(val.length < 3){
					this.popshow=false 
					return
				}
				let str = ''
				val.forEach((e,index)=> {
					str+=Number(e.name)
					if(index == 0){
						this.identifyList[this.currentIndex].province = e.name
					} else if( index == 1){
						this.identifyList[this.currentIndex].city = e.name
					} else {
						this.identifyList[this.currentIndex].area = e.name
					}
				})
				
				this.hasSelectArea[this.currentIndex] = val
				this.emptyArr[this.currentIndex] = vala
				this.indexflag[this.currentIndex] = valc
				this.identifyList[this.currentIndex].addrValue = str
				this.popshow=false 
			},
			openAddress(index) {
				this.currentIndex = index
				this.$nextTick(() => {
					this.popshow = true
				})
			}
		}

	}
</script>

<style lang="scss" scoped>
	.card-wrapper {
		width: 100%;
		background-color: #fff;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
		padding: 20rpx;
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

	.card-wrapper:last-child {
		margin-bottom: calc(constant(safe-area-inset-bottom) + 160rpx);
		margin-bottom: calc(env(safe-area-inset-bottom) + 160rpx);
	}

	// .popupview {
	// 	height: 100vh;
	// 	padding-bottom: 150rpx;
	// 	box-sizing: border-box;
	// }

	/deep/ .u-number-box__minus,
	/deep/.u-number-box__plus {
		background-color: #F6F6F6 !important;
		width: 60rpx !important;
		height: 60rpx !important;
		border-radius: 50% !important;
		overflow: hidden;
	}

	/deep/ .u-number-box__input {
		background-color: white !important;
	}

	.wrapper {
		width: 100%;
		padding: 0rpx 20rpx;
		box-sizing: border-box;
		background-color: white;
		border-radius: 20rpx;

		.container {
			position: relative;
			width: 100%;
			height: 100rpx;
			border-bottom: 1rpx solid #E3E4E5;

			.customShadow {
				position: absolute;
				z-index: 20;
				left: 0%;
				top: 0%;
				right: 0%;
				bottom: 0%;
			}

			.w-txt {
				width: 112rpx;
				font-size: 28rpx;
				font-weight: 500;
				color: #1A1A1A;
			}

			.w-input {
				width: calc(100% - 142rpx) !important;

				.input-img {
					width: 44rpx;
					height: 44rpx;
				}
			}
		}

		.container:last-child {
			border-bottom: none;
		}
	}

	/deep/ .u-index-list__letter {
		display: none;
	}

	/deep/ .u-index-list {
		height: calc(60vh - 208rpx) !important;
		max-height: calc(60vh - 208rpx) !important;

		// height: 400rpx !important;
		// max-height: 400rpx !important;
		scroll-view {
			height: calc(60vh - 208rpx) !important;
			max-height: calc(60vh - 208rpx) !important;
			// height: 400rpx !important;
			// max-height: 400rpx !important;
		}
	}

	/deep/ .u-index-anchor {
		// background-color: white !important;
		// border-bottom-width: 1rpx !important;
		// border-color: #F5F5F5 !important;
		// border-bottom-style: solid !important;
		padding-left: 0rpx !important;

		.u-index-anchor__text {
			font-size: 32rpx;
			font-weight: 800;
			color: #2E2E2E;
		}
	}

	.fixbtsview {
		width: calc(100% - 40rpx);
		padding: 20rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		background: #fff;
	}
</style>
