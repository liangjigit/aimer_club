<template>
	<view class="sign-up-box bg-mask flex align-center justify-center" v-show="isShow">
		<view class="record flex flex-direction justify-center align-center">
			<text class="cuIcon-close" @click="close"></text>
			<view class="flex justify-between align-end" style="width: 100%;">
				<view class="flex flex-direction justify-center">
					<text class="title margin-bottom">每日签到</text>
					<text class="integral margin-bottom-xs">您已获取 {{signInScore}} 签到积分</text>
				</view>
				<view class="image">
					<image src="/static/integral/sign-icon.png" mode="aspectFit"></image>
				</view>
			</view>
			<view class="day flex flex-wrap justify-around">
				<view class="item flex align-center" :class="{'flex-direction justify-center':item.days%7!=0,'justify-between':item.days%7==0,hasSign:item.todaySignIn,today:needSign&&!item.todaySignIn&&(todaySignIndex == index)}" v-for="(item,index) in signRecord" :key="index">
					<block v-if="item.days%7==0">
						<view class="flex flex-direction align-center justify-center" style="margin-left: 78upx;">
							<text class="count">{{item.days}}天</text>
							<image class="star-icon" :src="(needSign&&todaySignIndex == index)||item.todaySignIn?'/static/integral/signed-icon.png':'/static/integral/no-sign-icon.png'" mode="aspectFit"></image>
							<text class="count">+{{item.score}}</text>
						</view>
						<image class="like-icon" src="/static/integral/like-icon.png" mode="aspectFit"></image>
					</block>
					<block v-else>
						<text class="count">{{item.days}}天</text>
						<image class="star-icon" :src="(needSign&&todaySignIndex == index)||item.todaySignIn?'/static/integral/signed-icon.png':'/static/integral/no-sign-icon.png'" mode="aspectFit"></image>
						<text class="count">+{{item.score}}</text>
					</block>
				</view>
				<!-- <view class="item flex justify-between align-center" :class="{hasSign:item.signIn,today:!item.signIn&&item.isToday}" v-if="item.day%7==0">
					<view class="flex flex-direction align-center justify-center" style="margin-left: 78upx;">
						<text class="count">{{item.day}}天</text>
						<image class="star-icon" src="/static/no-sign-icon.png" mode="aspectFit"></image>
						<image class="star-icon" src="/static/no-sign-icon.png" mode="aspectFit"></image>
						<text class="count">+{{item.score}}</text>
					</view>
					<image class="like-icon" src="/static/integral/like-icon.png" mode="aspectFit"></image>
				</view> -->
			</view>
			<button class="cu-btn round" :disabled="!needSign" @click="signInforIntegral">{{needSign?'点我签到':'今日已完成'}}</button>
			<!-- <view class="draw-btn inline-flex align-center">
					<image src="/static/logo.png" mode="aspectFit"></image>
					<text>抽奖赢大礼</text>
					<text class="cuIcon-right"></text>
			</view> -->
		</view>
	</view>
</template>

