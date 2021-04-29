import {CHANGESIGNDATA,GETSIGNRECORD,GETINTEGRALWAYS,GETINTEGRALRECORD,CHANGEWAYSTATE} from '@/store/mutations_type.js'
import request from '@/utils/request.js'

const state = {
	signRecord:[],//签到记录
	needSign:true,//是否需要签到
	signInScore:0 ,// 签到总积分
	signInDays:0, // 连续签到天数
	ways:[], // 积分获取方式
	// 积分流水
	list:[] ,
	pageNum: 0,
	pageSize: 20,
	totalSize: 0,
}

const getters = {
	
}

const actions = {
	async getSignRecord({commit},payload){
		let response = (await request({
			url:'/user/miniapp/wx/auth/checkSignIn',
			method:'POST',
			data:payload
		})).data;
		if(response.code == 200){
			const {days:signInDays,todaySignIn,signInScore,userSignInList:signRecord} = response.data
			commit('GETSIGNRECORD',{signRecord}) 
			commit('CHANGESIGNDATA',{signInDays,todaySignIn,signInScore})
		}
		return response;
	},
	// 积分签到、点击签到
	async signIn({commit},payload){
		let response = (await request({
			url:'/user/miniapp/wx/auth/signIn',
			method:'POST',
			data:payload
		})).data;
		return response;
	},
	// 获取签到方式
	async getSignWays({commit,rootState},payload){
		let response = (await request({
			url:'/user/miniapp/user/integral/rule/list',
			method:'POST',
			data:payload
		})).data;
		if(response.code == 200){
			if(!rootState['login']['showActivity']){
				delete(response.data.userInfo)
			}
			commit('GETINTEGRALWAYS',{ways:{...response.data}})
		}
		return response;
	},
	// 获取积分流水
	async getIntegralRecord({commit},payload){
		let response = (await request({
			url:'/user/miniapp/user/integral/auth/flow',
			method:'POST',
			data:payload
		})).data;
		if(response.code == 200){
			let { list, pageNum, pageSize, totalSize } = response.data
			commit('GETINTEGRALRECORD', { list, pageNum, pageSize, totalSize })
		}
		return response;
	},
	// 用户能获得的最低积分
	async getLowestIntegral({commit},payload){
		let response = (await request({
			url:'/user/miniapp/user/integral/lowestIntegral',
			method:'GET',
			data:payload,
			needAuth:false
		})).data;
		return response;
	},
}

const mutations = {
	// 签到相关
	[CHANGESIGNDATA](state,payload){
		state.needSign = !payload.todaySignIn // 今天有没有签到
		state.signInScore = payload.signInScore // 签到总积分
		state.signInDays = payload.signInDays //连续签到天数
	},
	[GETSIGNRECORD](state,payload){
		state.signRecord = payload.signRecord
	},
	[GETINTEGRALWAYS](state,payload){
		let ways = []
		for(let key in payload.ways){
			let value = payload.ways[key]
			if(value){
				value.key = key
				ways.push(value)
			}
		}
		state.ways = [...ways]
	},
	[CHANGEWAYSTATE](state,payload){
		const {key,score,finished} = payload
		state.ways = state.ways.map(item=>{
			if(item.key == key){
				item['finished'] = finished
				item['score'] = score
			}
			return item
		})
	},
	[GETINTEGRALRECORD](state,payload){
		if(payload.pageNum == 1){
			state.list = []
		}
		state.list = [...state.list, ...payload.list]
		state.pageNum = payload.pageNum
		state.pageSize = payload.pageSize
		state.totalSize = payload.totalSize
	},
}
export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}