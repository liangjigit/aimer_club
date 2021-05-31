import {
	SETSELECTOR,
	GETBANNERS,
	GETNAVS,
	GETMINIPROGRAMSHARE,
	TRAININGCOUNT,
	GETMARKETING
} from '@/store/mutations_type.js'
import request from '@/utils/request.js'
const state = {
	selector: null, // 页面滚动到指定位置
	banners: [], //轮播图列表
	singleImage: null, //首页单图
	menuList: [], //首页四个菜单
	windowList: [], //橱窗图片
	miniProgramShare: null, // 小程序分享内容
	trainingCount: 0, // 训练人数
	marketing: null //营销弹窗的数据
}
const actions = {
	//获取首页营销弹窗的数据
	async getMarketingPop({
		commit
	}, payload) {
		const {
			type
		} = payload
		let response = (await request({
			url: `/content/admin/popup/auth/getPopup?type=${type}`,
			method: 'POST',
			// data: payload,
		})).data
		const {
			code,
			data
		} = response
		if (code == 200) {
			commit('GETMARKETING', {
				marketing: data
			})
		}
		return response
	},

	// 获取banner  pageId 1 表示首页 .linkType: 跳转到 1、小程序页面 2 外部地址 3 其他小程序
	async getBanners({
		commit
	}, payload) {
		let response = (await request({
			url: '/content/miniapp/home/banner/list',
			method: 'POST',
			data: payload,
			needAuth: false
		})).data;
		// console.log(response)
		if (response.code == 200) {
			commit('GETBANNERS', {
				banners: response.data
			})
		}
		return response;
	},

	// 获取首页导航、橱窗、单图 数据
	async getNavData({
		commit
	}, payload) {
		let response = (await request({
			url: '/content/miniapp/home/image/list',
			method: 'GET',
			data: {},
			needAuth: false
		})).data;
		if (response.code == 200) {
			const {
				imageInfo,
				menuList,
				windowList
			} = response.data
			commit('GETNAVS', {
				imageInfo,
				menuList,
				windowList
			})
		}
		return response;
	},
	// 首页CUP有料专家列表
	async getExperts({
		commit
	}, payload) {
		let response = (await request({
			url: '/content/miniapp/home/expert/list',
			method: 'GET',
			data: {},
			needAuth: false
		})).data;
		return response;
	},
	// 标签列表
	async getTags({
		commit
	}, payload) {
		let response = (await request({
			url: '/content/miniapp/home/tags/list',
			method: 'GET',
			data: {},
			needAuth: false
		})).data;
		return response;
	},
	// 小程序分享
	async getShareContent({
		commit
	}, payload) {
		let response = (await request({
			url: '/content/miniapp/home/share',
			method: 'GET',
			data: {},
			needAuth: false
		})).data;
		if (response.code == 200) {
			commit('GETMINIPROGRAMSHARE', {
				share: response.data
			})
		}
		return response;
	},
	// 首页 加入训练人数
	async getTrainingCount({
		commit
	}, payload) {
		let response = (await request({
			url: '/user/miniapp/user/count',
			method: 'GET',
			data: {},
			needAuth: false
		})).data;
		if (response.code == 200) {
			let {
				userCount
			} = response.data
			commit('TRAININGCOUNT', {
				userCount
			})
		}
		return response;
	},
	// 获取导购海报
	async getGuidePoster({
		commit
	}, payload) {
		let response = (await request({
			url: '/content/miniapp/home/poster',
			method: 'GET',
			data: {},
			needAuth: false
		})).data;
		return response;
	},
	// 获取直播间跳转地址
	async getLiveRoom({
		commit
	}, payload) {
		let response = (await request({
			url: '/content/miniapp/liveStreaming/info',
			method: 'POST',
			data: {},
			needAuth: false
		})).data;
		return response;
	}
}

const mutations = {
	[GETMARKETING](state, payload) {
		state.marketing = payload.marketing
	},
	[SETSELECTOR](state, payload) {
		state.selector = payload.selector
	},
	[GETBANNERS](state, payload) {
		let banners = payload.banners
		if (payload.banners.length === 2) {
			banners = [...payload.banners, ...payload.banners]
		}
		state.banners = banners || []
	},
	[GETNAVS](state, payload) {
		state.singleImage = payload.imageInfo
		state.menuList = [...payload.menuList]
		state.windowList = [...payload.windowList]
	},
	[GETMINIPROGRAMSHARE](state, payload) {
		state.miniProgramShare = payload.share
	},
	[TRAININGCOUNT](state, payload) {
		state.trainingCount = payload.userCount
	},
}

export default {
	namespaced: true,
	state,
	actions,
	mutations
}
