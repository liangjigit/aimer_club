<template>
	<view class="text-center" v-if="isShow">
		<text class="text-gray">(可多选)</text>
		<view class="select-box flex justify-around">
			<select-option :checked="selectsStates.indexOf(Selects[0])>=0" :title="Selects[0]" @select="select(Selects[0])" :img="'/static/training/evaluation/step3/check-img-1.png'"></select-option>
			<select-option :checked="selectsStates.indexOf(Selects[1])>=0" :title="Selects[1]" @select="select(Selects[1])" :img="'/static/training/evaluation/step3/check-img-2.png'"></select-option>
		</view>
		<view class="select-box flex justify-around">
			<select-option :checked="selectsStates.indexOf(Selects[2])>=0" :title="Selects[2]" @select="select(Selects[2])" :img="'/static/training/evaluation/step3/check-img-3.png'"></select-option>
		</view>
		<view class="select-box flex justify-around">
			<select-option :checked="selectsStates.indexOf(Selects[3])>=0" :title="'经常不自觉<br/>凸起小肚子'" @select="select(Selects[3])" :img="'/static/training/evaluation/step3/check-img-4.png'"></select-option>
			<select-option :checked="selectsStates.indexOf(Selects[4])>=0" :title="Selects[4]" @select="select(Selects[4])" :img="'/static/training/evaluation/step3/check-img-5.png'"></select-option>
		</view>
	</view>
</template>

<script>
	const Selects=["胸部比较松弛","臀部比较松弛","经常腰痛","经常不自觉凸起小肚子","小肚子比较明显"]
	import selectOption from '../components/option.vue'
	export default{
		components:{
			selectOption
		},
		props:{
			isShow: Boolean,
			afterBirth:String
		},
		data(){
			return{
				Selects,
				selectsStates:[]
			}
		},
		computed:{
			birthStates(){
				let birthStates = this.afterBirth.length>0?this.afterBirth.split(';'):[]
				return [...birthStates] 
			}
		},
		methods:{
			select(afterBirth){
				this.selectsStates = this.birthStates
				const index = this.selectsStates.indexOf(afterBirth)
				if(index>=0){
					this.selectsStates.splice(index,1)
				}else{
					this.selectsStates.push(afterBirth)
				}
				this.$emit('select',{afterBirth:this.selectsStates.join(";")})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.select-box{
		padding: 30upx 0;
	}
	
	.text-gray{
		color: #2C3850;
		font-size: 28upx;
		margin-bottom: 10upx;
	}
</style>
