<template>
	<view class="video-v" v-show="isShow">
		<video id="trainingVideo" ref="trainingVideo" object-fit="cover" :autoplay="true" @pause="pause" @play="play" @ended="end" :loop="isLoop" @error="videoErrorCallback" :src="detail.videoAddr" play-btn-position="center" :enable-play-gesture="true" :controls="true" :show-fullscreen-btn="false">
		</video>
		<view class="cover-top flex flex-direction justify-start" v-show="isShowTitle">
			<view class="info-box flex justify-between align-start"> 
				<view class="flex flex-direction flex-sub">
					<view class="title">{{detail.title}}</view> 
					<view class="sub-title text">{{detail.videoExplain}}</view> 
				</view>
				<view class="views flex align-center">
					<image class="icon" src="/static/training/detail/views-icon.png"></image>
					<text>{{detail.browseUserCount}}</text>
				</view>
			</view>
		</view>
		<view class="cover-bottom flex flex-direction align-center justify-center">
			<view class="btn flex flex-direction justify-center align-center" @click="goTraining">
				<view class="btn-img bg-white flex justify-center align-center">
					<image class="icon" src="/static/training/detail/course-icon.png"></image>
				</view>
				<view class="btn-name">所有课程</view>
			</view>
			<view class="btn flex flex-direction justify-center align-center" @click="addCourse">
				<view class="btn-img bg-white flex justify-center align-center">
					<image class="icon" :src="detail.collect?'/static/training/focused-icon.png':'/static/training/focus-icon.png'"></image>
				</view>
				<view class="btn-name">{{detail.collect?'取消课程':'添加课程'}}</view>
			</view>
			<view class="btn flex flex-direction justify-center align-center" @click="toggleShare">
				<view class="btn-img bg-white flex justify-center align-center">
					<image class="icon" src="/static/share-icon.png"></image>
				</view>
				<view class="btn-name">分享</view>
			</view>
		</view>  
		<view class="product" v-if="detail.goods&&detail.goods.length>0&&showGoods">
			<view class="tip-title flex align-center">
				<image class="icon" src="/static/training/detail/shop-icon.png"></image>
				<view class="text flex-sub">宝贝上架了，快来抢~</view>
				<view  @click.stop="closeGoods">
					<image class="close-icon" src="/static/training/detail/close-icon.png" mode="aspectFit"></image>
				</view> 
			</view>
			<view class="detail flex align-center" @click.stop="toMiniProgram(detail.goods[0].miniappId,detail.goods[0].goodsUrl,detail.goods[0].itemNo,detail.goods[0].goodsCode)">
				<view class="image">
					<image :src="detail.goods[0].goodsImg" mode="aspectFill"></image>
				</view>
				<view class="info flex flex-direction">
					<view class="text-cut title">{{detail.goods[0].goodsName}}</view>
					<view class="flex align-center">
						<view class="flex-sub like text-cut">已有{{detail.goods[0].likeNum}}人喜欢</view>
						<view class="cu-btn round bg-red">去看看</view>
					</view>
				</view>
			</view>
		</view>
		<view class="mask" v-show="showShare" @click.stop="closeDialog">
			<view class="screen-dialog" :class="{'weui-half-screen-dialog_show':showShare}">
				<view class="btn" @click.stop="saveVideo" v-if="detail.shortVideo">
					<button class="bg-white text-black">视频分享</button>
				</view>
				<view class="btn" @click.stop="">
					<button class="bg-white text-black" open-type="share">分享好友</button>
				</view>
				<view class="btn" @click.stop="savePoster" v-if="detail.previewImg">
					<button class="bg-white text-black">保存海报</button>
				</view>
				<view class="btn" @click.stop="toggleShare">
					<button class="bg-white text-black">取消</button>
				</view>
			</view>
		</view>
		<login-pupop ref="login"></login-pupop>
	</view>
</template>

