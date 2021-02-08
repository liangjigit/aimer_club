<template>
	<view class="flex justify-center" v-if="!isEmpty">
		<view class="cu-card case flex justify-between flex-wrap">
			  <view class="cu-item" v-for="(item,index) in list" :key="index" @click="goDetail(item.courseCode)">
					<view class="new-icon" v-if="index == 0">
						<image src="/static/training/new-icon.png" mode="aspectFit"></image>
					</view>
					<view class="exerciseNum">{{item.browseUserCount}}人已练习</view>
			  		<view class="image">
			  		  <image :src="item.img" mode="widthFix"></image>
			  		</view>
			  		<view class="cu-bar bg-white text-title flex flex-direction padding padding-top-lg">
			  			<view class="margin-bottom title text-cut">{{item.title}}</view> 
			  			<view class="flex justify-between" style="width: 100%;">
			  				<view class="sub-title flex-sub text-cut-line2">{{item.videoExplain}}</view>
			  				<view class="icon" @click.stop="add(item.courseCode,item.collect)">
			  					<image src="/static/training/focus-icon.png" mode="aspectFit" v-show="!item.collect"></image>
			  					<image src="/static/training/focused-icon.png" mode="aspectFit" v-show="item.collect"></image>
			  				</view>
			  			</view>
			  		</view>
			  </view>
		</view> 
	</view>
</template>

<script>
	export default{
		props:{
			list:Array
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
			add(code,isCollect){
				this.$emit('add',{code,isCollect})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.exerciseNum{
		position: absolute;
		top: 24upx;
		left: 24upx;
		color: #FFFFFF;
		font-size: 24upx;
		font-weight:400;
		z-index: 2;
	}
	.new-icon{
		position: absolute;
		top: 0;
		right: 0;
		width: 81upx;
		height: 81upx;
		z-index: 2;
		image{
			width: 100%;
			height: 100%;
		}
	}
	.title{
		font-size:28upx;
		font-weight:500;
		color: #111111;
		width: 100%;
		text-align: left;
		padding: 0 4upx;
		overflow: hidden;
		line-height: 1;
	}
	.sub-title{
		color: #666666;
		font-size:20upx;
		line-height:30upx;
		margin-left: 2upx;
		width: 200upx;
		flex: 1;
	}
	.cu-card{
		width: 708upx;
	}
	.cu-card>.cu-item{
		margin: 0;
		border-radius: 20upx;
		box-shadow:0upx 15upx 60upx 0upx rgba(0,15,41,0.12);
		margin-bottom: 40upx;
		margin-right:13upx;
		margin-left:13upx;
		width:324upx;
		position: relative;
	}
	.cu-card.case .image {
		width:324upx;
		height:432upx;
		border-radius: 20upx;
		overflow: hidden;
		image{
			width: 100%;
		}
	}
	.icon{
		width:72upx;
		height:60upx;
		overflow: hidden;
		padding-left: 40upx;
		padding-top: 4upx;
		image{
			width: 100%;
			height: 100%;
		}
	}
</style>
