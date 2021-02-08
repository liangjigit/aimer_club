import {GETCOURSEDETAIL,GETALLCATEGORYIES} from '@/store/mutations_type.js'
import request from '@/utils/request.js'

const state = {
	detail:null//课程详情
}

const getters = {
	
}

const actions = {
	// 课程详情
	async getDetail({commit,dispatch,rootGetters},payload){
		let response = (await request({
			url:'/content/miniapp/course/queryCourse',
			method:'post',
			data:payload,
			needAuth:rootGetters['login/isLogin']
		})).data;
		if(response.code == 200){
			commit('GETCOURSEDETAIL', { detail: response.data})
		}
		return response;
	},
	// 课程打卡 (与BRARTS 打卡共用接口)
	// 课程打卡传这个{"model":2,"modelCode":""} model 2 表示 课程 modelcode 表示课程code
	// async doPunch({state,commit},payload){
	// 	let response = (await request({
	// 		url:'/user/miniapp/userPunch/auth/punch',
	// 		method:'POST',
	// 		data:payload
	// 	})).data;
	// 	return response;
	// },
	// 获取打卡数据
	async getPunchData({commit},payload){
		let response = (await request({
			url:'/content/miniapp/course/auth/queryCourseEnd',
			method:'POST',
			data:payload
		})).data;
		return response;
	}
}

const mutations = {
	[GETCOURSEDETAIL](state,payload){
		state.detail = payload.detail
	}
}
export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}