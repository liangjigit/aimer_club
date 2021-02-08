<template>
	<view class="cu-form-group padding-lr-0 padding-tb-xs margin-lr">
		<view class="title">{{title}}<text class="unit">{{unit}}</text></view>
		<picker @change="change" :value="value" mode="date" :start="start" :end="end">
			<view class="picker">
				{{value||"未填写"}}
			</view>
		</picker>
	</view>
</template>

<script>
	function getDate(type) {
		const date = new Date();
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();

		if (type === 'start') {
			year = year - 100;
		} else if (type === 'end') {
			year = year + 100;
		}
		month = month > 9 ? month : '0' + month;;
		day = day > 9 ? day : '0' + day;
		return `${year}-${month}-${day}`;
	}
	export default{
		props:{
			title:String,
			value:String,
			start:{
				type:String,
				default: getDate('start')
			},
			end:{
				type:String,
				default:getDate('end')
			},
			unit: String,
		},
		created() {
			this.value
		},
		methods:{
			change(e){
				this.$emit("change",{value:e.detail.value})
			},
			
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
