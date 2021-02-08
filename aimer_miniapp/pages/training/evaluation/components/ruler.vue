<template>
	<view class="box">
		<text class="cursor"></text>
		<scroll-view scroll-x="true" :scroll-left="salNum" scroll-with-animation="true" @scroll="bindscroll" style="height:150rpx">
			<view class="scroller" :style="{width:scaleWidth}" >
				<text v-for="(item,index) in count" :key="index" :class="{big:(((item+min)*step)% bigStep == 0), middle:(((item+min)*step) % middleStep == 0) }">
					<text v-if="(item+min)%10==0" class="scale_txt">{{(item + min) * step * currentStep}}</text>
				</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default{
		props:{
			min:{
				type: Number,
				default: 0
			},
			max:{
				type: Number,
				default: 200
			},
			def:{
				type: Number,
				default: 30
			},
			currentStep:{
				type: Number,
				default: 1
			},
		},
		data(){
			return{
				curVal: 0,//当前值
				middleStep: 5,
				bigStep: 10,
				cellW: 10,
				scaleWidth: "100px",
				count: 300,
				salNum: 0,
				step: 1 //步长 每格代表的值
			}
		},
		created() {
			//一共有多少格
			this.$nextTick(()=>{
				let count = Math.ceil((this.max - this.min) / this.step) + 1;
				this.count = count;
				this.scaleWidth = (count * this.cellW) + 'px';
				this.salNum = (this.def - this.min) / this.step *  this.cellW;
				//初始值
				this.setVal(this.salNum);
			})
		},
		methods:{
			bindscroll(e){
				// 移动距离
				let left = e.detail.scrollLeft;
				this.setVal(left);
			},
			setVal(left){
				let curVal = Math.round( left / this.cellW / this.step ) + this.min;
				this.curVal = curVal > this.max ? this.max : (curVal < this.min ? this.min : curVal)
				this.$emit('slide',{"curVal":this.curVal});
			},
			setDefVal(){
				//初始值
				this.salNum = (this.curVal - this.min) * this.cellW * this.step
			}
		}
	}
</script>

<style lang="scss" scoped>
	/*
	*滑动标尺样式
	*/
	.box {
	    width: 90%;
	    height: 140upx;
	    margin:10upx auto 60upx;
	    overflow: hidden;
	    position: relative;
	}
	.cursor {
	    position: absolute;
	    top: 40upx;
	    left: 50%;
	    width: 6upx;
	    height: 44upx;
	    background-color: #EC2C5A;
	    transform: translate(-50%,0);
	    z-index: 9
	}
	.wrapper {
	    width: 100%;
	    margin-top: 0upx;
	}
	.scroller{
	    // width: 1500upx;
	    padding: 40upx 47% 40upx 50%;
	    // transition: all 1s;
		white-space: nowrap;
	}
	.scroller>text{
	    font-size: 20upx;
	    color: #CCCCCC;
	    display: inline-block;
	    width: 9px;
	    border-left: 1px solid #CCCCCC;
	    border-top: 1px solid #CCCCCC;
	    height: 14upx;
	    vertical-align: top;
	    position: relative;
	}
	.scroller>text:last-of-type{
	    border-bottom: 0upx;
	}
	.scroller .scale_txt{
	    font-size: 26upx;
	    font-style: normal;
	    position: absolute;
	    bottom: -40upx;
	    left: -8px;
		color: #111111;
	}
	.scroller .middle{
	    height: 28upx;
	}
	.scroller .big{
	    height: 44upx;
	}
</style>
