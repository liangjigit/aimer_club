import {} from '@/store/mutations_type.js'
import request from '@/utils/request.js'

const state = {
	// list:[] ,// 我的收藏列表
	// pageNum: 0,
	// pageSize: 10,
	// totalSize: 0,
	// currentCity:"",
	// activityCities:[]// 活动城市列表
}

const getters = {
	// isEmpty(state){
	// 	return !state.list.length
	// }
}

const actions = {
	// 获取活动首页数据
	async getActiveIndex({commit},payload){
		let response = (await request({
			url:'/user/user/bind/getUserBindData?activeType=FL&isShow=1',
			method:'POST',
			// data:payload,
		})).data;
		if(response.code == 200){
			// let {  } = response.data
			// commit('', { })
		}
		return response;
	},
	// 领取活动奖励
	async getActiveAward({commit},payload){
		let response = (await request({
			url:`/user/user/bind/saveReward`,
			method:'POST',
			params:payload,
		})).data;
		if(response.code == 200){
			// commit('', { })
		}
		return response;
	},
	// 老会员 关系记录
	async getOldInvite({commit},payload){
		let response = (await request({
			url:'/user/user/bind/invitationActivities',
			method:'POST',
			data:payload,
		})).data;
		return response;
	},
	// 新会员 关系记录
	async getNewInvite({commit},payload){
		let response = (await request({
			url:'/user/user/bind/newInvitationActivities',
			method:'POST',
			data:payload
		})).data;
		return response;
	},
	// 发送小程序消息
	async sendMiniMessage({commit},payload){
		let response = (await request({
			url:'/user/user/bind/sendMessage',
			method:'POST',
			data:payload
		})).data
		return response;
	},
	//获取新会员奖励列表
	async getNewMemberPrizeList({commit},payload){
		let response = (await request({
			url:`/user/user/bind/getComponConfig`,
			method:'POST',
			params:payload
		})).data
		return response;
	},
}

const mutations = {
	// [GETACTIVITYLIST](state,payload){
	// 	let list = payload.list.map(item=>{
	// 		item.code = item.activityCode
	// 		item.browseUserCount = item.browseUserCount > 10000 ? (item.browseUserCount/10000).toFixed(1) +'万':item.browseUserCount;
	// 		return item 
	// 	})
	// 	if(payload.pageNum == 1){
	// 		state.list = []
	// 	}
	// 	state.list = [...state.list, ...list]
	// 	state.pageNum = payload.pageNum
	// 	state.pageSize = payload.pageSize
	// 	state.totalSize = payload.totalSize
	// },
	// [GETCURRENTCITY](state,payload){
	// 	state.currentCity = payload.currentCity
	// },
	// [GETACTIVITYCITIES](state,payload){
	// 	state.activityCities = [...payload.activityCities]
	// }
}
export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}