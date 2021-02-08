<template>
	<view class="flex align-center flex-direction">
		<view class="title">
			请确认您需要获取电子券密码的会员卡
		</view>
		<view class="carmi-box flex flex-direction align-center">
			<view class="bg-white  flex flex-direction align-center justify-center count">
				<view class="card-info flex align-center justify-center">
					<text class="margin-right:20upx">{{userInfo.level}}</text>
					<text>{{userInfo.memberNo||""}}</text>
				</view>
				<view class="rest text-center">
					剩余 {{amount||0}} 电子券
				</view>
			</view>
			<view v-show="hasCarmi&&password" class="password flex flex-direction align-center justify-center bg-white">
				<text class="name">您的密码</text>
				<text class="value">{{password}}</text>
			</view>
		</view>
		<button class="cu-btn round lg" :disabled="amount<=0" v-if="!hasCarmi" @click="showPassword">
			获取密码
		</button>
		<button class="cu-btn round lg" v-else @click="getElectronic">
			重新获取
		</button>
		<view class="tip">
			提示：电子券密码实时有效，消费使用时获取，密码妥善保存。
		</view>
	</view>
</template>

<script>
	import request from '@/utils/request.js'
	import {mapState} from 'vuex'
	import {abnormalprompt} from '@/common/index.js'
	export default{
		data(){
			return{
				hasCarmi:false,
				amount:0,
				password:""
			}
		},
		computed:{
			...mapState('login',['userInfo','isDisabledUser']),
		},
		created() {
			this.getElectronic()
		},
		methods:{
			showPassword(){
				if(this.isDisabledUser){
					abnormalprompt()
					return
				}
				this.hasCarmi=true
			},
			async getElectronic(){
				if(this.isDisabledUser){
					abnormalprompt()
					return
				}
				let response = (await request({
					url:'/user/miniapp/user/auth/electronic/query',
					method:'GET',
					data:{}
				})).data;
				if(response.code == 200){
					let {amount,memberNo,password} = response.data
					this.amount = amount
					this.password = password
				}
			}
		}
	}
</script>
<style>
	page{
		background-color: #F9F9F9;
	}
</style>
<style lang="scss" scoped>
	.title{
		font-size:38upx;
		font-weight:500;
		color: #2C3850;
		margin-top: 128upx;
	}
	.tip{
		font-size:24upx;
		font-weight:400;
		color: #666666;
	}
	.cu-btn{
		width:590upx;
		height:88upx;
		background:linear-gradient(-50deg,rgba(213,27,71,1),rgba(244,50,96,1));
		box-shadow:0upx 15upx 40upx 0upx rgba(98,0,23,0.16);
		margin-bottom: 51upx;
		color: #FFFFFF;
		margin-top: 190upx;
		&[disabled]{
			background: #dfdfdf;
			box-shadow: none;
			color: #FFFFFF;
		}
	}
	.carmi-box{
		width:590upx;
		padding: 72upx 25upx 30upx 25upx;
		border-radius:20upx;
		background-color: #FFFFFF;
		margin-top: 89upx;
		overflow: hidden;
		.count{
			width: 100%;
			padding-bottom: 55upx;
		}
		.card-info{
			font-size:28upx;
			font-weight:400;
			color: #2C3850;
			margin-bottom: 38upx;
			text{
				line-height: 1;
			}
		}
		.rest{
			font-size:38upx;
			font-weight:500;
			color: #2C3850;
			line-height: 1;
		}
	}
	.password{
		color: #EC2C5A;
		border-top: 2upx solid #DDDDDD;
		height: 209upx;
		border-bottom-right-radius:20upx;
		border-bottom-left-radius: 20upx;
		width: 100%;
		.name{
			font-size:28upx;
			margin-bottom: 30upx;
			line-height: 1;
		}
		.value{
			font-size:48upx;
			font-weight:500;
			line-height: 1;
		}
	}
</style>
