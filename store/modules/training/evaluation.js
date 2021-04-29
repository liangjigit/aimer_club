import {GETDATELIST,GETBENEFITS} from '@/store/mutations_type.js'
import request from '@/utils/request.js'

const state = {
	dateList:[] // 测量记录
}

const getters = {
	
}

const actions = {
	// 保存体态测量信息
	async saveInfo({commit},payload){
		let response = (await request({
			url:'/user/miniapp/posture/auth/add',
			method:'POST',
			data:payload
		})).data;
		return response;
	},
	// 查询体态测量信息
	async getReport({commit},payload){
		const {date,showCourse} = payload
		let response = (await request({
			url:'/user/miniapp/posture/auth/queryByDate?date='+ date + '&showCourse='+showCourse,
			method:'GET',
			data:payload
		})).data;
		return response;
	},
	// 查询体态测评时间日历
	async getRecord({commit},payload){
		let response = (await request({
			url:'/user/miniapp/posture/auth/queryDate',
			method:'GET',
			data:payload
		})).data;
		if(response.code){
			let {dateList} = response.data
			commit('GETDATELIST',{dateList})
		}
		return response;
	}
}

const mutations = {
	[GETDATELIST](state,payload){
		state.dateList = payload.dateList
	}
}
export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}