<template>
	<view class="">
		<view style="padding-top: 48upx;">
			<!-- top -->
			<view class="padding-left flex justify-between" style="margin-bottom: 59upx;">
				<view class="flex flex-direction">
					<view class="title text-black">
						一分钟专业体态测评
					</view>
					<view class="title text-black">
						认识更真实的自己！
					</view>
					<view class="evaluate" @click="goEvaluation">
						<button class="cu-btn lines-red lg round flex align-center"><text>开始测评</text></button>
					</view>
					<view class="checkbtn" @click="goRecord">
						<text style="margin-right: 22upx;">查看历史测评记录</text>
						<text class="cuIcon-right text-xl"></text>
					</view>
				</view>
				<view class="padding-right-sm banner-image"> 
					<image src="/static/training/banner-right.png" mode="aspectFit"></image>
				</view>
			</view>
			<!-- 课程 -->
			<view class="bg-white" style="margin-top: 59upx;">
				<title :name="'体态管理课程'"></title>
				<view class="flex flex-direction" v-show="showAllCourse">
					<view class="padding-rl padding-top flex justify-between tab-btn align-center">
						<view class="flex-sub text-center flex align-center justify-center" @click="switchAllCategory">
							<text class="margin-right-sm text-lg active">全部课程</text>
							<view class="active" :class="{reserve:!showAllCategory}">
								<text class="cuIcon-unfold"></text>
							</view>
						</view>
						<view class="line"></view>
						<view class="text-gray flex-sub text-center text-lg" @click="switchCourse">我添加的课程</view>
					</view>
					<scroll-view scroll-x="true" enable-flex="true" style="height:70upx" class="scroll-view_H" v-show="showAllCategory">
						<button class="cu-btn round line-black margin-right" :class="{current:!classify}" @click="changeClassify('')">全部课程</button>
						<button class="cu-btn round line-black margin-right" @click="changeClassify(item.categoryName)" :class="{current:classify==item.categoryName}" v-for="(item,index) in classifyList" :key="index">{{item.categoryName}}</button>
					</scroll-view>
				</view>
				<view v-show="!showAllCourse" class="padding-lr padding-top flex justify-between tab-btn align-center">
					<view class="flex-sub text-center text-lg" @click="switchCourse">
						<text>全部课程</text>
					</view>
					<view class="line"></view>
					<view class="active flex-sub text-center text-lg" @click="switchCourse">我添加的课程</view>
				</view>
				<view style="padding-top: 30upx;" v-show="showAllCourse">
					<list-item-card-sm :list="course.list" @goDetail="goDetail" @add="addCourse"></list-item-card-sm>
					<empty-page v-if="courseIsEmpty" :image-height="'85px'" :top="'75px'" :noContent="'还没有课程'"></empty-page>
					<load-more :isLoad="courseIsLoading" :isShow="!courseIsEmpty"></load-more>
				</view>
				<view style="padding-top: 30upx;" v-show="!showAllCourse">
					<list-item-card-h :list="collect.list" @goDetail="goDetail"></list-item-card-h>
					<empty-page v-if="collectIsEmpty" :image-height="'85px'" :top="'75px'" :noContent="'还没有添加课程哦'" :linkText="'快去添加吧'" @click="showAllCourse=true"></empty-page>
					<load-more :isLoad="collectIsLoading" :isShow="!collectIsEmpty"></load-more>
				</view>
			</view>
		</view>
		<login-pupop ref="login"></login-pupop>
	</view>
