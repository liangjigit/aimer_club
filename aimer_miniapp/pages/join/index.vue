<template>
	<view>
		<cu-custom :bgColor="'transparent'"></cu-custom>
		<view>
			<view class="bg-image">
				<!-- <image src="/static/join/bg.png" mode="aspectFill"></image> -->
				<image src="https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1603965045021.jpg" mode="aspectFill"></image>
			</view>
			<view class="bg-mask flex flex-direction justify-end" style="padding-top: 140upx;">
				<view class="title flex flex-direction">
					<text>加入AIMER CLUB</text>
					<text>悦享会员专属生活方式</text>
				</view>
				<view class="flex justify-center" style="margin-top: 52upx;">
					<view class="coupon flex flex-direction justify-center"v-for="(item,index) in coupons" :key="index">
						<view class="num flex justify-center align-end flex-sub">
							<text class="unit">¥</text>
							<text class="discount">{{item.couponAmount * item.couponNum}}</text>
						</view>
						<view class="name text-cut">
							<!-- {{item.couponName}} -->
							新会员礼券
						</view>
					</view>
				</view>
				<view class="write-tip">
					为了您在生日当月获得会员好礼，请填写以下信息
				</view>
				<form>
					<view class="flex flex-direction align-center" style="width: 100%;">
						<view class="write-content flex align-center flex-wrap">
							<block v-for="(item,index) in fieldList" :key="item.id">
								<view class="flex item" v-if="item.field == 'realname'">
									<input class="flex-sub" type="text" @input="onInput(index,$event)" :value="item.value" :placeholder="'您的'+ item.fieldName + (item.isRequired ==1 ?'' : '(选填)')" placeholder-style="color:#fff" />
								</view>
								<picker class="item" v-if="item.field == 'birthday'|| item.field == 'childrenBirthday'" @change="change(index,$event)" v-model="item.value" mode="date" :start="start" :end="end">
									<view class="flex align-center">
										<text class="flex-sub input" v-if="item.field == 'birthday'">{{item.value||('您的' + item.fieldName + (item.isRequired ==1 ?'' : '(选填)'))}}</text>
										<text class="flex-sub input" v-if="item.field == 'childrenBirthday'">{{item.value|| (item.fieldName + (item.isRequired ==1 ?'' : '(选填)'))}}</text>
										<text class="cuIcon-playfill text-white"></text>
									</view>
								</picker>
								<picker class="item" v-if="item.field == 'gender'" @change="change(index,$event)" v-model="item.value" :range="GenderRange" range-key="name">
									<view class="flex align-center">
										<text class="flex-sub input">{{GenderRange[item.value].name || ('您的' + item.fieldName + (item.isRequired ==1 ?'' : '(选填)'))}}</text>
										<text class="cuIcon-playfill text-white"></text>
									</view>
								</picker>
							</block>
						</view>
					</view>
					<view class="write-tip" style="margin-top: -40upx;">
						(*此信息一经提交不可修改)
					</view>
					<view class="flex flex-direction align-center" style="width: 100%;">
						<button class="cu-btn round" open-type="getPhoneNumber" v-if="!isSavePhone" @getphonenumber="getPhoneNumber">立即领取</button>
						<button class="cu-btn round" v-else @click="submit" >立即领取</button>
						<button class="other" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">使用其他手机号登录领取</button>
						<view class="agree-box flex align-center justify-center" @click.stop="changeAgree">
							<image src="/static/join/checkbox-icon.png" class="checkbox" mode="aspectFit" v-show="!isAgree"></image>
							<image src="/static/join/cheked-icon.png" class="checkbox" mode="aspectFit" v-show="isAgree"></image>
							<text>我已阅读并同意</text>
							<text class="link">AIMER CLUB用户隐私声明</text>
						</view>
					</view>
				</form>
			</view>
		</view>
		
	</view>
</template>

