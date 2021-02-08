import {GETSTORENAVS} from '@/store/mutations_type.js'
import request from '@/utils/request.js'
const state = {
	list:[] //门店列表
}
const getters={
	
}
const actions = {
	// 门店列表
	async getStores({commit},payload){
		let response = (await request({
			url:'/user/miniapp/user/auth/storeNavigation',
			method:'POST',
			data:payload
		})).data;
		return response;
	},
}

const mutations = {
	[GETSTORENAVS](state,payload){
		let list = payload.list.map(item=>{
			item.distance = Number(item.distance.toFixed(2))
			return item 
		})
		state.list = [...state.list,...list]
	}
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}