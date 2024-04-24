<template>
	<view class="baseinfobg pad20">
		<u-navbar leftIconColor='#fff' :title="$t('setindex.title')" :titleStyle='{"color":"#fff"}' :placeholder='true'
			bgColor="#E1251B" fixed="" @leftClick="leftClick"></u-navbar>
		<!-- <view>{{$t('setindex.title')}}</view> -->

		<view class="bgfff bdRadius20 pad20 white-wrapper">
			<view class="flex-cc marB30 marT30">
				<view class="avatar-text">
					<view class="flex-cc">
						<u-avatar :src="ImgUrl+baseInfo.icon" size="70"></u-avatar>
					</view>
					<view class="change-avatar marT20 textC fontsize28" @tap.stop="handlePopShow('ICON')">{{$t('baseInfo.changeAvatar')}}</view>
				</view>
			</view>
			<view class="info-wrapper">
				<view class="flex-cb desc-item" @tap.stop="handlePopShow('SEX')">
					<view class="label">
						{{$t("baseInfo.sex")}}
					</view>
					<view class="flex-cc">
						<text class="marR10">{{baseInfo.sex}}</text>
						<u-icon name="arrow-right" color="#999" size="15"></u-icon>
					</view>
				</view>
				<view class="flex-cb desc-item" @tap.stop="handleModal('NICKNAME')">
					<view class="label">
						{{$t("baseInfo.nickname")}}
					</view>
					<view class="flex-cc">
						<text class="marR10">{{baseInfo.nickName}}</text>
						<u-icon name="arrow-right" color="#999" size="15"></u-icon>
					</view>
				</view>
				<view class="flex-cb desc-item" @tap.stop="pickerShow = true">
					<view class="label">
						{{$t("baseInfo.birth")}}
					</view>
					<view class="flex-cc">
						<text class="marR10">{{baseInfo.birthday}}</text>
						<u-icon name="arrow-right" color="#999" size="15"></u-icon>
					</view>
				</view>
				<view class="flex-cb desc-item" @tap.stop="handleModal('SIGNATURE')">
					<view class="label">
						{{$t("baseInfo.signture")}}
					</view>
					<view class="flex-cc">
						<text v-if="baseInfo.signature" class="color1A marR10">{{baseInfo.signature}}</text>
						<text class="marR10 color9c9e9c" v-else>{{$t("baseInfo.nowNoWrite")}}</text>
						<u-icon name="arrow-right" color="#999" size="15"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<!-- 修改昵称模态窗 -->
		<u-modal :show="modalShow" :title="modalTitle" confirmColor="#E1251B" cancelColor="#9c9e9c" showCancelButton
			class="textC" @cancel="handleModalCancel" @confirm="handleModalConfirm">
			<view class="slot-content">
				<u--input :placeholder="$t('common.input')" v-model="inputVal" @change="inputChange"
					:customStyle="inputStyle"></u--input>
			</view>
		</u-modal>
		<!-- 换头像 弹窗 -->
		<u-popup :show="popShow" @close="popShow = false" closeable round=10>
			<view class="avatar-pop pad30">
				<view class="title fontsize30 fontbold">
					{{popTitle}}
				</view>
				<view class="avatar-wrap pad20">
					<view class="option-item textC" v-for="(item,index) in popList" :key="index"
						:class="{'color9c9e9c' :index == 2,'active_sex': index == 0 && popType == 'SEX' }"
						@tap.stop="handlePopOption(index)">
						{{item}}
					</view>
				</view>
			</view>
		</u-popup>

		<u-datetime-picker :show="pickerShow" v-model="dateVal" mode="date" @cancel="pickerShow=false"
			@confirm="confirmDatetime" confirmColor="#E1251B" :confirmText="$t('baseInfo.confirm')"
			:cancelText="$t('baseInfo.cancel')"></u-datetime-picker>
	</view>
</template>

