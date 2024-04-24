<template>
	<view class="addaddressbg">
		<u-navbar leftIconColor='#fff' :title="openType == 'edit' ? $t('addaddress.edit'):$t('addaddress.title')"
			:titleStyle='{"color":"#fff"}' :placeholder='true' bgColor="#E1251B" fixed="" @leftClick="leftClick">
		</u-navbar>
		<view class="box">
			<view class="wrapper">
				<view class="container flex-cb">
					<view class="w-txt u-line-1">{{$t('addaddress.form1')}}</view>
					<view class="w-input">
						<u--input v-model="formData.userName" border="none" :placeholder="$t('addaddress.form1tips')">
						</u--input>
					</view>
				</view>
				<view class="container flex-cb">
					<view class="w-txt u-line-1">{{$t('addaddress.form2')}}</view>
					<view class="w-input">
						<u--input v-model="formData.refNo" border="none" :placeholder="$t('addaddress.form2tips')">
						</u--input>
					</view>
				</view>
				<view class="container flex-cb">
					<view class="w-txt u-line-1">{{$t('addaddress.form3')}}</view>
					<view class="w-input">
						<u--input v-model="formData.mobile" border="none" :placeholder="$t('addaddress.form3tips')">
						</u--input>
					</view>
				</view>
				<view class="container flex-cb" @click="show=true">
					<view class="customShadow"></view>
					<view class="w-txt u-line-1">{{$t('addaddress.form4')}}</view>
					<view class="w-input flex-c">
						<view style="width: 480rpx;">
							<u--input disabledColor="#ffffff" border="none" v-model="addrValue" disabled
								:placeholder="$t('common.select')"></u--input>
						</view>
						<img class="input-img" :src="ossIconUrl+'/mine/locate.png'" alt="">
					</view>
				</view>
				<view class="container flex-cb">
					<view class="w-txt u-line-1">{{$t('addaddress.form5')}}</view>
					<view class="w-input">
						<u--input disabledColor="#ffffff" v-model="formData.address" border="none"
							:placeholder="$t('addaddress.form5tips')"></u--input>
					</view>
				</view>
			</view>
		</view>
		<view class="btsView">
			<view class="bts bgMain colorfff fontbold fontsize30" @click="save">
				{{$t('common.confirm')}}
			</view>
		</view>
		<view class="">
			<AddressPop :father-empty="emptyArr" :open-type="openType" :select-flag="indexflag"
				:father-select="hasSelectArea" @closePop="closePop" :show="show" />
		</view>
	</view>
</template>

