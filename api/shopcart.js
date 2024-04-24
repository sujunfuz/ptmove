import request from '../common/request.js'

export default {
	//获取购物车列表
	cartList: (data) => {
		return request.get('/cart/pageList', data);
	},
	//删除购物车
	delcart: (data) => {
		return request.delete('/cart/delete', data);
	},
	//编辑购物车  已选清单
	editcart: (data) => {
		return request.put(`/cart/edit`, data);
	},
	//已选清单下单 和购物车结算
	cartBilling: (data) => {
		return request.post(`/cart/cartBilling`, data);
	},
	//移入收藏夹
	addCollect: (data) => {
		return request.post('/cart/addCollect',data)
	}
};
