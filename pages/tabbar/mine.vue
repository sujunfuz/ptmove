<template>
	<view class="minebg">
		<image class="img1bg" :src="ossIconUrl+'/mine/minebg1.png'" mode="scaleToFill"></image>
		<u-navbar leftIcon=' ' :title="navTopShow?$t('mine.title'):''" :titleStyle='{"color":"#fff"}' fixed
			:placeholder='true' :bgColor="navTopShow?'#E1251B':'rgba(0,0,0,0)'"></u-navbar>
		<view class="mineContent">
			<view class="infoView flex-cb">
				<view class="flex-c" @tap="isgoLogin()">
					<u-avatar :src="ImgUrl + userInfo.icon" size="43"></u-avatar>
					<view class="colorfff marL20 u-line-1">
						{{userInfo?userInfo.nickName||userInfo.realName:$t('mine.nologin')}}
					</view>
				</view>
				<view class="marL16 flexnone" @tap="checkLogin('/pages/mine/myMessage')">
					<image class="imgmsg" :src="ossIconUrl+'/mine/message.png'" mode="scaleToFill"></image>
					<view class="fontsize20 colorfff" style="position: relative;top: -10rpx;">{{$t('mine.msg')}}</view>
				</view>
			</view>

			<view class="orderView marT40">
				<view class="flex-cb head">
					<view class="flex-cc" style="width: 49%;">
						<view>{{$t('mine.deal')}}</view>
						<view class="colorMain marL10">
							{{rs.ordUserCenterCountVO?rs.ordUserCenterCountVO.paySuccessNum:0}}
						</view>
					</view>
					<view class="line"></view>
					<view class="flex-cc" style="width: 49%;">
						<view class="">{{$t('mine.spend')}}</view>
						<view class="colorMain marL10">
							{{globalUnit}}{{rs.ordUserCenterCountVO?rs.ordUserCenterCountVO.paidAmount:0}}
						</view>
					</view>
				</view>
				<view class="flex-cb marT20">
					<view class="color333 fontbold fontsize30">{{$t('mine.ordermanage')}}</view>
					<view class="flex-c" @tap="checkLogin('/pages/mine/myOrder')">
						<view class="color9c fontsize24">{{$t('mine.all')}}</view>
						<u-icon size="15" name="arrow-right" color="#9C9E9C"></u-icon>
					</view>
				</view>
				<view class="flex-cb marT20">
					<view class="order_li flex-cc wrap" v-for="(it,i) in tabs1" :key='i' @click="checkLogin(it.url)">
						<image class="imgicon1" :src="ossIconUrl+it.img" mode="scaleToFill"></image>
						<view class="textC">{{$t(it.label)}}</view>
						<view class="num colorfff bgMain" v-if="it.num>0">{{it.num}}</view>
					</view>
				</view>
			</view>

			<view class="orderView marT20 flex-cb" @tap="checkLogin('/pages/mine/followStore')">
				<view class="flex-c">
					<image class="imgicon2" :src="ossIconUrl+'/mine/dianpu.png'" mode="scaleToFill"></image>
					<view class="marL16">{{$t('mine.store')}} <text
							v-if="rs.collectUserCenterCountVO&&rs.collectUserCenterCountVO.supplierCount>0">({{rs.collectUserCenterCountVO.supplierCount}})</text>
					</view>
				</view>
				<u-icon size="18" name="arrow-right" color="#9C9E9C"></u-icon>
			</view>

			<view class="orderView marT20">
				<view class="flex-cb wrap">
					<view class="order_li marT20" style="width: 25%;" v-for="(it,i) in tabs2" :key='i'
						@click="goPage(it)">
						<image class="imgicon1" :src="ossIconUrl+it.img" mode="scaleToFill"></image>
						<view class="textC">{{$t(it.label)}}</view>
					</view>
				</view>
			</view>
			<!-- <image class="img2" :src="ossIconUrl+'/mine/jinrong.png'" mode="scaleToFill"></image> -->
		</view>

		<recommendShop :dataList='dataList'></recommendShop>
		<view style="padding: 20rpx 0;">
			<u-loadmore :status="status" :loadingText="$t('common.loading')" :nomoreText="$t('common.nomore1')" />
		</view>

		<hotline :show="hotlineShow" @close='hotlineShow=false' :hotline="hotlineTel"></hotline>

		<!-- 直销订单 -->
		<view @touchmove.stop.prevent="()=>{return false}">
			<u-popup :show="directSaleShow" :safeAreaInsetBottom='false' mode="center" round="10" :closeable='true'
				@close="directSaleShow=false;directNo=''">
				<view class="directSaleView" @touchmove.stop.prevent="()=>{return false}">
					<view class="textC">{{$t('mine.text12')}}</view>
					<view class='marT30'>
						<u-input v-model='directNo' :customStyle='inputStyle'
							:placeholder="$t('common.input')+$t('mine.inputnum')" clearable>
						</u-input>
					</view>
					<view class="minbts bgMain colorfff marT30" style="width: 100%;"
						@tap="$u.throttle(bindDirectOrd, 500)">{{$t('index.search')}}</view>
				</view>
			</u-popup>
		</view>
	</view>
