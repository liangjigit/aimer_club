<template>
	<view class="wrapper" v-if="isShow" @touchmove.stop.prevent="moveHandle">
		<view class="bg-mask flex flex-direction align-center justify-center">
			<view class="card flex flex-direction align-center" @click="savePhoto(posterImg)">
				<view class="btn">
					<canvas class="canvas" :style="{width:pupopWidth +'rpx',height: pupopHeight + 'rpx'}" canvas-id="guidePopop" id="guidePopop" @error="canvasError"></canvas>
				</view>
			</view>
			<view class="saveBtn"  @click="savePhoto(posterImg)" v-if="showCloseBtn">
				点击海报下载
			</view>
			<view @click="hide" class="cancel-btn" v-if="showCloseBtn">
				<image src="/static/close-icon.png" mode="aspectFit"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState,mapActions,mapMutations,mapGetters} from 'vuex'
	import {doGuidePosterStatistic} from '@/common/statistics.js'
	import {checkForAuthorization} from '@/common/index.js'
	export default{
		data(){
			return {
				isShow:false,
				showCloseBtn:false,
				poster:null, 
				posterId:0,
				pupopWidth:558,
				pupopHeight:646,
				posterImg:"", //生成的海报
			}
		},
		computed:{
			...mapState('login',['userInfo']), //,'pupop'
			...mapState('poster',['inviteQR'])
		},
		methods: {
			...mapActions('index',['getGuidePoster']),
			...mapActions('poster',['getInvitatePoster']),
			...mapMutations('poster',['GETINVITEQR']),
			moveHandle() {},
			canvasError(e){
				 console.error(e.detail.errMsg)
			},
			async init() {
				let response = await this.getGuidePoster({})
				if(response.code == 200&&response.data){
					const {id,image} = response.data
					this.posterId = id
					this.poster = image
					if(this.inviteQR){
						this.drawPoster();
					}else{
						const res = await this.getInvitatePoster({})
						if(res.code == 200){
							const {inviteQR} = res.data
							this.GETINVITEQR({inviteQR})
							this.drawPoster();
						}
					}
				}
			},
			// 绘制海报
			drawPoster() {
				uni.showLoading({
					title:"海报生成中...",
					mask:true
				})
				let _this = this
				_this.isShow = true
				let info = uni.getSystemInfoSync()
				const pixelRatio = info.pixelRatio // 屏幕像素密度
				uni.getImageInfo({
					src: _this.poster, //_this_pupop.image
					success(image) {
						const canvasId = "guidePopop"
						let  ctx = uni.createCanvasContext(canvasId,_this)
						let ratio = _this.pupopWidth/image.width
						let draw_h = image.height*ratio
						_this.pupopHeight = draw_h
						ctx.drawImage(image.path,0,0,uni.upx2px(_this.pupopWidth),uni.upx2px(draw_h)) // 海报
						// 绘制头像
						uni.getImageInfo({
							src: _this.userInfo.avatarUrl,
							success(res){
								const size = 76
								const x = 36
								const y = 36
								const acr_r = size/2
								const acr_x = x+acr_r
								const acr_y = y+acr_r
								const img_x = acr_x/2
								const img_y = acr_y/2
								const img_w = size
								const img_h = img_w
								ctx.save(); // 先保存状态 已便于画完圆再用
								ctx.beginPath(); //开始绘制
								//先画个圆
								ctx.arc(uni.upx2px(acr_x), uni.upx2px(acr_y),uni.upx2px(acr_r), 0, Math.PI * 2);
								ctx.setFillStyle('#ffffff')
								ctx.fill()//保证图片无bug填充
								ctx.clip();//画了圆 再剪切 原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内
								ctx.drawImage(res.path,uni.upx2px(img_x),uni.upx2px(img_y),uni.upx2px(img_w),uni.upx2px(img_h)) // 头像
								ctx.restore();
								// 绘制 昵称
								// ctx.save(); // 先保存状态 已便于画完圆再用
								// const text_size = 28
								// const text_x = x + img_w + 29
								// const text_y = 64
								// ctx.setFillStyle('#FFFFFF')
								// ctx.setTextBaseline('top') 
								// ctx.setFontSize(uni.upx2px(text_size))
								// ctx.fillText('Hi  '+_this.userInfo.nickName, uni.upx2px(text_x), uni.upx2px(text_y))
								// 绘制 小程序码
								uni.getImageInfo({
									src: _this.inviteQR,
									success(res){
										const x = 60
										const y = 55
										const size = 180
										const img_x = _this.pupopWidth - size - x
										const img_y = _this.pupopHeight - size - y
										const img_w = size
										const img_h = img_w
										ctx.drawImage(res.path,uni.upx2px(img_x),uni.upx2px(img_y),uni.upx2px(img_w),uni.upx2px(img_h)) // 头像
										ctx.draw(false, () => {
											uni.canvasToTempFilePath({
											  width: _this.pupopWidth,
											  height: draw_h,
											  destWidth: _this.pupopWidth * pixelRatio,
											  destHeight: draw_h *pixelRatio,
											  canvasId: canvasId,
											  fileType: 'png',
											  quality:1,
											  success: function(res) {
												_this.posterImg = res.tempFilePath
												_this.showCloseBtn = true
												console.log(_this.posterImg)
												uni.hideLoading()
											  },
											  fail(error) {
												console.log('4',error)
												_this.isShow = false
												uni.showLoading({
													title:'生成海报失败，请稍后重试',
													mask:true
												})
												uni.hideLoading()
											  }
											},_this)
										})
									},
									fail(error) {
										console.log('3',error)
										uni.showLoading({
											title:'生成海报失败，请稍后重试',
											mask:true
										})
										_this.isShow = false
										uni.hideLoading()
									}
								})
							},
							fail(error) {
								console.log('2',error)
								uni.showLoading({
									title:'生成海报失败，请稍后重试',
									mask:true
								})
								_this.isShow = false
								uni.hideLoading()
							}
						})
					 },
					 fail(error) {
					 	console.log('1',error)
						_this.isShow = false
						uni.showLoading({
							title:'生成海报失败，请稍后重试',
							mask:true
						})
					 	uni.hideLoading()
					 }
				});
			},
			savePhoto(filePath){
				doGuidePosterStatistic({id:this.posterId}) // 海报点击统计
				checkForAuthorization('scope.writePhotosAlbum').then(()=>{
					uni.saveImageToPhotosAlbum({
						filePath:filePath,
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
				}).catch((err)=>{
					console.log(err)
					uni.showToast({
						title:"保存失败",
						icon:"none"
					})
				})
			},
			hide(){
				this.isShow = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.saveBtn{
		color: #ffff;
		padding: 10upx 20upx;
		line-height: 1;
		margin-top: 10upx;
		border-radius: 20upx;
		letter-spacing: 10upx;
		text-align: center;
	}
	.wrapper{
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		width: 100%;
		height: 100%;
		z-index: 2;
		.bg-mask{
			width: 100%;
			height: 100%;
			background-color: transparent;
		}
	}
	.cancel-btn{
		// position: absolute;
		// left: 50%;
		// margin-left: -33upx;
		// bottom: -90upx;
		// font-size: 70upx;
		margin-top: 40rpx;
		width:66upx;
		height:66upx;
		image{
			width: 100%;
			height: 100%;
		}
		
	}
	.card{
		z-index: 3;
		width:558upx;
		height:auto;//664upx;
		background:rgba(255,255,255,1);
		// border-radius:10upx;
		background: none;
		position: relative;
		.btn{
			width: 100%;
			height: 100%;
			padding: 0;
			background-color: transparent;
			overflow: hidden;
			&::after{
				border-width: 0;
			}
			image{
				width: 100%;
				height: 100%;
			}
			canvas{
				width: 558upx;
				height: 646upx;
			}
		}
		
		
		.title{
			font-size:30upx;
			font-weight:600;
			color: #111111;
			margin-bottom: 49upx;
		}
		.money{
			margin-bottom: 40upx;
			.num{
				font-size:66upx;
				font-weight:600;
				color: #EC2C5A;
				margin-right: 22upx;
			}
			.unit{
				font-size:36upx;
				font-weight:400;
				color: #111111;
			}
		}
		.tip{
			margin-bottom: 82upx;
			line-height: 1;
		}
		// .cu-btn{
		// 	width:302upx;
		// 	height:80upx;
		// 	box-shadow:0upx 0upx 15upx 0upx rgba(187,0,52,0.17);
		// 	border-radius:10upx;
		// 	font-weight:500;
		// 	&::after{
		// 		border:3upx solid rgba(236,44,90,1);
		// 	}
		// }
		.title-img{
			width: 100%;
			height:76upx;
			margin-bottom: 60upx;
			image{
				width: 100%;
				height: 100%;
			}
		}
	}
</style>
