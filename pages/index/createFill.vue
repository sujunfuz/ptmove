<template>
	<view class="createFillbg">
		<u-navbar leftIconColor='#fff' :title="$t('createFill.title')" :titleStyle='{"color":"#fff"}'
			:placeholder='true' bgColor="#E1251B" fixed="" @leftClick="leftClick"></u-navbar>
		<view class="pad20">
			<view class="fontsize24 color9c textC marT20">{{$t('createFill.daizhifu')}}</view>
			<view class="colorMain marT10 marB32 flex-cc">
				<view style="position: relative;top: 6rpx;">{{globalUnit}}</view>
				<view class="marL6 fontsize50 fontbold">{{payObj.amount}}</view>
			</view>
			<view class="flex-cb cards">
				<view class="flex-c">
					<view class="colorRed">*</view>
					<view class="marL6">{{$t('createFill.input1')}}</view>
				</view>
				<view>
					<u--input style='width: 400rpx;' inputAlign='right' :placeholder="$t('common.input')" border="none"
						v-model="surname"></u--input>
				</view>
			</view>
			<view class="flex-cb cards">
				<view class="flex-c">
					<view class="colorRed">*</view>
					<view class="marL6">{{$t('createFill.input2')}}</view>
				</view>
				<view>
					<u--input style='width: 400rpx;' inputAlign='right' :placeholder="$t('common.input')" border="none"
						v-model="name"></u--input>
				</view>
			</view>
			<view class="cards">
				<view class="flex-cb">
					<view class="flex-c">
						<view class="colorRed">*</view>
						<view class="marL6">{{$t('createFill.input3')}}</view>
					</view>
					<view>
						<u--input style='width: 400rpx;' inputAlign='right' :placeholder="$t('common.input')"
							border="none" v-model="carId"></u--input>
					</view>
				</view>
				<view class="typebg">
					<image v-for="(it,i) in imgs" :key="i" class="imgtype" :src="ossIconUrl+it.url" mode="scaleToFill">
				</view>
			</view>
			<view class="flex-cb cards" style="position: relative;">
				<view style="position: absolute; width: 100%; height: 100%;left: 0; top: 0; z-index: 100;"
					@click="dateShow=true"></view>
				<view class="flex-c">
					<view class="colorRed">*</view>
					<view class="marL6">{{$t('createFill.input4')}}</view>
				</view>
				<view>
					<u--input style='width: 400rpx;' disabled disabledColor='#fff' inputAlign='right'
						:placeholder="$t('createFill.input4-1')" border="none" v-model="yearsValue"></u--input>
				</view>
			</view>
			<view class="flex-cb cards">
				<view class="flex-c">
					<view class="colorRed">*</view>
					<view class="marL6">{{$t('createFill.input5')}}</view>
				</view>
				<view>
					<u--input style='width: 400rpx;' inputAlign='right' :placeholder="$t('createFill.input5-1')"
						border="none" v-model="cvv2"></u--input>
				</view>
			</view>
			<view v-if="channelType=='UNION_PAY'" style="padding-bottom: 120rpx;">
				<view class="flex-cb cards">
					<view class="flex-c">
						<view class="colorRed">*</view>
						<view class="marL6">{{$t('createFill.input6')}}</view>
					</view>
					<view>
						<u--input style='width: 400rpx;' inputAlign='right' :placeholder="$t('common.input')"
							border="none" v-model="mobile"></u--input>
					</view>
				</view>
				<view class="flex-cb cards">
					<view class="flex-c">
						<view class="colorRed">*</view>
						<view class="marL6">{{$t('createFill.input7')}}</view>
					</view>
					<view>
						<u--input style='width: 400rpx;' inputAlign='right' :placeholder="$t('createFill.input7-1')"
							border="none" v-model="phoneCountry"></u--input>
					</view>
				</view>
				<view class="flex-cb cards">
					<view class="flex-c">
						<view class="colorRed">*</view>
						<view class="marL6">{{$t('createFill.input8')}}</view>
					</view>
					<view>
						<u--input style='width: 400rpx;' inputAlign='right' :placeholder="$t('common.input')"
							border="none" v-model="email"></u--input>
					</view>
				</view>
				<view class="flex-cb cards">
					<view class="flex-c">
						<view class="colorRed">*</view>
						<view class="marL6">{{$t('createFill.input9')}}</view>
					</view>
					<view>
						<u--input style='width: 400rpx;' inputAlign='right' :placeholder="$t('common.input')"
							border="none" v-model="postCode"></u--input>
					</view>
				</view>
				<view class="flex-cb cards">
					<view class="flex-c">
						<view class="colorRed">*</view>
						<view class="marL6">{{$t('createFill.input10')}}</view>
					</view>
					<view>
						<uni-data-picker :localdata="addressList" v-slot:default="{data, error, options}"
							:popup-title="$t('common.select')" @change='endchange'>
							<view v-if="error" class="huise">
								<text>{{error}}</text>
							</view>
							<view v-else-if="data.length">{{CountryRegion}}</view>
							<view v-else>
								<text class="huise">{{$t('common.select')}}</text>
							</view>
						</uni-data-picker>
					</view>
				</view>
				<view class="flex-cb cards">
					<view class="flex-c">
						<view class="colorRed">*</view>
						<view class="marL6">{{$t('createFill.input11')}}</view>
					</view>
					<view>
						<u--input style='width: 400rpx;' inputAlign='right' :placeholder="$t('common.input')"
							border="none" v-model="city"></u--input>
					</view>
				</view>
				<view class="flex-cb cards">
					<view class="flex-c">
						<view class="colorRed">*</view>
						<view class="marL6">{{$t('createFill.input12')}}</view>
					</view>
					<view>
						<u--input style='width: 400rpx;' inputAlign='right' :placeholder="$t('common.input')"
							border="none" v-model="address"></u--input>
					</view>
				</view>
			</view>

		</view>
		<view class="btsView">
			<view class="bts bgMain colorfff fontbold fontsize30" @tap="$u.throttle(openPaypwd, 500)">
				{{$t('common.confirm')}}
			</view>
		</view>
		<u-datetime-picker ref="datetimePicker" :show="dateShow" v-model="dateValue" mode="year-month"
			:cancelText="$t('common.cancel')" :confirmText="$t('common.confirm')" confirmColor='#E1251B'
			@cancel='dateShow=false' @confirm='dateConfirm'></u-datetime-picker>
		<paypwd :show="pwdShow" :amount='payObj.amount' @close='pwdShow=false' @finish='orderPay'></paypwd>
		<view ref='surplus'>
			<view v-html="htmlContent"></view>
		</view>
	</view>