</template>


<script>
	import commonApi from '@/api/common.js'
	import mineApi from '@/api/mine.js'
	import hotline from '@/components/hotline/hotline.vue'
	import recommendShop from '@/components/recommendShop/recommendShop.vue'
	export default {
		components: {
			recommendShop,
			hotline,
		},
		data() {
			return {
				// #ifdef MP-WEIXIN
				navTopShow: false,
				// #endif
				// #ifndef MP-WEIXIN
				navTopShow: true,
				// #endif
				tabs1: [{
					img: '/mine/icon1.png',
					label: 'mine.text1',
					url: '/pages/mine/myOrder?type=1',
					num: 0
				}, {
					img: '/mine/icon2.png',
					label: 'mine.text2',
					url: '/pages/mine/myOrder?type=2',
					num: 0
				}, {
					img: '/mine/icon3.png',
					label: 'mine.text3',
					url: '/pages/mine/myOrder?type=3',
					num: 0
				}, {
					img: '/mine/icon4.png',
					label: 'mine.text4',
					url: '/pages/mine/myOrder?type=4',
					num: 0
				}, {
					img: '/mine/icon5.png',
					label: 'mine.text5',
					url: '/pages/mine/myOrder?type=5',
					num: 0
				}],
				tabs2: [{
					img: '/mine/icon6.png',
					label: 'mine.text6',
					url: '',
					isLogin: true,
				}, {
					img: '/mine/icon7.png',
					label: 'mine.text7',
					url: '/pages/mine/myCollection',
					isLogin: true,
				}, {
					img: '/mine/icon8.png',
					label: 'mine.text8',
					url: '/pages/mine/historyList',
					isLogin: true,
				}, {
					img: '/mine/icon9.png',
					label: 'mine.text9',
					url: '/pages/mine/addressList',
					isLogin: true,
				}, {
					img: '/mine/icon10.png',
					label: 'mine.text10',
					url: 'hotline',
					isLogin: false,
				}, {
					img: '/mine/icon11.png',
					label: 'mine.text11',
					url: '/pages/mine/batchOrder',
					isLogin: false,
				}, {
					img: '/mine/icon12.png',
					label: 'mine.text12',
					url: 'directSales',
					isLogin: false,
				}, {
					img: '/mine/icon13.png',
					label: 'mine.text13',
					url: '/pages/set/index',
					isLogin: false,
				}],
				dataList: [],
				status: 'loading',
				hotlineShow: false,
				directSaleShow: false,
				directNo: '', //直销码
				inputStyle: {
					padding: '15rpx 20rpx',
					background: '#F6F6F6',
					width: '520rpx'
				},
				currentPage: 1, //分页1
				pageSize: 10, //每页10条
				dataList: [], //表格数据
				status: 'loading', //状态
				rs: '', //统计信息
				hotlineTel: ''
			}
		},
		// #ifdef MP-WEIXIN
		onPageScroll(e) {
			this.navTopShow = e.scrollTop > 88 ? true : false;
		},
		// #endif
		onLoad() {
			this.goodsShowRecommend()
			this.getTel()
		},
		onShow() {
			if (uni.getStorageSync('token')) {
				this.dataCenter();
			}
			this.$forceUpdate()
		},
		methods: {
			//统计数据
			dataCenter() {
				mineApi.dataCenter().then(res => {
					if (res.code == 200) {
						this.rs = res.data;
						this.tabs1[0].num = this.rs.ordUserCenterCountVO.waitingPayment;
						this.tabs1[1].num = this.rs.ordUserCenterCountVO.waitSendGoods;
						this.tabs1[2].num = this.rs.ordUserCenterCountVO.hasSendGoods;
						this.tabs1[3].num = this.rs.ordUserCenterCountVO.waitEvaluate;
						this.tabs1[4].num = this.rs.afCount;
					}
				})
			},
			getTel() {
				mineApi.mineGetCusTel({
					belongPlatform: "BANNER_BELONG_TYPE_ANDROID"
				}).then(res => {
					if (res.code == 200) {
						this.hotlineTel = res.msg
					}
				})
			},
			goPage(item) {
				if (item.isLogin && !uni.getStorageSync('token')) {
					this.showMsg(this.$t('cpnoLogin.text2'))
					return
				}
				if (!item.url) {
					this.showMsg(this.$t('common.msg1'))
					return
				}
				if (item.url == 'hotline') {
					if (!this.hotlineTel) {
						this.showMsg(this.$t('common.noTelNumber'))
						return
					}
					this.hotlineShow = true;
					return
				}
				if (item.url == 'directSales') {
					this.directSaleShow = true;
					return
				}
				this.goToPage(item.url)
			},
			//直销订单
			bindDirectOrd() {
				if (!this.ruleForm1(this.directNo, this.$t('mine.inputnum'))) return
				uni.removeStorageSync('isFirstDirect');
				this.goToPage('/pages/mine/directSale?directNo=' + this.directNo)
			},
			//商品推荐
			goodsShowRecommend() {
				commonApi.goodsShowRecommend({
					refId: 4,
					pageSize: this.pageSize,
					currentPage: this.currentPage,
				}).then(res => {
					if (res.code == 200) {
						let resOrderList = res.data.list;
						resOrderList.forEach(e => {
							e.imgList = e.descriptionImgAddr.split(',')
						})
						this.dataList = this.dataList.concat(resOrderList);
						this.total = res.data.total;
						if (resOrderList.length < this.pageSize) {
							this.status = 'nomore';
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
			this.goodsShowRecommend();
		},
	}
</script>

<style lang="scss" scoped>
	.minebg {
		min-height: calc(100vh - var(--window-bottom));
		position: relative;

		.img1bg {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			/* #ifdef MP-WEIXIN */
			height: 468rpx;
			/* #endif */
			/* #ifndef MP-WEIXIN */
			height: 438rpx;
			/* #endif */
		}

		.mineContent {
			padding: 0 24rpx;
			position: relative;

			.infoView {
				.imghead {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
				}

				.imgmsg {
					width: 40rpx;
					height: 40rpx;
					margin-top: 5rpx;
					margin: auto;
					display: block;
				}
			}

			.orderView {
				border-radius: 20rpx;
				background: #fff;
				padding: 20rpx;

				.head {
					border-bottom: 1rpx solid #C5C5C5;
					padding-bottom: 20rpx;

					.line {
						width: 1rpx;
						height: 20rpx;
						background: #C5C5C5;
					}
				}

				.order_li {
					position: relative;

					.imgicon1 {
						width: 80rpx;
						height: 80rpx;
						margin: auto;
						display: block;
					}

					.num {
						position: absolute;
						top: 0;
						right: 16rpx;
						border-radius: 50rpx;
						padding: 0 10rpx;
						font-size: 24rpx;
					}
				}

				.imgicon2 {
					width: 44rpx;
					height: 44rpx;
				}
			}

			.img2 {
				width: 100%;
				height: 155rpx;
				border-radius: 20rpx;
				margin-top: 20rpx;
			}
		}



		.directSaleView {
			padding: 30rpx;
		}
	}
</style>
