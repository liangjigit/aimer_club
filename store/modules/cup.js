import {GETCUPLIST,CHANGECOLLECT} from '@/store/mutations_type.js'
import request from '@/utils/request.js'
const state = {
	list:[] ,// 列表
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
	// 获取CUP有料列表
	async getCupList({commit,rootGetters},payload){
		let response = (await request({
			url:'/content/miniapp/cup/list',
			method:'POST',
			data:payload,
			needAuth:rootGetters['login/isLogin']
		})).data;
		if(response.code == 200){
			let { list, pageNum, pageSize, totalSize } = response.data
			commit('GETCUPLIST', { list, pageNum, pageSize, totalSize })
		}
		return response;
	},
	// 获取 cup 有料详情
	async getCupDetail({commit,dispatch,rootGetters},payload){
		let response = (await request({
			url:'/content/miniapp/cup/detail',
			method:'POST',
			data:payload,
			needAuth:rootGetters['login/isLogin']
		})).data;
		return response;
	},
	// 获取 阅读cup 积分
	async getCupScore({commit,dispatch,rootGetters},payload){
		let response = (await request({
			url:'/content/miniapp/cup/score',
			method:'POST',
			data:payload,
			needAuth:rootGetters['login/isLogin']
		})).data;
		if(response.code == 200&&response.data){
			let {score} = response.data
			if(score&&score > 0){
				dispatch('login/getMyInfo',{},{root: true})
			}
		}
		return response;
	},
}

const mutations = {
	[GETCUPLIST](state,payload){
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
		// console.log('GETCOLLECTLIST:'+state)
	},
	[CHANGECOLLECT](state,payload){
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