import {
	GETREDIRECTURL,
	GETUSERINFO,
	CHANGELOGINSTATE,
	GETLOGINPOPUP,
	SETSHOWACTIVITY,
	GETPOPUP,
	GETGUIDINFO,
	GETINVITEUSERID,
	GETUSERACCOUNTSTATE
} from '@/store/mutations_type.js'
import request from '@/utils/request.js'
const state = {
	userInfo: null, // 用户信息
	loginState: false, //登录状态
	isShowLogin: false, //是否显示login 弹框
	showActivity: false, // 是否显示活动（完善个人资料有礼）
	pupop: null, // 弹窗
	// 从小程序卡片进入首页获取测参数
	guidecode: undefined,
	source: undefined,
	aimerid: undefined,
	erpcode: undefined,
	appid: undefined,
	// 邀请好友进入首页 获取到的 inviteUserId
	inviteUserId: undefined,
	// 用户是否在中台停用
	isDisabledUser: false,
	// 注册后页面重定向
	redirectUrl: null // {url,type} 调用 navigatorToPage from 'common/index.js'

}
const getters = {
	isLogin(state, payload) {
		return Boolean(state.loginState)
	}
}
const actions = {
	// 通过微信 uni.login 获取用户信息 (微信小程序)
	async onGetUserInfo({
		dispatch,
		commit,
		state
	}) {
		const that = this;
		return new Promise((resolve, reject) => {
			//微信登录获取code
			uni.login({
				provider: 'weixin',
				async success(res) {
					const {
						code,
						errMsg
					} = res;
					if (errMsg == "login:ok") {
						// 获取用户信息
						let response = await dispatch('login', {
							jscode: code,
							userInfo: JSON.stringify(uni.getStorageSync(
								'saveUserProfile'))
						})
						resolve(response)
					} else {
						reject({
							errMsg: '微信登录失败 uni.login, login/onGetUserInfo：' +
								errMsg
						})
					}
				}
			})
		})
	},
	// 保存用户信息
	async login({
		commit,
		dispatch,
		state
	}, payload) {
		const {
			guidecode,
			source,
			aimerid,
			erpcode,
			appid,
			inviteUserId
		} = state // 导购信息
		//后台登录并保存用户数据
		let response = (await request({
			url: '/user/miniapp/wx/login',
			method: 'POST',
			data: {
				...payload, // userInfo 
				inviteUserId,
				guidecode,
				source,
				aimerid,
				erpcode,
				appid
			},
			needAuth: false
		})).data;
		if (response.code == 200) {
			let {
				token,
				getPhone,
				sessionKey
			} = response.data; // getPhone, sessionKey, 
			uni.setStorageSync('token', token)
			uni.setStorageSync('getPhone', getPhone) //如果有手机号 getPhone 值为 false 说明已注册，如果未注册则会跳转到 注册页面
			uni.setStorageSync('sessionKey', sessionKey)
			commit('CHANGELOGINSTATE', {
				loginState: true
			})
			//绑定导购
			if (inviteUserId || guidecode) {
				console.log('产生绑定关系:bindWithGuid...')
				dispatch('bindWithGuid', {})
			}
			// 登录状态
			if (!getPhone) {
				// 用户已注册 res.environment 如果是在微信中运行 则为 undefined
				let res = uni.getSystemInfoSync()
				if (res.environment === "wxwork") {
					dispatch('wxworkLogin', {}) // 在企业微信中需要进行企业微信登录，获取员工的信息
				}
			}
			// 获取个人资料
			await dispatch('getMyInfo', {
				userInfo: JSON.parse(payload.userInfo)
			})
		}
		return response;
	},
	// 获取个人资料
	async getMyInfo({
		state,
		commit
	}, payload) {
		let response = (await request({
			url: '/user/miniapp/user/auth/queryUser',
			method: 'GET',
			data: {}
		})).data;
		if (response.code == 200) {
			let {
				currentIntegral,
				showActivity,
				level,
				memberNo,
				id,
				guideId,
				isGuide,
				phone,
				isDisabledUser
			} = response.data
			//payload.userInfo不存在时
			if (!payload.userInfo) payload.userInfo = state.userInfo
			commit('GETUSERINFO', {
				userInfo: {
					...payload.userInfo,
					currentIntegral,
					level,
					memberNo,
					id,
					guideId,
					isGuide,
					phone,
					isDisabledUser
				}
			})
			commit('SETSHOWACTIVITY', {
				showActivity
			})
			commit('GETUSERACCOUNTSTATE', {
				isDisabledUser
			})
		}
		return response;
	},
	// 获取登录弹窗
	async getLoginPopup({
		commit
	}, payload) {
		let response = (await request({
			url: '/content/miniapp/home/popup',
			method: 'GET',
			data: {},
			needAuth: false
		})).data;
		if (response.code == 200) {
			commit('GETPOPUP', {
				pupop: response.data
			})
		}
		return response;
	},
	// 获取企业登录凭证。
	// 当用户在企业微信中打开小程序时，需要获取企业微信登录凭证js_code，后端去通过jscode 和 access_token 获取 userId ,
	// 再通过 userId 和 access_token 读取企业员工信息中的手机号，与微信小程序用户授权获取的手机号进行匹配，若匹配上了则为导购人员。
	wxworkLogin({
		commit
	}, payload) {
		const that = this;
		wx.qy.login({
			success: async function(res) {
				if (res.code) {
					console.log('企业微信登录:' + res.code)
					let response = (await request({
						url: '/user/miniapp/qywx/login',
						method: 'POST',
						data: {
							jscode: res.code
						},
						needAuth: false
					})).data;
					if (response.code == 200) {
						console.log("企业微信登录成功")
					}
				} else {
					console.error('调用wx.qy.login失败：' + res.errMsg)
				}
			}
		});
	},
	// 保存手机号
	async savePhoneNumber({
		state,
		commit,
		dispatch
	}, payload) {
		let response = (await request({
			url: '/user/miniapp/wx/save/phone',
			method: 'POST',
			data: payload
		})).data;
		if (response.code == 200) {
			uni.setStorageSync('getPhone', false)
		}
		return response;
	},
	// 导购关系绑定
	async bindWithGuid({
		commit,
		dispatch,
		state
	}, payload) {
		const {
			guidecode,
			inviteUserId
		} = state // 导购信息
		let response = (await request({
			url: '/user/miniapp/userGuide/auth/binding',
			method: 'POST',
			data: {
				guidecode, // 导购 code
				inviteUserId // 邀请人id
			}
		})).data;
		if (response.code == 200) {
			// 获取个人资料
			await dispatch('getMyInfo', {
				userInfo: state.userInfo
			})
			commit('GETINVITEUSERID', {
				inviteUserId: null
			})
			commit('GETGUIDINFO', {
				guidecode: null,
				source: null,
				aimerid: null,
				erpcode: null,
				appid: null
			})
		}
		return response
	}
}