<script>
	import {checkForAuthorization} from '@/common/index.js'
	export default{
		props:{
			isShow:Boolean,
			detail:Object,
			isLoop:Boolean
		},
		data(){
			return{
				isShowTitle:true,
				isPlay:false,
				videoContext:null,
				showShare:false,
				showGoods:true
			}
		},
		onReady(res) {
			this.videoContext = uni.createVideoContext('trainingVideo',this)
		},
		methods:{
			closeGoods(){
				this.showGoods = false
			},
			async toMiniProgram(appId,path,productNo,goodsCode){
				const isLogin = await this.$refs.login.checkLogin()
				if(!isLogin){
					return
				}
				this.$emit('clickGoods',{appId,path,productNo,goodsCode})
			},
			addCourse(){
				this.$emit('addCourse')
			},
			goTraining(){
				let showAllCourse = true
				uni.switchTab({
					url:"/pages/training/index?showAllCourse="+showAllCourse
				})
			},
			videoErrorCallback(e){
				this.$emit('error',{errMsg:e.target.errMsg})
			},
			end(){
				this.$emit('end')
			},
			pause(){
				this.isPlay = false,
				this.isShowTitle = !this.isPlay
				setTimeout(()=>{
					this.isShowTitle = false
				},1000) 
			},
			play(){
				this.isPlay = true
				this.isShowTitle = !this.isPlay
				uni.hideToast()
			},
			waiting(){
				uni.showToast({
					title:"正在缓冲",
					icon:"none"
				})
			},
			closeDialog(){
				this.$emit("close")
			},
			toggleShare(){
				this.showShare = !this.showShare
				if(this.showShare){
					this.videoContext.pause()
				}
			},
			saveVideo(){
				let _this = this
				checkForAuthorization('scope.writePhotosAlbum').then(()=>{
					uni.showLoading({
						title:"正在保存...",
					})
					const arr = _this.detail.shortVideo.split('.')
					const typeIndex = arr.length-1
					const type = arr[typeIndex]
					// console.log(type)
					// #ifdef MP-WEIXIN
					const filePath = wx.env.USER_DATA_PATH + '/.' + new Date().getTime()+'.'+ type
					// console.log(filePath)
					// #endif
					uni.downloadFile({
					     url: _this.detail.shortVideo,
						 filePath: filePath,
					     success: function (res) {
					       if (res.statusCode === 200) {
							    uni.saveVideoToPhotosAlbum({
								    filePath: res.filePath,
								    success: function () {
										uni.showToast({
											title:"已保存至相册",
											icon:"none"
										})
										uni.hideLoading()
								    },
								    fail: function(e){
										console.log(e)
										uni.hideLoading()
										if(e.errMsg == "saveVideoToPhotosAlbum:fail cancel"){
											uni.showToast({
												title:"已取消",
												icon:"none"
											})
										}else{
											uni.showToast({
												title:"保存失败",
												icon:"none"
											})
										}
								    },
									complete:function(){
										/* 删除文件缓存，否则累计超过10M保存失败 */
										let fileMgr = uni.getFileSystemManager();
										fileMgr.unlink({
										  filePath: filePath,
										  success: function (r) {
											console.log("删除成功")
										  },
										})
									}
								})
							}
						},
						fail:function(e){
							console.log(e)
							uni.hideLoading()
							uni.showToast({
								title:"下载失败",
								icon:"none"
							})
						}
					})
				}).catch((err)=>{
					console.log(err)
					uni.showToast({
						title:"保存失败",
						icon:"none"
					})
				})
			},
			savePoster(){
				checkForAuthorization('scope.writePhotosAlbum').then(()=>{
					uni.showLoading({
						title:"正在保存...",
					})
					this.$emit('doStatistic')
					 uni.downloadFile({
						  url: this.detail.previewImg, 
						  success: function (res) {
							if (res.statusCode === 200) {
								uni.saveImageToPhotosAlbum({
									filePath:res.tempFilePath,
									success: function () {
										uni.showToast({
											title:"已保存至相册",
											icon:"none"
										})
										uni.hideLoading()
									},
									fail: function(e){
										uni.hideLoading()
										console.log(e)
										if(e.errMsg == "saveImageToPhotosAlbum:fail cancel"){
											uni.showToast({
												title:"已取消",
												icon:"none"
											})
										}else{
											uni.showToast({
												title:"保存失败",
												icon:"none"
											})
										}
									}
								})
							}
						},
						fail: function(e){
							uni.hideLoading()
							console.log(e)
							uni.showToast({
								title:"下载失败",
								icon:"none"
							})
						}
					})
				}).catch((err)=>{
					console.log(err)
					uni.showToast({
						title:"保存失败",
						icon:"none"
					})
				})
			}
		}
	}
	
