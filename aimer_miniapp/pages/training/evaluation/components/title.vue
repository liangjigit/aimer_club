<template>
	<view class="title-box padding-lr-lg padding-tb">
		<text class="num">{{current}}/{{total}}</text><text class="title">{{title}}</text>
	</view>
</template>

<script>
	const Titles=["请填写您的基本信息","选择你的身高和体重","刚生完宝宝之后，您是否出现以下情况？","按图所示，在一个固定的区域原地踏步，您属于以下哪种情况？","您最希望自己胸部的哪个问题得到改善？","以下三个数据非常重要，请根据图片示意测量"]
	export default{
		props:{
			current:Number,
			total:Number
		},
		computed:{
			title(){
				return Titles[this.current-1]
			}
		}
	}
</script>

<style lang="scss" scoped>
	.title-box{
		text-align: center;
		width: 100%;
		display: flex;
		align-items: baseline;
		justify-content: center;
		text{
			font-size:34upx;
			font-weight:500;
		}
		.title{
			color: #000000;
			line-height:60upx;
			text-align: left;
			display: inline-flex;
		}
		.num{
			margin-right: 24upx;
			color: #EC2C5A;
		}
	}
</style>
