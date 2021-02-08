<template>
	<view class="text-center" v-if="isShow">
		<text class="text-gray">(可多选)</text>
		<view class="select-box flex justify-around">
			<select-option :checked="chestExpects.indexOf(Selects[0])>=0" :title="Selects[0]" @select="select(Selects[0])" :img="'/static/training/evaluation/step5/check-img-1.png'"></select-option>
			<select-option :checked="chestExpects.indexOf(Selects[1])>=0" :title="Selects[1]" @select="select(Selects[1])" :img="'/static/training/evaluation/step5/check-img-2.png'"></select-option>
		</view>
		<view class="select-box flex justify-around">
			<select-option :checked="chestExpects.indexOf(Selects[2])>=0" :title="Selects[2]" @select="select(Selects[2])" :img="'/static/training/evaluation/step5/check-img-3.png'"></select-option>
			<select-option :checked="chestExpects.indexOf(Selects[3])>=0" :title="Selects[3]" @select="select(Selects[3])" :img="'/static/training/evaluation/step5/check-img-4.png'"></select-option>
		</view>
		<view class="select-box flex justify-around">
			<select-option :checked="chestExpects.indexOf(Selects[4])>=0" :title="'底围小 隆起高'" @select="select(Selects[4])" :img="'/static/training/evaluation/step5/check-img-5.png'"></select-option>
			<select-option :checked="chestExpects.indexOf(Selects[5])>=0" :title="'我是完美小仙女，没问题'" @select="select(Selects[5])" :img="'/static/training/evaluation/step5/check-img-6.png'"></select-option>
		</view>
	</view>
</template>

<script>
	const Selects=["腋下有多余赘肉","乳点低于胸水平线","乳点间距过大","胸部面积大底围不明显","底围小隆起高","我是小仙女"]
	import selectOption from '../components/option.vue'
	export default{
		components:{
			selectOption
		},
		props:{
			isShow: Boolean,
			chestExpect:String
		},
		data(){
			return{
				Selects,
				chestExpects:[]
			}
		},
		computed:{
			expects(){
				let expects = this.chestExpect.length>0?this.chestExpect.split(';'):[]
				return [...expects] 
			}
		},
		methods:{
			select(select){
				this.chestExpects = this.expects
				const index = this.chestExpects.indexOf(select)
				if(index>=0){
					this.chestExpects.splice(index,1)
				}else{
					this.chestExpects.push(select)
				}
				if(this.chestExpects.indexOf(Selects[5])>=0){
					this.chestExpects = []
					this.chestExpects.push(select)
				}
				this.$emit('change',{chestExpect:this.chestExpects.join(";")})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.select-box{
		padding: 30upx 50upx;
	}
</style>
