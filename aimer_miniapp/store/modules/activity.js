import {GETACTIVITYLIST,GETCURRENTCITY,GETACTIVITYCITIES} from '@/store/mutations_type.js'
import request from '@/utils/request.js'

const state = {
	list:[] ,// 我的收藏列表
	pageNum: 0,
	pageSize: 10,
	totalSize: 0,
	currentCity:"",
	activityCities:[]// 活动城市列表
}

const getters = {
	isEmpty(state){
		return !state.list.length
	}
}

const actions = {
	// 获取活动列表
	async getActivityList({commit,rootGetters},payload){
		let response = (await request({
			url:'/content/miniapp/activity/list',
			method:'POST',
			data:payload,
			needAuth:rootGetters['login/isLogin']
		})).data;
		if(response.code == 200){
			let { list, pageNum, pageSize, totalSize } = response.data
			commit('GETACTIVITYLIST', { list, pageNum, pageSize, totalSize })
		}
		return response;
	},
	// 获取活动城市
	async getActivityCities({commit,rootGetters},payload){
		let response = (await request({
			url:'/content/miniapp/activity/getActivityCity',
			method:'GET',
			data:payload,
			needAuth:rootGetters['login/isLogin']
		})).data;
		if(response.code == 200){
			let activityCities = [...response.data]
			commit('GETACTIVITYCITIES', { activityCities })
		}
		return response;
	},
	// 获取ACTIVITY 详情
	async getDetail({commit,rootGetters},payload){
		let response = (await request({
			url:'/content/miniapp/activity/queryActivity',
			method:'POST',
			data:payload,
			needAuth:rootGetters['login/isLogin']
		})).data;
		return response;
	},
	// 活动报名
	async apply({commit},payload){
		let response = (await request({
			url:'/content/miniapp/activity/auth/apply',
			method:'POST',
			data:payload
		})).data;
		return response;
	},
	// 获取用户当前城市
	async getCurrentCity({commit,rootGetters},payload){
		const {longitude,latitude} = payload
		let response = (await request({
			url:'/content/miniapp/activity/getCurrentCity?lat='+ latitude +'&lng=' + longitude,
			method:'GET',
			data:{},
			needAuth:rootGetters['login/isLogin']
		})).data
		return response;
	},
	// 判断是否在报名时间范围内
	async getApplyTimeStatus({commit,rootGetters},payload){
		const {activityCode} = payload
		let response = (await request({
			url:'/content/miniapp/activity/timeStatus?activityCode='+activityCode,
			method:'GET',
			data:{},
			needAuth:rootGetters['login/isLogin']
		})).data
		return response;
	}
}

const mutations = {
	[GETACTIVITYLIST](state,payload){
		let list = payload.list.map(item=>{
			item.code = item.activityCode
			item.browseUserCount = item.browseUserCount > 10000 ? (item.browseUserCount/10000).toFixed(1) +'万':item.browseUserCount;
			return item 
		})
		if(payload.pageNum == 1){
			state.list = []
		}
		state.list = [...state.list, ...list]
		state.pageNum = payload.pageNum
		state.pageSize = payload.pageSize
		state.totalSize = payload.totalSize
	},
	[GETCURRENTCITY](state,payload){
		state.currentCity = payload.currentCity
	},
	[GETACTIVITYCITIES](state,payload){
		state.activityCities = [...payload.activityCities]
	}
}
export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}