</template>

<script>
	import indexApi from '@/api/index.js'
	import paypwd from '@/components/paypwd/paypwd.vue'
	import addressjson from '@/common/addressJson.js'
	export default {
		components: {
			paypwd,
		},
		data() {
			return {
				imgs: [{
					url: '/index/ka1.png',
				}, {
					url: '/index/ka2.png',
				}, {
					url: '/index/ka3.png',
				}, {
					url: '/index/ka4.png',
				}, {
					url: '/index/ka5.png',
				}],
				channelType: '', //UNION_PAY 聚合   VISA 信用卡
				payObj: '',
				surname: '',
				name: '',
				carId: '',
				yearsValue: '',
				year: '',
				month: '',
				cvv2: "",
				pwd: '',
				dateShow: false,
				dateValue: Number(new Date()),
				pwdShow: false,

				mobile: '',
				phoneCountry: '',
				email: '',
				postCode: '',
				countryCode: '',
				stateCode: '',
				CountryRegion: '',
				city: '',
				address: '',
				addressList: [],
				htmlContent: '',
				btnText: this.$t('common.viewnow'),
			}
		},
		computed: {
		},
		created() {
			let list = JSON.parse(JSON.stringify(addressjson))
			list.forEach(e => {
				e.text = e.name
				e.value = e.name_en
				e.children.forEach(e => {
					e.text = e.name
					e.value = e.code
					e.children.forEach(e => {
						e.text = e.name
						e.value = e.code
						e.children.forEach(e => {
							e.text = e.name
							e.value = e.code
						})
					})
				})
			})
			this.addressList = list
		},
		onLoad(e) {
			if (e.channelType) {
				this.channelType = e.channelType
			}
			this.payObj = JSON.parse(e.payObj);
		},
		methods: {
			dateConfirm(e) {
				let date = new Date(e.value)
				let Y = date.getFullYear()
				let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
				this.yearsValue = Y + '/' + M
				this.year = Y;
				this.month = M;
				this.dateShow = false;
			},
			endchange(e) {
				let list = e.detail.value;
				switch (list.length) {
					case 2:
						this.city = ''
						this.countryCode = list[1].value
						this.CountryRegion = list[1].text;
						break;
					case 3:
						this.countryCode = list[1].value
						this.stateCode = list[2].value
						this.CountryRegion = list[1].text + '/' + list[2].text;
						this.city = ''
						break;
					case 4:
						this.countryCode = list[1].value
						this.stateCode = list[2].value
						this.CountryRegion = list[1].text + '/' + list[2].text;
						this.city = list[3].text;
						break;
				}
			},
			openPaypwd() {
				if (!this.ruleForm1(this.surname, this.$t('createFill.input1'))) return
				if (!this.ruleForm1(this.name, this.$t('createFill.input2'))) return
				if (!this.ruleForm1(this.carId, this.$t('createFill.input3'))) return
				if (!this.ruleForm1(this.yearsValue, this.$t('createFill.input4'))) return
				if (!this.ruleForm1(this.cvv2, this.$t('createFill.input5'))) return

				if (this.channelType == 'UNION_PAY') {
					if (!this.ruleForm1(this.mobile, this.$t('createFill.input6'))) return
					if (!this.ruleForm1(this.phoneCountry, this.$t('createFill.input7'))) return
					if (!this.ruleForm1(this.email, this.$t('createFill.input8'))) return
					if (!this.ruleForm1(this.postCode, this.$t('createFill.input9'))) return
					if (!this.ruleForm1(this.CountryRegion, this.$t('createFill.input10'))) return
					if (!this.ruleForm1(this.city, this.$t('createFill.input11'))) return
					if (!this.ruleForm1(this.address, this.$t('createFill.input12'))) return
				}
				this.pwdShow = true;
			},
			orderPay(e) {
				let that = this;
				this.pwdShow = false;
				indexApi.orderPay({
					amount: this.payObj.amount,
					batchOrdNo: this.payObj.batchOrdNo,
					channelCode: this.payObj.channelCode,
					payType: this.payObj.payType,
					signImage: this.payObj.signImage,
					surname: this.surname,
					name: this.name,
					carId: this.carId,
					year: this.year,
					month: this.month,
					cvv2: this.cvv2,
					pwd: e,
					sceneType: 'H5',

					//聚合支付
					mobile: this.mobile,
					phoneCountry: this.phoneCountry,
					postCode: this.postCode,
					email: this.email,
					countryCode: this.countryCode,
					stateCode: this.stateCode,
					city: this.city,
					address: this.address
				}).then(res => {
					if (res.code == 200) {
						if (res.data && res.data.url3d && that.channelType == 'UNION_PAY') {
							if (res.data.type3d == 'url') {
								window.location.href = res.data.payUrl;
							} else {
								let html3d = res.data.html3d
								html3d = html3d.replace("<form", '<form id="form" ref="form" ')
									.replace("display: none", "display:block")
									.replace(
										'<input type="submit" value="submit" style="display:none" >',
										`<button type="primary" formType="submit" style="width:200px;border:0;background-color:#FDCD08;border-radius:20px;height:40px;line-height:40px;font-weight:bold">${this.btnText}</button>`
									)
									.replace(/<input/g, '<input style="display: none"')
								this.htmlContent = html3d;

								// #ifdef H5
								this.$nextTick(async () => {
									var scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
									var match;
									let scriptCode = '';
									while ((match = scriptRegex.exec(html3d)) !== null) {
										let Code = match[1];
										scriptCode = Code;
									}
									const func = new Function(scriptCode);
									func();
								});
								// #endif


								// #ifndef H5
								that.goToPage('/pages/index/html3d?form=' + this.htmlContent)
								// #endif

							}
						} else {
							that.showMsg(res.msg || that.$t('common.operateSuccess'))
							setTimeout(e => {
								that.goToPage('/pages/mine/myOrder')
							}, 1000)
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.createFillbg {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));

		.cards {
			background: #fff;
			padding: 40rpx 30rpx;
			margin-top: 20rpx;

			.typebg {
				background: #F6F6F6;
				padding: 20rpx;
				margin-top: 30rpx;

				.imgtype {
					width: 112rpx;
					height: 66rpx;
					margin-right: 11rpx;
					border-radius: 4rpx;
				}
			}

			.huise {
				color: #c0c4cc;
			}
		}

		.popoeview {
			padding: 50rpx;
		}
	}
</style>
