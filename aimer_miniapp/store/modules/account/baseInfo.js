import {GETCONFIGS,GETCONTENT} from '@/store/mutations_type.js'
import request from '@/utils/request.js'

const state = {
	configs:null,
	myInfo:null,//我的信息
	babyInfo:null,//宝贝信息
	honeyInfo:null//我的TA 信息
}

const getters = {
}

const actions = {
	// 完善信息配置
	async getBaseInfoConfig({commit},payload){
		let response = (await request({
			url:'/user/miniapp/userInfoConfig/auth/query',
			method:'POST',
			data:payload
		})).data;
		return response;
	},
	// // 查询用户须填写的信息字段  
	// async getBaseInfoFields({commit},payload){
	// 	let response = (await request({
	// 		url:'/user/miniapp/userInfoConfig/auth/queryFields',
	// 		method:'POST',
	// 		data:payload
	// 	})).data;
	// 	return response;
	// },
	// 个人信息 回显 包含 我的信息、我的TA、我的宝贝
	async getBaseInfoContent({commit},payload){
		let response = (await request({
			url:'/user/miniapp/user/auth/queryPersonInfo',
			method:'GET',
			data:payload
		})).data;
		if(response.code == 200){
			commit('GETCONTENT',{...response.data})
		}
		return response;
	},
	// 编辑个人资料
	async editMyInfo({commit},payload){
		let response = (await request({
			url:'/user/miniapp/user/auth/editMyself',
			method:'POST',
			data:payload
		})).data;
		return response;
	},
	// 新增我的他
	async saveHoney({commit},payload){
		let response = (await request({
			url:'/user/miniapp/user/auth/saveMyMan',
			method:'POST',
			data:payload
		})).data;
		return response;
	},
	// 新增baby
	async saveBaby({commit},payload){
		let response = (await request({
			url:'/user/miniapp/user/auth/addMyBaby',
			method:'POST',
			data:payload
		})).data;
		return response;
	},
	async deleteBaby({commit},payload){
		const {babyId} = payload
		let response = (await request({
			url:'/user/miniapp/user/auth/deleteBaby',
			method:'POST',
			data:babyId
		})).data;
		return response;
	},
	// join配置
	async getJoinConfig({commit},payload){
		let response = (await request({
			url:'/user/miniapp/wx/reg/config',
			method:'GET',
			data:payload
		})).data;
		return response;
	},
	// 保存join 信息
	async saveJoinInfo({commit},payload){
		let response = (await request({
			url:'/user/miniapp/wx/auth/save/info',
			method:'POST',
			data:payload
		})).data;
		return response;
	},
}

const mutations = {
	[GETCONFIGS](state,payload){
		state.configs = [...payload.configs]
	},
	[GETCONTENT](state,payload){
		state.myInfo = payload.userInformation || {}
		state.babyInfo = payload.babyInformation || []
		state.honeyInfo = payload.spouseInformation || {}
	}
}
export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}