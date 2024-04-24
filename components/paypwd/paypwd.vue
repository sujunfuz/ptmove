<template>
	<view @touchmove.stop.prevent="()=>{return false}">
		<u-popup :show="show" mode="center" :safeAreaInsetTop='false' :safeAreaInsetBottom='false' :round='20' closeable
			@close="colse" :closeOnClickOverlay='false'>
			<view class="popupview">
				<view class="fontsize30 textC">{{$t('paypwd.title')}}</view>
				<view class="marT40 flex-cc"> 
					<view style="position: relative;top: 6rpx;">{{globalUnit}}</view>  <!-- {{globalUnit}} -->
					<view class="marL6 fontsize50 fontbold">{{amount}}</view>
				</view>
				<view class="flex-cc marT60">
					<u-code-input dot v-model="value" :maxlength="6" @finish='finish'></u-code-input>
				</view>
				<view class="flex-cb">
					<view></view>
					<view  class="marT30 colorblue" @click="goToPage('/pages/set/selFindType')">{{$t('forgetpsd.title')}}？</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		props: {
			show: {
				type: Boolean,
				default: () => false
			},
			amount: {
				type:  String,
				default: () => '0'
			},
		},
		data() {
			return {
				value:''
			}
		},
		methods: {
			colse() {
				this.$emit('close');
			},
			finish(e){
				this.value='';
				this.$emit('finish',e);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.popupview {
		height: 368rpx;
		padding: 30rpx 30rpx 58rpx 30rpx;
		border-radius:20rpx;
		width: 540rpx;
	}
</style>
