<template>
	<view class="step1 padding-tb-lg padding-lr-lg flex flex-direction" v-if="isShow">
		 <view class="flex justify-between">
			<view class="left">
				<!-- <image src="/static/training/evaluation/step1/test-girl.png" mode="aspectFit"></image> -->
				<image src="https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1596806451112" mode="aspectFit"></image>
			</view>
			<view class="right flex flex-direction align-center">
				<text class="step-title">设定年龄阶段 (岁)</text>
				<view class="select-v flex flex-direction align-center justify-between">
					<view class="option" @click="selectAge(item)" :class="{active:item == age}" v-for="(item,index) in Ages" :key="index">{{item}}</view>
				</view>
			</view>
		 </view>
		<view class="bottom flex flex-direction align-center">
			<text class="step-title">生育情况</text>
			<view class="select-h flex align-center justify-between">
				<view class="option" @click="selectBirthState(item)" :class="{active:item == birthState}" v-for="(item,index) in BirthStates" :key="index">{{item}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	const Ages = ["<25","26-30","31-35","36-40",">40"]
	const BirthStates = ["未生育","怀孕中","已生育"]
	export default{
		props:{
			isShow:Boolean,
			age:{
				type:String,
				default:"<25"
			},
			birthState:{
				type:String,
				default:"未生育"
			}
		},
		data(){
			return{
				Ages,
				BirthStates,
			}
		},
		methods:{
			selectAge(age){
				this.$emit('selectAge',{age})
			},
			selectBirthState(birth){
				this.$emit('selectBirthState',{birth})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.step1{
		.left{
			width: 312upx;
			height: 600upx;
			margin-left: 60upx;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.bottom{
			width: 690upx;
			padding-top: 45upx;
			.select-h{
				width:100%;
				height:85upx;
				background-color: rgba(255,255,255,1);
				border:1upx solid rgba(209,186,186,1);
				box-shadow:0upx 12upx 0upx 0upx rgba(238,220,216,1);
				border-radius:43upx;
				overflow: hidden;
				.option{
					width: 230upx;
					border-right: 1upx solid #D1BABA;
					height: 100%;
					line-height: 85upx;
					color: #111111;
					text-align: center;
					&:first-child{
						border-top-left-radius:20upx;
						border-bottom-left-radius:20upx;
					}
					&:last-child{
						border-right-width: 0;
						border-top-right-radius:20upx;
						border-bottom-right-radius:20upx;
					}
					&.active{
						background-color:rgba(255,240,240,1);
						box-shadow: inset 0upx 20upx 0upx 0upx rgba(249,221,221,1);
						font-size:28upx;
						font-weight:500;
						color: #EC2C5A;
					}
				}
			}
			.step-title{
				font-size:28upx;
				margin-bottom: 30upx;
				line-height: 1;
				color: #111111;
			}
		}
		.right{
			width: 230upx;
			text-align: center;
			.select-v{ 
				width:210upx;
				background-color:rgba(255,255,255,1);
				border:1upx solid rgba(209,186,186,1);
				box-shadow:7upx 10upx 0upx 0upx rgba(238,220,216,1);
				border-radius:30upx;
				overflow: hidden;
				.option{
					width: 100%;
					border-bottom: 1upx solid #D1BABA;
					height: 96upx;
					line-height: 96upx;
					color: #111111;
					&:last-child{
						border-width: 0;
						border-bottom-right-radius:30upx;
						border-bottom-left-radius:30upx;
					}
					&.active{
						background-color:rgba(255,240,240,1);
						box-shadow:inset 0upx 18upx 0upx 0upx rgba(249,221,221,1);
						font-size:28upx;
						font-weight:500;
						color: #EC2C5A;
					}
				}
			}
			
			.step-title{
				font-size:28upx;
				padding-bottom: 59upx;
				line-height: 1;
			}
		}
	}
</style>
