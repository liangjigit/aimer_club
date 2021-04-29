<template>
	<view class="">
		  <progress :percent="progress" activeColor="#EC2C5A" stroke-width="2" backgroundColor="#E5E5E5" />
		  <view class="title-box padding-lr-lg padding-tb">
		  	<text class="num">{{currentStep}}/{{totalStep}}</text><text class="title">{{title}}</text>
		  </view>
		  <step1 :isShow="currentStep == 1" :birthState="birth" :age="age" @selectAge="change('age',$event)" @selectBirthState="change('birth',$event)"></step1>
		  <step2 :isShow="currentStep == 2" :height="height" :weight="weight" @changeHeight="change('height',$event)" @changeWeight="change('weight',$event)"></step2>
		  <step3 :isShow="currentStep == 3" :afterBirth="afterBirth" @select="change('afterBirth',$event)"></step3>
		  <step4 :isShow="currentStep == 4" :step="step" @change="change('step',$event)"></step4>
		  <step5 :isShow="currentStep == 5" :chestExpect="chestExpect" @change="change('chestExpect',$event)"></step5>
		  <step6 :isShow="currentStep == 6" :underBust="underBust" :nippleSpacing="nippleSpacing" :nippleToUnderBreast="nippleToUnderBreast" @changeUnderBust="change('underBust',$event)" @changeNippleToUnderBreast="change('nippleToUnderBreast',$event)" @changeNippleSpacing="change('nippleSpacing',$event)"></step6>
		  <view class="flex justify-center flex-direction align-center" style="margin-bottom: 87upx;">
		  	<button class="cu-btn round lg" @click="nextStep">{{currentStep == 6?"提交":"下一步"}}</button>
			<view class="padding-tb-lg text-red text-df" v-if="currentStep>1" @click="lastStep">
				上一步
			</view>
			<view class="padding-tb text-red text-df" v-if="currentStep == 4" @click="currentStep++">
				跳过此步骤
			</view>
			<view class="padding-tb text-red text-df" v-if="currentStep == 6" @click="submit">
				不方便测量，直接提交
			</view>
		  </view>
	</view>
</template>  

<script>
	const Titles=["请填写您的基本信息","选择你的身高和体重","刚生完宝宝之后，您是否出现以下情况？","按图所示，在一个固定的区域原地踏步，您属于以下哪种情况？","您最希望自己胸部的哪个问题得到改善？","以下三个数据非常重要，请根据图片示意测量"]
	import step1 from './steps/step1.vue'
	import step2 from './steps/step2.vue'
	import step3 from './steps/step3.vue'
	import step4 from './steps/step4.vue'
	import step5 from './steps/step5.vue'
	import step6 from './steps/step6.vue'
	import {mapState,mapActions} from 'vuex'
	function getNowDate(){
		const now = new Date()
		const year = now.getFullYear()
		let month = now.getMonth()+1
		month = month <10 ? ('0' + month) :month
		let day = now.getDate()
		day = day <10 ? ('0' + day) :day
		return year+'-'+ month +'-'+ day
	}
	export default {
		components:{
			step1,
			step2,
			step3,
			step4,
			step5,
			step6
		},
		data(){
			return{
				totalStep: 6,
				currentStep: 1,
				age:"<25", //年龄
				birth:"未生育",//生育情况
				weight:50, //体重
				height:165,//身高
				afterBirth:"",//生完宝宝之后
				step:"闭眼原地踏步，位置移动很明显",//闭眼原地踏步情况
				chestExpect:"",//胸部改善期望
				underBust:80, // 下胸围
				nippleSpacing:80, // 乳点间距
				nippleToUnderBreast:4.9 // 乳点到乳下距离
			}
		},
		computed:{
			progress(){
				return (this.currentStep/this.totalStep)*100
			},
			title(){
				return Titles[this.currentStep-1]
			}
		},
		methods:{
			...mapActions('trainingEvaluation',['saveInfo']),
			change(key,options){
				this[key] = options[key]
			},
			nextStep(){
				if((this.currentStep == 3 &&!this.afterBirth)|| (this.currentStep == 5 && !this.chestExpect)){
					uni.showToast({
						title:'请选择',
						icon:"none" 
					})
					return
				}
				if(this.currentStep >= this.totalStep){
					this.submit()
					return
				}
				if(this.currentStep == 2&&(this.birth === "未生育"||this.birth === "怀孕中")){
					this.currentStep++
				}
				this.currentStep++
			},
			async submit(){
				let {afterBirth,age,birth,chestExpect,evaluationTime,height,nippleSpacing,nippleToUnderBreast,step,underBust,weight} = this
				let response = await this.saveInfo({
					afterBirth,
					age,
					birth,
					chestExpect,
					evaluationTime,
					height,
					nippleSpacing,
					nippleToUnderBreast,
					// phone,
					step,
					underBust,
					// userId,
					weight
				})
				if(response.code == 200){
					let date = getNowDate()
					uni.redirectTo({
						url:"/pages/training/evaluation/report?date="+date
					})
				}
			},
			lastStep(){
				if(this.currentStep>1){ 
					if(this.currentStep == 4&&(this.birth === "未生育"||this.birth === "怀孕中")){
						this.currentStep--
					}
					this.currentStep--
				}
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.cu-btn{
		margin-top: 59upx;
		width:380upx;
		font-weight:500;
		height: 88upx;
		padding: 0;
		color: #2C3850;
		font-size:30upx;
		background:linear-gradient(-50deg,rgba(213,27,71,1),rgba(244,50,96,1));
		box-shadow:0upx 15upx 40upx 0upx rgba(98,0,23,0.16);
		border-radius:44upx;
		border-width: 0;
		color: #FFFFFF;
	}
	
	.cu-progress{
		background-color: #E5E5E5;
		height: 4upx;
	}
	
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