</script>

<style lang="scss" scoped>
	.video-v{
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		width:100%;
		height:100%;
		overflow: hidden;
		video{
			width: 100%;
			height: 100%;
			pointer-events: initial;
			position: relative;
		}
	}
	.mask{
		position: absolute;
		z-index: 1000;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: rgba(0,0,0,0.6);
		width: 100%;
		height: 100%;
	}
	.screen-dialog{
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		max-height: 75%;
		z-index: 5000;
		line-height: 1.4;
		background-color: #fff;
		border-top-left-radius: 20upx;
		border-top-right-radius: 20upx;
		transition: all .3s ease-in-out;
		transform: translateY(100%);
		.btn{
			width: 100%;
			// height: 100upx;
			font-size:32upx;
			font-weight:400;
			padding: 0 24upx;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-bottom: 0;
			button{
				width: 100%;
				height: 100%;
				&::after{
					border-width: 0;
				}
			}
			&:last-child{
				border-top: 20upx solid  #F9F9F9;
				padding: 12upx 0;
			}
			&::after{
				content: "";
				position: absolute;
				bottom: 0;
				left: 10%;
				width:80%;
				height:2upx;
				background:rgba(242,242,242,1);
			}
		}
	}
	.weui-half-screen-dialog_show{
		transform: translateY(0);
	}
	.cover-top{
		width:100%;
		height:370Upx;
		background: linear-gradient(to bottom,rgba(0,0,0,0.5),rgba(0,0,0,0));
		color: #FFFFFF;
		padding: 24upx 40upx 0;
		font-weight:400;
		position: fixed;
		top: 0;
		left: 0;
		.title{
			font-size:26upx;
			padding-bottom: 46upx;
		}
		.sub-title{
			font-size:26upx;
		}
		.views{
			padding-top: 10upx;
			.icon{
				width: 33upx;
				height: 25upx;
				margin-right: 11upx;
			}
			text{
				font-size:24upx;
			}
		}
	}
	.close-icon{
		width: 20upx;
		height: 20upx;
	}
	.cover-bottom{
		position: fixed;
		right: 35upx;
		bottom: 139upx;
		width: 96upx;
		// height: 420upx;
	}
	.btn{
		margin-bottom: 24upx;
		.btn-img{
			width:92upx;
			height:92upx;
			background:rgba(255,255,255,1);
			border-radius: 100%;
			.icon{
				width: 36upx;
				height: 36upx;
				z-index: 2;
			}
		}
		.btn-name{
			margin-top: 12upx;
			font-size:24upx;
			font-weight:400;
			color: #FFFFFF;
		}
	}
	.product{
		width:498upx;
		height:192upx;
		background:rgba(255,255,255,1);
		border-radius:10upx;
		position: fixed;
		bottom: 80upx;
		left: 30upx;
		background-color: #FFFFFF;
		.tip-title{
			width:100%;
			height:44upx;
			background-color:#F9DDDD;
			border-radius:10upx;
			padding-left: 25upx;
			padding-right: 24upx;
			.icon{
				width: 28upx;
				height: 28upx;
				margin-right: 17upx;
			}
			.text{
				color: #EC2C5A;
				font-size:20upx;
				font-weight:400;
			}
			.cuIcon-close{
				color: #999999;
			}
		}
		.detail{
			padding: 24upx;
			.image image{
				width:98upx;
				height:98upx;
				background:rgba(238,238,238,1);
				border-radius:5upx;
			}
			.info{
				padding-left: 16upx;
				width: 80%;
				.title{
					font-size:26upx;
					font-weight:500;
					margin-bottom: 24upx;
					padding-right: 0;
				}
				.like{
					font-size:20upx;
					font-weight:400;
					color: #666666;
					padding-right: 15upx;
				}
				.cu-btn{
					width:138upx;
					height:44upx;
					// background:linear-gradient(-50deg,rgba(213,27,71,1),rgba(244,50,96,1));// 开发者工具上显示，小程序 真机不显示 ,cover-view 不支持 需要用图片代替
					background-color: #EC2C5A;
					border-radius:22upx;
					color: #FFFFFF;
					font-size:24upx;
					font-weight:500;
					line-height: 44upx;
				}
			}
		}
	}
</style>