<script>
	import {mapState,mapActions,mapMutations} from 'vuex'
	import {debounce,abnormalprompt} from '@/common/index.js'
	export default{
		props:{
			isShow:Boolean
		},
		computed:{
			...mapState('login',['userInfo','isDisabledUser']),
			...mapState('integral',['signInScore','needSign','signRecord', 'signInDays','pageSize']),
			todaySignIndex(){
				return this.signRecord.findIndex(z=>z.todaySignIn === false)
			}
		},
		methods:{
			...mapActions('login', ['getMyInfo']),
			...mapActions('integral',['signIn','getIntegralRecord']),
			...mapMutations('integral',['GETSIGNRECORD','CHANGESIGNDATA','CHANGEWAYSTATE']),
			signInforIntegral:debounce(async function(){
				if(this.isDisabledUser){
					abnormalprompt()
					return
				}
				uni.showLoading({
					title:"请求中",
					mask:true
				})
				let response = await this.signIn({})
				if(response.code == 200){
					let {days,score} = response.data
					this.CHANGESIGNDATA({
						todaySignIn:true,
						signInScore:this.signInScore + score,
						signInDays:days
					})
					uni.showToast({
						title:"积分 +" + score,
						icon:"none"
					})
					// 更新签到记录
					let signRecord = [...this.signRecord]
					const index = signRecord.findIndex(z=>z.todaySignIn == false)
					signRecord[index].todaySignIn = true
					this.GETSIGNRECORD({
						signRecord
					})
					// 更新用户积分
					this.getMyInfo({ 
						userInfo:this.userInfo
					})
					// 更新签到方式的状态
					this.CHANGEWAYSTATE({
						key:"signIn",
						finished:true,
						score:this.signInScore
					})
					// 刷新积分流水 
					this.getIntegralRecord({
						pageNum: 1,
						pageSize: this.pageSize 
					})
				}
				uni.hideLoading()
			},200),
			close(){
				this.$emit("close")
			}
		}
	}
</script>

<style lang="scss" scoped>
	// .draw-btn{
	// 	margin-top: 73upx;
	// 	margin-bottom: 27upx;
	// 	image{
	// 		width: 34upx;
	// 		height: 34upx;
	// 	}
	// 	text{
	// 		font-size:28upx;
	// 		font-weight:400;
	// 		color: #333333;
	// 		margin-left: 10upx;
	// 		line-height: 1;
	// 		&.cuIcon-right{
	// 			color: #000000;
	// 			font-size: 24upx;
	// 		}
	// 	}
	// }
	.sign-up-box{
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		width: 100%;
		height:100%;
		background-color: transparent;
		.record{
			width:620upx;
			// height:740upx;
			background:rgba(255,255,255,1);
			box-shadow:3upx 4upx 13upx 0upx rgba(122,86,93,0.3);
			border-radius:20upx;
			padding: 40upx;
			padding-top: 72upx;
			.cu-btn{
				width:520upx;
				height:80upx;
				background:linear-gradient(-50deg,rgba(213,27,71,1),rgba(244,50,96,1));
				box-shadow:0upx 15upx 40upx 0upx rgba(98,0,23,0.16);
				font-size:30upx;
				font-weight:500;
				color: #FFFFFF;
				margin-top: 48upx;
				&[disabled]{
					background:linear-gradient(-50deg,rgba(185,195,205,1),rgba(204,211,218,1));
					box-shadow:none;
				}
			}
			.day{
				margin-top: 14upx;
				.item{
					width:110upx;
					height:130upx;
					background:rgba(245,245,245,1);
					border-radius:30upx;
					margin: 12upx;
					
					&:last-child{
						width: 247upx;
					}
					.like-icon{
						width: 80upx;
						height: 92upx;
					}
					.count{
						font-size:24upx;
						font-weight:400;
						color: #CCCCCC;
						margin-bottom: 9upx;
						line-height: 1;
						&:last-child{
							margin-bottom: 0;
						}
					}
					&.hasSign{
						background-color: #FFECEF;
						.count{
							color: #EC2C5A;
						}
					}
					&.today{
						.count{
							color: #EC2C5A;
						}
					}
					.star-icon{
						width:26upx;
						height:26upx;
						margin-bottom: 6upx;
					}
				}
			}
			.cuIcon-close{
				position: absolute;
				top: 20upx;
				right: 20upx;
				font-size: 50rpx;
				color: #CCCCCC;
			}
			.title{
				font-size:42upx;
				font-weight:500;
				color: #EC2C5A;
				margin-left: 10upx;
				line-height: 1;
			}
			.integral{
				margin-left: 10upx;
				font-size:30upx;
				font-weight:500;
				color: #333333;
				line-height: 1;
			}
			.image{
				height: 161upx;
				width: 175upx;
				image{
					width: 100%;
					height: 100%;
				}
			}
		}
	}
</style>
