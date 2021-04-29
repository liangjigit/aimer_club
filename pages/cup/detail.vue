<template>
	<view class="">
		<view class="padding-top-lg" v-if="detail">
			<view class="title padding-top-lg  padding-left">
				{{detail.title}}
			</view>
			<view class="read-box flex align-center  padding-lr">
				<text class="flex-sub">{{detail.browseCount}} 次阅读</text>
				<view class="icon" @click="collect">
					<image :src="detail.isCollect?'/static/like-icon.png':'/static/dislike-icon.png'" mode="aspectFit"></image>
				</view>
				<view class="icon" @click="goShare" v-if="detail.previewImg">
					<image src="/static/share-icon.png" mode="aspectFit"></image>
				</view>
				<button class="btn" open-type="share" v-else>
					<view class="icon">
						<image src="/static/share-icon.png" mode="aspectFit"></image>
					</view>
				</button>
			</view>
			<view>
				<!-- <jyf-parser :html="detail.content" ref="article"></jyf-parser> -->
				<html-content :content="detail.content" @ready="ready"></html-content>
			</view>
			<view class="padding flex justify-between">
				<button class="cu-btn round" @click="collect">
					<view class="icon">
						<image :src="detail.isCollect?'/static/like-icon.png':'/static/dislike-icon.png'" mode="aspectFit"></image>
					</view>
					<text>{{detail.isCollect?'已收藏':'加入收藏'}}</text>
				</button>
				<button class="cu-btn round" @click="goShare" v-if="detail.previewImg">
					<view class="icon">
						<image src="/static/share-icon.png" mode="aspectFit"></image>
					</view>
					<text>分享朋友</text> 
				</button>
				<button class="cu-btn round" open-type="share" v-else>
					<view class="icon">
						<image src="/static/share-icon.png" mode="aspectFit"></image>
					</view>
					<text>分享朋友</text>
				</button>
			</view>
			<view class="padding-lr-xs" style="margin-top: 70upx;" v-if="detail.goodsList&&detail.goodsList.length>0">
				<title :name="'相关产品'"></title>
			</view> 
			<view class="products-box flex flex-direction align-center" v-if="detail.goodsList&&detail.goodsList.length>0"> 
				<view class="product-item flex margin-bottom-lg" @click="toMiniProgram(item.miniappId,item.goodsUrl,item.itemNo,item.goodsCode)" v-for="(item,index) in detail.goodsList" :key="index">
					<view class="image">
						<image :src="item.goodsImg" mode="aspectFill"></image>
					</view>
					<view class="flex flex-direction flex-sub">
						<view class="name text-cut-line2">{{item.goodsName}}</view>
						<view class="sign flex-sub text-cut">
							{{item.sellingPoint}}
						</view>
						<view class="after-box flex align-center">
							<view class="price">¥{{item.goodsPrice}}</view>
							<view class="like flex-sub">{{item.browseCount}}人喜欢</view>
							<text class="cuIcon-cart" style="color: #CCCCCC;"></text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<login-pupop ref="login"></login-pupop>
		<home-btn></home-btn>
	</view>
</template>