</template>
<script>
	import listItemCardSm from '@/pages/components/list-item/list-item-card-sm.vue'
	import listItemCardH from '@/pages/components/list-item/list-item-card-h.vue'
	import title from '@/pages/components/title-bar/title.vue'
	import emptyPage from '@/pages/components/empty/empty.vue'
	import loadMore from '@/pages/components/footer/loadMore.vue'
	import {mapState,mapActions,mapMutations,mapGetters} from 'vuex'
	import login from '@/common/login.js'
	const Model = 2 // 课程
	export default{
		onShow(){
			this.$refs.login.checkLogin()
			if(this.onCreated){
				this.onCreated = false
				return
			}
			this.getClassifyList({})
			this.getCourseList({
				classify:this.classify,
				pageNum: 1,
				pageSize:this.course.pageSize
			})
			if(this.isLogin){
				this.getCollectList({
					pageNum: 1,
					pageSize:this.collect.pageSize
				})
			}
		},
		mixins:[login],
		components:{
			listItemCardSm,
			listItemCardH,
			title,
			emptyPage,
			loadMore
		},
		data(){
			return{
				showAllCourse:true,
				showAllCategory:true,
				selectCode:"",
				courseIsLoading:false,
				collectIsLoading:false,
				onCreated:false
			}
		},
		computed:{
			...mapState('training',['course','collect','detail','classify','classifyList']),
			...mapGetters('login',['isLogin']),
			courseIsEmpty(){
				return this.course.list.length==0
			},
			collectIsEmpty(){
				return this.collect.list.length==0
			},
			getCourses(){
				this.getCourseList({
					classify:"",
					pageNum: 1,
					pageSize:this.course.pageSize
				})
				if(this.isLogin){
					this.getCollectList({
						pageNum: 1,
						pageSize:this.collect.pageSize
					})
				}
				return this.isLogin
			}
		},
		created() {
			this.onCreated = true
			this.getClassifyList({})
			// this.getCourseList({
			// 	classify:"",
			// 	pageNum: 1,
			// 	pageSize:this.course.pageSize
			// })
			// this.getCollectList({
			// 	pageNum: 1,
			// 	pageSize:this.collect.pageSize
			// })
		},
		onLoad(options) {
			let {showAllCourse} = options
			this.showAllCourse = showAllCourse || this.showAllCourse
		},
		async onPullDownRefresh() {
			if(this.courseIsLoading||this.collectIsLoading){
				return
			}
			let isRefresh = true
			await this.getData(isRefresh)
			uni.stopPullDownRefresh();
			uni.showToast({
				title:"已刷新",
				icon: "none"
			})
		},
		onReachBottom() {
			if(this.showAllCourse){
				if(this.course.totalSize == this.course.list.length || this.courseIsLoading){
					return
				}
				this.courseIsLoading = true
			}else{
				if(this.collect.totalSize == this.collect.list.length || this.collectIsLoading){
					return
				}
				this.collectIsLoading = true
			}
			this.getData()
		},
		methods:{
			...mapActions('accountCollect',['doCollect']),
			...mapActions('training',['getCourseList','getCollectList','getClassifyList']),
			...mapMutations('training',['CHANGECOURSE']),
			async getData(isRefresh){
				let response = {}
				if(this.showAllCourse){
					let {pageNum,pageSize} = this.course
					let pageIndex = isRefresh? 1 : pageNum + 1
					response = await this.getCourseList({
						classify:this.classify,
						pageNum: pageIndex,
						pageSize
					})
					this.courseIsLoading = false
				}else{
					let {pageNum,pageSize} = this.collect
					let pageIndex = isRefresh? 1 : pageNum + 1
					response = await this.getCollectList({
						pageNum: pageIndex,
						pageSize
					})
					this.collectIsLoading = false
				}
			},
			// 添加课程
			async addCourse(options){
				const isLogin = await this.$refs.login.checkLogin()
				if(!isLogin){
					return
				}
				let _this = this
				let {code,isCollect} = options
				if(isCollect){
					uni.showModal({
					    title: '确定要取消课程吗',
					    success: function (res) {
					        if (res.confirm) {
								_this.changeCollectState(code,isCollect)
					        }
					    }
					});
				}else{
					_this.changeCollectState(code,isCollect)
				}
			},
			async changeCollectState(code,isCollect){
				let response = await this.doCollect({
					modelCode: code,
					model: Model,
					type: Number(isCollect)
				})
				if(response.code == 200){
					this.CHANGECOURSE({courseCode:code,collect:Number(!isCollect)})
					const {pageSize} = this.collect
					this.getCollectList({
						pageNum: 1,
						pageSize
					})
					uni.showToast({
						title: !isCollect?"添加成功":"已取消",
						icon:"none"
					})
				}
			},
			// 切换分类
			async changeClassify(classify){
				let {pageNum,pageSize} = this.course
				let pageIndex = 1
				await this.getCourseList({
					classify:classify,
					pageNum: pageIndex,
					pageSize
				})
			},
			// 课程分类
			switchCourse(){
				this.showAllCourse = !this.showAllCourse
			},
			switchAllCategory(){
				this.showAllCategory = !this.showAllCategory
			},
			// 去详情
			goDetail(options){
				// const isLogin = await this.$refs.login.checkLogin()
				// if(!isLogin){
				// 	return
				// }
				let {code,title} = options
				uni.navigateTo({
					url:'/pages/training/detail/index?code='+code
				})
			},			
			// 去测评
			async goEvaluation(){
				uni.navigateTo({
					url:'/pages/training/evaluation/index'
				})
			},
			// 去历史记录
			async goRecord(){
				const isLogin = await this.$refs.login.checkLogin()
				if(!isLogin){
					return
				}
				uni.navigateTo({
					url:'/pages/training/evaluation/record'
				})
			}
			
		}
	}
</script>

<style lang="scss" scoped>
	.banner-image{
		width: 309upx; 
		height: 252upx;	
		overflow: hidden;
		image{
			width: 100%;
			height: 100%;
		}
	}
	.reserve{
		transform:rotate(180deg);
	}
	.scroll-view_H{
		width: 100%;
		overflow: hidden;
		white-space: nowrap;
		padding-left: 34upx;
		margin-top: 30upx;
		.cu-btn {
			font-weight: 500;
			height: 54upx;//60upx;
			line-height: 1;
			font-size: 24upx;
			padding: 0 20upx;
			&.line-black{
				color: #333333;
				font-weight:500;
			}
			&.current{
				color: #FFFFFF;
				background-color: #EC2C5A;
			}
			&.current[class*="line"]::after{
				border-color: #EC2C5A;
			}
		}
		.cu-btn[class*="line"]::after{
			border:1upx solid rgba(204,204,204,1);
		}
	}
	
	.tab-btn{
		font-size:30upx;
		font-weight:500;
	}
	.text-gray{
		color: #2C3850;
	}
	.text-lg{
		font-size: 30upx;
	}
	.active{
		color: #EC2C5A;
		font-weight:500;
		transition: all 0.2s ease-in-out 0s;
	}
	.title{
		font-weight:600;
		font-size:40upx;
		line-height: 1;
		margin-bottom: 23upx;
	}
	.checkbtn{
		margin-top: 25upx;
		color: #C80F3C;
	}
	.line{
		width:2upx;
		height:24upx;
		background-color:#CCCCCC;
		border-radius:1upx;
	}
	
	.evaluate .cu-btn{
		margin-top: 17upx;
		margin-bottom: 25upx;
		width:222upx;
		font-weight:500;
		height: 70upx;
		&[class*="lines-red"]::after {
			background:linear-gradient(-50deg,rgba(213,27,71,1),rgba(244,50,96,1));
			border-radius:44px;
		}
		text{
			color: #FFFFFF;
			z-index: 2;
			font-size: 30upx;
			line-height: 1;
		}
	}
</style>