<script>
	import setApi from "@/api/set.js"
	export default {
		data() {
			return {
				inputStyle: {
					'backgroundColor': '#F6F6F6',
					'padding': '20rpx',
					'border-radius': '10rpx'
				},
				baseInfo: {},
				modalShow: false,
				// NICKNAME | SIGNTURE
				type: 'NICKNAME',
				modalTitle: '',
				modalPlace: '',//提示语
				inputVal: '',
				popShow: false,
				// ICON | SEX
				popType: 'ICON',
				popTitle: '',
				popList: [],
				// 时间选择器
				pickerShow: false,
				dateVal: Number(new Date()),
				avatarUrl: ''
			}
		},
		onLoad() {
			this.getBaseInfo()
		},
		methods: {
			inputChange(val) {
				console.log(val)
			},
			getBaseInfo() {
				setApi.getBaseInfo().then(res => {
					if (res.code == 200) {
						this.baseInfo = res.data
						const oldInfo = uni.getStorageSync('userInfo')
						const newInfo = {
							...oldInfo,
							...res.data
						}
						this.$store.commit('setuserInfo', newInfo)
						uni.setStorageSync('userInfo', newInfo)
					} else {
						this.showMsg(res.msg)
					}
				})
			},
			modifyInfo(type, value) {
				setApi.modifyBaseInfo({
					type,
					value
				}).then(res => {
					console.log(res, "resresres")
					this.getBaseInfo()
				})
			},
			handleModal(type) {
				this.modalShow = true
				this.type = type
				this.modalTitle = type == 'NICKNAME' ? this.$t("baseInfo.changeName") : this.$t("baseInfo.signture")
				this.inputVal = type == 'NICKNAME' ? this.baseInfo.nickName : this.baseInfo.signature
			},
			handleModalCancel() {
				this.modalShow = false;
				this.inputVal = ''
			},
			handleModalConfirm() {
				const tips = this.type == 'NICKNAME' ? this.$t("baseInfo.changeName") : this.$t("baseInfo.signture")
				if (!this.ruleForm1(this.inputVal, tips)) return
				this.modalShow = false;
				this.modifyInfo(this.type, this.inputVal)
				this.inputVal = ''
			},
			handlePopShow(type) {
				this.popType = type;
				this.popShow = true;
				this.popTitle = type == 'ICON' ? this.$t('baseInfo.changeAvatar') : this.$t("baseInfo.sex")
				this.popList = type == 'ICON' ? [this.$t('baseInfo.popAvatar1'), this.$t('baseInfo.popAvatar2'), this.$t(
					'baseInfo.cancel')] : [this.$t('baseInfo.popSex1'), this.$t('baseInfo.popSex2'), this.$t(
					'baseInfo.cancel')]
			},
			confirmDatetime(date) {
				const format = new Date(date.value).toLocaleDateString().replaceAll('/', '-')
				this.modifyInfo('BIRTHDAY', format)
				this.pickerShow = false
			},
			// 上传头像
			uploadAvatar() {
				const that = this
				uni.uploadFile({
					url: that.uploadUrl,
					filePath: this.avatarUrl,
					name: 'file',
					success: (uploadFileRes) => {
						uploadFileRes = JSON.parse(uploadFileRes.data)
						console.log(uploadFileRes.data, "0000")
						this.modifyInfo('ICON', uploadFileRes.data.fileAdder)
					},
					fail: (err) => {
						that.showMsg(that.$t('common.uploadfail'));
					},
				});
			},

			handlePopOption(index) {
				if (index == 0 || index == 1) {
					// 改头像
					if (this.popType == 'ICON') {
						const method = index == 0 ? 'album' : 'camera'
						uni.chooseImage({
							count: 1,
							sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
							sourceType: [method], //从相册选择
							success: (res) => {
								console.log('获取成功')
								this.avatarUrl = res.tempFilePaths[0]
								// 图片路径
								console.log(this.avatarUrl)
								this.uploadAvatar()
							},
							fail: (res) => {
								console.log('获取失败')
							},
							complete: (res) => {
								console.log('获取完成')
								console.log(JSON.stringify(res.tempFilePaths));
							}
						});
						// 改性别
					} else {
						this.modifyInfo(this.popType, index == 0 ? '男' : '女')
					}
				}
				this.popShow = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.baseinfobg {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));
		box-sizing: border-box;

		.change-avatar {
			color: #E1251B;

		}

		.desc-item {
			padding: 40rpx 0;
			border-top: 1px solid #E3E4E5;
		}

		/deep/ .u-modal__content {
			flex-direction: column;
		}

		/deep/ .u-border {
			border: none;
		}

		.avatar-pop {
			height: 495rpx;

			.avatar-wrap {
				margin: 60rpx 0;

				.option-item:not(:last-of-type) {
					border-bottom: 1px solid #eee;
				}

				.option-item {
					padding: 40rpx 0;
				}
			}
		}

	}
</style>