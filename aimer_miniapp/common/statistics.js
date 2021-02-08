import request from '@/utils/request.js'
// cup 统计 1、下载海报  2、识别小程序码 3、分享
export async function doCupStatistics(payload){
	const {modelCode:articleCode,no} = payload
	let url = ""
	switch(no){ 
		case 1:
			url = "/content/miniapp/cup/poster/download/data"
		break;
		case 2:
			url = "/content/miniapp/cup/qrcode/data"
		break;
		case 3:
			url = "/content/miniapp/cup/share/data"
		break;
		default:
		break;
	}
	if(!url) return
	let response = (await request({
		url,
		method:'POST',
		data:{
			articleCode
		}
	})).data;
	return response;
}
// 导购海报弹窗 统计
export async function doGuidePosterStatistic(payload){
	const {id} = payload
	let response = (await request({
		url:'/content/miniapp/home/poster/click?id='+id,
		method:'GET',
		data:{}
	})).data;
	return response;
}
// 课程统计 no 为 2:分享 4：海报下载 5 识别小程序码
export async function doCourseStatistics(payload){
	let response = (await request({
		url:'/content/miniapp/course/statistics',
		method:'POST',
		data:payload
	})).data;
	return response;
}
// BRARTS数据统计 no 2:分享 6：识别小程序码  7：海报下载
export async function doBrartsStatistics(payload){
	let response = (await request({
		url:'/content/miniapp/BRARTS/statistics',
		method:'POST',
		data:payload
	})).data;
	return response;
}
// 社区活动数据统计 no 为 2 表示分享 5 表示海报下载 6 识别小程序码
export async function doActivityStatistics(payload){
	let response = (await request({
		url:'/content/miniapp/activity/statistics',
		method:'POST',
		data:payload
	})).data;
	return response;
}
// 点击产品数据统计
export async function doGoodsStatistics(payload){
	let response = (await request({
		url:'/content/miniapp/goods/click',
		method:'POST',
		data:payload
	})).data;
	return response;
}
// 首页导航、橱窗、单图点击量，type 0 导航，1 橱窗，2 单图
export async function doNavStatistics(payload){
	const {type,id} = payload
	let response = (await request({
		url:'/content/miniapp/home/image/click?type='+type+'&id=' + id,
		method:'GET',
		data:{}
	})).data;
	return response;
}
// 首页 banner 点击量统计
export async function doBannerStatistics(payload){
	const {id} = payload
	let response = (await request({
		url:'/content/miniapp/home/banner/click?id='+id,
		method:'GET',
		data:{},
	})).data;
	return response;
}
// 弹窗 点击量统计
export async function doPupopClickStatistics(payload){
		const {id} = payload
		let response = (await request({
			url:'/content/miniapp/home/popup/click?id='+id,
			method:'GET',
			data:{}
		})).data;
		return response;
}
