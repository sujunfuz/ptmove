<template>
	<view class="tabbarIndexbg">
		<view v-if="navTopShow" class="navbarZx">
			<u-navbar :title="$t('index.title')" bgColor="#E93A2C" :titleStyle='{"color":"#fff"}' leftIcon=' '>
			</u-navbar>
		</view>
		<image v-if="navTopShow" class="imgfiexd" :src="ossIconUrl+'/index/zhiding.png'" mode="scaleToFill"
			@tap="goTop"></image>
		<image class="img1bg" :src="ossIconUrl+'/index/bg1.png'" mode="scaleToFill"></image>
		<!-- #ifdef MP-WEIXIN -->
		<u-sticky offset-top="0">
			<view class="headerView flex-c" :style="{paddingTop:navBarTop + 'px',Height:navBarHeight+'px'}">
				<image class="imglogo" :src="ossIconUrl+'/index/logo.png'" mode="heightFix">
				</image>
				<image class="imglang" :src="ossIconUrl+'/index/langicon.png'" mode="scaleToFill"
					@click="setlangshow=true"></image>
			</view>
		</u-sticky>
		<!-- #endif -->
		<!-- #ifndef MP-WEIXIN -->
		<view style="padding-top: 20rpx;" class="marL24 flex-c">
			<image class="imglogo" :src="ossIconUrl+'/index/logo.png'" mode="heightFix"></image>
			<image class="imglang" :src="ossIconUrl+'/index/langicon.png'" mode="scaleToFill" @click="setlangshow=true">
			</image>
		</view>
		<!-- #endif -->

		<view class="tabbarIndexcontent">
			<view class="tabsview  flex-cc">
				<view class="tabs_li" v-for="(it,i) in tabs" :key='i' :class="globalType==it.value?'active':''"
					@click="onchangeType(it)">
					<view :class="globalType==it.value?'acxian':''"></view>
					{{$t(it.label)}}
				</view>
			</view>
			<view class="positionRelative  marT30" @tap="goToPage('/pages/index/search')">
				<u-search bgColor='#fff' :inputStyle='searchStyle' :placeholder="$t('index.search')"
					:showAction='false'>
				</u-search>
			</view>
			<view class="marT20">
				<u-swiper :list="swiperList" height="130" imgMode='scaleToFill' radius='10' @click='swiperChick'>
				</u-swiper>
			</view>
			<!-- 消息提示 -->
			<view class="flex-c noticeView" v-if="noticeList.length>0" @click="goToPage('/pages/mine/myMessage')">
				<image class="imglaba" :src="ossIconUrl+'/index/laba.png'" mode="scaleToFill"></image>
				<u-notice-bar :text="noticeList" icon=' ' direction='column' color='#343434' mode='link' bgColor='none'>
				</u-notice-bar>
			</view>
			<view class="classifyView  flex-c wrap marT20">
				<view class="class_li animationX10" v-for="(it,i) in classList" :key="i" @tap="classChick(it)">
					<view class="">
						<image v-if="globalType=='PRODUCT'" class="imgclass" :src="it.newgoodsIcon" mode="scaleToFill">
						</image>
						<image v-else class="imgclass" :src="it.newfactoryIcon" mode="scaleToFill"></image>
						<view class="u-line-1 marT6">{{it.categoryName}}</view>
					</view>
				</view>
			</view>
			<view v-if="globalType=='PRODUCT'" class="marT20 flex-cb  recommendView">
				<view class="fontsize30 fontbold recommend_li heightshop"
					:style="'background-image: url('+ossIconUrl+it.bg+')'" v-for="(it,i) in shoptabs" :key='i'
					@click="goPage(it)">
					<view class="flex-cb">
						<view class="u-line-1">{{$t(it.title)}}</view>
						<view class="recommend_tip fontsize24 u-line-1" :class="i==0?'colorOrange':'colorMain'">
							{{$t(it.tip)}}
						</view>
					</view>
					<view class="flex-cb" v-if="i==0">
						<view v-for="(it1,i1) in newshopList" :key='i1' class="factory_li"
							@click.stop="goToPage('/pages/index/shopDetails?id='+it1.id)">
							<image class="imgfactory" :src="ImgUrl+substringIndexOf(it1.descriptionImgAddr)"
								mode="scaleToFill"></image>
							<view class="price colorMain bgRed u-line-1" style="width: 90%;">
								<text class="fontsize26">{{globalUnit}}</text><text
									class="marL6">{{it1.minimumPrice}}</text>
							</view>
						</view>
					</view>
					<view class="flex-cb" v-if="i==1">
						<view v-for="(it2,i2) in lifeList" :key='i2' class="factory_li">
							<image class="imgfactory" style="position: relative;top: -15rpx;" :src="ossIconUrl+it2.img"
								mode="scaleToFill"></image>
							<view class="price colorMain bgRed u-line-1" style="width: 90%;">
								<text class="fontsize26">{{globalUnit}}</text><text class="marL6">{{it2.price}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view v-else class="marT20 flex-cb  recommendView">
				<view class="fontsize30 fontbold recommend_li heightfactory"
					:style="'background-image: url('+ossIconUrl+it.bg+')'" v-for="(it,i) in factorytabs" :key='i'
					@click="goPage(it)">
					<view class="flex-cb">
						<view class="u-line-1">{{$t(it.title)}}</view>
						<image class="imgyou" :src="ossIconUrl+'/index/right1.png'" mode="scaleToFill"></image>
					</view>
					<view class="flex-cb" v-if="i==0">
						<view v-for="(it1,i1) in dayList" :key='i1' class="factory_li"
							@click.stop="goToPage('/pages/mine/storeDetails?merchantNo='+it1.merchantNo)">
							<image class="imgfactory" :src="ImgUrl+substringIndexOf(it1.productImages)"
								mode="scaleToFill"></image>
							<view class="textC u-line-1">{{it1.storeName}}</view>
						</view>
					</view>
					<view class="flex-cb" v-if="i==1">
						<view v-for="(it2,i2) in facList" :key='i2' class="factory_li"
							@click.stop="goToPage('/pages/mine/storeDetails?merchantNo='+it2.merchantNo)">
							<image class="imgfactory" :src="ImgUrl+substringIndexOf(it2.productImages)"
								mode="scaleToFill"></image>
							<view class="textC u-line-1">{{it2.storeName}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view style="padding:0 12rpx;">
			<view class="marT20" v-if="globalType=='PRODUCT'">
				<goodCardsFlow :dataList="dataList"></goodCardsFlow>
			</view>

			<view class="marT20" v-else>
				<factoryCards :dataList="dataList"></factoryCards>
			</view>
			<view style="padding: 20rpx 0;">
				<u-loadmore :status="status" :loadingText="$t('common.loading')" :nomoreText="$t('common.nomore1')" />
			</view>
		</view>
		<setLang v-if="setlangshow" :show="setlangshow" @closesetlang='closesetlang' @cancel='setlangshow=false'>
		</setLang>
	</view>
</template>


<script>
	import goodCardsFlow from '@/components/goodCardsFlow/goodCardsFlow.vue'
	import factoryCards from '@/components/factoryCards/factoryCards.vue'
	import setLang from '@/components/setLang/setLang.vue'
	import indexApi from '@/api/index.js'
	import commonApi from '@/api/common.js'
	export default {
		components: {
			setLang,
			goodCardsFlow,
			factoryCards
		},
		data() {
			return {
				navTopShow: false,
				searchStyle: {
					padding: '5rpx 0',
				},
				setlangshow: false,
				tabs: [{
					label: 'index.tab1',
					value: 'PRODUCT'
				}, {
					label: 'index.tab2',
					value: 'SUPPLIER'
				}],
				globalType: uni.getStorageSync('globalType') || 'PRODUCT',
				swiperList: [],
				noticeList: [],
				classList: [],
				shoptabs: [{
					bg: '/index/bg2.png',
					title: 'newShop.title',
					tip: 'index.newShoptips',
					url: '/pages/index/newShop'
				}, {
					bg: '/index/bg3.png',
					title: 'lifeCard.title',
					tip: 'index.lifeCardtips',
					url: ''
				}],
				newshopList: [],
				lifeList: [{
					img: '/index/hui1.png',
					price: '88'
				}, {
					img: '/index/hui2.png',
					price: '39.9'
				}],
				dayList: [],
				facList: [],
				factorytabs: [{
					bg: '/index/bg4.png',
					title: 'dayFactory.title',
					url: '/pages/index/dayFactory'
				}, {
					bg: '/index/bg5.png',
					title: 'factoryList.title',
					url: '/pages/index/factoryList'
				}],
				currentPage: 1, //分页1
				pageSize: 10, //每页10条
				dataList: [], //表格数据
				status: 'loading', //状态
				total: 0,
			}
		},
		onPageScroll(e) {
			this.navTopShow = e.scrollTop > 88 ? true : false;
		},
		onLoad() {
			this.goodsBanner()
		},
		onShow() {
			this.setTabBarTitle(); //设置底部导航栏多语言
			this.currentPage = 1;
			this.dataList = [];
			this.status = 'loading';
			if (this.globalType == 'PRODUCT') {
				this.goodsShowRecommend(1)
				this.goodsShowRecommend(2) //商品底部推荐
			} else {
				this.factoryShowRecommend(5)
				this.factoryShowRecommend(6)
				this.factoryShowRecommend(7) //底部工厂推荐
			}
		},
		methods: {
			closesetlang(selLang, selCurrency) {
				uni.setStorageSync('currency', selCurrency.currencyCode);
				uni.setStorageSync('globalUnit', selCurrency.currencySymbol);
				uni.setStorageSync('langStr', selLang.value)
				this.$i18n.locale = selLang.value;
				this.setlangshow = false;
				// #ifndef H5
				uni.reLaunch({
					url: '/pages/tabbar/index'
				});
				// #endif

				//#ifdef H5
				setTimeout(e => {
					window.location.reload();
				}, 300)
				//#endif
			},
			// 切换tab
			onchangeType(it) {
				this.globalType = it.value;
				uni.setStorageSync('globalType', it.value)
				this.goodsBanner();
				this.currentPage = 1;
				this.dataList = [];
				this.status = 'loading';
				if (this.globalType == 'PRODUCT') {
					this.goodsShowRecommend(1)
					this.goodsShowRecommend(2) //商品底部推荐
				} else {
					this.factoryShowRecommend(5)
					this.factoryShowRecommend(6)
					this.factoryShowRecommend(7) //底部工厂推荐
				}
			},
			//轮播
			goodsBanner() {
				indexApi.goodsBanner({
					belongType: 'BANNER_BELONG_TYPE_ANDROID',
				}).then(res => {
					if (res.code == 200) {
						res.data.forEach(e => {
							e.url = this.ImgUrl + e.bannerImg
						})
						this.swiperList = res.data;
						this.getTree()
					}
				})
			},
			swiperChick(index) {
				let that = this;
				let obj = this.swiperList[index]
				console.log(obj)
				switch (obj.bannerType) {
					case 'BANNER_TYPE_GOODS':
						that.goToPage('/pages/index/shopDetails?id=' + obj.relevancyId)
						break;
					case 'BANNER_TYPE_STORE':
						this.goToPage('/pages/mine/storeDetails?merchantNo=' + obj.merchantNo)
						break;
					default:
						console.log('其他')
						break;
				}
			},
			//分类树形
			getTree() {
				indexApi.getTree().then(res => {
					if (res.code == 200) {
						this.messageBroadcast()
						let arr = res.data.slice(0, 9);
						// arr.shift();//删除第一个
						arr.forEach(e => {
							e.newfactoryIcon = this.ImgUrl + e.factoryIcon;
							e.newgoodsIcon = this.ImgUrl + e.goodsIcon
						})
						arr.push({
							categoryName: this.globalType == 'PRODUCT' ? this.$t('index.more1') : this.$t(
								'index.more2'),
							id: 'MORE',
							newfactoryIcon: this.ossIconUrl + '/index/moregc.png',
							newgoodsIcon: this.ossIconUrl + '/index/moreClass.png',
						})
						this.classList = arr;
					}
				})
			},
			//消息
			messageBroadcast() {
				indexApi.messageBroadcast().then(res => {
					if (res.code == 200 && res.data && res.data.length > 0) {
						res.data.forEach(e => {
							this.noticeList.push(e.title)
						})
					}
				})
			},
			classChick(item) {
				if (item.id == 'MORE') {
					uni.removeStorageSync('cateId1');
				} else {
					uni.setStorageSync('cateId1', item.id)
				}
				this.goToSw('/pages/tabbar/class')
			},
			goPage(item) {
				if (!item.url) {
					this.showMsg(this.$t('common.msg1'))
					return
				}
				this.goToPage(item.url)
			},

			//商品推荐   新品上架1   首页商品推荐2  商品详情推荐3    我的页面推荐4 
			goodsShowRecommend(refId) {
				commonApi.goodsShowRecommend({
					refId: refId,
					pageSize: this.pageSize,
					currentPage: this.currentPage,
				}).then(res => {
					if (res.code == 200) {
						if (refId == 1) {
							this.newshopList = res.data.list.slice(0, 2);
							return
						}
						let resOrderList = res.data.list;
						this.dataList = this.dataList.concat(resOrderList);
						this.total = res.data.total;
						if (resOrderList.length < this.pageSize) {
							this.status = 'nomore';
						}
					}
				})
			},
			//工厂推荐    每日好厂5     工厂榜单6    首页工厂推荐7 
			factoryShowRecommend(refId) {
				commonApi.factoryShowRecommend({
					refId: refId,
					pageSize: this.pageSize,
					currentPage: this.currentPage,
				}).then(res => {
					if (res.code == 200) {
						switch (refId) {
							case 5:
								this.dayList = res.data.list.slice(0, 2);
								break;
							case 6:
								this.facList = res.data.list.slice(0, 2);
								break;
							case 7:
								let resOrderList = res.data.list;
								resOrderList.forEach(e => {
									if (e.productImages) {
										e.imgList = e.productImages.split(',')
									} else {
										e.imgList = []
									}
									if (e.mainProducts) {
										e.mainProList = e.mainProducts.split(',')
									} else {
										e.mainProList = []
									}
								})
								this.dataList = this.dataList.concat(resOrderList);
								this.total = res.data.total;
								if (resOrderList.length < this.pageSize) {
									this.status = 'nomore';
								}
								break;
						}

					}
				})
			},
		},
		onReachBottom() {
			if (this.status == 'nomore') {
				return;
			}
			this.currentPage++;
			this.globalType == 'PRODUCT' ? this.goodsShowRecommend(2) : this.factoryShowRecommend(7)
		},
	}
</script>

<style lang="scss" scoped>
	.tabbarIndexbg {
		width: 100%;
		min-height: calc(100vh - var(--window-bottom));
		position: relative;

		.imgfiexd {
			width: 100rpx;
			height: 100rpx;
			position: fixed;
			right: 50rpx;
			z-index: 999;
			border-radius: 50%;
			background: #fff;
			box-shadow: 0rpx 0rpx 30rpx 0rpx rgba(0, 0, 0, 0.16);
			/* #ifdef MP-WEIXIN */
			bottom: 68rpx;
			/* #endif  */

			/* #ifndef MP-WEIXIN */
			bottom: 168rpx;
			/* #endif  */
		}

		.img1bg {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 490rpx;
		}

		.headerView {
			padding: 0 42rpx;
		}

		.imglogo {
			height: 38rpx;
		}

		.tabbarIndexcontent {
			padding: 0 24rpx;

			.tabsview {
				position: relative;
				height: 88rpx;

				.tabs_li {
					color: #fff;
					font-size: 32rpx;
				}

				.tabs_li:last-child {
					margin-left: 60rpx;
				}

				.active {
					font-size: 36rpx;
					font-weight: bold;
					position: relative;
				}

				.acxian {
					position: absolute;
					left: 50%;
					transform: translateX(-50%);
					bottom: -20rpx;
					width: 40rpx;
					height: 4rpx;
					background: #fff;
					border-radius: 12rpx;
				}
			}

			.noticeView {
				/deep/.u-icon__icon {
					color: #C4CBBF !important;
				}

				/deep/.u-notice-bar {
					padding: 20rpx 20rpx 0 10rpx;
				}

				margin-top: 10rpx;

				.imglaba {
					width: 32rpx;
					height: 30rpx;
					margin-right: 10rpx;
					padding: 20rpx 0 0 20rpx;
				}
			}

			.classifyView {
				background: #fff;
				border-radius: 20rpx;
				padding: 20rpx 0;

				.class_li {
					width: 20%;
					text-align: center;
					margin: 15rpx 0;

					.imgclass {
						width: 80rpx;
						height: 80rpx;
					}
				}
			}

			.recommendView {
				.recommend_li {
					width: 50%;
					background-size: 100% 100%;
					background-repeat: no-repeat;
					padding: 20rpx;

					.recommend_tip {
						background: #fff;
						border-radius: 50rpx;
						padding: 3rpx 15rpx;
						margin-left: 10rpx;
						text-align: center;
					}

					.imgyou {
						width: 30rpx;
						height: 30rpx;
						margin-right: 10rpx;
					}

					.factory_li {
						width: 50%;
						margin-top: 20rpx;
						position: relative;

						.imgshop {
							width: 100%;
							height: 100%;
						}

						.price {
							position: absolute;
							left: 50%;
							transform: translateX(-50%);
							bottom: -10rpx;
							padding: 2rpx 10rpx;
							border-radius: 50rpx;
							text-align: center;
						}

						.imgfactory {
							// width: 145rpx;
							width: 100%;
							height: 145rpx;
							border-radius: 20rpx;
						}
					}

					.factory_li:last-child {
						margin-left: 10rpx;
					}
				}

				.heightfactory {
					height: 248rpx;
				}

				.heightshop {
					height: 218rpx;
				}

				.recommend_li:last-child {
					margin-left: 20rpx;
				}
			}

		}

	}
</style>
