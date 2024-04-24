import request from '../common/request.js'

export default {
	//字典
	dictAll: (data) => {
		return request.get('/home/pageTop', data,true);
	},
	//获取支付通道
	getChannel: (id) => {
		return request.get('/home/getChannel/' + id);
	},
	//商品推荐
	goodsShowRecommend: (data) => {
		return request.get(`/home/goodsShowRecommend`, data);
	},
	//工厂推荐
	factoryShowRecommend: (data) => {
		return request.get(`/home/factoryShowRecommend`, data);
	},
	//收藏  店铺 SUPPLIER， 商品PRODUCT
	userCollect: (data) => {
		return request.post(`/userCollect/add`, data);
	},
	//获取已有币种
	getCurrency: (data) => {
		return request.get(`/home/getCurrency`, data);
	},
	//判断账户是否封存
	checkUserStatus: (data) => {
		return request.get(`/home/checkUserStatus`, data);
	},
	
	// 新品上架 
	goodsByCategory: (data) => {
		return request.get(`/category/getGoodsByCategory`, data)
	},
	// 商品类目 工厂类目
	goodsCategoryMenu: (data) => {
		return request.get(`/category/getGoodsCategoryIds`, data)
	},
	// 工厂榜单 列表
	factoryCategoryMenu: (data) => {
		return request.get(`/category/factoryShowRecommend`, data)
	},
	// 根据类目id获取单个children
	getSingleCategory: (data) => {
		return request.get(`/category/getSingleCategory`, data)
	},
	// 用户浏览记录
	getUserViewRecord: (data) => {
		return request.post(`/userViewRecord/pageListForMobile`, data)
	},
};
