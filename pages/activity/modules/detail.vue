<template>
	<view>
		<view class="detail-wrapper" v-if="detail">
			<view class="image">
			  <image :src="detail.img" mode="aspectFill"></image>
			</view>
			<view class="activity-title self-start padding-lr">
				<text>{{detail.title}}</text>
			</view>
			 <!-- 地址 -->
			<list-item-img :icon="'/static/activity/address-icon.png'" :isShow="detail.address" :title="detail.city + detail.address"></list-item-img>
			<!-- 时间 -->
			<list-item-img :icon="'/static/activity/datetime-icon.png'" :title="detail.activityStartTime + ' - ' + detail.activityEndTime"></list-item-img>
			<!-- 积分 -->
			<list-item-img :icon="'/static/activity/integral-icon.png'" :isShow="detail.integral?true:false" :title="'获得'+detail.integral+'积分'"></list-item-img>
			<!-- 报名人数 -->
			<list-item-img :icon="'/static/activity/members-icon.png'" :title="getApplyData"></list-item-img>
			<!-- 会员等级 -->
			<list-item-img :icon="'/static/activity/level-icon.png'" :isShow="levelLimit" :title="levelLimit"></list-item-img>
			<!-- 活动提示 -->
			<view class="activity-tip padding-lr">
				<text>
					* 活动当天，微信扫描现场签到二维码，即可获得积分哦~
				</text>
			</view>
			<!-- 活动详情 -->
			<view class="line"></view>
			<view class="activity-title self-start padding-lr" style="margin-bottom:36upx">
				<text>活动详情</text>
			</view>
			<view style="margin-bottom:70upx;">
				<html-content :content="detail.content" @ready="ready"></html-content>
				<!-- <jyf-parser :html="detail.content" ref="article"></jyf-parser> -->
			</view>
			<!-- 活动报名时间 -->
			<view class="activity-tip padding-lr" style="font-size: 26upx;">
				<text>
					报名时间:
				</text>
				<view  style="margin-top: 16upx;">
					{{detail.applyStartTime +' - '+detail.applyEndTime}}
				</view>
			</view> 
			<!-- 用户操作按钮 -->
			<view class="btns-wrapper flex justify-around align-center">
				<!-- 未报名 || 取消报名 -->
				<button class="cu-btn lines-red lg shadow" @click="getModal('signUp','是否确定报名？',1)" v-show="!stopApply&&!detail.isApply">我要报名</button>
				<!-- 已报名 -->
				<button class="cu-btn lines-gray lg shadow text-gray" @click="getModal('signUp','是否取消报名？',2)" v-show="detail.isApply&&!detail.signStatus">取消报名</button>
				<!-- 已签到 -->
				<button class="cu-btn lines-gray lg shadow text-gray" v-show="detail.isApply&&detail.signStatus">已签到</button>
				<!-- 活动已结束 -->
				<button class="cu-btn lines-gray lg shadow text-gray" v-show="!detail.isApply&&stopApply">报名已结束</button>
				<!-- 分享按钮 -->
				<button class="cu-btn lines-red lg shadow" v-if="detail.previewImg" @click="goShare">我要分享</button>
				<button class="cu-btn lines-red lg shadow" v-else open-type="share">我要分享</button>
			</view>
		</view>
		<!--弹窗 -->
		<popup :modalName="modalName" :title="title" @hideModal="hideModal" @confirm="confirm"></popup>
		<share-pupop :modalName="modalName" :title="'报名成功'" :subTitle="detail.signStatus&&isQR===1&&isDuringActivity&&detail.isApply?(detail.integral?'您已签到，获得'+detail.integral+'积分~':'您已签到~'):''" @hideModal="hideModal"></share-pupop>
		<login-pupop ref="login"></login-pupop>
		<home-btn></home-btn>
	</view>
</template>

