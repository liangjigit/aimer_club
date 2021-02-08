<template>
	<view class="cu-form-group padding-lr-0 padding-tb-xs margin-lr">
		<view class="title">{{title}}<text class="unit">{{unit}}</text></view>
		<input class="text-right" :disabled="disabled":type="type" :placeholder="placeholder" :value="value" @input="inputHandle"></input>
	</view>
</template>

<script>
	export default{
		props:{
			title:String,
			placeholder:String,
			disabled:{
				type:Boolean,
				default:false
			},
			value: String || Number,
			unit: String,
			type:String,
			field:String
		},
		data(){
			return{
				inputValue:this.value
			}
		},
		methods:{
			inputHandle(e){
				this.$emit('input',{value:e.detail.value})
				let strategy = {
					realname:function(){
						return e.detail.value.replace(/\d/g,"")
					},
					phone:function(){
						return e.detail.value.replace(/\D/g,"")
					}
				}
				if(strategy[this.field]){
					return strategy[this.field]()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.cu-form-group {
		border-bottom: 1upx solid #f9f9f9;
		.title{
			font-size: 34upx;
			height: auto;
			line-height: 1;
			.unit{
				color: #9A9A9A;
				font-size: 24upx;
				align-self: flex-end;
				padding-left: 10upx;
			}
		}
		input{
			font-size: 30upx;
			line-height: 1;
			color: #9A9A9A;
		}
	}
</style>
