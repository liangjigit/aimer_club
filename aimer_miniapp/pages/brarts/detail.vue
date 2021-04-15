<template>
	<view>
		<view class="detail-wrapper" v-if="detail">
			<view class="image">
			  <image :src="detail.img" mode="aspectFill"></image>
			</view>
			<view class="activity-title self-start padding-lr">
				<text>{{detail.title}}</text>
			</view>
			<!-- 提示 -->
			<view class="activity-tip padding-lr">
				<text>
					*了解内衣文化，滑动到文章最下方完成打卡，可获得1积分哦
				</text>
			</view>
			<!-- 详情 -->
			<view style="margin-bottom:70upx;">
				<!-- <jyf-parser :html="detail.content" ref="article"></jyf-parser> -->
				<html-content :content="detail.content"></html-content>
			</view>
			<!-- 用户操作按钮 -->
			<view class="btns-wrapper">
				<!-- 未报名 || 取消报名 -->
				<button class="cu-btn lines-red lg shadow" v-if="detail.allowPunch" @click="getModal('signUp','是否确定打卡？',1)">打卡文化之旅</button>
				<!-- 已打卡 -->
				<button class="cu-btn lines-gray lg shadow text-gray" v-else>已打卡</button>
				<!-- 分享按钮 -->
				<button class="cu-btn lines-red lg shadow" v-if="detail.previewImg" @click="goShare">我要分享</button>
				<button class="cu-btn lines-red lg shadow" v-else open-type="share">我要分享</button>
			</view> 
		</view>
		<!--弹窗 -->
		<popup :modalName="modalName" :title="title" @hideModal="hideModal" @confirm="signIn"></popup>
		<share-pupop :modalName="modalName" :title="'打卡成功'" :subTitle="score>0?'打卡成功，恭喜您获得'+score+'积分！':''"  @hideModal="hideModal"></share-pupop>
		<login-pupop ref="login"></login-pupop>
		<home-btn></home-btn>
	</view>
</template>

<script>
	import {mapState,mapActions,mapMutations,mapGetters} from 'vuex'
	import popup from '../components/popup/popup.vue'
	import sharePupop from '../components/popup/share-pupop.vue'
	import homeBtn from '@/pages/components/float-button/home.vue'
	import htmlContent from '@/pages/components/html-content/htmlContent.vue'
	import {doBrartsStatistics} from '@/common/statistics.js'
	import {getNowDate,abnormalprompt} from '@/common/index.js'
	import share from '@/common/share.js'
	import login from '@/common/login.js'
	export default{
		mixins:[share,login],
		components:{
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
				code:null,
				isLoading:false,
				score:0 // 打开获得的积分
			}
		},
		computed:{
			...mapState('login',['inviteUserId','guidecode','isDisabledUser']),
			...mapState('poster',['shareInfo']),
			...mapGetters('login',['isLogin']),
			getDetailForBrarts(){ 
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
				doBrartsStatistics({
					modelCode:code,
					no: 6// 识别小程序吗
				})
			}
			this.code = code
		},
		onShow() {
			this.$refs.login.checkLogin('tabBar')
		},
		onShareAppMessage(res){
			// 统计分享数据
			doBrartsStatistics({
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
			...mapActions('brarts',['getDetail','doPunch']),
			async getData(isRefresh){
				this.isLoading = true
				let response = await this.getDetail({
					articleCode:this.code
				})
				if(isRefresh) uni.stopPullDownRefresh();
				if(response.code == 200){
					let detail = {...response.data}
					uni.setNavigationBarTitle({title:detail.title})
					detail.browseUserCount = detail.browseUserCount > 10000 ? (detail.browseUserCount/10000).toFixed(1) +'万':detail.browseUserCount;
					this.detail = detail
					let {shareTitle,title,shareImg,previewImg} = response.data
					// mixins
					this.setShareInfo(shareTitle,title,shareImg,previewImg,'brarts')
					if(isRefresh){
						uni.showToast({
							title:"已刷新",
							icon: "none"
						})
					}
				}
				this.isLoading = false
			},
			// 弹窗相关
			// 确定打卡
			async signIn(){
				if(this.isDisabledUser){
					abnormalprompt()
					return
				}
				uni.showLoading({
					title:"请求中...",
					mask:true
				})
				const punchDate = getNowDate()
				let response = await this.doPunch({
					model:1, // BRARTS
					modelCode: this.code,
					punchDate
				})
				if(response.code == 200){
					this.detail.allowPunch = false
					this.getModal("share")
					this.score = response.data.score || 0
				}
				uni.hideLoading()
			},
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
				this.modalName= modalName;
				this.title = title || this.title;
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
	.detail-wrapper{
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		background-color: #FFFFFF;
		padding-top: 40upx;
		.image{
			justify-self: center;
			text-align: center;
			margin-bottom: 26upx;
			width: 100%;
			image{
				width:690upx;
				height:376upx;
				// box-shadow:10upx 17upx 50upx 0upx rgba(0, 0, 0, 0.1);
				border-radius:20upx;
			}
		}
	}
	.activity-title{
		margin-bottom: 46upx;
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
		display: flex;
		justify-content: space-between;
		align-self: center;
		width: 690upx;
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
