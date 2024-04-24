import request from '../common/request.js'

export default {
	//售后

	//获取订单商品
	getOrderGoods: (data) => {
		return request.get('/order/getOrderGoods', data);
	},

	//申请退款
	applyRefund: (data) => {
		return request.post('/afterSales/apply', data);
	},

	//售后详情
	afterSalesDetail: (data) => {
		return request.get('/afterSales/detail', data, true);
	},

	//撤销售后
	revoke: (data) => {
		return request.post('/afterSales/revoke', data);
	},

	//申请平台介入
	applyPlatform: (data) => {
		return request.post('/afterSales/applyPlatform', data);
	},

	//填写退货物流
	submitLogistics: (data) => {
		return request.post('/afterSales/submitLogistics', data);
	},

	//提交退货凭证
	addDescription: (data) => {
		return request.post('/afterSales/addDescription', data);
	},

	//补充描述
	addDescription: (data) => {
		return request.post('/afterSales/addDescription', data);
	},
	
	//修改售后
	update: (data) => {
		return request.post('/afterSales/update', data);
	},
}
