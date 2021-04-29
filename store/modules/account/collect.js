import {GETCOLLECTLIST,CHANGECOLLECTSTATE} from '@/store/mutations_type.js'
import request from '@/utils/request.js'
const state = {
	list:[] ,// 我的收藏列表
	pageNum: 0,
	pageSize: 10,
	totalSize: 0
}
const getters={
	isEmpty(state){
		return !state.list.length
	}
}
const actions = {
	// 收藏文章 (与课程共用一个接口)
	// model 1 表示 cup 有料 2 表示课程
	async doCollect({commit},payload){
		let response = (await request({
			url:'/user/miniapp/userCollect/auth/collect',
			method:'POST',
			data:payload
		})).data;
		return response;
	},
	// 获取收藏列表
	async getCollectList({commit},payload){
		let response = (await request({
			url:'/user/miniapp/userCollect/auth/article',
			method:'POST',
			data:payload
		})).data;
		if(response.code == 200){
			let { list, pageNum, pageSize, totalSize } = response.data
			commit('GETCOLLECTLIST', { list, pageNum, pageSize, totalSize })
		}
		return response;
	}
}

const mutations = {
	[GETCOLLECTLIST](state,payload){
		let list = payload.list.map(item=>{
			item.tags = item.tags.split(';')
			item.browseBaseStatus = Boolean(item.browseBaseStatus)
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
	[CHANGECOLLECTSTATE](state,payload){
		state.list = state.list.map(item=>{
			if(item.articleCode == payload.code){
				item.isCollect = payload.isCollect
				item.collectCount = payload.isCollect? item.collectCount + 1: item.collectCount - 1
			}
			return item
		})
	}
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}