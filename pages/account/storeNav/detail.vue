<template>
	<view class="" v-if="detail">
		<map :longitude="detail.store_gpslng" :latitude="detail.store_gpslat" :markers="covers"style="width: 750upx;height: 308px;"></map>
		<scroll-view class="bg-white" :scroll-y="true" :style="{height:height}" scroll-with-animation="true">
			<view class="name padding-tb-lg padding-lr-lg">
				<text>{{detail.store_name}}</text>
			</view>
			<view class="detail padding-tb-lg padding-lr-lg">
				<text>{{detail.store_address}}</text>
			</view>
			<view class="detail padding-tb-lg padding-lr-lg">
				<text>主营品牌：{{detail.brand}}</text>
			</view>
			<view class="">
				<button class="contact-btn" @click="makePhoneCall" >{{detail.store_tel}}</button>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {mapState,mapActions} from 'vuex'
	export default{
		data(){
			return{
				detail:null,
				height:"0px",
				covers:[]
			}
		},
		computed:{
			...mapState('accountStoreNav',['list']),
		},
		onLoad(options) {
			let system = uni.getSystemInfoSync()
			this.height = (system.windowHeight - 308) + "px"
			let { index } = options
			this.detail = this.list[Number(index)]
			this.covers.push({
				latitude: this.detail.store_gpslat,
				longitude: this.detail.store_gpslng,
				width: 20,
				height: 20,
				iconPath: '/static/account/location.png'
			})
		},
		methods:{
			makePhoneCall(){
				uni.makePhoneCall({
				    phoneNumber: this.detail.store_tel
				});
			}
		}
	}
</script>

<style scoped>
	.contact-btn{
		width: 690upx;
		background-color: #bda47c;
		color: #FFFFFF;
		border-radius: 10upx;
		font-size: 28upx;
	}
	.contact-btn::after{
		border-width: 0;
	}
	.name{
		color: #2b2b2b;
		font-size:30upx;
		border-bottom: 2upx solid #e1e1e1;
	}
	.detail{
		color: #999999;
		font-size:26upx;
	}
</style>
