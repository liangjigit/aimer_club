<template>
	<view class="" v-if="isShow">
		<view class="title flex justify-center align-center">
			<view class="img">
				<image src="/static/training/evaluation/step3/check-img-1.png" mode="aspectFit"></image>
			</view>
			<view class="flex flex-direction">
				<view class="name">下胸围</view>
				<view class="flex align-end value">
					<text class="num">{{underBust}}</text>
					<text class="unit">cm</text>
				</view>
			</view> 
		</view>
		<ruler-slider :min="0" :max="300" :def="80" @slide="changeUnderBust"></ruler-slider>
		
		<view class="title flex justify-center align-center">
			<view class="img">
				<image src="/static/training/evaluation/step3/check-img-1.png" mode="aspectFit"></image>
			</view>
			<view class="flex flex-direction">
				<view class="name">乳点到乳下距离</view>
				<view class="flex align-end value">
					<text class="num">{{nippleToUnderBreast}}</text>
					<text class="unit">cm</text>
				</view>
			</view> 
		</view>
		<ruler-slider :min="0" :max="500" :def="49" :step="1" :currentStep="0.1" @slide="changeNippleToUnderBreast"></ruler-slider>
		
		<view class="title flex justify-center align-center">
			<view class="img">
				<image src="/static/training/evaluation/step3/check-img-1.png" mode="aspectFit"></image>
			</view>
			<view class="flex flex-direction">
				<view class="name">乳点间距</view>
				<view class="flex align-end value">
					<text class="num">{{nippleSpacing}}</text>
					<text class="unit">cm</text>
				</view>
			</view> 
		</view>
		<ruler-slider :min="0" :max="300" :def="80" @slide="changeNippleSpacing"></ruler-slider>
	</view>
</template>

<script>
	import rulerSlider from '../components/ruler.vue'
	export default{
		components:{
			rulerSlider
		},
		props:{
			isShow: Boolean,
			underBust:{
				type:Number,
				default:80
			},
			nippleSpacing:{
				type:Number,
				default:80
			},
			nippleToUnderBreast:{
				type:Number,
				default:4.8
			}
		},
		data(){
			return{
			}
		},
		methods:{
			changeUnderBust(options){
				this.underBust = options.curVal
				this.$emit('changeUnderBust',{underBust:options.curVal})
			},
			changeNippleToUnderBreast(options){
				const currentStep = 0.1
				const nippleToUnderBreast = Number((options.curVal * currentStep).toFixed(1))
				this.$emit('changeNippleToUnderBreast',{nippleToUnderBreast})
			},
			changeNippleSpacing(options){
				this.$emit('changeNippleSpacing',{nippleSpacing:options.curVal})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.title{
		padding-top: 46upx;
		.img{
			width: 164upx;
			height: 164upx;
			margin-right: 47upx;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.name{
			font-size:28upx;
			font-weight:500;
			color: #111111;
			margin-bottom: 39upx;
		}
		.value{
			.num{
				font-size:56upx;
				font-weight:500;
				color: #EC2C5A;
			}
			.unit{
				color: #999999;
				font-size:28upx;
			}
		}
	}
</style>
