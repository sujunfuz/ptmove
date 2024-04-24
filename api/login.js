import api from '../common/request.js'

export default {
	//邮箱登录
	emailLogin: (data) => {
		return api.get('/user/go', data);
	},
	//手机号登录
	phoneLogin: (data) => {
		return api.get('/user/smsLogin', data);
	},
	//获取手机号验证码
	verificationCode: (data) => {
		return api.get('/user/verificationCode', data, true);
	},
	//获取邮箱验证码
	emailVerifyCode: (data) => {
		return api.get('/user/emailVerifyCode', data, true);
	},
	//注册
	register: (data) => {
		return api.post('/user/register', data);
	},
	// 忘记密码
	forgetPass: (data) => {
		return api.post('/user/forgetPwd', data);
	},
	// 获取协议
	getProtocol: (data) => {
		return api.get('/user/getProtocol', data,true);
	},
	// 获取协议
	wechatLogin: (data) => {
		return api.post('/user/wechatLogin', data);
	}
};
