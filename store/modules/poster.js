import {GETSHAREINFO,GETINVITEQR} from '@/store/mutations_type.js'
import request from '@/utils/request.js'

const state = {
	shareInfo:null ,// {title,image,type,poster，path}
	inviteQR:"" // 邀请人二维码
}

const getters = {
	
}

const actions = {
	// 获取邀请好友海报
	async getInvitatePoster({commit},payload){
		let response = (await request({
			url:'/user/miniapp/UserInviteConfig/auth/query',
			method:'GET',
			data:payload
		})).data;
		return response;
	}
}

const mutations = {
	[GETSHAREINFO](state,payload){
		state.shareInfo = payload.shareInfo
	},
	[GETINVITEQR](state,payload){
		state.inviteQR = payload.inviteQR
	}
}
export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}