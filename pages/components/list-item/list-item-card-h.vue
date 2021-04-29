<template>
	<view class="flex justify-center" v-if="!isEmpty">
		<view class="card-list flex flex-direction justify-center align-center flex-wrap">
			<view class="card-list-item flex justify-between" v-for="(item,index) in list" :key="index" @click="goDetail(item.courseCode)">
				<view class="image flex align-center justify-center">
				  <image :src="item.img" mode="aspectFill"></image>
				  <view class="play-btn flex align-center justify-center">
				  	<text class="cuIcon-playfill text-white" style="font-size: 40upx;"></text>
				  </view>
				</view>
				<view class="bg-white flex-sub content">
					<view class="flex justify-center align-center margin-bottom" style="width: 100%;">
						<view class="text-grey flex-sub text-cut text-xs">{{item.browseUserCount}}人已练习</view>
						<view class="icon text-gray text-xxs" v-show="showStart">
							<text class="text-xxs" style="margin-right: 12upx;">开始第{{item.exerciseNum+1}}次练习</text>
							<text class="cuIcon-right text-xs"></text>
						</view>
					</view>
					<view class="margin-bottom text-cut text-black margin-bottom" style="margin-bottom: 47upx;">
						{{item.title}}</view> 
					<view class="text-cut text-gray text-xs" style="width: 100%;margin-bottom: 10upx;">
						{{item.videoExplain}}
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
			showStart:{
				type:Boolean,
				default:true
			}
		},
		computed:{
			isEmpty(){
				return this.list.length == 0
			}
		},
		methods:{
			goDetail(code){
				this.$emit('goDetail',{code})
			},
			add(){
				this.$emit('add')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.card-list .card-list-item{
		width:690upx;
		height:200upx;
		background:rgba(255,255,255,1);
		box-shadow:0upx 15upx 60upx 0upx rgba(0,15,41,0.12);
		border-radius:20upx;
		margin: 20upx 30upx;
		overflow: hidden;
		.image{
			// width:268upx;
			width:150upx;
			height:100%;
			overflow: hidden;
			position: relative;
			image{
				width: 100%;
				height: 100%;
			}
			.play-btn{
				position: absolute;
				top: 70upx;
				left: 45upx;
				z-index: 2;
				width:60upx;
				height:60upx;
				background:rgba(0,7,27,0.6);
				border-radius:100%;
				image{
					width:31upx;
					height:31upx;
				}
			}
		}
	}
	.content{
		padding: 24upx 23upx;
		width: 400upx;
	}
	.text-grey{
		color: #666666;
	}
	.text-gray{
		color: #999999;
	}
	.text-black{
		color: #111111;
	}
	.text-df{
		font-size: 26upx;
	}
	.text-xxs{
		font-size: 18upx;
	}
	text,view{
		line-height: 1;
	}
	
</style>
