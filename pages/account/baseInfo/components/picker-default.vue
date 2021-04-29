<template>
	<view class="cu-form-group padding-lr-0 padding-tb-xs margin-lr">
		<view class="title">{{title}}<text class="unit">{{unit}}</text></view>
		<picker @change="change" v-model="value" :range="range" >
			<view class="picker">
				{{range[value]||"请选择"}}
			</view>
		</picker>
	</view>
</template>

<script>
	export default{
		props:{
			title:String,
			range:Array,
			value:{
				type:Number,
				default:0
			},
			unit: String,
		},
		methods:{
			change(e){
				this.$emit("change",{value:Number(e.detail.value)})
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
		picker .picker{
			font-size: 30upx;
			color: #9A9A9A;
		}
	}
</style>
