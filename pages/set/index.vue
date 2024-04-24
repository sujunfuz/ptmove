<template>
	<view class="setindexbg pad20">
		<u-navbar leftIconColor='#fff' :title="$t('setindex.title')" :titleStyle='{"color":"#fff"}' :placeholder='true'
			bgColor="#E1251B" fixed="" @leftClick="leftClick"></u-navbar>
		<!-- <view>{{$t('setindex.title')}}</view> -->

		<view class="bgfff bdRadius20 pad30 white-wrapper">
			<view class="info-wrapper">
				<view class="flex-cb desc-item" v-for="(item,index) in list" :key="index" @tap.stop="clickItem(index,item)">
					<view class="label flex-cc">
						<image :src="`${ossIconUrl}/set/icon${index+1}.png`" mode="aspectFill" class="icon-size">
						</image>
						<text class="marL10">{{item.label}}</text>
					</view>
					<view class="flex-cc">
						<text class="marR10 color9c9e9c" v-if="index==3">v1.0.1</text>
						<u-icon name="arrow-right" color="#999" size="15"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<view class="bgfff bdRadius marT20 logout textC" @tap.stop="handleLogout">
			{{$t("setindex.logout")}}
		</view>
		<u-modal :show="show" :content="$t('setindex.askOutAccount')" confirmColor="#E1251B" cancelColor="#9c9e9c"
			showCancelButton class="textC" @cancel="show=false" @confirm="logOut"></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
						label: this.$t('setindex.label1'),
						url: '/pages/set/baseInfo'
					},
					{
						label: this.$t('setindex.label2'),
						url: '/pages/set/modifyPass?type=pay'
					},
					{
						label: this.$t('setindex.label3'),
						url: '/pages/set/modifyPass?type=login'
					},
					{
						label: this.$t('setindex.label4'),
						url: '/pages/set/about'
					},
				],
				show: false
			}
		},
		onLoad() {

		},
		methods: {
			clickItem(index,item) {
				if(index!=3){
					this.checkLogin(item.url)
				}else{
					this.goToPage(item.url)
				}
			},
			handleLogout() {
				this.show = true
			},
			logOut() {
				uni.removeStorageSync('userInfo');
				uni.removeStorageSync('token');
				uni.reLaunch({
					url: '/pages/login/login',
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.setindexbg {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));
		box-sizing: border-box;

		.desc-item:not(:first-of-type) {
			border-top: 1px solid #E3E4E5;
		}

		.desc-item:first-of-type {
			padding-top: 10rpx;
		}

		.desc-item:last-of-type {
			padding-bottom: 10rpx;
		}

		.desc-item {
			padding: 35rpx 0;
		}

		.icon-size {
			width: 32rpx;
			height: 32rpx;
		}

		.logout {
			height: 100rpx;
			line-height: 100rpx;
			color: #E1251B;
		}
	}
</style>