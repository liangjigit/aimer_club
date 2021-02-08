<template>
<view class="cu-card case">
	<view class="cu-item shadow" v-for="(item,index) in list" :key="item.code" @click="goDetail(item.code)">
		<view class="image">
		  <image :src="item.img" mode="widthFix"></image> 
		</view>
		<view class="cu-bar bg-white text-title flex flex-direction">
			<text class="text-lg margin-bottom-sm title text-cut-line2" style="width: 100%;">{{item.title}}</text>
			<view class="text-gray flex justify-between align-center" style="width: 100%;">
				<text class="text-black text-sm">{{item.browseUserCount}} 人感兴趣</text>
				<view class="padding-bottom">
					<button class="cu-btn round lg text-df" :class="{'bg-gray text-gray':isActivity&&!item.isApply&&item.isApplyEnd,'bg-red':(isActivity&&(!item.isApplyEnd||item.isApply))||!isActivity}" style="font-weight: 500;">
					{{isActivity?(item.isApply?isApplyText:(item.isApplyEnd?isApplyEndText:btnText)):btnText}}</button>
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
			btnText:String,
			isApplyText:String,
			isActivity:Boolean,
			isApplyEndText:String
		},
		methods:{
			goDetail(code){
				this.$emit('click',{code})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.cu-card.case .image{
		width: 690upx;
		height: 376upx;
		border-radius: 20upx;
		overflow: hidden;
	}
	.cu-card.case .image image{
		width: 100%;
	}
	
	.cu-card>.cu-item{
		width: 690upx;
		border-radius:20upx;
		box-shadow:0upx 15upx 60upx 0upx rgba(0,15,41,0.08);
		margin: 22upx 30upx;
	}
	.text-title{
		padding: 24upx 24upx 10upx;
		.title {
			font-weight:500;
			line-height:50upx;
			color: #2C3850;
		}
	}
	.text-df{
		font-size: 26upx;
	}
	.cu-btn{	
		min-width: 210upx;
		height: 66upx;
	}

</style>
