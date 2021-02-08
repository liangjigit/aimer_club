<template>
	<view class="bg-grey flex flex-wrap padding-top-lg justify-center" v-show="isShow">
		<view class="flex flex-wrap" style="width: 708upx;">
			<view class="box" v-for="(item,index) in ways" :key="index">
				<view class="title flex align-center justify-center">
					<image src="/static/integral/signUp-icon.png" mode="aspectFit" v-if="item.key == 'signIn'"></image>
					<image src="/static/integral/cup-icon.png" mode="aspectFit" v-if="item.key == 'cup'"></image>
					<image src="/static/integral/training-icon.png" mode="aspectFit" v-if="item.key == 'posture'"></image>
					<image src="/static/integral/brarts-icon.png" mode="aspectFit" v-if="item.key == 'brarts'"></image>
					<image src="/static/integral/info-icon.png" mode="aspectFit" v-if="item.key == 'userInfo'"></image>
					<image src="/static/integral/invite-icon.png" mode="aspectFit" v-if="item.key == 'userInvite'"></image>
					<text>{{item.ruleName}}</text>
				</view>
				<view class="padding-top-lg padding-bottom flex flex-direction align-center" style="height: 334upx;">
					<view class="count flex align-center">
						<image src="/static/integral/money-icon.png" mode="aspectFit"></image>
						<text>{{item.score}}</text>
					</view>
					<text class="text">{{item.desc||''}}</text>
					<text class="text">{{item.availableScores||''}}</text>
					<text class="text flex-sub">{{item.dayNum||''}}</text>
					<button class="cu-btn round" :class="{hasSign:item.finished}" @click="toPage(item.key)"> 
					<block v-if="!item.finished">
						<text>
							立即前往
						</text>
						<text class="cuIcon-right"></text>
					</block>
					<block v-else-if="item.key == 'userInfo'">
						<text>
							已完成
						</text>
					</block>
					<block v-else>
						<text>
							今日已完成
						</text>
					</block>
					</button>
				</view>
			</view>
		</view>
		<load-more :isLoad="false" :isShow="true"></load-more>
		<sign-popup :isShow="isShowPopup" @close="showSignPopup"></sign-popup>
	</view>
</template>
<script>
	import {mapState,mapActions,mapMutations} from 'vuex'
	import signPopup from './sign-popup.vue'
	import loadMore from '@/pages/components/footer/loadMore.vue'
	import {abnormalprompt} from '@/common/index.js'
	export default{
		components:{
			signPopup,
			loadMore
		},
		computed:{ 
			...mapState('integral',['needSign','signInScore','ways']),
			...mapState('poster',['shareInfo']),
			...mapState('index',['miniProgramShare']),
			...mapState('login',['isDisabledUser'])
		},
		props:{
			isShow:Boolean
		},
		data(){
			return{
				isShowPopup:false
			}
		},
		methods:{
			...mapActions('poster',['getInvitatePoster']),
			...mapMutations('index',['SETSELECTOR']),
			...mapMutations('poster',['GETSHAREINFO','GETINVITEQR']),
			...mapActions('index',['getShareContent']),
			toPage(key){
				switch(key){
					case 'signIn':
						this.showSignPopup()
					break;
					case 'cup':
						this.SETSELECTOR({selector:'#cup-box'})
						uni.switchTab({
							url:'/pages/index/index'
						})
					break;
					case 'posture':
						uni.switchTab({
							url:'/pages/training/index'
						})
					break;
					case 'brarts':
						uni.switchTab({
							url:'/pages/brarts/index'
						})
					break;
					case 'userInfo':
						if(this.isDisabledUser){
							abnormalprompt()
							return 
						}
						uni.navigateTo({
							url:"/pages/account/baseInfo/index"
						})
					break;
					case 'userInvite':
						this.invite()
						
					break;
					
				}
			},
			showSignPopup(){
				this.isShowPopup = !this.isShowPopup
			},
			async invite(){
				let response = await this.getInvitatePoster({})
				if(response.code == 200){
					const {image:poster,userId,inviteQR} = response.data
					await this.getShareContent({})
					const {title,image} = this.miniProgramShare
					this.setShareInfo(image,title,poster,userId,inviteQR)
					uni.navigateTo({
						url:"/pages/poster/index"
					})
				}
			},
			setShareInfo(image,title,poster,userId,inviteQR){
				this.GETINVITEQR({inviteQR})
				this.GETSHAREINFO({shareInfo:{
						title: title,
						image: image || "",
						type: "invitation", 
						poster: poster,
						path: "/pages/index/index?inviteUserId="+userId
					}
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.bg-grey{
		background-color: #F9F9F9;
	}
	.box{
		width:324upx;
		height:424upx;
		background:rgba(254,255,254,1);
		border-radius:20upx;
		margin: 0 15upx;
		margin-bottom: 30upx;
		.count{
			margin-bottom: 60upx;
			image{
				width:23upx;
				height:28upx;
			}
			text{
				font-size:34upx;
				font-weight:400;
				color: #EB1253;
				margin-left: 12upx;
				line-height: 1;
			}
		}
		.text{
			margin-bottom: 12upx;
			font-size:22upx;
			color: #333333;
			line-height: 1;
		}
		.cu-btn{
			width:198upx;
			height:44upx;
			background:linear-gradient(-50deg,rgba(213,27,71,1),rgba(244,50,96,1));
			border-radius:22upx;
			color: #FFFFFF;
			font-size:24upx;
			font-weight:500;
			text-align: center; 
			&.hasSign{
				background: #ffafc1;
			}
			text{
				z-index: 2;
				line-height: 1;
			}
		}
		.title{
			padding:28upx 0;
			border-bottom: 2upx solid #EFEFEF;
			image{
				width:34upx;
				height:33upx;
			}
			text{
				font-size:26upx;
				font-weight:500;
				color: #111111;
				line-height: 1;
				margin-left: 16upx;
			}
		}
	}
</style>
