import config from '../config.js'
import commonApi from '@/api/common.js'

let myAppId = config.myAppId;
let myAppName = config.myAppName;
let baseUrl = config.baseUrl;
let ossIconUrl = config.ossIconUrl;
let ImgUrl = config.ImgUrl;

let uploadUrl = `${baseUrl}/save/file/saveIdImg` //公用文件上传地址

// if (process.env.NODE_ENV === 'development') {
// 	// 开发环境
// 	myAppId='wx693b94b1a328e76c'
// 	baseUrl = 'http://192.168.110.51:8611/user-api'   //本地
// 	ossIconUrl='http://travelimg.nsd2020.com/'//本地图片前缀地址
// } else {
// 	// 正式环境
// }


// 如果是get请求，且params是数组类型如arr=[1,2]，则转换成arr=1&arr=2
// uni.addInterceptor('request', {
// 	invoke(args) {
// 		// request 触发前拼接 url 
// 		const {
// 			data,
// 			method,
// 		} = args;
// 		if (method === "GET") {
// 			// 如果是get请求，且params是数组类型如arr=[1,2]，则转换成arr=1&arr=2
// 			const newData = qs.stringify(data, {
// 				arrayFormat: "repeat"
// 			})
// 			delete args.data;
// 			args.url = `${args.url}?${newData}`;
// 		}
// 	},
// 	success(args) {},
// 	fail(err) {},
// 	complete(res) {}
// })


export default {
	baseUrl,
	ossIconUrl,
	ImgUrl,
	myAppId,
	myAppName,
	uploadUrl,
	/**
	 * 获取通用请求头
	 * 包含用户登录权限 && 签名
	 */
	// getComHeader(param = {}) {
	// 	let comHeader = {}
	// 	if (uni.getStorageSync('token')) {
	// 		comHeader['Authorization'] = uni.getStorageSync('token') || '';
	// 	}
	// 	console.log('comHeader', comHeader)
	// 	return comHeader
	// },
	/**
	 * @param {*} url 请求地址
	 * @param {*} data 请求参数
	 * @param {*} header 请求头
	 * @param {*} method 请求非法
	 * @param {*} isLoading 是否显示加载状态
	 */
	request(url = '', data = {}, header = {}, method = '', isLoading = false, isuserNo = true) {
		if (uni.getStorageSync('token')) {
			header['boss-token'] = uni.getStorageSync('token') || ''
		}
		header['AppId'] = myAppId || ''
		header['currency'] = uni.getStorageSync('currency') || 'CNY'
		header['lang'] = uni.getStorageSync('langStr') || 'cht'
		if (uni.getStorageSync('userInfo') && isuserNo) {
			data['userNo'] = uni.getStorageSync('userInfo').userNo || ''
		}
		return new Promise((resolve, reject) => {
			if (isLoading) {
				uni.showLoading({
					title: 'loading...',
				})
			}
			uni.request({
				url: `${baseUrl}${url}`,
				data: data,
				method: method,
				header: header,
				success: res => {
					if (isLoading) {
						uni.hideLoading()
					}
					if (res.data.code == 200) {
						resolve(res.data)
					} else if (res.data.code == 401) {
						if (res.data.msg) {
							uni.showToast({
								title: res.data.msg,
								icon: 'none',
								duration: 2000,
							})
						}
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
						resolve(res.data)
					} else {
						uni.showToast({
							title: res.data.msg,
							icon: 'none',
							duration: 2000,
						})
						resolve(res.data)
					}
				},
				fail: err => {
					if (isLoading) {
						uni.hideLoading()
					}
					reject(err)
				},
			})
		})
	},
	post(url = '', data = {}, isLoading = false, isuserNo = true, header = {}) {
		if (header == true) {
			header = {}
		}
		//post默认请求头 和 接口保持一致
		header['content-type'] = 'application/json'
		return this.request(url, data, header, 'POST', isLoading, isuserNo)
	},
	get(url = '', data = {}, isLoading = false, isuserNo = true, header = {}) {
		//默认请求头
		return this.request(url, data, header, 'GET', isLoading, isuserNo)
	},
	put(url = '', data = {}, header = {}, isToken = false, isLoading = false) {
		//默认请求头
		header['Content-Type'] = 'application/json'
		return this.request(url, data, header, 'PUT', isLoading)
	},
	delete(url = '', data = {}, header = {}, isToken = false, isLoading = false) {
		//默认请求头
		header['content-type'] = 'application/x-www-form-urlencoded'
		return this.request(url, data, header, 'DELETE', isLoading)
	},
}