const mutations = {
	[GETUSERACCOUNTSTATE](state, payload) {
		state.isDisabledUser = payload.isDisabledUser
	},
	[GETUSERINFO](state, payload) {
		let userInfo = {
			...state.userInfo,
			...payload.userInfo
		}
		userInfo.avatarUrl = userInfo.avatarUrl.replace(/\/thirdwx./g, '/wx.').replace(/http:\/\//, 'https:\/\/')
		state.userInfo = userInfo
	},
	[CHANGELOGINSTATE](state, payload) {
		state.loginState = payload.loginState
	},
	[GETLOGINPOPUP](state, payload) {
		state.isShowLogin = !state.isShowLogin
	},
	[SETSHOWACTIVITY](state, payload) {
		state.showActivity = payload.showActivity
	},
	[GETPOPUP](state, payload) {
		state.pupop = payload.pupop
	},
	[GETGUIDINFO](state, payload) {
		state.guidecode = payload.guidecode,
			state.source = payload.source,
			state.aimerid = payload.aimerid,
			state.erpcode = payload.erpcode,
			state.appid = payload.appid
	},
	[GETINVITEUSERID](state, payload) {
		state.inviteUserId = payload.inviteUserId
	},
	[GETREDIRECTURL](state, payload) {
		state.redirectUrl = payload.redirectUrl
	}
}

export default {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}
