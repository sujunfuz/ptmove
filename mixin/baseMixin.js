/**
 * 项目全局混入
 */
import commonApi from '@/api/common.js'

export default {
	data() {
		return {
			maskShow: false,
			navBarTop: 0, //导航栏到顶部的距离
			navBarHeight: 0, //导航栏高度
			ossIconUrl: this.$request.ossIconUrl, //oss图片前缀
			myAppId: this.$request.myAppId, //小程序appId
			myAppName: this.$request.myAppName, //小程序名称
			baseUrl: this.$request.baseUrl, //api接口
			uploadUrl: this.$request.uploadUrl, //上传文件地址
			ImgUrl: this.$request.ImgUrl, //图片前缀地址
			globalUnit: uni.getStorageSync('globalUnit'), //货币单位
			userInfo: uni.getStorageSync('userInfo') || '', //登录用户信息
		}
	},
	onLoad() {
		// #ifndef H5
		let menuButtonInfo = uni.getMenuButtonBoundingClientRect();
		this.navBarTop = menuButtonInfo.top;
		this.navBarHeight = menuButtonInfo.height;
		// #endif
	},
	onShow() {
		this.userInfo = uni.getStorageSync('userInfo');
		this.globalUnit = uni.getStorageSync('globalUnit')
	},
	methods: {
		setTabBarTitle() {
			uni.setTabBarItem({
				index: 0,
				text: this.$t('index.title')
			});
			uni.setTabBarItem({
				index: 1,
				text: this.$t('class.title')
			});
			uni.setTabBarItem({
				index: 2,
				text: this.$t('shopcart.title')
			});
			uni.setTabBarItem({
				index: 3,
				text: this.$t('mine.title')
			});
		},
		// 保留 pos位小数  
		fomatFloat(src, pos) {
			return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
		},
		//小程序富文本图片变窄
		richTextImg(value, tag = true) {
			if (value && value.indexOf('<img') !== -1) {
				if (tag) {
					return value.replace(/\<img/gi, "<img class='richTextImg'")
				} else {
					return value.replace(/\<img/gi, "<img class='richTextImg'")
				}
			}
			return value
		},
		//点击导航栏返回上一级
		leftClick() {
			uni.navigateBack({
				delta: 1
			});
		},
		//截取逗号的第一张
		substringIndexOf(str) {
			if (str == null) return ''
			let index = str.indexOf(",");
			let result = index == -1 ? str : str.substring(0, index);
			return result
		},
		//登录后跳转
		checkLogin(url){
			if(!uni.getStorageSync('token')){
				this.showMsg(this.$t('cpnoLogin.text2'))
				return
			}
			this.goToPage(url)
		},
		//去登录
		isgoLogin() {
			if (!uni.getStorageSync('token')) {
				let pages = getCurrentPages();
				let formPath = pages[pages.length - 1].$page.fullPath
				setTimeout(() => {
					// uni.clearStorage()
					// uni.clearStorageSync()
					uni.setStorageSync('formPath', formPath)
					uni.reLaunch({
						url: '/pages/login/login',
					})
				}, 500)
			}
		},
		//验证不能为空
		ruleForm1(value, msg) {
			if (!value) {
				this.showMsg(msg + this.$t('common.cannot'))
				return false
			} else {
				return true
			}
		},
		//验证2
		ruleForm2(value, msg) {
			if (!value) {
				this.showMsg(msg)
				return false
			} else {
				return true
			}
		},
		//滚动到顶部
		goTop() {
			uni.pageScrollTo({
				scrollTop: 0, //距离页面顶部的距离
				duration: 300
			});
		},
		//判断是否要调用静默登录
		async isGetBasic() {
			let iscall = true;
			if (!uni.getStorageSync('userNo') || !uni.getStorageSync('openId') || !uni.getStorageSync('code') || !
				uni
				.getStorageSync('ImgUrl')) {
				iscall = true
			} else {
				iscall = false
			}
			if (iscall) {
				await this.$onLaunched;
				this.ImgUrl = uni.getStorageSync('ImgUrl');
			}
			return iscall
		},
		//判断是否是顶级页面
		getPages() {
			let pages = getCurrentPages(); // 获取当前页面栈的实例
			return pages.length == 1 ? true : false
		},
		//数组去重
		unique(arr) {
			var obj = {};
			return arr.filter(function(item, index, arr) {
				return obj.hasOwnProperty(typeof item + item) ? false : (obj[typeof item + item] = true)
			})
		},
		//获取全部地址
		realAddress(str) {
			if (!str) return
			let info = JSON.parse(str)
			return info.province + info.city + info.area + info.address
		},
		//物流信息将电话号码单独切割成数组
		selectPhoneNumber(str) {
			//识别字符串中包含的电话并切割
			var regx = /(1[3|4|5|7|8][\d]{9}|0[\d]{2,3}-[\d]{7,8}|400[-]?[\d]{3}[-]?[\d]{4})/g;
			var c = str.split(regx);
			let list = [];
			for (var i in c) {
				var flag = c[i] != '' && regx.test(c[i])
				c[i] != '' && list.push({
					type: flag ? 'phone' : 'text',
					val: c[i]
				})
			}
			return list
		},
		//涨红包下载至本地
		setImagecache() {
			let that = this;
			let imgData = [];
			let typeData = ['/wxshop/one.gif', '/wxshop/two.jpeg', '/wxshop/three.gif'];
			for (let i = 0; i < 3; i++) {
				wx.downloadFile({
					url: that.ossIconUrl + typeData[i],
					success: function(res) {
						const fs = wx.getFileSystemManager();
						fs.saveFile({
							tempFilePath: res.tempFilePath,
							success(res1) {
								imgData[i] = res1.savedFilePath;
								// console.log(imgData)
								wx.setStorageSync('image_cache', imgData);
							}
						})
					},
					fail: function(err) {
						// console.log('涨红包下载失败', err)
					}
				})
			}
		},
		//复制订单号
		copyText(text) {
			uni.setClipboardData({
				data: text, //复制的内容
				success: () => {
					this.showMsg(this.$t('common.copysuccess'), 'success')
				},
				fail() {
					this.showMsg(this.$t('common.copyerror'), 'error')
				}
			});
		},
		//拨打电话
		callPhone(text) {
			if (!text) {
				return
			}
			uni.makePhoneCall({
				phoneNumber: text,
				success: function() {
					console.log('拨打电话成功');
				},
				fail() {
					console.log('打电话失败了');
				}
			})
		},

		//时间返回年月日
		TimeofYear(time) {
			if (time) {
				return time.substring(0, 10)
			} else {
				return time
			}
		},
		//时间返回月日
		TimeofDate(time) {
			if (time) {
				return time.substring(5, 10)
			} else {
				return time
			}
		},
		//时间返回时分
		TimeofHour(time) {
			if (time) {
				return time.substring(11, 16)
			} else {
				return time
			}
		},
		//隐藏手机号
		hidePhone(tel) {
			const mobile = tel.toString();
			const a = mobile.substring(0, 3);
			const b = mobile.substring(7, 11);
			return a + '****' + b;
		},
		parseTime(number, timer1 = 6) {
			if (!number) number = new Date();
			// var n = number * 1000
			let date = new Date(number);
			let Y = date.getFullYear();
			let M =
				(date.getMonth() + 1 < 10 ?
					"0" + (date.getMonth() + 1) :
					date.getMonth() + 1);
			let D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
			let h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
			let mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
			let s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
			if (timer1 == 7) {
				return D + '天' + h + '时' + mm + '分';
			}
			if (timer1 == 8) {
				return M + '-' + D
			}
			if (timer1 == 9) {
				return h + ':' + mm
			}
			if (timer1 == 1) {
				return Y
			}
			if (timer1 == 2) {
				return Y + "-" + M
			}
			if (timer1 == 3) {
				return Y + "-" + M + "-" + D
			}
			if (timer1 == 4) {
				return Y + "-" + M + "-" + D + " " + h
			}
			if (timer1 == 5) {
				return Y + "-" + M + "-" + D + " " + h + ":" + mm
			}
			if (timer1 == 6) {
				return Y + "-" + M + "-" + D + " " + h + ":" + mm + ":" + s;
			}
		},
		//传入数字返回多少个字符
		getnumList(num) {
			let n = Number(num);
			let arr = [];
			for (let i = 1; i <= n; i++) {
				arr.push({
					value: i,
					label: i
				})
			}
			return arr
		},
		// 消息时间，时间表示方式：
		// 1 当天：10:01
		// 2 昨天：昨天 10:01
		// 3 当年：01-03 10:01
		// 4 当年之前：2022-12-31 13:22
		timeShift(time) {
			let date = new Date(time.replace(/-/g, '/'));
			let sign2 = ":";
			let year = date.getFullYear() // 年
			let month = date.getMonth() + 1; // 月
			let day = date.getDate(); // 日
			let hour = date.getHours(); // 时
			let minutes = date.getMinutes(); // 分
			let seconds = date.getSeconds() //秒
			let weekArr = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'];
			let week = weekArr[date.getDay()];
			// 给一位数的数据前面加 “0”
			if (month >= 1 && month <= 9) {
				month = "0" + month;
			}
			if (day >= 0 && day <= 9) {
				day = "0" + day;
			}
			if (hour >= 0 && hour <= 9) {
				hour = "0" + hour;
			}
			if (minutes >= 0 && minutes <= 9) {
				minutes = "0" + minutes;
			}
			if (seconds >= 0 && seconds <= 9) {
				seconds = "0" + seconds;
			}
			// return year + "-" + month + "-" + day + " " + hour + sign2 + minutes + sign2 + seconds;
			if (this.isToday(time)) {
				return hour + sign2 + minutes
			} else if (this.isYesterday(time)) {
				return '昨天 ' + hour + sign2 + minutes
			} else if (this.isThisYear(time) && !this.isYesterday(time)) {
				return month + "-" + day + " " + hour + sign2 + minutes
			} else {
				return year + "-" + month + "-" + day + " " + hour + sign2 + minutes
			}
		},
		//今天
		isToday(date) {
			let d = new Date(date.toString().replace(/-/g, "/"));
			let todaysDate = new Date();
			if (d.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)) {
				return true;
			} else {
				return false;
			}
		},
		//是否是昨天
		isYesterday(time) {
			let date = new Date(time.toString().replace(/-/g, "/"));
			let d = new Date(date).setHours(0, 0, 0, 0);
			let today = new Date().setHours(0, 0, 0, 0);
			let obj = {
				'-86400000': '昨天',
			};
			return obj[d - today] == '昨天' ? true : false;
		},
		//判断是否是今年
		isThisYear(time) {
			let date = new Date(time.toString().replace(/-/g, "/"));
			let year = new Date().getFullYear();
			let timeYear = new Date(date).getFullYear();
			return year == timeYear ? true : false;
		},
		//判断是 今天明天还是昨天
		isdate(str) {
			let d = new Date(str).setHours(0, 0, 0, 0);
			let today = new Date().setHours(0, 0, 0, 0);
			let obj = {
				'-86400000': '昨天',
				0: '今天',
				86400000: '明天',
			};
			return obj[d - today] || '啥也不是';
		},
		//获取之前或者之后的日期 n为负数表示之前
		getdate_n(date, n) {
			let dd = (new Date(date))
			dd.setDate(dd.getDate() + (n)); //获取p_count天后的日期
			let y = dd.getFullYear();
			let m = dd.getMonth() + 1; //获取当前月份的日期
			if (m < 10) {
				m = '0' + m;
			}
			let d = dd.getDate();
			if (d < 10) {
				d = '0' + d;
			}
			return y + "-" + m + "-" + d;
		},
		// 根据文件名判断文件类型
		getFileType(name) {
			// if (!name) return false;
			let imgType = ["gif", "jpeg", "jpg", "bmp", "png", "jfif"];
			let videoType = ["avi", "wmv", "mkv", "mp4", "mov", "rm", "3gp", "flv", "mpg", "rmvb"];
			let pdfType = ["pdf"];
			let wordType = ['docx', 'doc'];
			let pptType = ['pptx', 'ppt'];
			let excelType = ['xls', 'xlsx'];
			let txtType = ['txt']
			if (RegExp("\.(" + imgType.join("|") + ")$", "i").test(name.toLowerCase())) {
				return "image";
			} else if (RegExp("\.(" + videoType.join("|") + ")$", "i").test(name.toLowerCase())) {
				return "video";
			} else if (RegExp("\.(" + pdfType.join("|") + ")$", "i").test(name.toLowerCase())) {
				return "pdf";
			} else if (RegExp("\.(" + wordType.join("|") + ")$", "i").test(name.toLowerCase())) {
				return "word";
			} else if (RegExp("\.(" + pptType.join("|") + ")$", "i").test(name.toLowerCase())) {
				return "ppt";
			} else if (RegExp("\.(" + excelType.join("|") + ")$", "i").test(name.toLowerCase())) {
				return "excel";
			} else if (RegExp("\.(" + txtType.join("|") + ")$", "i").test(name.toLowerCase())) {
				return "txt";
			} else {
				return "error"; //错误文件
			}
		},
		//跳转
		goToPage(url) {
			uni.navigateTo({
				url,
			})
		},
		//删除当前跳转
		goDelPage(url) {
			uni.redirectTo({
				url,
			})
		},
		//底部跳转
		goToSw(url) {
			uni.switchTab({
				url,
			})
		},
		//返回某页面
		goBack(page) {
			uni.navigateBack({
				delta: page
			});
		},
		//关闭所有页面，打开到应用内的某个页面
		goOpen(url) {
			uni.reLaunch({
				url,
			});
		},
		//提示语
		showMsg(title, icon) {
			uni.showToast({
				title: title,
				duration: 1500,
				icon: icon || 'none'
			})
		},
		//隐藏手机号
		phone(phone) {
			if (phone != undefined) {
				let showPhone = phone.substr(0, 3) + '****' + phone.substr(7)
				return showPhone
			}
		},
		//支付 pay_type支付方式，orderInfo订单信息,goBackUrl支付成功后回调地址
		payFN(pay_type, orderInfo, goBackUrl) {
			let that = this;
			let provider = 'alipay';
			if (pay_type == 1) {
				provider = 'alipay';
			} else if (pay_type == 2) {
				provider = 'wxpay';
			}
			uni.requestPayment({
				provider,
				orderInfo,
				success(res) {
					console.log('success:' + JSON.stringify(res));
					that.showMsg('购买成功')
					setTimeout(function() {
						uni.navigateTo({
							url: goBackUrl
						});
					}, 500)
				},
				fail(err) {
					console.log('fail:' + JSON.stringify(err));
					that.showMsg('支付失败,请重试')
				}
			});
		},
		isWebview() {
			return this.isAndroid() || this.isIos()
		},
		isApp() {
			return uni.getStorageSync('headData').systemName || false
		},
		// 判断是否是安卓webview
		isAndroid() {
			// window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
			let ua = window.navigator.userAgent.toLowerCase()
			// 通过正则表达式匹配ua中是否含有MicroMessenger字符串
			return ua.match(/android_app/i) == 'android_app' || ua.match(/android/i) == 'android'
		},
		// 判断是否是ios webview
		isIos() {
			// window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
			let ua = window.navigator.userAgent.toLowerCase()
			// 通过正则表达式匹配ua中是否含有MicroMessenger字符串
			return ua.match(/ios_app/i) == 'ios_app'
		},
		// 判读是否是IOS打开
		isIosSys() {
			let agent = window.navigator.userAgent
			let isiOS = !!agent.match(/iPhone|mac|iPod|iPad|ios/i)
			return isiOS
		},
		//判断多维demo
		createArr() {
			// 一维 this.diaArr=[4]
			for (let i = 0; i < this.diaArr[0]; i++) {
				this.realArr[i] = this.skuList[i]
			}
			//二维 this.diaArr=[2,2]
			// for (let i = 0; i < this.diaArr[0]; i++) {
			// 	this.realArr[i]=[]
			// 	for (let j = 0; j < this.diaArr[1]; j++) {
			// 		this.realArr[i][j] = this.skuList[i*this.diaArr[1]+j]
			// 	}
			// }
			// 三维 this.diaArr=[4,3,2]
			for (let i = 0; i < this.diaArr[0]; i++) {
				this.realArr[i] = []
				for (let j = 0; j < this.diaArr[1]; j++) {
					this.realArr[i][j] = []
					for (let z = 0; z < this.diaArr[2]; z++) {
						this.realArr[i][j][z] = this.skuList[i * this.diaArr[1] * this.diaArr[2] + j * this.diaArr[2] +
							z]
					}
				}
			}
			console.log('realArr', this.realArr)
		},
	},
}
