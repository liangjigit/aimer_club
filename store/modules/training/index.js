import {GETCOURSELIST,GETCOLLECTLIST,GETCLASSIFYLIST,GETCLASSIFY,CHANGECOURSE} from '@/store/mutations_type.js'
import request from '@/utils/request.js'

const state = {
	course:{
		list:[],
		pageNum:0,
		pageSize:10,
		totalSize:0
	},
	collect:{
		list:[],
		pageNum:0,
		pageSize:10,
		totalSize:0
	},
	classifyList:[],//课程分类列表
	classify:""//当前分类
}

const getters = {
	
}

const actions = {
	// 获取课程列表
	async getCourseList({commit,rootGetters},payload){
		const {classify} = payload
		let response = (await request({
			url:'/content/miniapp/course/list',
			method:'post',
			data:payload,
			needAuth:rootGetters['login/isLogin']
		})).data;
		if(response.code == 200){
			let {list,pageNum,pageSize,totalSize} = response.data
			commit('GETCOURSELIST', { list,pageNum,pageSize,totalSize })
			commit('GETCLASSIFY',{classify})
		}
		return response;
	},
	// 收藏的课程列表
	async getCollectList({commit},payload){
		let response = (await request({
			url:'/content/miniapp/course/auth/queryCollectCourse',
			method:'post',
			data:payload
		})).data;
		if(response.code == 200){
			let {list,pageNum,pageSize,totalSize} = response.data
			commit('GETCOLLECTLIST', { list,pageNum,pageSize,totalSize })
		}
		return response;
	},
	// 获取所有课程分类
	  async getClassifyList({ commit }, payLoad) {
		const response = (
		  await request({
			url: `/content/miniapp/course/all`,
			method: "GET",
			needAuth:false
		  })
		).data;
		if (response.code == 200) {
		  commit("GETCLASSIFYLIST", { classifyList: response.data });
		}
		return response;
	  }
}

const mutations = {
	[GETCOURSELIST](state,payload){
		if(payload.pageNum == 1){
			state.course.list = []
		}
		state.course.list = [...state.course.list,...payload.list]
		state.course.pageNum = payload.pageNum
		state.course.pageSize = payload.pageSize
		state.course.totalSize = payload.totalSize
	},
	[GETCOLLECTLIST](state,payload){
		if(payload.pageNum == 1){
			state.collect.list = []
		}
		state.collect.list = [...state.collect.list,...payload.list]
		state.collect.pageNum = payload.pageNum
		state.collect.pageSize = payload.pageSize
		state.collect.totalSize = payload.totalSize
	},
	[GETCLASSIFYLIST](state,payload){
		state.classifyList = [...payload.classifyList]
	},
	[GETCLASSIFY](state,payload){
		state.classify = payload.classify
	},
	[CHANGECOURSE](state,payload){
		let course = state.course.list.filter(z=>z.courseCode == payload.courseCode)[0]
		course.collect = payload.collect
	}
}
export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}