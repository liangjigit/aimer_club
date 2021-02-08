import {GETBENEFITINTR,GETBENEFITS} from '@/store/mutations_type.js'
import request from '@/utils/request.js'
const state = {
	benefitIntr:null ,// 权益介绍
	benefits:null
}
const getters={
	
}
const actions = {
	// 权益介绍
	async getBenifitIntr({commit},payload){
		let response = (await request({
			url:'/user/miniapp/userBenefits/auth/queryUserBenefits',
			method:'GET',
			data:payload
		})).data;
		if(response.code == 200){
			commit('GETBENEFITINTR', {benefitIntr: response.data})
		}
		return response;
	},
	// 获取我的权益
	async getMyBenefit({commit},payload){
		let response = (await request({
			url:'/user/miniapp/userBenefits/auth/queryMyBenefits',
			method:'GET',
			data:payload
		})).data;
		if(response.code == 200){
			commit('GETBENEFITS', {benefits: response.data})
		}
		return response;
	},
	// 优惠券
	async getCoupons({commit},payload){
		let response = (await request({
			url:'/user/miniapp/coupon/auth/list',
			method:'POST',
			data:payload
		})).data;
		return response;
	},
	// 优惠券详情
	async getCouponDetail({commit},payload){
		let response = (await request({
			url:'/user/miniapp/coupon/auth/detail',
			method:'POST',
			data:payload
		})).data;
		return response;
	},
}

const mutations = {
	[GETBENEFITINTR](state,payload){
		state.benefitIntr = payload.benefitIntr
	},
	[GETBENEFITS](state,payload){
		state.benefits = payload.benefits
	}
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}