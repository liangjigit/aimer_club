import {GETCURRENTCITY,GETSTORES} from '@/store/mutations_type.js'
import request from '@/utils/request.js'
const state = {
	currentCity:"", // 用户当前城市
	nearStore:[] // 所有店铺
}
const getters={
	
}
const actions = {
	// 获取有门店的城市
	// async getStoresCity({commit},payload){
	// 	let response = (await request({
	// 		url:'/user/miniapp/qywx/city/list',
	// 		method:'GET',
	// 		data:{}
	// 	})).data;
	// 	return response;
	// },
	// 搜索门店
	async searchStores({commit},payload){
		const {name,lat,lng,pageNo,pageSize} = payload
		let response = (await request({
			url:'/user/miniapp/qywx/depart/fuzzyQuery?name='+name+'&lat='+lat+'&lng='+lng+'&pageNo='+pageNo+'&pageSize='+pageSize,
			method:'GET',
			data:{}
		})).data;
		if(response.code == 200){
			commit('GETSTORES',{nearStore:response.data})
		}
		return response;
	},
	// 根据定位获取当前城市、最近的店铺 及店铺的导购列表
	async getNearStores({commit},payload){
		const {lat,lng} = payload
		let response = (await request({
			url:'/user/miniapp/qywx/depart/query?lat='+lat+'&lng='+lng,
			method:'GET',
			data:{}
		})).data;
		return response;
	},
	// 根据店铺id查询店铺导购
	async getDepartUserList({commit},payload){
		const {departmentId,departmentName} = payload
		let response = (await request({
			url:'/user/miniapp/qywx/departUser/list?departmentId='+departmentId+'&departmentName='+departmentName,
			method:'GET',
			data:{}
		})).data;
		return response;
	},
	// 根据导购id查询导购详情
	async  getDepartUserDetail({commit},payload){
		const {userId} = payload
		let response = (await request({
			url:'/user/miniapp/qywx/departUser/query?userId='+userId,
			method:'GET',
			data:{}
		})).data;
		return response;
	},
	// 根据用户手机号获取导购id
	async getUserGuideByPhone({commit},payload){
		const {phone} = payload
		let response = (await request({
			url:'/user/miniapp/qywx/departUser/queryByPhone?phone='+phone,
			method:'GET',
			data:{}
		})).data;
		return response;
	},
}

const mutations = {
	[GETCURRENTCITY](state,payload){
		state.currentCity = payload.currentCity
	},
	[GETSTORES](state,payload){
		state.nearStore = payload.nearStore
	},
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}