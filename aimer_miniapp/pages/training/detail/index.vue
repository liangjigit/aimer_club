<template>
	<view class="">
		<view v-show="detail">
			<!-- 横视频：视频地址 -->
			<video-h ref="videoH" :isShow="!detail.verticalVideo" :detail="detail" @end="goPunch" :isLoop="isLoop" @error="videoError" @addCourse="addCourse">
			</video-h>
			<!-- 竖视频：视频地址，15秒短视频-->
			<swiper v-if="detail.verticalVideo" class="video-swiper" :vertical="true" :indicator-dots="false" :autoplay="false" :duration="300">
				<swiper-item>
					<view class="swiper-item">
						<video-v ref="videoV" @clickGoods="clickGoods" @addCourse="addCourse" :isLoop="isLoop" :isShow="detail.verticalVideo" :detail="detail" @end="goPunch"  @error="videoError" @doStatistic="doStatistic">
						</video-v>
					</view>
				</swiper-item>
				<swiper-item>
					<scroll-view :style="{height:height}" :scroll-anchoring="true" class="scroll-view_H" scroll-top="0" scroll-y="true" scroll-with-animation="true">
						<course :detail="detail" @clickGoods="clickGoods"></course>
					</scroll-view>
				</swiper-item>
			</swiper>
			<view v-else>
				<course :detail="detail" @clickGoods="clickGoods"></course>
			</view>
		</view>
		<login-pupop ref="login"></login-pupop>
	</view>
</template>

<script>
	import videoH from './components/video-h.vue' 
	import videoV from './components/video-v.vue'
	import course from './components/course.vue'
	import {mapState,mapActions,mapMutations,mapGetters} from 'vuex'
	import {doCourseStatistics,doGoodsStatistics} from '@/common/statistics.js'
	import {debounce} from '@/common/index.js'
	import share from '@/common/share.js'
	import login from '@/common/login.js'
	const Model = 2 // 课程
	export default{
		mixins:[share,login],
		onShow(){
			this.$refs.login.checkLogin('tabBar') 
		},
		components:{
			videoH,
			videoV,
			course
		},
		data(){
			return{
				showShare:false,
				code:"",
				videoContext:null,
				isPlay:false,
				height:"",
				isLoop:false,
				isGoPunchPage:false
			}
		},
		computed:{
			...mapState('login',['inviteUserId','guidecode']),
			...mapState('poster',['shareInfo']),
			...mapState('trainingDetail',['detail']),
			...mapGetters('login',['isLogin']),
			getDetailForCourse(){
				if(this.code){ 
					this.getData()
				}
				return this.isLogin
			}
		},
		onLoad(options) {
			let {code,scene} = options
			if(scene&&/^S/.test(scene)) {
				code = scene.split('S')[1]
				doCourseStatistics({
					modelCode:code,
					no: 5// 识别小程序吗
				})
			}
			this.code = code
			// this.getData()
			let info = uni.getSystemInfoSync()
			this.height  = info.windowHeight + 'px'
		},
		onShareAppMessage(res){
			// 统计分享数据
			doCourseStatistics({ 
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
		onUnload() {
			this.GETCOURSEDETAIL({detail:null})
		},
		methods:{
			...mapActions('trainingDetail',['getDetail','getPunchData']),
			...mapActions('accountCollect',['doCollect']),
			...mapMutations('poster',['GETSHAREINFO']),
			...mapMutations('training',['CHANGECOURSE']),
			...mapMutations('trainingDetail',['GETCOURSEDETAIL']),
			// 跳转到外部小程序
			clickGoods(options){
				const {appId,path,productNo,goodsCode} = options
				doGoodsStatistics({
					goodsCode
				})
				uni.navigateToMiniProgram({
					appId,
					path//,
					// extraData:{
					// 	'data1': 'test'
					// },
				})
			},
			// 下载海报数据统计
			doStatistic(){
				doCourseStatistics({modelCode:this.code,no:4})
			},
			// 添加课程
			async addCourse(){
				const isLogin = await this.$refs.login.checkLogin()
				if(!isLogin){
					return
				}
				let _this = this
				let isCollect = this.detail.collect
				if(isCollect){
					uni.showModal({
					    title: '确定要取消课程吗',
						success: (res) => {
							if (res.confirm) {
								_this.changeCollectState()
							}
						}
					});
				}else{
					_this.changeCollectState()
				}
			},
			async changeCollectState(){
				let code = this.code
				let isCollect = this.detail.collect
				let response = await this.doCollect({
					modelCode: this.code,
					model: Model,
					type: Number(isCollect)
				})
				if(response.code == 200){
					this.CHANGECOURSE({courseCode:code,collect:Number(!isCollect)})
					let detail = {...this.detail,collect:!isCollect}
					this.GETCOURSEDETAIL({detail})
					uni.showToast({
						title: !isCollect?"添加成功":"已取消",
						icon:"none"
					})
				}
			},
			async getData(isRefresh){
				this.isLoading = true
				let response = await this.getDetail({
					courseCode:this.code
				})
				if(isRefresh) uni.stopPullDownRefresh();
				if(response.code == 200){
					let {shareTitle,title,shareImg,previewImg} = response.data
					uni.setNavigationBarTitle({title})
					// mixins
					this.setShareInfo(shareTitle,title,shareImg,previewImg,'course')
					if(isRefresh){
						uni.showToast({
							title:"已刷新",
							icon: "none"
						})
					}
				}
				this.isLoading = false
			},
			goPunch:debounce(function(){ 
				// if(this.detail.allowPunch && this.isLogin){
				if(this.isLogin){
					uni.navigateTo({
						url:"/pages/training/detail/punch?code="+this.code
					}) 
				}
			},300), 
			videoError(options){
				let {errMsg} = options
				uni.showToast({
					title:"视频加载失败",
					icon:"none"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	// cover-image,
	// cover-view{
	// 	z-index: inherit;
	// }
	.video-swiper {
		height:100% !important;
		width: 100% !important;
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		swiper-item{
			height:100% !important;
			width: 100% !important;
			position: relative;
			.swiper-item{
				height:100% !important;
				width: 100% !important;
				position: relative;
				&video {
					pointer-events: initial; 
					position: relative;
				}
			}
		}
	}
	
	.scroll-view_H{
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		width:100%;
		height:100%;
		background-color: #FFFFFF;
		overflow-anchor:none;
		z-index: 99999;
	}
	
	
</style>
