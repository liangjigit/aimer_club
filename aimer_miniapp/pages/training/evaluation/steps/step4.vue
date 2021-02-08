<template>
	<view class="flex flex-direction justify-center align-center" v-if="isShow">
		<view class="image">
			<image src="/static/training/evaluation/step4/img.png" mode="aspectFit"></image>
		</view>
		<view class="flex flex-direction" style="padding-bottom: 60upx;">
			<select-button :buttonName="Selects[0]" :checked="step == Selects[0]" @select="select(Selects[0])"></select-button>
			<select-button :buttonName="Selects[1]" :checked="step == Selects[1]" @select="select(Selects[1])"></select-button>
		</view>
	</view>
</template>

<script>
	const Selects=["闭眼原地踏步，位置移动很明显","闭眼原地踏步，没有明显的位置移动"]
	import selectButton from '../components/button.vue'
	export default{
		components:{
			selectButton
		},
		props:{
			isShow: Boolean,
			step: {
				type:String,
				default:'闭眼原地踏步，位置移动很明显'
			}
		},
		data(){
			return{
				Selects
			}
		},
		methods:{
			select(step){
				this.$emit('change',{step})
			}	
		}
	}
</script>

<style lang="scss" scoped>
	.image{
		width:356upx;
		height:356upx;
		margin-top: 44upx;
		margin-bottom: 97upx;
		image{
			width: 100%;
			height: 100%;
		}
	}
</style>
