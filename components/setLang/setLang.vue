<template>
	<view @touchmove.stop.prevent="()=>{return false}">
		<u-popup :show="show" mode="bottom" :safeAreaInsetTop='false' :safeAreaInsetBottom='false'
			:closeOnClickOverlay='false' :round='20' closeable @close="cancel">
			<view class="popupview">
				<view class="fontsize30 fontbold">{{$t('cpsetLang.title')}}</view>
				<scroll-view scroll-y="true" style="max-height: 468rpx;">
					<view class="fontsize32 fontbold marT30">{{$t('cpsetLang.sellang')}}</view>
					<view class='marT20' @click='langShow=!langShow'>
						<u--input v-model="langName" disabled disabledColor='#fff' :customStyle='inputStyle'
							:placeholder="$t('cpsetLang.sellang')" suffixIcon="arrow-down"
							suffixIconStyle="color: #1A1A1A">
						</u--input>
					</view>
					<view class="show_ul borderC5" v-if="langShow">
						<view class="show_li" :class="langValue==it.value?'colorMain bgRed':''"
							v-for="(it,i) in locales" :key='i' @click="onLocaleChange(it)">{{it.label}}</view>
					</view>
					<view class="fontsize32 fontbold marT30">{{$t('cpsetLang.selmoney')}}</view>
					<view class='marT20' @click='moneyShow=!moneyShow'>
						<u--input v-model="currencyName" disabled disabledColor='#fff' :customStyle='inputStyle'
							:placeholder="$t('cpsetLang.selmoney')" suffixIcon="arrow-down"
							suffixIconStyle="color: #1A1A1A">
						</u--input>
					</view>
					<view class="show_ul borderC5" v-if="moneyShow">
						<view class="show_li" :class="currencyCode==it.currencyCode?'colorMain bgRed':''"
							v-for="(it,i) in currencyList" :key='i' @click="onMoneyChange(it)">{{$t(it.currencyName)}}
						</view>
					</view>
				</scroll-view>
				<view class="flex-cb marT40">
					<view class="minbts borderC5" @click="cancel">{{$t('common.cancel')}}</view>
					<view class="minbts marL20 borderMain bgMain colorfff" @click="colse">{{$t('common.confirm2')}}
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import commonApi from '@/api/common.js'
	export default {
		props: {
			show: {
				type: Boolean,
				default: () => false
			},
		},
		data() {
			return {
				inputStyle: {
					padding: '20rpx',
				},
				locales: [{
					label: this.$t('locale.cht'),
					value: 'cht'
				}, {
					label: this.$t('locale.zh'),
					value: 'zh'
				}, {
					label: this.$t('locale.en'),
					value: 'en'
				}],
				langValue: 'cht',
				langName: '',
				langShow: false,
				currencyList: [],
				currencyName: '',
				currencyCode: '',
				moneyShow: false,
				selCurrency:{},//选择币种
				selLang:{},//选择语言
			}
		},
		created() {
			this.getCurrency()
		},
		methods: {
			cancel(){
				this.$emit('cancel');
			},
			colse() {
				this.$emit('closesetlang',this.selLang,this.selCurrency);
			},
			onLocaleChange(item) {
				this.langValue = item.value;
				this.langName = item.label;
				this.selLang=item;
				this.langShow = false;
			},
			getCurrency() {
				commonApi.getCurrency().then(res => {
					if (res.code == 200) {
						this.langValue = uni.getStorageSync('langStr')
						this.currencyCode = uni.getStorageSync('currency')
						this.currencyList = res.data;
						this.currencyList.forEach(e => {
							if (e.currencyCode == this.currencyCode) {
								this.selCurrency=e;
								this.currencyName = e.currencyName;
							}
						})
						this.locales.forEach(e => {
							if (this.langValue == e.value) {
								this.selLang=e;
								this.langName = e.label;
							}
						})
						console.log(this.langName)
					}
				})
			},
			onMoneyChange(e) {
				this.selCurrency=e;
				this.currencyName = e.currencyName;
				this.currencyCode = e.currencyCode;
				this.moneyShow = false;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.popupview {
		height: 608rpx;
		padding: 30rpx 30rpx 58rpx 30rpx;

		.show_ul {
			background: #fff;
			padding: 20rpx 0;
			border-radius: 20rpx;

			.show_li {
				padding: 20rpx 30rpx;
			}
		}
	}
</style>
