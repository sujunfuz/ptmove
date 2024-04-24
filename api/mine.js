import request from '../common/request.js'

export default {
	//我的页面统计数据
	dataCenter: (data) => {
		return request.get('/center/index', data);
	},
	//我的收藏列表 collectType  店铺SUPPLIER， 商品PRODUCT
	myCollectList: (data) => {
		return request.get('/userCollect/pageList', data);
	},
	//获取订单列表
	getMyOrder: (data) => {
		return request.get('/order/pageList', data);
	},
	//订单详情
	getOrderDetail: (id) => {
		return request.get('/order/ordDetail/' + id);
	},
	// 继续支付
	payAgain: (id) => {
		return request.get(`/order/payAgain/${id}`)
	},
	// 取消订单
	cancelOrder: (id) => {
		return request.get(`/order/cancel/${id}`)
	},
	// 确认收货
	confirmGoods: (id) => {
		return request.get(`/order/confirmGoods/${id}`)
	},
	// 再次购买
	reBuy: (data) => {
		return request.get(`/order/reBuy`, data)
	},
	//获取评价商品的信息
	getEvaluateOrder: (data) => {
		return request.get('/order/getEvaluateOrder', data);
	},
	//评价
	evaluate: (data) => {
		return request.post('/order/evaluate', data);
	},
	//直销订单
	bindDirectOrd: (id) => {
		return request.get('/order/bindDirectOrd/' + id);
	},
	//批量下单
	batchOrd: (data) => {
		return request.post('/order/batchOrd', data, true, false);
	},



	//收货地址获取地区信息
	getListRegion: (data) => {
		return request.get('/userShippingAddress/listRegion', data)
	},
	addShippingAddress: (data) => {
		return request.post('/userShippingAddress/add', data)
	},
	getShippingAddress: (data) => {
		return request.get('/userShippingAddress/pageList', data)
	},
	getShippingAddressById: (data) => {
		return request.get('/userShippingAddress/detail', data)
	},
	editShippingAddress: (data) => {
		return request.put('/userShippingAddress/edit', data)
	},
	deleteShippingAddress: (data) => {
		return request.post('/userShippingAddress/delete', data)
	},

	// 商品搜索
	goodsSearch: (data) => {
		return request.get(`/home/goodsSearch`, data, true);
	},
	// 商家信息
	merchantInfo: (data) => {
		return request.get(`/home/merchantInfo`, data);
	},
	// 商家详情信息
	merchantDetailInfo: (data) => {
		return request.get(`/home/merchantDetailInfo`, data);
	},
	// 消息通知
	messagePageList: (data) => {
		return request.get(`/home/messagePageList`, data)
	},
	// 我的收藏
	getUserCollect: (data) => {
		return request.get(`/userCollect/pageList`, data)
	},
	// 删除收藏
	delUserCollect: (data) => {
		return request.delete(`/userCollect/delete`, data)
	},
	// 浏览记录
	getViewRecord: (data) => {
		return request.get(`/userViewRecord/pageListForMobile`, data)
	},
	// 删除浏览记录
	delViewRecord: (data) => {
		return request.delete(`/userViewRecord/delete`, data)
	},
	// 我的页面 客服热线
	//center/getCusTel
	mineGetCusTel: (data) => {
		return request.get(`/center/getCusTel`, data)
	},
	
}
