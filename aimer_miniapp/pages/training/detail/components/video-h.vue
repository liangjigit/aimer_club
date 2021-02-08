<template>
	<view class="flex flex-direction justify-center padding-top-lg align-center" v-if="isShow">
		<view class="video-h">
			<video id="trainingVideo" ref="trainingVideo" object-fit="contain" @pause="pause" @ended="end" :loop="isLoop" @fullscreenchange="fullscreenchange" @error="videoErrorCallback" :src="detail.videoAddr" :poster="detail.bigImg" :controls="isHideControl" :enable-play-gesture="true" play-btn-position="center" :show-center-play-btn="false">
			</video>
			<view class="cover flex flex-direction justify-end" v-if="!isHideControl">
				<view class="info-box flex justify-between align-center">
					<view class="flex flex-direction justify-center flex-sub" style="width: 80%;">
						<view class="text">{{detail.browseUserCount}} 人已练习</view>
						<view class="title text text-cut-line2">{{detail.videoExplain}}</view>
					</view>
					<view class="text">{{detail.duration}}分钟</view>
				</view> 
			</view>
		</view>
		<view class="flex margin-top margin-bottom-lg" style="width: 690upx;">
			<view class="flex-sub">
				<view class="btn inline-flex flex-direction align-center" @click="videoPlay">
					<button class="btn-img round flex align-center justify-center bg-red">
						<image class="icon" src="/static/training/detail/play-icon.png" mode="aspectFit"></image>
					</button>
					<text>开始第{{detail.exerciseNum+1}}次练习</text>
				</view>
			</view>
			<view style="width: 222upx;" class="flex justify-between">
				<view class="btn inline-flex flex-direction align-center" @click="addCourse">
					<button class="btn-img round flex align-center justify-center">
						<image class="icon" :src="detail.collect?'/static/training/focused-icon.png':'/static/training/focus-icon.png'" mode="aspectFit"></image>
					</button>
					<text>{{detail.collect?'取消课程':'添加课程'}}</text>
				</view>
				<view class="btn inline-flex flex-direction align-center">
					<button class="btn-img round flex align-center justify-center" open-type="share" v-if="!detail.previewImg">
						<image class="icon" src="/static/share-icon.png" mode="aspectFit"></image>
					</button>
					<button class="btn-img round flex align-center justify-center" v-else @click="goShare">
						<image class="icon" src="/static/share-icon.png" mode="aspectFit"></image>
					</button>
					<text>分享闺蜜</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			isShow:Boolean,
			detail:Object,
			isLoop:Boolean
		},
		data(){
			return{
				isHideControl:false,
				isPlay:false,
				videoContext:null
			}
		},
		onReady(res) {
			this.videoContext = uni.createVideoContext('trainingVideo',this)
		},
		methods:{
			addCourse(){
				this.$emit('addCourse')
			},
			fullscreenchange(e){
				let options = {...e.detail}
				if(!options.fullScreen&&this.isPlay){
					let _this = this
					_this.videoContext.pause()
					uni.showModal({
						title: '真的要半途而废吗？',
						content: '现在退出训练，数据将不被记录！',
						cancelColor:'#111111',
						cancelText:'放弃',
						confirmText:'不想放弃',
						confirmColor:'#EC2C5A',
						success: function (res) {
							if (res.confirm) {
								_this.videoPlay()
							}
						}
					});
				}
			},
			videoErrorCallback(e){
				this.$emit('error',{errMsg:e.target.errMsg})
			},
			end(){
				this.isPlay = false
				this.$emit('end')
			},
			pause(){
				this.isPlay = false
			},
			videoPlay(){
				this.videoContext.requestFullScreen({direction:90})
				this.videoContext.play()
				this.isPlay = true
				this.isHideControl = true
			},
			waiting(){
				uni.showToast({
					title:"正在缓冲",
					icon:"none"
				})
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
	.inline-flex{
		display: inline-flex;
	}
	.btn{
		.btn-img{
			width:86upx;
			height:86upx;
			box-shadow:0px 3px 10px 0px rgba(0,15,41,0.15);
			background-color: #FFFFFF;
			padding: 0;
			&::after{
				border-width: 0;
			}
			&.bg-red{
				background:linear-gradient(-50deg,rgba(213,27,71,1),rgba(244,50,96,1));
				box-shadow:0upx 3upx 10upx 0upx rgba(0,15,41,0.24);
			}
			.icon{
				width: 36upx;
				height: 36upx;
			}
		}
		text{
			padding-top: 16upx;
			font-size:24upx;
			font-weight:400;
			color: #666666;
		}
	}
	.video-h{
		width:690upx;
		height:388upx;
		background:rgba(218,218,218,1);
		box-shadow:0upx 15upx 60upx 0upx rgba(0,15,41,0.12);
		border-radius:20upx;
		overflow: hidden;
		position: relative;
		video{
			width: 100%;
			height: 100%;
			border-radius:20upx; 
			overflow: hidden;
		}
		.cover{
			position: absolute;
			top: 0;
			right: 0;
			width: 100%;
			height: 100%;
			border-radius:20upx;
			overflow: hidden;
			.info-box{
				width:100%;
				// height:136upx;
				background:rgba(0,3,12,0.4);
				border-bottom-left-radius:20upx;
				border-bottom-right-radius:20upx;
				color: #FFFFFF;
				font-weight:400;
				font-size:24upx;
				padding-left: 27upx;
				padding-right: 23upx;
				.title{
					font-size:34upx;
					font-weight:500;
					padding-top: 17upx;
					margin-bottom: 17upx;
				}
			}
		}
	}
</style>
