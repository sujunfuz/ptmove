<script>
	import commonApi from '@/api/common.js'
	export default {
		onLaunch: function() {
			// this.dictAll()
			let systemInfo = uni.getSystemInfoSync();
			let langStr = systemInfo.hostLanguage == 'zh-TW' ? 'cht' : systemInfo.hostLanguage == 'zh-CN' ? 'zh' : 'en'
			langStr = 'cht'
			if (!uni.getStorageSync('globalType')) {
				uni.setStorageSync('globalType', 'PRODUCT')
			}
			if (!uni.getStorageSync('langStr')) {
				uni.setStorageSync('langStr', langStr);
			} 
			this.$i18n.locale = uni.getStorageSync('langStr');
			if (!uni.getStorageSync('globalUnit')) {
				uni.setStorageSync('globalUnit', '¥');
				uni.setStorageSync('currency', 'CNY');
				// uni.setStorageSync('globalUnit', '$');
				// uni.setStorageSync('currency', 'USD');
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			dictAll() {
				commonApi.dictAll().then(res => {
					if (res.code == 200) {
						let globalType = res.data.UserCollectTypeEnum[0].value
						console.log(globalType)
						uni.setStorageSync('globalType', globalType);
					}
				})
			},

		}
	}
</script>

<style lang="scss">
	@import "@/uni_modules/uview-ui/index.scss";
	@import "common/common.scss";

	page {
		background-color: #F6F6F6;
		font-size: 28rpx;
		word-wrap: break-word;
		color: #1A1A1A;
		font-family: PingFang SC;
		word-break: break-all; /* 允许在单词内换行 */
	}

	// tabber栏设置阴影
	/deep/ .uni-tabbar {
		box-shadow: 0rpx -6rpx 16rpx 1rpx rgba(0, 0, 0, 0.06);
	}
</style>
