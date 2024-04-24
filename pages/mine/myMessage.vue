<template>
	<view class="myMessagebg">
		<u-navbar leftIconColor='#fff' :title="$t('myMessage.title')" :titleStyle='{"color":"#fff"}' :placeholder='true'
			bgColor="#E1251B" fixed @leftClick="leftClick"></u-navbar>
		</u-navbar>
		<view class="fixed-top">
			<u-sticky>
				<view class="flex-cc bgfff">
					<u-tabs :list="tabList" @click="clickTabs" keyName='label' lineColor="#E1251B" lineWidth="30"
						itemStyle="padding-left: 80rpx; padding-right: 80rpx; height: 44px;"
						:activeStyle="{'color':'#E1251B'}"></u-tabs>
				</view>
			</u-sticky>
		</view>
		<view class="pad20" style="margin-top: 88rpx;">
			<view class="bdRadius20">
				<view class="msg-item">
					<view class="title-wrap bgfff pad20 marB20 bdRadius20" v-for="(item,index) in dataList" :key="index"
						@tap.stop="handleTapDetail(item)">
						<view class="flex-cb marB20">
							<text class="fontsize32 fontbold u-line-1">{{item.title}}</text>
							<view class="flex-cc" v-if="item.messageType!='MESSAGE_TYPE_ACTIVITY'">
								<text class="color80 marR10 view-more">{{$t("myMessage.viewDetail")}}</text>
								<u-icon name="arrow-right" color="#808080" size="15"></u-icon>
							</view>
						</view>
						<view class="bgF6 pad20 flex bdRadius20">
							<image :src="ImgUrl + item.images" mode="aspectFill" style="width: 150rpx;height: 150rpx;"
								class="bdRadius20 marR20"></image>
							<view class="right-wrap">
								<view class="u-line-1">
									{{item.subTitle}}
								</view>
								<!-- <view class="tag-box marT10 color9c9e9c u-line-1">
									<text class="tag-item fontsize24 bgfff" v-for="(item,index) in tagList.slice(0,3)"
										:key="index">
										48小時發貨
									</text>
								</view> -->
								<view class="marT10 color9c9e9c fontsize24">
									{{item.remark}}
								</view>
							</view>
						</view>
					</view>
				</view>
				<view style="padding: 20rpx 0;">
					<u-loadmore :status="status" :loadingText="$t('common.loading')"
						:nomoreText="$t('common.nomore1')" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import commonApi from "@/api/common.js"
	import mineApi from "@/api/mine.js"
	export default {
		data() {
			return {
				tabList: [],
				messageType: '',
				currentPage: 1,
				pageSize: 10,
				status: 'loading',
				dataList: [],
			}
		},
		onLoad() {

		},
		created() {
			// 全局字典
			this.dictAll()
		},
		mounted() {},
		onReachBottom() {
			if (this.status == 'nomore') {
				return;
			}
			this.currentPage++;
			this.getMessageList()
		},
		methods: {
			dictAll() {
				commonApi.dictAll().then(res => {
					if (res.code == 200) {
						this.tabList = res.data.MessageTypeEnum;
						this.messageType = this.tabList[0].value;
						this.currentPage = 1;
						this.dataList = [];
						this.status = 'loading';
						this.getMessageList();
					}
				})
			},
			clickTabs(item) {
				this.messageType = item.value;
				this.currentPage = 1;
				this.dataList = [];
				this.status = 'loading';
				this.getMessageList()
			},
			handleTapDetail(item) {
				switch (item.messageType) {
					case 'MESSAGE_TYPE_ACTIVITY':
						// this.goToPage('/pages/common/webview?url=' + encodeURIComponent(item.fileUrl))
						console.log('活动详情')
						break;
					case 'MESSAGE_TYPE_NOTICE':
						this.goToPage('/pages/mine/ptNotice?data=' + JSON.stringify(item))
						break;
					case 'MESSAGE_TYPE_REMIND':
						this.goToPage(item.fileName)
						break;
				}
			},
			getMessageList() {
				mineApi.messagePageList({
					currentPage: this.currentPage,
					messageType: this.messageType,
					pageSize: this.pageSize,
				}).then(res => {
					let resOrderList = res.data.list;
					this.dataList = this.dataList.concat(resOrderList);
					if (resOrderList.length < 10) {
						this.status = 'nomore';
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.myMessagebg {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));

		.right-wrap {
			.tag-item:not(:last-of-type) {
				margin-right: 10rpx;
			}

			.tag-item {
				display: inline-block;
				border: 1px solid #c5c5c5;
				padding: 5rpx;
				border-radius: 10rpx;
			}
		}

		.view-more {
			flex-shrink: 0;
		}
	}
</style>
