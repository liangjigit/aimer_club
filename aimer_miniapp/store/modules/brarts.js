import {GETBRARTSLIST} from '@/store/mutations_type.js'
import request from '@/utils/request.js'

const state = {
	list:[] ,// 我的收藏列表
	pageNum: 0,
	pageSize: 10,
	totalSize: 0
}

const getters = {
	isEmpty(state){
		return !state.list.length
	}
}

const actions = {
	// 获取BRARTS列表
	async getBrartsList({commit,rootGetters},payload){
		let response = (await request({
			url:'/content/miniapp/BRARTS/list',
			method:'POST',
			data:payload,
			needAuth:rootGetters['login/isLogin']
		})).data;
		if(response.code == 200){
			let { list, pageNum, pageSize, totalSize } = response.data
			commit('GETBRARTSLIST', { list, pageNum, pageSize, totalSize })
		}
		return response;
	},
	// BRARTS 打卡 (与课程打卡共用接口)
	// BRARTS打卡传这个{"model":1,"modelCode":""，punchDate:""} model 2 表示 课程 modelcode 表示BRARTScode punchDate 表示打卡日期
	async doPunch({commit,dispatch},payload){
		let response = (await request({
			url:'/user/miniapp/userPunch/auth/punch',
			method:'POST',
			data:payload
		})).data;
		if(response.code == 200){
			let {score} = response.data
			if(score&&score > 0){
				dispatch('login/getMyInfo',{},{root: true})
			}
		}
		return response;
	},
	// 获取BRARTS 详情
	async getDetail({commit,rootGetters},payload){
		let response = (await request({
			url:'/content/miniapp/BRARTS/queryBRARTS',
			method:'POST',
			data:payload,
			needAuth:rootGetters['login/isLogin']
		})).data;
		return response;
	}
}

const mutations = {
	[GETBRARTSLIST](state,payload){
		let list = payload.list.map(item=>{
			item.code = item.articleCode
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
	}
}
export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}