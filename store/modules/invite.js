import {
	GETBURIEDPOINT
} from '@/store/mutations_type.js'
import request from '@/utils/request.js'

const state = {
	buriedData: {
		activeId: 666666,
		invitePhone: 'string'
	}
}

const getters = {

}

const actions = {
	//埋点数据接口
	async getBuriedPoint(context, payload) {
		const response = (await request({
			url: '/content/admin/burying/saveBuryingData',
			method: 'POST',
			data: payload
		})).data
		console.log(response)
	},
	// 获取活动首页数据
	async getActiveIndex({
		commit
	}, payload) {
		let {
			isShowHide
		} = payload
		let param = ''
		//匹配成功代表分享或者服务通知请求
		if (/fx/.test(isShowHide)) {
			let newIsShow = isShowHide.substr(2)
			param = `activeId=${newIsShow}`
		} else {
			param = `activeType=FL&isShow=${isShowHide}`
		}
		// console.log(param)
		let response = (await request({
			url: `/user/user/bind/getUserBindData?${param}`,
			method: 'POST',
			// data:payload,
		})).data;
		if (response.code == 200) {
			// let {  } = response.data
			// commit('', { })
		}
		return response;
	},
	// 领取活动奖励
	async getActiveAward({
		commit
	}, payload) {
		let response = (await request({
			url: `/user/user/bind/saveReward`,
			method: 'POST',
			params: payload,
		})).data;
		if (response.code == 200) {
			// commit('', { })
		}
		return response;
	},
	// 老会员 关系记录
	async getOldInvite({
		commit
	}, payload) {
		let response = (await request({
			url: '/user/user/bind/invitationActivities',
			method: 'POST',
			data: payload,
		})).data;
		return response;
	},
	// 新会员 关系记录
	async getNewInvite({
		commit
	}, payload) {
		let response = (await request({
			url: '/user/user/bind/newInvitationActivities',
			method: 'POST',
			data: payload
		})).data;
		return response;
	},
	// 发送小程序消息
	async sendMiniMessage({
		commit
	}, payload) {
		let response = (await request({
			url: '/user/user/bind/sendMessage',
			method: 'POST',
			data: payload
		})).data
		return response;
	},
	//获取新会员奖励列表
	async getNewMemberPrizeList({
		commit
	}, payload) {
		let {
			isShowHide
		} = payload
		let param = ''
		//匹配成功代表分享或者服务通知请求
		if (/fx/.test(isShowHide)) {
			let newIsShow = isShowHide.substr(2)
			param = `activeId=${newIsShow}`
		} else {
			param = `activeType=FL&isShow=${isShowHide}`
		}
		let response = (await request({
			url: `/user/user/bind/getComponConfig?${param}`,
			method: 'POST',
			// params: payload
		})).data
		if (response.code == 200) {
			// let {  } = response.data
			// commit('', { })
		}
		return response;
	},
}

const mutations = {
	[GETBURIEDPOINT](state, payload) {
		state.buriedData = payload
	}
}
export default {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}
