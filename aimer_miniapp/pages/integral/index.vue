<template>
	<view style="padding-top: 48upx;" >
		<view class="flex flex-direction justify-center" v-if="isLogin">
			<view class="flex justify-end margin-bottom padding-lr">
				<button class="cu-btn round" @click="goIntegral">
					<view class="icon-shop">
						<image src="/static/integral/shop-icon.png" mode="aspectFit"></image>
					</view>
					<text class="text-red">积分商城</text>
				</button>
			</view>
			<view class="flex justify-center align-end">
				<text class="integral"  v-show="userInfo">{{userInfo.currentIntegral}}</text>
				<text class="unit">积分</text>
			</view>
			<view class="flex flex-direction justify-center align-center margin-top-lg">
				<text class="text">购买原价商品时，10积分可抵1元钱</text>
				<text class="text" >可在积分商城兑换精美礼物</text>
			</view>
			<view class="tabbar-box flex align-stretch justify-center text-center">
				<text class="flex-sub" :class="{active:current==1}" @click="current=1">如何赚积分</text>
				<text class="flex-sub" :class="{active:current==2}" @click="current=2">积分明细</text>
			</view>
		</view> 
		<view v-if="isLogin">
			<ways :isShow="current==1"></ways>
			<record :isShow="current==2" :isLoading="isLoading"></record>
		</view> 
		<login-pupop ref="login" :isDefault="true" defaultTitle="查看赚积分攻略" :defaultDesc="'首次完成最少可获得70积分'"></login-pupop>
	</view>
</template>

<script>
	import ways from './components/ways.vue'
	import record from './components/recode.vue'
	import {mapState,mapActions,mapGetters} from 'vuex' 
	import login from '@/common/login.js'
	export default {
		mixins:[login],
		components:{
			ways,
			record
		},
		data(){
			return{
				lowestIntegral:0,
				current:1,
				isLoading:false
			}
		},
		computed:{
			...mapState('login',['userInfo']),
			...mapState('integral',['ways','list','pageNum','pageSize','totalSize']),
			...mapGetters('login',['isLogin']),
			getDetailForCup(){
				if(this.isLogin){
					this.getSignWays({})
					this.getSignRecord({})
					this.isLoading = true
					this.getFlow(true)
				}
				return this.isLogin
			}
		},
		async created() {
			// let response = await this.getLowestIntegral({})
			// if(response.code == 200){
			// 	this.lowestIntegral = response.data
			// }
		},
		onShow() {
			this.$refs.login.checkLogin()
			// if(this.isLogin){
			// 	this.getSignWays({})
			// 	this.getSignRecord({})
			// 	this.isLoading = true
			// 	this.getFlow(true)
			// }
		},
		async onReachBottom() {
			if(this.current == 2){
				if(this.totalSize == this.list.length || this.isLoading){
					return
				}
				this.isLoading = true
				this.getFlow()
			}
		},
		methods:{
			...mapActions('integral',['getSignWays','getSignRecord','getIntegralRecord','getLowestIntegral']),
			// 跳转到积分商城
			goIntegral(){
				uni.navigateToMiniProgram({
					appId:'wx203ab2d5cb638d1d',
					path:'/integral_mall/index/index'
				})
			},
			async getFlow(isRefresh){
				let pageIndex = isRefresh? 1 : this.pageNum + 1
				let response = await this.getIntegralRecord({
					pageNum: pageIndex,
					pageSize: this.pageSize 
				})
				this.isLoading = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.cu-btn{
		width:192upx;
		height:66upx;
		border:2upx solid rgba(204,204,204,1);
		background-color: #FFFFFF;
		padding: 0 18upx;
		.icon-shop{
			width:30upx;
			height:30upx;
			margin-right: 16upx;
			z-index: 1;
			image{
				width: 100%;
				height: 100%;
			}
		}
		text{
			z-index: 1;
			color: #EC2C5A;
			font-size:26upx;
			font-weight:400;
			line-height: 1;
		}
	}
	.integral{
		font-size:80upx;
		font-weight:500;
		color: #EC2C5A;
		margin-right: 39upx;
		line-height: 1;
	}
	.unit{
		font-size:26upx;
		font-weight:400;
		color: #BBBBBB;
		line-height: 1.4;
	}
	.text{
		font-size:26upx;
		font-weight:400;
		color: #BBBBBB;
		margin-bottom: 22upx;
	}
	.tabbar-box{
		height: 100upx;
		border-top: 2upx solid #EEEEEE;
		margin-top: 14upx;
		text{
			font-size:30upx;
			font-weight:500;
			color: #111111;
			padding: 34upx 0;
			line-height: 1;
			&.active{
				color: #EC2C5A;
			}
		}
	}
	
</style>
