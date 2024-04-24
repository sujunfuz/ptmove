import api from '../common/request.js'

export default {
	// 修改密码
	changePwd: (data) => {
		return api.post('/center/change/pwd', data);
	},
	// 获取基本信息
	getBaseInfo: (data) => {
		return api.get("/center/base", data);
	},
	// 修改基本信息
	modifyBaseInfo: (data) => {
		return api.post("/center/change/base", data)
	},
	// 根据类型发送验证码
	sendVerifyCode: (data) => {
		return api.get("/user/sendVerifyCode", data, true)
	},
	// 检验验证码是否正确
	checkVerifyCode: (data) => {
		return api.get("/user/checkVerifyCode", data)
	},
	// 重设支付密码
	resetPayPwd: (data) => {
		return api.get("/user/resetPayPwd", data)
	}
};