<script>
	import AddressPop from './components/AddressPop.vue'
	import mineApi from '@/api/mine.js'
	import form from '../../uni_modules/uview-ui/libs/config/props/form'
	export default {
		components: {
			AddressPop
		},
		onLoad(e) {
			this.openType = e.openType
			if (this.openType == 'edit') {
				this.id = e.id
				this.getAddressInfo()
			}
		},
		data() {
			return {
				allData: null,
				indexflag: 0, //0代表中国内地（大陆） 1代表港澳台
				id: '',
				openType: '',
				show: false,
				hasSelectArea: [],
				emptyArr: [],// 配置空值
				addrValue: '',
				inland: 'YES',
				formData: {
					userName: '',
					refNo: '',
					mobile: '',
					// phoneAreaCode: '',
					province: '',
					provinceCode: '',
					city: '',
					cityCode: '',
					area: '',
					areaCode: '',
					address: '',
					// defaultIs: ''
				}
			}
		},
		watch: {
			hasSelectArea: {
				handler() {
					let str = ''
					this.hasSelectArea.forEach(item => {
						str += item.name + ' '
					})
					this.addrValue = str
				}
			}
		},
		methods: {
			getAddressInfo() {
				mineApi.getShippingAddressById({
					id: this.id
				}).then(res => {
					this.allData = res.data
					this.formData.userName = res.data.userName
					this.formData.refNo = res.data.refNo
					this.formData.mobile = res.data.mobile
					this.formData.address = res.data.address
					this.formData.inland = res.data.inland
					this.indexflag = this.formData.inland == 'YES' ? 0 : 1
					this.emptyArr[0] = false
					if (res.data.province) {
						this.hasSelectArea[0] = {
							name: res.data.province,
							id: res.data.provinceCode,
							parentId: '',
							level: 2
						}
						this.emptyArr[1] = false
					}
					if (res.data.city) {
						this.hasSelectArea[1] = {
							name: res.data.city,
							id: res.data.cityCode,
							parentId: this.hasSelectArea[0].id,
							level: 3
						}
						this.emptyArr[2] = false
					}
					if (res.data.area) {
						this.hasSelectArea[2] = {
							name: res.data.area,
							id: res.data.areaCode,
							parentId: this.hasSelectArea[1].id,
							level: 4
						}
						this.emptyArr[3] = false
						this.emptyArr[4] = true
					}
					this.hasSelectArea = [...this.hasSelectArea]
					this.emptyArr = [...this.emptyArr]
					this.formData = {
						...this.formData
					}
				})
			},
			closePop(val, vala, valc) {
				this.hasSelectArea = val //已选择的地区数组
				this.emptyArr = vala
				this.indexflag = valc 
				this.show = false
			},
			save() {
				const reg = /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/
				if (!this.formData.userName) {
					this.showMsg(this.$t('addaddress.form1tips'))
					return;
				} else if (!this.formData.refNo) {
					this.showMsg(this.$t('addaddress.form2tips'))
					return;
				} else if (!this.formData.mobile) {
					this.showMsg(this.$t('addaddress.form3tips'))
					return;
				} else if(!reg.test(this.formData.mobile)){
					this.showMsg(this.$t('addaddress.form3tips2'))
					return
				}else if (this.emptyArr.length == 0 || !this.emptyArr[this.emptyArr.length - 1]) {
					this.showMsg(this.$t('common.select')+this.$t('addaddress.form4'))
					return;
				} else if (!this.formData.address) {
					this.showMsg(this.$t('addaddress.form5tips'))
					return;
				}
				this.hasSelectArea.forEach((item, index) => {
					if (index == 0) {
						this.formData.province = item.name
						this.formData.provinceCode = item.id
					} else if (index == 1) {
						this.formData.city = item.name
						this.formData.cityCode = item.id
					} else if (index == 2) {
						this.formData.area = item.name
						this.formData.areaCode = item.id
					}
				})
				this.formData.inland = this.indexflag == 0 ? 'YES' : 'NO'
				if (this.openType == 'add') {
					mineApi.addShippingAddress(this.formData).then(res => {
						if (res.code == 200) {
							this.showMsg(res.msg)
							setTimeout(() => {
								this.goBack()
							}, 500)
						}
					})
				} else if (this.openType == 'edit') {
					this.formData.id = this.id
					mineApi.editShippingAddress(this.formData).then(res => {
						if (res.code == 200) {
							this.showMsg(res.msg)
							setTimeout(() => {
								this.goBack()
							}, 500)
						}
					})

				}


			}
		}
	}
</script>

<style lang="scss" scoped>
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

	// /deep/ .u-index-item {
	// 	.list-cell {
	// 		font-size: 28rpx;
	// 		font-weight: 500;
	// 		color: #2E2E2E;
	// 		margin-top:  30rpx;
	// 	}
	// 	.list-cell:first-child {
	// 		margin-top: 20rpx;
	// 	}
	// 	.list-cell:last-child{
	// 		margin-bottom: 40rpx;
	// 	}

	// }

	.addaddressbg {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));
	}

	.box {
		box-sizing: border-box;
		width: 100%;
		padding: 20rpx 24rpx;
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
				width: 120rpx;
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
</style>
