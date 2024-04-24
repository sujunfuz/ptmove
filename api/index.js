import request from "../common/request.js";

export default {
	//商品推荐
	goodsShowRecommend: (data) => {
		return request.get(`/home/goodsShowRecommend`, data);
	},
	//工厂推荐
	factoryShowRecommend: (data) => {
		return request.get(`/home/factoryShowRecommend`, data);
	},

	//首页轮播
	goodsBanner: (data) => {
		return request.get(`/home/goodsBanner`, data);
	},
	//首页消息滚播
	messageBroadcast: (data) => {
		return request.get(`/home/messageBroadcast`, data);
	},
	//首页获取类目
	getTree: (data) => {
		return request.get(`/home/getTree`, data);
	},
	
	//根据类目id获取全部children
	getAllCategoryChildren: (data) => {
		return request.get(`/category/getAllCategoryChildren`, data);
	},
	
	//类目获取工厂列表
	getFactoryByCategory: (data) => {
		return request.get(`/category/getFactoryByCategory`, data);
	},
	
	//商品详情
	goodsDetail: (data) => {
		return request.get(`/home/goodsDetail`, data, true);
	},
	//商品sku库存接口
	goodsSkuInventory: (data) => {
		return request.get(`/home/goodsSkuInventory`, data);
	},
	//加入购物车
	addCart: (data) => {
		return request.post(`/cart/add`, data);
	},
	//已选清单
	skuInventoryList: (data) => {
		return request.post(`/cart/skuInventory`, data);
	},
	//计算运费
	orderfreight: (data) => {
		return request.post(`/order/freight`, data);
	},
	//计算运费2
	orderfreight2: (id,data) => {
		return request.post(`/order/freight2/`+id, data);
	},
	//识别地址
	addressRecognize: (data) => {
		return request.post(`/order/addressRecognize`, data, true);
	},
	//订单结算 一件发一处-多处
	detailCreateOrd: (data) => {
		return request.post(`/order/detailCreateOrd`, data);
	},
	//购物车结算
	cartCreateOrd: (data) => {
		return request.post(`/order/cartCreateOrd`, data);
	},
	//直销订单结算
	updateDirectOrd: (data) => {
		return request.post(`/order/updateDirectOrd`, data);
	},
	//通用结算 购物车除外
	commonSettle: (type,data) => {
		return request.post(`/order/commonSettle/`+type, data);
	},
	//支付
	// orderPay: (data) => {
	// 	return request.post(`/order/pay`, data);
	// },
	//支付
	orderPay: (data) => {
		return request.post(`/order/pay2`, data);
	},

	// 工厂搜索
	factorySearch: (data) => {
		return request.get(`/home/factorySearch`, data);
	},
	// 评价列表
	getEvaluateList: (data) => {
		return request.get(`/evaluate/getEvaluateList`, data);
	},
	// 评价头部数据
	getEvaluateTab: (data) => {
		return request.get(`/evaluate/getEvaluatePageTop`, data)
	},
	
	
	// 新品上架 
	// 获取拥有商品的所有一级类目
	getLevOneCategoryByGoods: (data) => {
		return request.get(`/category/getLevOneCategoryByGoods`, data)
	},
	// 根据一级类目id获取所有商品
	getGoodsByCategoryLevOne: (data) => {
		return request.get(`/category/getGoodsByCategoryLevOne`, data)
	},
	
};