<script>
	import htmlContent from '@/pages/components/html-content/htmlContent.vue'
	import homeBtn from '@/pages/components/float-button/home.vue'
	import title from '@/pages/components/title-bar/title.vue'
	import {mapState,mapActions,mapMutations,mapGetters } from 'vuex'
	import {doGoodsStatistics,doCupStatistics} from'@/common/statistics.js'
	import share from '@/common/share.js'
	import login from '@/common/login.js'
	import {abnormalprompt} from '@/common/index.js'
	const Model = 1; // cup 有料
	export default {
		mixins:[share,login],
		onShow() {
			this.$refs.login.checkLogin()
		},
		components:{
			title,
			homeBtn,
			htmlContent
		},
		data(){
			return{
				title:"",
				code:null,
				detail:null,
				screenHeight:0,
				timer:null
			}
		},
		computed:{
			...mapState('login',['inviteUserId','guidecode','isDisabledUser']),
			...mapState('poster',['shareInfo']),
			...mapGetters('login',['isLogin']),
			getDetailForCup(){
				if(this.code){
					this.getDetail()
				}
				return this.isLogin
			}
		},
		onLoad(options) {
			let {code,scene} = options
			if(scene&&/^S/.test(scene)) {
				code = scene.split('S')[1]
				doCupStatistics({
					modelCode:code,
					no: 2// 识别小程序吗
				})
			}
			this.code = code
		},
		onShareAppMessage(res){
			// 统计分享数据
			doCupStatistics({
				modelCode:this.code,
				no: 3// 分享
			})
			let {title,image,path} = this.shareInfo
			return {
				title:title,
				imageUrl:image,
				path:path
			} 
		},
		onUnload(){
			clearTimeout(this.timer)
		},
		methods:{
			...mapActions('cup',['getCupDetail','getCupScore']),
			...mapActions('accountCollect',['doCollect']),
			...mapMutations('poster',['GETSHAREINFO']),
			...mapMutations('cup', ['CHANGECOLLECT']),
			ready(){
				this.timer = setTimeout(async ()=>{
					if(this.isDisabledUser){
						abnormalprompt()
						return
					}
					let response = await this.getCupScore({articleCode:this.code})
					if(response.code == 200&&response.data){
						let {score} = response.data
						if(score&&score > 0){
							uni.showToast({
								title: '积分 +' + score,
								icon: 'none'
							}); 
						}
					}
				},1000)
			},
			toMiniProgram(appId,path,productNo,goodsCode){
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
			async collect(){
				const isLogin = await this.$refs.login.checkLogin()
				if(!isLogin){
					return
				}
				let code = this.detail.articleCode
				let isCollect = this.detail.isCollect
				let response = await this.doCollect({
					modelCode: code,
					model: Model,
					type: Number(isCollect)
				})
				if(response.code == 200){
					this.detail.isCollect = !this.detail.isCollect
					this.CHANGECOLLECT({ // cup 列表收藏状态
						isCollect:!isCollect,
						code
					})
					uni.showToast({
						title:!isCollect?'收藏成功':'已取消',
						icon:"none"
					})
				}
			},
			async getDetail(){
				let code = this.code
				let response = await this.getCupDetail({articleCode:code})
				if(response.code == 200){
					let detail = {...response.data}
					uni.setNavigationBarTitle({title:detail.title})
					detail.browseUserCount = detail.browseUserCount > 10000 ? (detail.browseUserCount/10000).toFixed(1) +'万':detail.browseUserCount;
					detail.goodsList = detail.goodsList || []
					this.detail = detail
					let {shareTitle,title,shareImg,previewImg} = response.data
					// mixins
					this.setShareInfo(shareTitle,title,shareImg,previewImg,'cup')
				}
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
	.products-box{
		padding: 30upx;
		padding-top: 20upx;
	}
	.product-item{
		width: 690upx; 
		height:220upx;
		background:rgba(255,255,255,1);
		box-shadow:0upx 15upx 60upx 0upx rgba(0,15,41,0.12);
		border-radius:20upx;
		overflow: hidden;
		font-size:26upx;
		font-weight:400;
		padding: 30upx 30upx 30upx 42upx;
		.image{
			width:160upx;
			height:160upx;
			background:rgba(255,255,255,1);
			margin-right: 48upx;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.name{
			width:362upx;
			color: #111111;
			font-size: 28upx;
		}
		.price{
			font-size:30upx;
			color: #EC2C5A;
			margin-right: 42upx;
		}
		.sign{
			width:362upx;
			margin-top: 10upx;
			font-size:24upx;
			font-weight:400;
			color: #999999;
			margin-right: 12upx;
		}
		.after-box{
			.like{
				font-size:20upx;
				color:#999999;
			}
			.cuIcon-cart{
				font-size: 36upx;
			}
		}
	}
	.title{
		font-size:34upx;
		font-weight:500;
		color: #111111;
	}
	.read-box{
		margin-top: 39upx;
		margin-bottom: 46upx;
		text{
			font-size:28upx;
			font-weight:400;
			color: #999999;
		}
		
		.icon{
			width:40upx;
			height:40upx;
			margin-bottom: 14upx;
			margin-left: 48upx;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.btn{
			background-color: #FFFFFF;
			width:40upx;
			height:40upx;
			margin-bottom: 14upx;
			margin-left: 48upx;
			padding: 0;
			line-height: 1;
			&::after{
				border-width: 0;
			}
			.icon{
				margin-bottom:0;
				margin-left:0;
			}
		}
	}
	.cu-btn{
		width:300upx;
		height:88upx;
		background:rgba(255,255,255,1);
		box-shadow:4upx 10upx 35upx 0upx rgba(0,0,0,0.1);
		.icon{
			width: 40upx;
			height: 40upx;
			margin-right: 16upx;
			image{
				width: 100%;
				height: 100%;
			}
		}
		text{
			z-index: 1;
			font-size:26upx;
			font-weight:500;
			color: #111111;
		}
	}
</style>
