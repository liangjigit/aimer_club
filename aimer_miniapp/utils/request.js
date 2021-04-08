import store from '../store/index.js'
import axios from "axios";
import axiosRetry from 'axios-retry';
// import {env} from '../common/index.js'
// console.log(env)
// if(!env){
//   console.error("获取运行环境失败!");
// }

// const baseApi = {
//   // 开发版
//   develop: "https://clubtest.aimer.com.cn", //"https://aimerclub.aimergroup.com",
//   // 体验版
//   trial: "https://clubtest.aimer.com.cn", //"https://aimerclub.aimergroup.com",
//   // 正式版
//   release: "https://aimerclub.aimergroup.com"
// };
let request = axios.create({
	baseURL: process.env.NODE_ENV === 'development' ? "https://clubtest.aimer.com.cn" :
		"https://aimerclub.aimergroup.com", //baseApi[env]||
	headers: {
		"Content-Type": "application/json"
	},
	timeout: 2000
});
axiosRetry(request, {
	retries: 1, // 设置自动发送请求次数
	retryDelay: (retryCount) => {
		return retryCount * 2000; // 重复请求延迟
	},
	shouldResetTimeout: true, //  重置超时时间
	retryCondition: async (error) => {
		//true为打开自动发送请求，false为关闭自动发送请求
		if (error.message.includes("status code 401")) {
			await store.dispatch("login/onGetUserInfo", {}, {
				root: true
			});
			return true
		} else if (error.message.includes("timeout")) {
			return true;
		} else {
			return false;
		};
	}
})
request.interceptors.request.use(
	config => {
		try {
			uni.showNavigationBarLoading()
			const token = uni.getStorageSync('token');
			if (config.needAuth === false) {
				config.headers.authorization = ""
			} else if (token) {
				// 判断是否存在token，如果存在的话，则每个http header都加上token
				config.headers.authorization = token; //Authorization是登录接口返回
			}
			config.headers.type = "user"; // type:user   是固定的
			return config;

		} catch (e) {
			uni.hideNavigationBarLoading()
			uni.showToast({
				title: '发生错误，请稍后重试',
				position: 'center',
				icon: 'none',
				duration: 2000
			})
		}
	},
	err => {
		uni.hideLoading()
		uni.hideNavigationBarLoading()
		return Promise.reject(err);
	}
);
// http response 拦截器
request.interceptors.response.use(
	response => {
		//拦截响应，做统一处理
		if (response.data.code != 200) {
			uni.hideLoading()
			// uni.showToast({
			// 	title: response.data.msg,
			// 	icon:"none",
			// 	duration: 2000
			// })
			if (process.env.NODE_ENV === 'development') {
				console.error(response.data.msg)
			}
		}
		uni.hideNavigationBarLoading()
		return response;
	},
	//接口错误状态处理，也就是说无响应时的处理
	error => {
		uni.hideLoading()
		uni.hideNavigationBarLoading()
		const {
			response: {
				status,
				errMsg: statusText,
				data: {
					message
				}
			}
		} = error;
		const token = uni.getStorageSync('token');
		if (status == 401 && token) { // 登录过期处理
			uni.getSetting({
				success: async function(t) {
					if (!t.authSetting["scope.userInfo"]) {
						uni.clearStorageSync()
						store.commit("login/CHANGELOGINSTATE", {
							loginState: false
						}, {
							root: true
						})
						if (!store.state.login.isShowLogin) {
							store.commit("login/GETLOGINPOPUP", {}, {
								root: true
							})
						}
						uni.showToast({
							title: '登录已过期，请重新登录',
							icon: 'none',
							duration: 2000
						})
					}
				}
			})
		} else {
			uni.showToast({
				title: `请求错误，请稍后重试`,
				position: 'center',
				icon: 'none',
				duration: 2000
			})
			console.error(`请求错误${status||''}：${statusText||message||''}`)
		}
		return Promise.reject(error); // 返回接口返回的错误信息
	}
);
//真机获取  
axios.defaults.adapter = function(config) {
	return new Promise((resolve, reject) => {
		var settle = require('axios/lib/core/settle');
		var buildURL = require('axios/lib/helpers/buildURL');
		uni.request({
			method: config.method.toUpperCase(),
			url: buildURL(config.baseURL + config.url, config.params, config.paramsSerializer),
			header: config.headers,
			data: config.data,
			dataType: config.dataType,
			responseType: config.responseType,
			sslVerify: config.sslVerify,
			complete: function complete(response) {
				response = {
					data: response.data,
					status: response.statusCode,
					errMsg: response.errMsg,
					header: response.header,
					config: config
				};

				settle(resolve, reject, response);
			}
		})
	})
}
export default request;
