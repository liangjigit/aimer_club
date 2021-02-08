<template>
	<view class="padding-top-lg">
		<title :name="'课程介绍'" class="padding-lr-xs" v-if="courseIntr.catagory.length>0"></title>
		<view class="padding-lr advice margin-bottom-lg flex align-center" v-if="courseIntr.catagory.length>0">
			<button class="cu-btn round" @click="changeCatagory(index)" :class="{active:current == index}" 
			v-for="(item,index) in courseIntr.catagory" :key="index">{{item}}</button>
		</view>
		<view class="intr padding-lr" v-for="(item,index) in courseIntr.contents" :key="index" v-show="current == index">
			{{item}}
		</view>
		<title :name="'动作解析'" class="padding-lr-xs" :isShow="detail.exploded.length>0" ></title>
		<scroll-view scroll-x="true" scroll-with-animation="true" style="height:400upx" class="scroll-view_H" v-if="detail.exploded.length>0">
			<view class="scroll-item inline-flex flex-direction" v-for="(item,index) in detail.exploded" :key="index">
				<view class="image">
					<image :src="item.explodedImg" mode="aspectFill"></image>
				</view>
				<view class="text">
					{{item.explodedExplain}}
				</view>
			</view>
		</scroll-view>
		<title :name="'训练装备'" :isShow="!!detail.goods||detail.goods.length>0" class="padding-lr-xs"></title>
		<view class="products-box flex flex-wrap justify-between h" v-if="detail.goods">
			<view class="product-item flex flex-direction" v-for="(item,index)  in detail.goods" :key="index" @click="toMiniProgram(item.miniappId,item.goodsUrl,item.itemNo,item.goodsCode)">
				<view class="image">
					<image :src="item.goodsImg" mode="aspectFill"></image>
				</view>
				<view class="name text-cut-line2">{{item.goodsName}}</view>
				<view class="price">¥{{item.goodsPrice}}</view>
				<view class="after-box flex align-center justify-between">
					<view class="like">{{item.likeNum}}人喜欢</view>
					<text class="cuIcon-cart" style="color: #CCCCCC;"></text>
				</view>
			</view>
		</view>
		<title :name="'导师简介'" :isShow="!!detail.expert" class="padding-lr-xs"></title>
		<view class="profile" v-if="detail.expert">
			<view class="flex align-center" style="margin-bottom: 24upx;">
				<view class="avatar margin-right">
					<image :src="detail.expert.expertPhoto" mode="aspectFill"></image>
				</view>
				<view class="name">{{detail.expert.expertName}}</view>
			</view>
			<view class="intr">
				{{detail.expert.profile}}
			</view>
		</view>
		<load-more :isLoad="false" :isShow="true"></load-more>
		<home-btn></home-btn>
	</view>
</template>

<script>
	import homeBtn from '@/pages/components/float-button/home.vue'
	import title from '@/pages/components/title-bar/title.vue'
	import loadMore from '@/pages/components/footer/loadMore.vue'
	import {mapActions} from 'vuex'
	export default {
		props:{
			detail:Object
		},
		data(){
			return{
				current:0//,//课程介绍
				// catagory:["练习功效","适应人群","身体反应","练习建议"] //课程介绍分类
			}
		},
		computed:{
			courseIntr(){
				let cates = []
				let conts = []
				if(this.detail){
					const {effect,suitablePeople,bodyReaction,suggest} = this.detail
					if(effect){
						cates.push('练习功效')
						conts.push(effect)
					}
					if(suitablePeople){
						cates.push('适应人群')
						conts.push(suitablePeople)
					}
					if(bodyReaction){
						cates.push('身体反应')
						conts.push(bodyReaction)
					}
					if(suggest){
						cates.push('练习建议')
						conts.push(suggest)
					}
				}
				return {catagory:cates,contents:conts}
			}
		},
		components:{
			title,
			loadMore,
			homeBtn
		},
		methods:{
			changeCatagory(current){
				this.current = current
			},
			toMiniProgram(appId,path,productNo,goodsCode){
				this.$emit('clickGoods',{appId,path,productNo,goodsCode})
			}
		}
	}
</script>

<style lang="scss" scoped>
	video{
		width: 100%;
		height: 100%;
		pointer-events: initial;
		position: relative;
	}
	.cover-top{
		width:100%;
		height:370Upx;
		background: linear-gradient(to bottom,rgba(0,0,0,0.5),rgba(0,0,0,0));
		color: #FFFFFF;
		padding: 24upx 40upx 0;
		font-weight:400;
		
		.title{
			font-size:26upx;
			padding-bottom: 46upx;
		}
		.sub-title{
			font-size:26upx;
		}
		.views{
			padding-top: 10upx;
			font-size:20upx;
			.icon{
				width: 33upx;
				height: 25upx;
				margin-right: 11upx;
			}
		}
	}
	.profile{
		margin-bottom: 49upx;
		padding: 0 36upx;
		.avatar{
			overflow: hidden;
			width: 120upx;
			height: 120upx;
			border-radius: 100%;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.name{
			font-size:32upx;
			font-weight:500;
			color: #111111;
		}
		.intr{
			color: #666666;
			font-size:28upx;
			font-weight:400;
		}
	}
	.products-box{
		padding: 0 17upx;
		margin-bottom: 100upx;
	}
	.product-item{
		margin: 6px;
		width: calc(50% - 12px); 
		// height:495upx;
		background:rgba(255,255,255,1);
		box-shadow:0upx 15upx 60upx 0upx rgba(0,15,41,0.12);
		border-radius:20upx;
		overflow: hidden;
		font-size:26upx;
		font-weight:400;
		.image{
			width:100%;
			height:280upx;
			background:rgba(255,255,255,1);
			margin-bottom: 24upx;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.name{
			width:100%;
			// height:61upx;
			color: #333333;
			padding: 0 23upx;
		}
		.price{
			font-size:26upx;
			padding: 0 23upx;
			color: #EC2C5A;
			padding-top: 31upx;
			margin-bottom: 20upx;
		}
		.after-box{
			padding: 0 23upx;
			margin-bottom: 23upx;
			.like{
				font-size:20upx;
				color:#999999;
			}
			.cuIcon-cart{
				font-size: 36upx;
			}
		}
	}
	.scroll-view_H{
		width: 100%;
		overflow: hidden;
		white-space: nowrap;
		padding: 0 17upx;
		margin-bottom: 60upx;
		.scroll-item{
			overflow: hidden;
			width:467upx;
			margin: 0 12upx;
			
			.image{
				width:100%;
				height:263upx;
				border-radius:20upx;
				margin-bottom: 39upx;
				overflow: hidden;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.text{
				font-size:28upx;
				font-weight:500;
				color: #333333;
				margin-bottom: 68upx;
				line-height:50upx;
				white-space: normal;
			}
		}
	}
	.advice{
		.cu-btn{
			height:54upx;
			background-color:#FFFFFF;
			border-radius:27upx;
			border: 0;
			font-size:28upx;
			font-weight:bold;
			color: #333333;
			&.active{
				background-color:rgba(191,201,216,1);
				color: #FFFFFF;
			}
		}
	}
	.intr{
		font-size:26upx;
		font-weight:400;
		color:#666666;
		line-height:42upx;
		margin-bottom: 80upx;
	}
</style>