<script>
	import {mapState,mapActions,mapMutations,mapGetters} from 'vuex'
	import listItemImg from './components/list-item-img.vue' 
	import popup from '../../components/popup/popup.vue'
	import sharePupop from '../../components/popup/share-pupop.vue'
	import homeBtn from '@/pages/components/float-button/home.vue'
	import htmlContent from '@/pages/components/html-content/htmlContent.vue'
	import {getFullDate,debounce,abnormalprompt} from '@/common/index.js'
	import {doActivityStatistics} from '@/common/statistics.js'
	import share from '@/common/share.js'
	import login from '@/common/login.js'
	export default{
		mixins:[share,login],
		async onShow(){
			this.$refs.login.checkLogin('tabBar')
			let response = await this.getApplyTimeStatus({activityCode:this.code})
			if(response.code == 200){
				this.stopApply = response.data ===-2
			}
		},
		components:{
			listItemImg,
			popup, 
			sharePupop,
			homeBtn,
			htmlContent
		},
		data(){
			return {
				detail:null,
				// 弹窗
				modalName:"",
				title:"",
				modalType: 0 ,// 1 表示 是否确定报名, 2 表示 是否取消报名 3 表示 您已取消报名
				code:null,
				isLoading:false,
				levelLimit:null,
				// 报名状态
				// canCancel: false,
				// canApply:false,
				stopApply:false,// 报名是否截止
				isQR:0,// 是否是扫码进入 ，是 1 ，不是 0
				isDuringActivity:false, // 是否在活动时间范围内
				isOnReady:false // 文章是否加载完成
			}
		},
		computed:{
			...mapState('login',['inviteUserId','guidecode','isDisabledUser']),
			...mapState('poster',['shareInfo']),
			...mapGetters('login',['isLogin']),
			getDetailForActivity(){ 
				if(this.code){ 
					this.getData()
				}
				return this.isLogin
			},
			getApplyData(){
				if(this.detail){
					let limitStr=""
					let {applyCount, applyNumLimit} = this.detail
					if(applyNumLimit){
						limitStr = `<span style='color:#999999;font-size:28upx'> /${applyNumLimit}</span>人`
					}else{
						limitStr = `<span style='color:#999999;font-size:28upx'> /人数不限</span>`
					}
					return '已报名'+ applyCount+ limitStr
				}
			},
			showTip(){
				// 已登录 && 已注册 && 页面加载完成 && 在活动期间 && 未签到 
				if(this.detail){
					const getPhone = uni.getStorageSync('getPhone');
					if(this.isLogin&&!getPhone&&this.isOnReady&&this.detail.signStatus===false){
						this.showSignTip()
					}
				}
				return true
			}
		},
		onLoad(options) {
			let {code,scene} = options
			this.isQR = 0
			if(scene&&/^S/.test(scene)) {
				this.isQR = 1 //扫码进入
				code = scene.split('S')[1]
				doActivityStatistics({
					modelCode:code, 
					no: 6// 识别小程序吗
				}) 
			}
			this.code = code
			if(this.isQR===1){
				// mixin
				this.getRedirectUrl()
			}
		},
		onShareAppMessage(res){
			// 统计分享数据
			doActivityStatistics({ 
				modelCode:this.code,
				no: 2// 分享
			})
			let {title,image,path} = this.shareInfo
			return {
				title:title,
				imageUrl:image,
				path:path
			}
		},
		methods:{
			...mapActions('activity',['getDetail','apply','getApplyTimeStatus']),
			...mapMutations('activity',['GETACTIVITYDETAIL']),
			...mapMutations('poster',['GETSHAREINFO']),
			ready(){
				this.isOnReady = true
			},
			// 签到提示
			showSignTip(){
				// 扫码进入 && 在活动期间 && 已报名
				if(this.isQR===1&&this.isDuringActivity&&this.detail.isApply){
					this.detail.signStatus = true
					const {integral} = this.detail
					uni.showModal({
						title:"提示",
						content:integral?"您已签到，获得"+integral+"积分~":"您已签到~",
						showCancel:false
					})
				}
			},
			// 在活动时间 或者 报名时间 范围内扫码则可签到成功
			isInActivity(activity_start,activity_end,apply_start,apply_end){
				let nowStr = new Date().getTime()
				let activity_startStr = new Date(activity_start.replace(/-/g,"/")).getTime()
				let activity_endStr = new Date(activity_end.replace(/-/g,"/")).getTime()
				let apply_startStr = new Date(apply_start.replace(/-/g,"/")).getTime()
				let apply_endStr = new Date(apply_end.replace(/-/g,"/")).getTime()
				return (nowStr>=activity_startStr&&activity_endStr>=nowStr) || (nowStr>=apply_startStr&&apply_endStr>=nowStr)
			},
			async getData(isRefresh){
				this.isLoading = true
				let response = await this.getDetail({
					activityCode:this.code,
					isQR:this.isQR
				})
				if(isRefresh) uni.stopPullDownRefresh();
				if(response.code == 200){
					let detail = {...response.data}
					this.isDuringActivity = this.isInActivity(detail.activityStartTime,detail.activityEndTime,detail.applyStartTime,detail.applyEndTime)
					uni.setNavigationBarTitle({title:detail.title})
					detail.city = (detail.city == "市辖区" || detail.city == "县" || !detail.city || detail.city == "自治区直辖县级行政区划")? detail.province: detail.city;
					detail.activityStartTime = getFullDate(detail.activityStartTime.replace(/-/g,"/")) // ios上是不识别“yyyy-MM-dd HH:mm:ss” 需要通过“/”来分隔
					detail.activityEndTime = getFullDate(detail.activityEndTime.replace(/-/g,"/"))
					detail.applyStartTime = getFullDate(detail.applyStartTime.replace(/-/g,"/"))
					detail.applyEndTime = getFullDate(detail.applyEndTime.replace(/-/g,"/"))
					this.detail = detail
					this.levelLimit = this.getLevelLimit()
					// this.canCancel = this.getCanCancel()
					// this.canApply = this.getCanApply()
					let {shareTitle,title,shareImg,previewImg} = response.data
					// mixins
					this.setShareInfo(shareTitle,title,shareImg,previewImg,'activity')
					if(isRefresh){
						uni.showToast({
							title:"已刷新",
							icon: "none"
						})
					}
				}
				this.isLoading = false
			},
			
			getLevelLimit(){
				let {lowestLevel,lowestMoney} = this.detail
				let level = lowestLevel?lowestLevel+'及以上会员可参与；':'';
				let money = ''//lowestMoney?'<br/>年消费金额'+lowestMoney+'元及以上会员可参与':''
				return level + money
			},
			// getCanCancel(){
			// 	let now = new Date().getTime()
			// 	let {applyEndTime} = this.detail
			// 	let endTime = new  Date(applyEndTime).getTime()
			// 	return  now <= endTime
			// },
			// getCanApply(){
			// 	let now = new Date().getTime()
			// 	let {applyStartTime} = this.detail
			// 	let startTime = new  Date(applyStartTime).getTime()
			// 	return startTime<=now
			// },
			// 弹窗相关
			// 点击modal 确定按钮
			confirm(){
				switch(this.modalType){
					case 1:
						this.signUp();
					break;
					case 2:
						this.cancelSignUp();
					break;
					case 3:
						this.hideModal();
					break;
					default:
						this.hideModal();
					break;
				}
			},
			// 确定报名
			signUp:debounce(async function(){
				if(this.isDisabledUser){
					abnormalprompt()
					return
				}
				uni.showLoading({
					title:"请求中...",
					mask:true
				})
				let response = await this.apply({
					activityCode:this.code,
					status: 0 // 报名
				})
				if(response.code == 200){
					this.detail.isApply = true
					uni.hideLoading()
					this.detail.applyCount++
					if(this.isQR===1&&this.isDuringActivity&&this.detail.isApply){
						this.detail.signStatus = true
					}
					this.getModal("share")
				}
			},300),
			// 取消报名
			cancelSignUp:debounce(async function(){
				if(this.isDisabledUser){
					abnormalprompt()
					return
				}
				uni.showLoading({
					title:"请求中...",
					mask:true
				})
				let response = await this.apply({
					activityCode:this.code,
					status: 1 // 取消报名
				})
				if(response.code == 200){
					this.detail.isApply = false
					uni.hideLoading()
					this.detail.applyCount--
					this.getModal('signUp','您已取消报名！',3)
				}
			},300),
			// 隐藏弹窗
			hideModal(){
				this.getModal("");
			},
			// 显示弹窗
			async getModal(modalName,title,modalType){
				const isLogin = await this.$refs.login.checkLogin()
				if(!isLogin){
					return
				}
				if(this.isDisabledUser){
					abnormalprompt()
					return
				}
				let canSign = await this.checkCanSignUp(modalType || this.modalType);
				if(canSign){
					this.modalName= modalName;
					this.title = title || this.title;
					this.modalType = modalType || this.modalType;
				}
			},
			// 点击我要报名，判断是否在报名时间范围内
			async checkCanSignUp(modalType){
				let canSignUp = true
				let response = await this.getApplyTimeStatus({activityCode:this.code})
				if(response.code == 200){
					if(modalType === 1){
						if(response.data === -1){
							uni.showToast({
								title:"报名还未开始，晚点再来吧~",
								icon: "none"
							})
							canSignUp = false
						}
						if(response.data === -2){
							uni.showToast({
								title:"报名已经结束啦，下次早点来吧~",
								icon: "none"
							})
							canSignUp = false
						}
					}
				}
				return canSignUp
			},
			goShare(){
				uni.navigateTo({
					url:'/pages/poster/index'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	/*!
	 * Quill Editor v1.3.7
	 * https://quilljs.com/
	 * Copyright (c) 2014, Jason Chen
	 * Copyright (c) 2013, salesforce.com
	 */
	.ql-container {
	  box-sizing: border-box;
	  font-family: Helvetica, Arial, sans-serif;
	  font-size: 13px;
	  height: 100%;
	  margin: 0px;
	  position: relative;
	}
	.ql-container.ql-disabled .ql-tooltip {
	  visibility: hidden;
	}
	.ql-container.ql-disabled .ql-editor ul[data-checked] > li::before {
	  pointer-events: none;
	}
	.ql-clipboard {
	  left: -100000px;
	  height: 1px;
	  overflow-y: hidden;
	  position: absolute;
	  top: 50%;
	}
	.ql-clipboard p {
	  margin: 0;
	  padding: 0;
	}
	.ql-editor {
	  box-sizing: border-box;
	  line-height: 1.42;
	  height: 100%;
	  outline: none;
	  overflow-y: auto;
	  padding: 12px 15px;
	  -o-tab-size: 4;
	     tab-size: 4;
	  -moz-tab-size: 4;
	  text-align: left;
	  white-space: pre-wrap;
	  word-wrap: break-word;
	}
	.ql-editor > * {
	  cursor: text;
	}
	.ql-editor p,
	.ql-editor ol,
	.ql-editor ul,
	.ql-editor pre,
	.ql-editor blockquote,
	.ql-editor h1,
	.ql-editor h2,
	.ql-editor h3,
	.ql-editor h4,
	.ql-editor h5,
	.ql-editor h6 {
	  margin: 0;
	  padding: 0;
	  counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
	}
	.ql-editor ol,
	.ql-editor ul {
	  padding-left: 1.5em;
	}
	.ql-editor ol > li,
	.ql-editor ul > li {
	  list-style-type: none;
	}
	.ql-editor ul > li::before {
	  content: '\2022';
	}
	.ql-editor ul[data-checked=true],
	.ql-editor ul[data-checked=false] {
	  pointer-events: none;
	}
	.ql-editor ul[data-checked=true] > li *,
	.ql-editor ul[data-checked=false] > li * {
	  pointer-events: all;
	}
	.ql-editor ul[data-checked=true] > li::before,
	.ql-editor ul[data-checked=false] > li::before {
	  color: #777;
	  cursor: pointer;
	  pointer-events: all;
	}
	.ql-editor ul[data-checked=true] > li::before {
	  content: '\2611';
	}
	.ql-editor ul[data-checked=false] > li::before {
	  content: '\2610';
	}
	.ql-editor li::before {
	  display: inline-block;
	  white-space: nowrap;
	  width: 1.2em;
	}
	.ql-editor li:not(.ql-direction-rtl)::before {
	  margin-left: -1.5em;
	  margin-right: 0.3em;
	  text-align: right;
	}
	.ql-editor li.ql-direction-rtl::before {
	  margin-left: 0.3em;
	  margin-right: -1.5em;
	}
	.ql-editor ol li:not(.ql-direction-rtl),
	.ql-editor ul li:not(.ql-direction-rtl) {
	  padding-left: 1.5em;
	}
	.ql-editor ol li.ql-direction-rtl,
	.ql-editor ul li.ql-direction-rtl {
	  padding-right: 1.5em;
	}
	.ql-editor ol li {
	  counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
	  counter-increment: list-0;
	}
	.ql-editor ol li:before {
	  content: counter(list-0, decimal) '. ';
	}
	.ql-editor ol li.ql-indent-1 {
	  counter-increment: list-1;
	}
	.ql-editor ol li.ql-indent-1:before {
	  content: counter(list-1, lower-alpha) '. ';
	}
	.ql-editor ol li.ql-indent-1 {
	  counter-reset: list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
	}
	.ql-editor ol li.ql-indent-2 {
	  counter-increment: list-2;
	}
	.ql-editor ol li.ql-indent-2:before {
	  content: counter(list-2, lower-roman) '. ';
	}
	.ql-editor ol li.ql-indent-2 {
	  counter-reset: list-3 list-4 list-5 list-6 list-7 list-8 list-9;
	}
	.ql-editor ol li.ql-indent-3 {
	  counter-increment: list-3;
	}
	.ql-editor ol li.ql-indent-3:before {
	  content: counter(list-3, decimal) '. ';
	}
	.ql-editor ol li.ql-indent-3 {
	  counter-reset: list-4 list-5 list-6 list-7 list-8 list-9;
	}
	.ql-editor ol li.ql-indent-4 {
	  counter-increment: list-4;
	}
	.ql-editor ol li.ql-indent-4:before {
	  content: counter(list-4, lower-alpha) '. ';
	}
	.ql-editor ol li.ql-indent-4 {
	  counter-reset: list-5 list-6 list-7 list-8 list-9;
	}
	.ql-editor ol li.ql-indent-5 {
	  counter-increment: list-5;
	}
	.ql-editor ol li.ql-indent-5:before {
	  content: counter(list-5, lower-roman) '. ';
	}
	.ql-editor ol li.ql-indent-5 {
	  counter-reset: list-6 list-7 list-8 list-9;
	}
	.ql-editor ol li.ql-indent-6 {
	  counter-increment: list-6;
	}
	.ql-editor ol li.ql-indent-6:before {
	  content: counter(list-6, decimal) '. ';
	}
	.ql-editor ol li.ql-indent-6 {
	  counter-reset: list-7 list-8 list-9;
	}
	.ql-editor ol li.ql-indent-7 {
	  counter-increment: list-7;
	}
	.ql-editor ol li.ql-indent-7:before {
	  content: counter(list-7, lower-alpha) '. ';
	}
	.ql-editor ol li.ql-indent-7 {
	  counter-reset: list-8 list-9;
	}
	.ql-editor ol li.ql-indent-8 {
	  counter-increment: list-8;
	}
	.ql-editor ol li.ql-indent-8:before {
	  content: counter(list-8, lower-roman) '. ';
	}
	.ql-editor ol li.ql-indent-8 {
	  counter-reset: list-9;
	}
	.ql-editor ol li.ql-indent-9 {
	  counter-increment: list-9;
	}
	.ql-editor ol li.ql-indent-9:before {
	  content: counter(list-9, decimal) '. ';
	}
	.ql-editor .ql-indent-1:not(.ql-direction-rtl) {
	  padding-left: 3em;
	}
	.ql-editor li.ql-indent-1:not(.ql-direction-rtl) {
	  padding-left: 4.5em;
	}
	.ql-editor .ql-indent-1.ql-direction-rtl.ql-align-right {
	  padding-right: 3em;
	}
	.ql-editor li.ql-indent-1.ql-direction-rtl.ql-align-right {
	  padding-right: 4.5em;
	}
	.ql-editor .ql-indent-2:not(.ql-direction-rtl) {
	  padding-left: 6em;
	}
	.ql-editor li.ql-indent-2:not(.ql-direction-rtl) {
	  padding-left: 7.5em;
	}
	.ql-editor .ql-indent-2.ql-direction-rtl.ql-align-right {
	  padding-right: 6em;
	}
	.ql-editor li.ql-indent-2.ql-direction-rtl.ql-align-right {
	  padding-right: 7.5em;
	}
	.ql-editor .ql-indent-3:not(.ql-direction-rtl) {
	  padding-left: 9em;
	}
	.ql-editor li.ql-indent-3:not(.ql-direction-rtl) {
	  padding-left: 10.5em;
	}
	.ql-editor .ql-indent-3.ql-direction-rtl.ql-align-right {
	  padding-right: 9em;
	}
	.ql-editor li.ql-indent-3.ql-direction-rtl.ql-align-right {
	  padding-right: 10.5em;
	}
	.ql-editor .ql-indent-4:not(.ql-direction-rtl) {
	  padding-left: 12em;
	}
	.ql-editor li.ql-indent-4:not(.ql-direction-rtl) {
	  padding-left: 13.5em;
	}
	.ql-editor .ql-indent-4.ql-direction-rtl.ql-align-right {
	  padding-right: 12em;
	}
	.ql-editor li.ql-indent-4.ql-direction-rtl.ql-align-right {
	  padding-right: 13.5em;
	}
	.ql-editor .ql-indent-5:not(.ql-direction-rtl) {
	  padding-left: 15em;
	}
	.ql-editor li.ql-indent-5:not(.ql-direction-rtl) {
	  padding-left: 16.5em;
	}
	.ql-editor .ql-indent-5.ql-direction-rtl.ql-align-right {
	  padding-right: 15em;
	}
	.ql-editor li.ql-indent-5.ql-direction-rtl.ql-align-right {
	  padding-right: 16.5em;
	}
	.ql-editor .ql-indent-6:not(.ql-direction-rtl) {
	  padding-left: 18em;
	}
	.ql-editor li.ql-indent-6:not(.ql-direction-rtl) {
	  padding-left: 19.5em;
	}
	.ql-editor .ql-indent-6.ql-direction-rtl.ql-align-right {
	  padding-right: 18em;
	}
	.ql-editor li.ql-indent-6.ql-direction-rtl.ql-align-right {
	  padding-right: 19.5em;
	}
	.ql-editor .ql-indent-7:not(.ql-direction-rtl) {
	  padding-left: 21em;
	}
	.ql-editor li.ql-indent-7:not(.ql-direction-rtl) {
	  padding-left: 22.5em;
	}
	.ql-editor .ql-indent-7.ql-direction-rtl.ql-align-right {
	  padding-right: 21em;
	}
	.ql-editor li.ql-indent-7.ql-direction-rtl.ql-align-right {
	  padding-right: 22.5em;
	}
	.ql-editor .ql-indent-8:not(.ql-direction-rtl) {
	  padding-left: 24em;
	}
	.ql-editor li.ql-indent-8:not(.ql-direction-rtl) {
	  padding-left: 25.5em;
	}
	.ql-editor .ql-indent-8.ql-direction-rtl.ql-align-right {
	  padding-right: 24em;
	}
	.ql-editor li.ql-indent-8.ql-direction-rtl.ql-align-right {
	  padding-right: 25.5em;
	}
	.ql-editor .ql-indent-9:not(.ql-direction-rtl) {
	  padding-left: 27em;
	}
	.ql-editor li.ql-indent-9:not(.ql-direction-rtl) {
	  padding-left: 28.5em;
	}
	.ql-editor .ql-indent-9.ql-direction-rtl.ql-align-right {
	  padding-right: 27em;
	}
	.ql-editor li.ql-indent-9.ql-direction-rtl.ql-align-right {
	  padding-right: 28.5em;
	}
	.ql-editor .ql-video {
	  display: block;
	  max-width: 100%;
	}
	.ql-editor .ql-video.ql-align-center {
	  margin: 0 auto;
	}
	.ql-editor .ql-video.ql-align-right {
	  margin: 0 0 0 auto;
	}
	.ql-editor .ql-bg-black {
	  background-color: #000;
	}
	.ql-editor .ql-bg-red {
	  background-color: #e60000;
	}
	.ql-editor .ql-bg-orange {
	  background-color: #f90;
	}
	.ql-editor .ql-bg-yellow {
	  background-color: #ff0;
	}
	.ql-editor .ql-bg-green {
	  background-color: #008a00;
	}
	.ql-editor .ql-bg-blue {
	  background-color: #06c;
	}
	.ql-editor .ql-bg-purple {
	  background-color: #93f;
	}
	.ql-editor .ql-color-white {
	  color: #fff;
	}
	.ql-editor .ql-color-red {
	  color: #e60000;
	}
	.ql-editor .ql-color-orange {
	  color: #f90;
	}
	.ql-editor .ql-color-yellow {
	  color: #ff0;
	}
	.ql-editor .ql-color-green {
	  color: #008a00;
	}
	.ql-editor .ql-color-blue {
	  color: #06c;
	}
	.ql-editor .ql-color-purple {
	  color: #93f;
	}
	.ql-editor .ql-font-serif {
	  font-family: Georgia, Times New Roman, serif;
	}
	.ql-editor .ql-font-monospace {
	  font-family: Monaco, Courier New, monospace;
	}
	.ql-editor .ql-size-small {
	  font-size: 0.75em;
	}
	.ql-editor .ql-size-large {
	  font-size: 1.5em;
	}
	.ql-editor .ql-size-huge {
	  font-size: 2.5em;
	}
	.ql-editor .ql-direction-rtl {
	  direction: rtl;
	  text-align: inherit;
	}
	.ql-editor .ql-align-center {
	  text-align: center;
	}
	.ql-editor .ql-align-justify {
	  text-align: justify;
	}
	.ql-editor .ql-align-right {
	  text-align: right;
	}
	.ql-editor.ql-blank::before {
	  color: rgba(0,0,0,0.6);
	  content: attr(data-placeholder);
	  font-style: italic;
	  left: 15px;
	  pointer-events: none;
	  position: absolute;
	  right: 15px;
	}
	.ql-bubble.ql-toolbar:after,
	.ql-bubble .ql-toolbar:after {
	  clear: both;
	  content: '';
	  display: table;
	}
	.ql-bubble.ql-toolbar button,
	.ql-bubble .ql-toolbar button {
	  background: none;
	  border: none;
	  cursor: pointer;
	  display: inline-block;
	  float: left;
	  height: 24px;
	  padding: 3px 5px;
	  width: 28px;
	}
	.ql-bubble.ql-toolbar button svg,
	.ql-bubble .ql-toolbar button svg {
	  float: left;
	  height: 100%;
	}
	.ql-bubble.ql-toolbar button:active:hover,
	.ql-bubble .ql-toolbar button:active:hover {
	  outline: none;
	}
	.ql-bubble.ql-toolbar input.ql-image[type=file],
	.ql-bubble .ql-toolbar input.ql-image[type=file] {
	  display: none;
	}
	.ql-bubble.ql-toolbar button:hover,
	.ql-bubble .ql-toolbar button:hover,
	.ql-bubble.ql-toolbar button:focus,
	.ql-bubble .ql-toolbar button:focus,
	.ql-bubble.ql-toolbar button.ql-active,
	.ql-bubble .ql-toolbar button.ql-active,
	.ql-bubble.ql-toolbar .ql-picker-label:hover,
	.ql-bubble .ql-toolbar .ql-picker-label:hover,
	.ql-bubble.ql-toolbar .ql-picker-label.ql-active,
	.ql-bubble .ql-toolbar .ql-picker-label.ql-active,
	.ql-bubble.ql-toolbar .ql-picker-item:hover,
	.ql-bubble .ql-toolbar .ql-picker-item:hover,
	.ql-bubble.ql-toolbar .ql-picker-item.ql-selected,
	.ql-bubble .ql-toolbar .ql-picker-item.ql-selected {
	  color: #fff;
	}
	.ql-bubble.ql-toolbar button:hover .ql-fill,
	.ql-bubble .ql-toolbar button:hover .ql-fill,
	.ql-bubble.ql-toolbar button:focus .ql-fill,
	.ql-bubble .ql-toolbar button:focus .ql-fill,
	.ql-bubble.ql-toolbar button.ql-active .ql-fill,
	.ql-bubble .ql-toolbar button.ql-active .ql-fill,
	.ql-bubble.ql-toolbar .ql-picker-label:hover .ql-fill,
	.ql-bubble .ql-toolbar .ql-picker-label:hover .ql-fill,
	.ql-bubble.ql-toolbar .ql-picker-label.ql-active .ql-fill,
	.ql-bubble .ql-toolbar .ql-picker-label.ql-active .ql-fill,
	.ql-bubble.ql-toolbar .ql-picker-item:hover .ql-fill,
	.ql-bubble .ql-toolbar .ql-picker-item:hover .ql-fill,
	.ql-bubble.ql-toolbar .ql-picker-item.ql-selected .ql-fill,
	.ql-bubble .ql-toolbar .ql-picker-item.ql-selected .ql-fill,
	.ql-bubble.ql-toolbar button:hover .ql-stroke.ql-fill,
	.ql-bubble .ql-toolbar button:hover .ql-stroke.ql-fill,
	.ql-bubble.ql-toolbar button:focus .ql-stroke.ql-fill,
	.ql-bubble .ql-toolbar button:focus .ql-stroke.ql-fill,
	.ql-bubble.ql-toolbar button.ql-active .ql-stroke.ql-fill,
	.ql-bubble .ql-toolbar button.ql-active .ql-stroke.ql-fill,
	.ql-bubble.ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,
	.ql-bubble .ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,
	.ql-bubble.ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,
	.ql-bubble .ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,
	.ql-bubble.ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,
	.ql-bubble .ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,
	.ql-bubble.ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill,
	.ql-bubble .ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill {
	  fill: #fff;
	}
	.ql-bubble.ql-toolbar button:hover .ql-stroke,
	.ql-bubble .ql-toolbar button:hover .ql-stroke,
	.ql-bubble.ql-toolbar button:focus .ql-stroke,
	.ql-bubble .ql-toolbar button:focus .ql-stroke,
	.ql-bubble.ql-toolbar button.ql-active .ql-stroke,
	.ql-bubble .ql-toolbar button.ql-active .ql-stroke,
	.ql-bubble.ql-toolbar .ql-picker-label:hover .ql-stroke,
	.ql-bubble .ql-toolbar .ql-picker-label:hover .ql-stroke,
	.ql-bubble.ql-toolbar .ql-picker-label.ql-active .ql-stroke,
	.ql-bubble .ql-toolbar .ql-picker-label.ql-active .ql-stroke,
	.ql-bubble.ql-toolbar .ql-picker-item:hover .ql-stroke,
	.ql-bubble .ql-toolbar .ql-picker-item:hover .ql-stroke,
	.ql-bubble.ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
	.ql-bubble .ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
	.ql-bubble.ql-toolbar button:hover .ql-stroke-miter,
	.ql-bubble .ql-toolbar button:hover .ql-stroke-miter,
	.ql-bubble.ql-toolbar button:focus .ql-stroke-miter,
	.ql-bubble .ql-toolbar button:focus .ql-stroke-miter,
	.ql-bubble.ql-toolbar button.ql-active .ql-stroke-miter,
	.ql-bubble .ql-toolbar button.ql-active .ql-stroke-miter,
	.ql-bubble.ql-toolbar .ql-picker-label:hover .ql-stroke-miter,
	.ql-bubble .ql-toolbar .ql-picker-label:hover .ql-stroke-miter,
	.ql-bubble.ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,
	.ql-bubble .ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,
	.ql-bubble.ql-toolbar .ql-picker-item:hover .ql-stroke-miter,
	.ql-bubble .ql-toolbar .ql-picker-item:hover .ql-stroke-miter,
	.ql-bubble.ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter,
	.ql-bubble .ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter {
	  stroke: #fff;
	}
	@media (pointer: coarse) {
	  .ql-bubble.ql-toolbar button:hover:not(.ql-active),
	  .ql-bubble .ql-toolbar button:hover:not(.ql-active) {
	    color: #ccc;
	  }
	  .ql-bubble.ql-toolbar button:hover:not(.ql-active) .ql-fill,
	  .ql-bubble .ql-toolbar button:hover:not(.ql-active) .ql-fill,
	  .ql-bubble.ql-toolbar button:hover:not(.ql-active) .ql-stroke.ql-fill,
	  .ql-bubble .ql-toolbar button:hover:not(.ql-active) .ql-stroke.ql-fill {
	    fill: #ccc;
	  }
	  .ql-bubble.ql-toolbar button:hover:not(.ql-active) .ql-stroke,
	  .ql-bubble .ql-toolbar button:hover:not(.ql-active) .ql-stroke,
	  .ql-bubble.ql-toolbar button:hover:not(.ql-active) .ql-stroke-miter,
	  .ql-bubble .ql-toolbar button:hover:not(.ql-active) .ql-stroke-miter {
	    stroke: #ccc;
	  }
	}
	.ql-bubble {
	  box-sizing: border-box;
	}
	.ql-bubble * {
	  box-sizing: border-box;
	}
	.ql-bubble .ql-hidden {
	  display: none;
	}
	.ql-bubble .ql-out-bottom,
	.ql-bubble .ql-out-top {
	  visibility: hidden;
	}
	.ql-bubble .ql-tooltip {
	  position: absolute;
	  transform: translateY(10px);
	}
	.ql-bubble .ql-tooltip a {
	  cursor: pointer;
	  text-decoration: none;
	}
	.ql-bubble .ql-tooltip.ql-flip {
	  transform: translateY(-10px);
	}
	.ql-bubble .ql-formats {
	  display: inline-block;
	  vertical-align: middle;
	}
	.ql-bubble .ql-formats:after {
	  clear: both;
	  content: '';
	  display: table;
	}
	.ql-bubble .ql-stroke {
	  fill: none;
	  stroke: #ccc;
	  stroke-linecap: round;
	  stroke-linejoin: round;
	  stroke-width: 2;
	}
	.ql-bubble .ql-stroke-miter {
	  fill: none;
	  stroke: #ccc;
	  stroke-miterlimit: 10;
	  stroke-width: 2;
	}
	.ql-bubble .ql-fill,
	.ql-bubble .ql-stroke.ql-fill {
	  fill: #ccc;
	}
	.ql-bubble .ql-empty {
	  fill: none;
	}
	.ql-bubble .ql-even {
	  fill-rule: evenodd;
	}
	.ql-bubble .ql-thin,
	.ql-bubble .ql-stroke.ql-thin {
	  stroke-width: 1;
	}
	.ql-bubble .ql-transparent {
	  opacity: 0.4;
	}
	.ql-bubble .ql-direction svg:last-child {
	  display: none;
	}
	.ql-bubble .ql-direction.ql-active svg:last-child {
	  display: inline;
	}
	.ql-bubble .ql-direction.ql-active svg:first-child {
	  display: none;
	}
	.ql-bubble .ql-editor h1 {
	  font-size: 2em;
	}
	.ql-bubble .ql-editor h2 {
	  font-size: 1.5em;
	}
	.ql-bubble .ql-editor h3 {
	  font-size: 1.17em;
	}
	.ql-bubble .ql-editor h4 {
	  font-size: 1em;
	}
	.ql-bubble .ql-editor h5 {
	  font-size: 0.83em;
	}
	.ql-bubble .ql-editor h6 {
	  font-size: 0.67em;
	}
	.ql-bubble .ql-editor a {
	  text-decoration: underline;
	}
	.ql-bubble .ql-editor blockquote {
	  border-left: 4px solid #ccc;
	  margin-bottom: 5px;
	  margin-top: 5px;
	  padding-left: 16px;
	}
	.ql-bubble .ql-editor code,
	.ql-bubble .ql-editor pre {
	  background-color: #f0f0f0;
	  border-radius: 3px;
	}
	.ql-bubble .ql-editor pre {
	  white-space: pre-wrap;
	  margin-bottom: 5px;
	  margin-top: 5px;
	  padding: 5px 10px;
	}
	.ql-bubble .ql-editor code {
	  font-size: 85%;
	  padding: 2px 4px;
	}
	.ql-bubble .ql-editor pre.ql-syntax {
	  background-color: #23241f;
	  color: #f8f8f2;
	  overflow: visible;
	}
	.ql-bubble .ql-editor img {
	  max-width: 100%;
	}
	.ql-bubble .ql-picker {
	  color: #ccc;
	  display: inline-block;
	  float: left;
	  font-size: 14px;
	  font-weight: 500;
	  height: 24px;
	  position: relative;
	  vertical-align: middle;
	}
	.ql-bubble .ql-picker-label {
	  cursor: pointer;
	  display: inline-block;
	  height: 100%;
	  padding-left: 8px;
	  padding-right: 2px;
	  position: relative;
	  width: 100%;
	}
	.ql-bubble .ql-picker-label::before {
	  display: inline-block;
	  line-height: 22px;
	}
	.ql-bubble .ql-picker-options {
	  background-color: #444;
	  display: none;
	  min-width: 100%;
	  padding: 4px 8px;
	  position: absolute;
	  white-space: nowrap;
	}
	.ql-bubble .ql-picker-options .ql-picker-item {
	  cursor: pointer;
	  display: block;
	  padding-bottom: 5px;
	  padding-top: 5px;
	}
	.ql-bubble .ql-picker.ql-expanded .ql-picker-label {
	  color: #777;
	  z-index: 2;
	}
	.ql-bubble .ql-picker.ql-expanded .ql-picker-label .ql-fill {
	  fill: #777;
	}
	.ql-bubble .ql-picker.ql-expanded .ql-picker-label .ql-stroke {
	  stroke: #777;
	}
	.ql-bubble .ql-picker.ql-expanded .ql-picker-options {
	  display: block;
	  margin-top: -1px;
	  top: 100%;
	  z-index: 1;
	}
	.ql-bubble .ql-color-picker,
	.ql-bubble .ql-icon-picker {
	  width: 28px;
	}
	.ql-bubble .ql-color-picker .ql-picker-label,
	.ql-bubble .ql-icon-picker .ql-picker-label {
	  padding: 2px 4px;
	}
	.ql-bubble .ql-color-picker .ql-picker-label svg,
	.ql-bubble .ql-icon-picker .ql-picker-label svg {
	  right: 4px;
	}
	.ql-bubble .ql-icon-picker .ql-picker-options {
	  padding: 4px 0px;
	}
	.ql-bubble .ql-icon-picker .ql-picker-item {
	  height: 24px;
	  width: 24px;
	  padding: 2px 4px;
	}
	.ql-bubble .ql-color-picker .ql-picker-options {
	  padding: 3px 5px;
	  width: 152px;
	}
	.ql-bubble .ql-color-picker .ql-picker-item {
	  border: 1px solid transparent;
	  float: left;
	  height: 16px;
	  margin: 2px;
	  padding: 0px;
	  width: 16px;
	}
	.ql-bubble .ql-picker:not(.ql-color-picker):not(.ql-icon-picker) svg {
	  position: absolute;
	  margin-top: -9px;
	  right: 0;
	  top: 50%;
	  width: 18px;
	}
	.ql-bubble .ql-picker.ql-header .ql-picker-label[data-label]:not([data-label=''])::before,
	.ql-bubble .ql-picker.ql-font .ql-picker-label[data-label]:not([data-label=''])::before,
	.ql-bubble .ql-picker.ql-size .ql-picker-label[data-label]:not([data-label=''])::before,
	.ql-bubble .ql-picker.ql-header .ql-picker-item[data-label]:not([data-label=''])::before,
	.ql-bubble .ql-picker.ql-font .ql-picker-item[data-label]:not([data-label=''])::before,
	.ql-bubble .ql-picker.ql-size .ql-picker-item[data-label]:not([data-label=''])::before {
	  content: attr(data-label);
	}
	.ql-bubble .ql-picker.ql-header {
	  width: 98px;
	}
	.ql-bubble .ql-picker.ql-header .ql-picker-label::before,
	.ql-bubble .ql-picker.ql-header .ql-picker-item::before {
	  content: 'Normal';
	}
	.ql-bubble .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
	.ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
	  content: 'Heading 1';
	}
	.ql-bubble .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
	.ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
	  content: 'Heading 2';
	}
	.ql-bubble .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
	.ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
	  content: 'Heading 3';
	}
	.ql-bubble .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
	.ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
	  content: 'Heading 4';
	}
	.ql-bubble .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
	.ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
	  content: 'Heading 5';
	}
	.ql-bubble .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
	.ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
	  content: 'Heading 6';
	}
	.ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
	  font-size: 2em;
	}
	.ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
	  font-size: 1.5em;
	}
	.ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
	  font-size: 1.17em;
	}
	.ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
	  font-size: 1em;
	}
	.ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
	  font-size: 0.83em;
	}
	.ql-bubble .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
	  font-size: 0.67em;
	}
	.ql-bubble .ql-picker.ql-font {
	  width: 108px;
	}
	.ql-bubble .ql-picker.ql-font .ql-picker-label::before,
	.ql-bubble .ql-picker.ql-font .ql-picker-item::before {
	  content: 'Sans Serif';
	}
	.ql-bubble .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
	.ql-bubble .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
	  content: 'Serif';
	}
	.ql-bubble .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
	.ql-bubble .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
	  content: 'Monospace';
	}
	.ql-bubble .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
	  font-family: Georgia, Times New Roman, serif;
	}
	.ql-bubble .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
	  font-family: Monaco, Courier New, monospace;
	}
	.ql-bubble .ql-picker.ql-size {
	  width: 98px;
	}
	.ql-bubble .ql-picker.ql-size .ql-picker-label::before,
	.ql-bubble .ql-picker.ql-size .ql-picker-item::before {
	  content: 'Normal';
	}
	.ql-bubble .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
	.ql-bubble .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
	  content: 'Small';
	}
	.ql-bubble .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
	.ql-bubble .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
	  content: 'Large';
	}
	.ql-bubble .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
	.ql-bubble .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
	  content: 'Huge';
	}
	.ql-bubble .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
	  font-size: 10px;
	}
	.ql-bubble .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
	  font-size: 18px;
	}
	.ql-bubble .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
	  font-size: 32px;
	}
	.ql-bubble .ql-color-picker.ql-background .ql-picker-item {
	  background-color: #fff;
	}
	.ql-bubble .ql-color-picker.ql-color .ql-picker-item {
	  background-color: #000;
	}
	.ql-bubble .ql-toolbar .ql-formats {
	  margin: 8px 12px 8px 0px;
	}
	.ql-bubble .ql-toolbar .ql-formats:first-child {
	  margin-left: 12px;
	}
	.ql-bubble .ql-color-picker svg {
	  margin: 1px;
	}
	.ql-bubble .ql-color-picker .ql-picker-item.ql-selected,
	.ql-bubble .ql-color-picker .ql-picker-item:hover {
	  border-color: #fff;
	}
	.ql-bubble .ql-tooltip {
	  background-color: #444;
	  border-radius: 25px;
	  color: #fff;
	}
	.ql-bubble .ql-tooltip-arrow {
	  border-left: 6px solid transparent;
	  border-right: 6px solid transparent;
	  content: " ";
	  display: block;
	  left: 50%;
	  margin-left: -6px;
	  position: absolute;
	}
	.ql-bubble .ql-tooltip:not(.ql-flip) .ql-tooltip-arrow {
	  border-bottom: 6px solid #444;
	  top: -6px;
	}
	.ql-bubble .ql-tooltip.ql-flip .ql-tooltip-arrow {
	  border-top: 6px solid #444;
	  bottom: -6px;
	}
	.ql-bubble .ql-tooltip.ql-editing .ql-tooltip-editor {
	  display: block;
	}
	.ql-bubble .ql-tooltip.ql-editing .ql-formats {
	  visibility: hidden;
	}
	.ql-bubble .ql-tooltip-editor {
	  display: none;
	}
	.ql-bubble .ql-tooltip-editor input[type=text] {
	  background: transparent;
	  border: none;
	  color: #fff;
	  font-size: 13px;
	  height: 100%;
	  outline: none;
	  padding: 10px 20px;
	  position: absolute;
	  width: 100%;
	}
	.ql-bubble .ql-tooltip-editor a {
	  top: 10px;
	  position: absolute;
	  right: 20px;
	}
	.ql-bubble .ql-tooltip-editor a:before {
	  color: #ccc;
	  content: "\D7";
	  font-size: 16px;
	  font-weight: bold;
	}
	.ql-container.ql-bubble:not(.ql-disabled) a {
	  position: relative;
	  white-space: nowrap;
	}
	.ql-container.ql-bubble:not(.ql-disabled) a::before {
	  background-color: #444;
	  border-radius: 15px;
	  top: -5px;
	  font-size: 12px;
	  color: #fff;
	  content: attr(href);
	  font-weight: normal;
	  overflow: hidden;
	  padding: 5px 15px;
	  text-decoration: none;
	  z-index: 1;
	}
	.ql-container.ql-bubble:not(.ql-disabled) a::after {
	  border-top: 6px solid #444;
	  border-left: 6px solid transparent;
	  border-right: 6px solid transparent;
	  top: 0;
	  content: " ";
	  height: 0;
	  width: 0;
	}
	.ql-container.ql-bubble:not(.ql-disabled) a::before,
	.ql-container.ql-bubble:not(.ql-disabled) a::after {
	  left: 0;
	  margin-left: 50%;
	  position: absolute;
	  transform: translate(-50%, -100%);
	  transition: visibility 0s ease 200ms;
	  visibility: hidden;
	}
	.ql-container.ql-bubble:not(.ql-disabled) a:hover::before,
	.ql-container.ql-bubble:not(.ql-disabled) a:hover::after {
	  visibility: visible;
	}
	.detail-wrapper{
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		background-color: #FFFFFF;
		padding-top: 40upx;
		.image{
			align-self: center;
			text-align: center;
			margin-bottom: 54upx;
			width: 100%;
			width:690upx;
			height:376upx;
			overflow: hidden;
			// box-shadow:10upx 17upx 50upx 0upx rgba(0, 0, 0, 0.1);
			border-radius:20upx;
			image{
				width:100%;
				height: 100%;
				display: block;
			}
		}
	}
	.activity-title{
		margin-bottom: 49upx;
		text {
			color: #2C3850;
			font-size: 34upx;
			font-weight:500;
			text-align: left;
		}
	}
	.activity-tip{
		color: #999999;
		font-size: 24upx;
		margin-top: 6upx;
		margin-bottom: 51upx;
		line-height:32upx;
	}
	.line{
		margin: 0 30upx;
		width: 690upx;
		height:2upx;
		margin-bottom: 51upx;
		background-color: rgba(204,204,204,0.1);
	}
	.btns-wrapper{
		width: 100%;
		margin-bottom: 61upx;
		.cu-btn{
			width:302upx;
			font-weight:500;
			height: 88upx;
			&[class*="lines-red"]::after {
				border: 2upx solid $aimer-color;
				box-shadow:4upx 10upx 35upx 0upx rgba(42,36,10,0.1);;
				border-radius: 20upx;
			}
			// 
			&[class*="lines-gray"]::after {
				box-shadow:4upx 10upx 35upx 0upx rgba(42,36,10,0.1);;
				border:2upx solid rgba(204,204,204,1);
				border-radius: 20upx;
			}
		}
	}

</style>
