<template>
	<view class="" v-if="!isEmpty">
		<view class="item flex" v-for="(item,index) in list" :key="index" @click.stop="goDetail(item.articleCode)">
			<image src="/static/cup/new-icon.png" class="new-icon" mode="aspectFit" v-if="index==0&&isShowNew"></image>
			<view class="face">
				<image class="image1" :src="item.img" mode="aspectFill"></image>
			</view>
			 <view class="content flex flex-direction flex-sub">
			 	<text class="title text-cut-line2">{{item.title}}</text>
				<view class="sign flex flex-sub" v-if="item.tags&&item.tags.length>0">
					<text class="text1" v-for="(tag, tagIndex) in item.tags" :key="tagIndex">{{tag}}</text>
				</view>
				<view class="tutor flex flex-direction">
					<view class="flex align-center margin-bottom" v-if="item.expertName">
						<view class="avatar">
							<image class="image2" :src="item.expertPhoto" mode="aspectFill"></image>
						</view>
						<view class="info">
							<view class="name">
								{{item.expertName}}
							</view> 
							<view class="position text-cut">
								{{item.profile}}
							</view>
						</view> 
					</view>
					<view class="flex align-center justify-between">
						<text class="text-red text-sm">{{item.browseUserCount}}人已Get</text>
						<image class="icon-like" :src="item.isCollect?'/static/like-icon.png':'/static/dislike-icon.png'" mode="aspectFit" @click.stop="doCollect(item.articleCode,item.isCollect)"></image>
					</view>
				</view>
			 </view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			list:Array,
			isShowNew:Boolean
		},
		computed:{
			isEmpty(){
				return this.list.length == 0
			}
		},
		methods:{
			goDetail(code){
				this.$emit('click',{code})
			},
			doCollect(code,isCollect){
				console.log(code)
				this.$emit('doCollect',{code,isCollect})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.item{
		width:690upx;
		height:410upx;
		background:rgba(255,255,255,1);
		box-shadow:0upx 15upx 60upx 0upx rgba(0,15,41,0.12);
		border-radius:20upx;
		padding: 40upx 30upx;
		margin-bottom: 30upx;
		position: relative;
		overflow: hidden;
		.new-icon{
			position: absolute;
			left: 0;
			top: 0;
			width: 81upx;
			height: 81upx;
			z-index: 1;
		}
		.face{
			width:210upx;
			height:330upx;
			border-radius:10upx;
			margin-right: 26upx;
			overflow: hidden;
			flex-shrink: 0;
			.image1{
				width: 100%;
				height: 100%;
			}
		}
		.content{
			.tutor{
				width: 100%;
				.avatar{
					width:72upx;
					height:72upx;
					border-radius:100%;
					margin-right: 25upx;
					overflow: hidden;
					.image2{
						width:100%;
						height: 100%;
					}
				}
				.info{
					.name{
						font-size:28upx;
						font-weight:500;
						color: #111111;
					}
					.position{
						width: 322rpx;
						font-size:22upx;
						font-weight:400;
						color: #999999;
					}
				}
			}
			.title{
				font-size:28upx;
				font-weight:500;
				color: #111111;
				line-height:44upx;
				margin-bottom: 30upx;
			}
			.sign{
				flex-wrap: wrap;
				align-items: baseline;
				.text1{
					font-size:24upx;
					font-weight:400;
					color: #BBBBBB;
					padding-right: 12upx;
				}
			}
			.icon-like{
				width: 26upx;
				height: 26upx;
				margin-right: 12upx;
			}
		}
	}
</style>