<script>
	import cuCustom from '@/colorui/components/cu-custom.vue'
	import {mapState,mapActions,mapMutations} from 'vuex'
	import {getNowDate,debounce,abnormalprompt,navigatorToPage} from '@/common/index.js'
	// const GenderRange = ['','男', '女']
	const GenderRange = [{key:1,name:"男"},{key:2,name:"女"}]
	const NowDate = getNowDate()
	function checkName(value){
		return (/\d/.test(value)); 
	}
	export default{
		components:{
			cuCustom
		},
		data(){
			return{
				isAgree:false,
				start:'1900-01-01',
				end:NowDate,
				// form
				GenderRange,
				// 
				fieldList:[],
				isSaveInfo:false,
				isSavePhone:false, 
				coupons:[],
				encryptedData:undefined,
				iv:undefined
			}
		},
		computed:{
			...mapState('login',['isDisabledUser','redirectUrl']),
			saveAllInfo(){
				if(this.isSaveInfo&&this.isSavePhone){
					if(this.redirectUrl){
						let {url,type} = this.redirectUrl
						navigatorToPage(url,type,null,null,true)
						this.GETREDIRECTURL({redirectUrl:null})
					}else{
						uni.switchTab({
							url:"/pages/index/index"
						})
					}
					
				}
				return this.isSaveInfo&&this.isSavePhone
			}
		},
		created() {
			this.getConfig()
			this.isSavePhone = !uni.getStorageSync('getPhone')
		},
		onUnload() {
			this.GETREDIRECTURL({redirectUrl:null})
		},
		methods:{
			...mapActions('login',['savePhoneNumber','wxworkLogin','getMyInfo']),
			...mapActions('accoutBaseInfo',['getJoinConfig','saveJoinInfo']),
			...mapMutations('login',['GETREDIRECTURL']),
			onInput(index,e){
				let value = e.detail.value.replace(/\d/g,"")
				this.fieldList[index].value = value
				return value
			},
			async getConfig(){
				let response = await this.getJoinConfig({})
				if(response.code == 200){
					// console.log(response.data)
					let {fieldList,templateList} = response.data
					this.fieldList  = fieldList.map(item=>{
						if(item.field == 'gender'){
							item.value = -1
						}else{
							item.value = ""
						}
						return item
					})
					this.coupons = templateList
				}
			},
			changeAgree(){
				this.isAgree = !this.isAgree
			},
			change(index,e){
				this.fieldList[index].value = e.target.value
			},
			validateField(){
				if(!this.isAgree){
					uni.showToast({
						title:"请先同意隐私声明",
						icon:"none"
					})
					return false
				}
				for(let i=0;i<this.fieldList.length;i++){
					let item = this.fieldList[i]
					if(item.isRequired == 1){ 
						if((!item.value||item.value ===-1)&&item.value!==0){
							uni.showToast({
								title:"请完善"+ item.fieldName + "信息",
								icon:"none"
							})
							return false 
						}
						if(item.field ==='realname'){
							if(/\d/g.test(item.value)){
								uni.showToast({
									title:item.fieldName + "格式不正确",
									icon:"none"
								})
								return false
							}
						}
					}
				}
				return true
			},
			submit:debounce(async function(){
				if(this.isDisabledUser){
					abnormalprompt()
					return
				}
				if(this.validateField()){
					const token = uni.getStorageSync('token');
					const sessionKey = uni.getStorageSync('sessionKey');
					const {encryptedData,iv} = this
					await this.savePhoneNumber({
						encryptedData,
						iv,
						sessionKey,
						token
					})
					let obj = {}
					this.fieldList.forEach(item=>{
						obj[item.field] = item.value
						if(item.field == 'gender'){
							obj[item.field] = GenderRange[item.value]?GenderRange[item.value].key:0
						}
					})
					let response = await this.saveJoinInfo(obj)
					if(response.code == 200){
						await this.getMyInfo({})
						this.isSaveInfo = true 
						console.log("用户加入成功")
						let res = uni.getSystemInfoSync()
						console.log("当前运行环境："+res.environment)
						if(getApp().globalData.level){
							uni.reLaunch({
								url:'/pages/account/benefit?level=lv'
							})
						}
						if(res.environment === "wxwork"){ 
							this.wxworkLogin({})
						}
					}
				}
			},200),
			async getPhoneNumber(e){
				let {encryptedData,iv,errMsg} = e.detail
				if(errMsg == "getPhoneNumber:ok"){
					this.encryptedData = encryptedData,
					this.iv = iv,
					this.isSavePhone = true
					this.submit()
				}
			}
		}
	}
</script>
<style>
	page{
		background-color: #F9F9F9;
	}
</style>
<style lang="scss" scoped>
	.agree-box{
		color: #C0C0C0;
		font-size:22upx;
		font-weight:400;
		margin-bottom: 30rpx;
		margin-top: 30rpx;
		.link{
			color: #EC2C5A;
		}
		.checkbox{
			width:22upx;
			height:22upx;
			background:rgba(255,255,255,1);
			border-radius:4upx;
			margin-right: 12upx;
		}
	}
	.other{
		font-size:22upx;
		font-weight:400;
		color: #FFFFFF;
		margin-top: 46upx;
		border-width:0;
		background-color: transparent;
		&::after{
			border-width: 0;
		}
	}
	.cu-btn{
		width:590upx;
		height:88upx;
		background-color:#FFFFFF;
		margin-top: 60upx;
		font-size:30upx;
		font-weight:500;
		color: #EC2C5A;
		
	}
	
	.write-content{
		margin-top: 30upx;
		width:590upx;
		.item{
			width: 259upx;
			margin-bottom: 70upx;
			&:nth-child(2n+1){
				margin-right: 60upx;
			}
		}
		.input,
		input{
			background-color: transparent;
			color: #FFFFFF;
		}
		.flex{
			border-bottom:2upx solid #A9A9A9;
			padding-bottom: 30upx;
		}
		text{
			line-height: 1.45rem;
			height: 1.4rem;
		}
	}
	.placeholder-style{
		color: #FFFFFF;
	}
	.write-tip{
		margin-top: 100upx;
		font-size:22upx;
		font-weight:400;
		color: #CCCCCC;
		padding-left: 86upx;
		line-height: 1;
	}
	.coupon{
		width:198upx;
		height:222upx;
		background:rgba(187,63,89,1);
		border-radius:20upx;
		margin: 0 15upx;
		overflow: hidden;
		.num{
			width: 100%;
			height: 142upx;
			padding-bottom: 54upx;
			.unit{
				font-size:34upx;
				font-weight:400;
				color: #E5A3B4;
				line-height: 1;
				margin-right: 14upx;
			}
			.discount{
				font-size:44upx;
				font-family:PingFang SC;
				font-weight:400;
				color: #FFFFFF;
				line-height: 1;
			}
		}
		.name{
			background-color: #FFFFFF;
			color: #333333;
			font-size:22upx;
			font-weight:500;
			height: 80upx;
			line-height: 80upx;
			text-align: center;
			padding: 0 10rpx;
		}
	}
	.title{
		padding-left: 86upx;
		text{
			font-size:34upx;
			font-weight:400;
			color: #FFFFFF;
			margin-bottom: 14upx;
		}
	}
	.bg-image{
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		height: 100%;
		width: 100%;
		overflow: hidden;
		image{
			width: 100%;
			height: 100%;
		}
	}
	.bg-mask{
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		height: 100%;
		width: 100%;
		z-index: 2;
		background-color: transparent;
		overflow: hidden;
	}
</style>
