<template>
	<view class="page">
		<view class="background-image">
			<view class="bg-color"></view>
		</view>
		
		<view class="info flex flex-direction align-center">
			<view class="avatar margin-bottom-lg">
				<image :src="userInfo.avatarUrl" mode="aspectFill"></image>
			</view>
			<view class="nickName">
				{{userInfo.nickName}}
			</view>
			<view class="calendar-box">
				<view class="top-style flex justify-around">
					<view class="red"></view>
					<view class="red"></view>
					<view class="red"></view>
					<view class="red"></view> 
				</view>
				<imt-calendar ref="calendar" :selected="dateList" @click="goWebview"></imt-calendar>
			</view>
			<view class="footer flex justify-center align-center">
				<view class="line"></view>
				<text>了解自己，才能更自信</text>
				<view class="line"></view>
			</view>
		</view>
		<login-pupop ref="login"></login-pupop>
	</view>
</template>

<script>
	import {mapState,mapActions} from 'vuex'
	import imtCalendar from '@/pages/training/evaluation/imt-calendar/imt-calendar.vue'
	export default{
		onShow(){
			this.$refs.login.checkLogin()
		},
		components: {
			imtCalendar
		},
		computed:{
			...mapState('trainingEvaluation',['dateList']),
			...mapState('login',['userInfo'])
		},
		data(){
			return{
				
			}
		},
		async created(){
			let response =  await this.getRecord({})
			if(response.code == 200){
				this.$refs['calendar'].init()
			}
		},
		methods:{
			...mapActions('trainingEvaluation',['getRecord']),
			goWebview(options){
				const {date} = options
				uni.navigateTo({
					url:"/pages/training/evaluation/report?date="+date
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.footer{
		.line{
			width:101upx;
			height:2upx;
			background:rgba(204,204,204,1);
		}
		text{
			font-size:22upx;
			font-weight:300;
			padding: 0 20upx;
			color: #666666;
		}
	}
	.calendar-box{
		position: relative;
		margin-bottom: 100upx;
	}
	.top-style{
		width: 690upx;
		position: absolute;
		top: -13upx;
		.red{
			width:9upx;
			height:26upx;
			background:rgba(249,93,95,1);
			border-radius:6upx;
		}
	}
	.page{
		background-color: #F9F9F9;
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: 1;
	}
	.info{
		padding-top: 60upx;
		z-index: 2;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		.avatar{
			width:118upx;
			height:118upx;
			background:rgba(236,44,90,1);
			border:3upx solid rgba(255,255,255,1);
			border-radius:50%;
			overflow: hidden;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.nickName{
			margin-bottom: 60upx;
			color: #FFFFFF;
			font-size: 34upx;
		}
	}
	.background-image{
		width:100%;
		height:525upx;
		overflow: hidden;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
		background-color: #F9F9F9;
		.bg-color{
			background:linear-gradient(-50deg,rgba(213,27,71,1),rgba(244,50,96,1));
			box-shadow:0px 15px 40px 0px rgba(98,0,23,0.16);
			width:1500upx;
			height:1500upx;
			border-radius: 100%;
			margin-top: -975upx;
			margin-left: -375upx;
		}
	}
</style>
