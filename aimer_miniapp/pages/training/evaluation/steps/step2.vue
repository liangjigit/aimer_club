<template>
	<view v-if="isShow">
		<view class="box-wrapper">
			<view class="title-box flex align-center">
				<text class="name">身高</text>
				<text class="value flex flex-sub justify-center">
					<text class="num">{{height}}</text>
					<text class="unit self-end">cm</text>
				</text>
			</view>
			<ruler-slider :min="0" :max="300" :def="height" @slide="changeHeight"></ruler-slider>
		</view>
		<view class="box-wrapper" style="padding-top: 90upx;">
			<view class="title-box flex align-center">
				<text class="name">体重</text>
				<text class="value flex flex-sub justify-center">
					<text class="num">{{weight}}</text>
					<text class="unit self-end">kg</text> 
				</text>
			</view>
			<ruler-slider :min="0" :max="300" :def="weight" @slide="changeWeight"></ruler-slider>
		</view>
	</view>
</template>

<script>
	import rulerSlider from '../components/ruler.vue'
	export default{
		props:{
			isShow: Boolean,
			height:{
				type:Number,
				default: 165
			},
			weight:{
				type:Number,
				default: 50
			}
		},
		components:{
			rulerSlider
		},
		data(){
			return{
			}
		},
		methods:{
			changeHeight(options){
				this.$emit("changeHeight",{height:Number(options.curVal)})
			},
			changeWeight(options){
				this.$emit("changeWeight",{weight:Number(options.curVal)})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.box-wrapper{
		padding-top: 140upx;
		padding-bottom: 100;
		.title-box{
			padding: 0 30upx;
			margin-bottom: 55upx;
			.name{
				font-size: 28upx;
				font-weight: 500;
				color: #111111;
				line-height: 1;
			}
			.value{
				.num{
					font-size:56upx;
					font-weight:500;
					margin-right: 34upx;
					color: #EC2C5A;
					line-height: 1;
				}
				.unit{
					color: #999999;
					font-size:28upx;
					line-height: 1;
				}
			}
		}
	}
</style>
