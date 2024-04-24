import api from '../common/request.js'

export default {
	//工厂关联搜索
	factoryRelationSearch: (data) => {
		return api.get('/home/factoryRelationSearch',data);
	},
	// 工厂搜索
	factorySearch: (data) => {
		return api.get('/home/factorySearch', data);
	},
	// 商品关联搜索
	goodsRelationSearch: (data) => {
		return api.get('/home/goodsRelationSearch', data);
	},
	// 商品搜索
	goodsSearch: (data) => {
		return api.get('/home/goodsSearch', data);
	},
}