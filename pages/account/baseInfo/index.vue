<template>
	<view style="overflow-x: hidden;">
		<view class="select-box flex flex-direction align-center">
			<view class="tip padding-tb">
				（可多选）完善不同身份的信息即可获得对应礼券
			</view>
			<view class="options flex flex-direction">
				<view class="item flex justify-between margin-bottom" v-show="item.type<4" :class="{'current': selected.indexOf(item.type)>=0}" v-for="(item,index) in configs" :key="index">
					<view class="left flex flex-direction align-center justify-center" @click="toggle(item.type)">
						<view class="check-icon">
							<image src="/static/account/selected-icon.png" mode="aspectFit"></image>
						</view>
						<view class="uncheck-icon">
							<image src="/static/account/select-icon.png" mode="aspectFit"></image>
						</view>
						
						<view class="icon">
							<image :src="item.icon" mode="aspectFit"></image>
						</view>
						<text class="name">{{item.name}}</text>
					</view>
					<view :class="{'justify-between':item.coupon,'justify-center':!item.coupon}" class="right flex flex-direction bg-red" v-if="item.receive" @click="goMiniProgram">
						<block v-if="item.coupon">
							<view class="info flex align-center">
								<view class="flex-sub flex align-center">
									<text class="num margin-right-lg">¥{{item.coupon.discount}}</text>
									<image class="get-icon" src="/static/account/get-icon.png" mode="aspectFit"></image>
								</view>
								<text class="text" style="margin-top:-15upx;font-size: 22upx;">去使用</text>
								<text class="cuIcon-usefullfill text-white" style="margin-top:-15upx;transform: rotate(90deg);font-size: 26upx;"></text>
							</view>
							<view class="tips">
								{{item.coupon.tip}} 
							</view>
						</block>
						<block v-else>
							<div class="info flex align-center text-xs" style="padding-bottom: 0;">优惠券被领光啦！期待下个惊喜</div>
						</block>
					</view>
					<view :class="{'justify-between':item.coupon,'justify-center':!item.coupon}" class="right flex flex-direction" v-else @click="toggle(item.type)">
						<block v-if="item.coupon">
							<view class="info flex align-center">
								<view class="flex-sub flex align-center">
									<text class="num margin-right-lg">¥{{item.coupon.discount}}</text>
								</view>
								<text class="text">完善信息后领取</text>
							</view>
							<view class="tips">
								{{item.coupon.tip}}
							</view>
						</block>
						<block v-else>
							<div class="info flex align-center text-xs" style="padding-bottom: 0;">优惠券被领光啦！期待下个惊喜</div>
						</block>
					</view>
				</view>
			</view>
		</view>
		<!-- 表单 -->
		<view class="form-box">
			<form @submit="submitEdit"> 
				<view class="my-info-box" v-show="showMy">
					<title-bar :title="'我的信息'" :icon="myGender=='男'?'/static/account/honey-icon.png':'/static/account/my-icon.png'"></title-bar>
					<block v-for="(item,index) in hasInfos" :key="index">
						<input-text :disabled="true" :title="item.label" :value="item.value"  v-if="item.value"></input-text>
					</block>
					<view class="line" v-if="hasInfos.length>0"></view> 
					<block v-for="(item,index) in my" :key="index">
						<input-text :disabled="true" :title="item.label" :value="item.value"  v-if="item.field == 'birthday'"></input-text>
						<input-text :disabled="true" :title="item.label" :value="item.value"  v-if="item.field == 'phone'"></input-text>
						<input-text :disabled="true" :title="item.label" :value="myGender"  v-if="item.field == 'gender'"></input-text>
						<input-text :title="item.label" type="text" :placeholder="'请输入' + item.label" :value="item.value" @input="change(item,$event)" :field="item.field" v-if="item.field == 'realname'"></input-text>
						<!-- <picker-date :end="NowDate" :title="item.label" :placeholder="'请输入' + item.label" :value="item.value" @change="change(item,$event)" v-if="item.field == 'birthday'"></picker-date> -->
						<!-- <picker-range-key :title="item.label" :range="Gender" :value="item.value" @change="change(item,$event)" v-if="item.field == 'gender'"></picker-range-key> -->
						<!-- <picker-default :title="item.label" :range="Gender" :value="item.value" @change="change(item,$event)" v-if="item.field == 'gender'"></picker-default> -->
						<picker-default :title="item.label" :range="HeightRange" :value="item.value" @change="change(item,$event)" v-if="item.field == 'stature'"></picker-default>
						<picker-multi-selector :title="item.label" :range="BraSize" :value="item.value" @change="change(item,$event)" v-if="item.field == 'braSize'&&showMyBraSize"></picker-multi-selector>
						<picker-default :title="item.label"  :unit="'(cm)'" :range="UnderwearSize" :value="item.value" @change="change(item,$event)" v-if="item.field == 'briefsSize'"></picker-default>
						
					</block>
					<view class="line-lg"></view>
				</view>
				<view class="honey-info-box" v-show="showHoney">
					<title-bar :title="'我的TA信息'" :icon="(honeyGender=='男'||(myGender=='女'&&!honeyGender))?'/static/account/honey-icon.png':'/static/account/my-icon.png'"></title-bar>
					<block v-for="(item,index) in honey" :key="index">
						<input-text :title="item.label" type="number" :placeholder="'请输入' + item.label" :value="item.value" @input="change(item,$event)" :field="item.field" v-if="item.field == 'phone'"></input-text>
						<input-text :title="item.label" type="text" :placeholder="'请输入' + item.label" :value="item.value" @input="change(item,$event)" :field="item.field" v-if="item.field == 'realname'"></input-text>
						<picker-date :end="NowDate" :title="item.label" :placeholder="'请输入' + item.label" :value="item.value" @change="change(item,$event)" v-if="item.field == 'birthday'"></picker-date>
						<picker-range-key :title="item.label" :range="Gender" :value="item.value" @change="changeHoneyGender(item,$event)" v-if="item.field == 'gender'"></picker-range-key>
						<picker-default :title="item.label" :range="HeightRange" :value="item.value" @change="change(item,$event)" v-if="item.field == 'stature'"></picker-default>
						<picker-multi-selector :title="item.label" :range="BraSize" :value="item.value" @change="change(item,$event)" v-if="item.field == 'braSize'&&showHoneyBraSize"></picker-multi-selector>
						<picker-default :title="item.label" :unit="'(cm)'" :range="UnderwearSize" :value="item.value" @change="change(item,$event)" v-if="item.field == 'briefsSize'"></picker-default>
						
					</block>
					<view class="line-lg"></view>
				</view>
				<view class="babies-info-box" v-for="(baby,index) in babies" :key="index" v-show="showBabies">
					<title-bar :title="'宝贝的信息'+(index+1)" :icon="'/static/account/baby-icon.png'">
						<template v-slot:btns>
							<view class="text-red margin-right-sm" @click="deleteForBaby(index)">删除宝贝</view>
						</template>
					</title-bar>
					<block v-for="(item,itemIndex) in baby" :key="item.id">
						<input-text :title="item.label" type="number" :placeholder="'请输入' + item.label" :value="item.value" @input="changBaby(index,itemIndex,$event)" :field="item.field" v-if="item.field == 'phone'"></input-text>
						<input-text :title="item.label" type="text" :placeholder="'请输入' + item.label" :value="item.value" @input="changBaby(index,itemIndex,$event)" :field="item.field" v-if="item.field == 'realname'"></input-text>
						<picker-date :end="NowDate" :title="item.label" :placeholder="'请输入' + item.label" :value="item.value" @change="changBaby(index,itemIndex,$event)" v-if="item.field == 'birthday'"></picker-date>
						<picker-range-key :title="item.label" :range="Gender" :value="item.value" @change="changBaby(index,itemIndex,$event)" v-if="item.field == 'gender'"></picker-range-key>
						<picker-default :title="item.label" :range="BabyHeightRange" :value="item.value" @change="changBaby(index,itemIndex,$event)" v-if="item.field == 'stature'"></picker-default>
						<picker-multi-selector :title="item.label" :range="BraSize" :value="item.value" @change="changBaby(index,itemIndex,$event)"  v-if="item.field == 'braSize'"></picker-multi-selector>
						<picker-default :title="item.label"  :unit="'(cm)'" :range="UnderwearSize" :value="item.value" @change="changBaby(index,itemIndex,$event)" v-if="item.field == 'briefsSize'"></picker-default>
					</block>
					<view class="line"></view>
				</view>
				<!-- <input-text :disabled="true" :title="'名字'" :placeholder="'请输入姓名'" :value="my.name"></input-text>
				<input-text :disabled="true" :title="'性别'" :placeholder="'请输入性别'" :value="my.gender"></input-text>
				<input-text :disabled="true" :title="'生日'" :placeholder="'请输入生日'" :value="my.birthday"></input-text>
				<input-text :disabled="true" :title="'手机号'" :placeholder="'请输入手机号'" :value="my.phone"></input-text>
				<view class="line"></view>
				<picker-default :title="'婚姻状况'" :range="MaritalStatus" :value="my.maritalStatus" @change="change('my.maritalStatus',$event)" ></picker-default>
				<picker-default :title="'是否生育'" :range="BirthStatus" :value="my.birthStatus" @change="change('my.birthStatus',$event)" ></picker-default>
				<picker-default :title="'身高'" :unit="(cm)" :range="HeightRange" :value="my.height" @change="change('my.height',$event)" ></picker-default>
				<picker-multi-selector :title="'文胸尺码'" :range="BraSize" :value="my.braSize" @change="change('my.braSize',$event)"  @columnchange="changeCol('my.braSize',$event)"></picker-multi-selector>
				<picker-default :title="'内裤尺码'" :range="UnderwearSize" :value="my.underwearSize" @change="change('my.underwearSize',$event)" ></picker-default>
				<view class="line"></view>
				<input-text :disabled="true" :title="'所在城市'" :placeholder="'请输入所在城市'" :value="my.currentCity"></input-text>
				<input-text :disabled="true" :title="'入会时间'" :placeholder="'请输入入会时间'" :value="my.joinTime"></input-text> -->
				<!-- <view class="line-lg"></view>
				<view class="honey-info-box" v-show="showHoney">
					<title-bar :title="'我的TA信息'" :icon="'/static/account/honey-icon.png'"></title-bar>
					<input-text :title="'名字'" :placeholder="'请输入姓名'" :value="honey.name" @input="input('honey.name',$event)"></input-text>
					<input-text :title="'手机号'" :placeholder="'请输入手机号'" :type="'number'" :value="honey.phone" @input="input('honey.phone',$event)"></input-text>
					<picker-date :title="'生日'" :placeholder="'请输入生日'" :value="honey.birthday" @change="change('honey.birthday',$event)"></picker-date>
					<picker-default :title="'成衣尺码'" :unit="(cm)" :value="honey.wearSize"  :range="WearSize" @change="change('honey.wearSize',$event)"></picker-default>
					<picker-default :title="'内裤尺码'" :unit="(cm)" :value="honey.underwearSize" :range="UnderwearSize" @change="change('honey.underwearSize',$event)"></picker-default>
					<view class="line-lg"></view>
				</view> -->
				<!-- <view class="babies-info-box" v-for="(item,index) in babies" :key="index" v-show="showBabies">
					<title-bar :title="'宝贝的信息'+(index+1)" :icon="'/static/account/baby-icon.png'">
						<template v-slot:btns>
							<view class="text-red margin-right-sm" @click="deleteBaby(index)">删除宝贝</view>
						</template>
					</title-bar>
					<input-text :title="'名字'" :placeholder="'请输入姓名'" :value="item.name" @input="input('item.name',$event)"></input-text>
					<picker-default :title="'性别'" :placeholder="'请输入性别'" :range="Gender" :value="item.gender" @change="changeItem(item,'gender',$event)"></picker-default>
					<picker-date :title="'生日'" :placeholder="'请输入生日'" :value="item.birthday" @change="changeItem(item,'birthday',$event)"></picker-date>
					<picker-default :title="'身高'" :range="BabyHeightRange" :value="item.height" @change="changeItem(item,'height',$event)" ></picker-default>
					<view class="line"></view>
				</view> -->
				<view class="add-box" v-show="showBabies&&needAddBaby">
					<view class="add-btn text-red flex justify-center align-center">
						<view class="inline-flex justify-center align-center" @click="addBaby">
							<image src="/static/account/addcircle-icon.png" class="add-circle" mode="aspectFit"></image>
							<text>新增我的宝贝</text>
						</view>
					</view>
					<view class="add-tip text-center">
						{{addBabyDesc}}
					</view>
				</view>
				<view class="submit-btn flex justify-center align-center" v-if="!loading">
					<button class="cu-btn round lg bg-red" form-type="submit">提交</button>
				</view>
			</form> 
		</view>
		
		<home-btn></home-btn>
	</view>
</template>

<script>
	import homeBtn from '@/pages/components/float-button/home.vue'
	import titleBar from './components/title-bar.vue'
	import inputText from './components/input-text.vue'
	import pickerRangeKey from './components/picker-range-key.vue'
	import pickerDefault from './components/picker-default.vue'
	import pickerDate from './components/picker-date.vue'
	import pickerMultiSelector from './components/picker-multiSelector.vue'
	import {getNowDate,debounce,abnormalprompt} from '@/common/index.js'
	import {mapState,mapActions,mapMutations} from "vuex"
	function checkPhone(phone){
		return (/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone)); 
	}
	const NowDate = getNowDate()
	const Selects=[{
			type:1,
			icon:"", ///static/account/my-icon.png
			name:"我的信息"
		},{
			type:2,
			icon:"",//"/static/account/honey-icon.png",
			name:"我的TA"
		},{
			type:3,
			icon:"/static/account/baby-icon.png",
			name:"宝贝的信息"
		}]
	// const Gender = ['','男', '女']
	const Gender = [{key:1,name:"男"},{key:2,name:"女"}]
	const MaritalStatus = ["","未婚","已婚"]
	const BirthStatus = ["","未生育","已生育"]
	const HeightRange = ["156~160cm","161-165cm","166-170cm","171-175cm","176-180cm","181-185cm","其他"]
	const BabyHeightRange = ["80~90cm","91~100cm","101~110cm","111~120cm","121~130cm","131~140cm","141~150cm","151~160cm","161~170cm"]
	const BraSize=[["70","75","80","85","其他"],["A","B","C","D","其他"]]
	const UnderwearSize = ["根据腰围测量","64","70","76","82","90","96","102","108","其他"]
	const WearSize = ["155","160","165","170","175","180","185","其他"]
	let BabyDefaultInfo = []
	export default{
		components:{
			titleBar,
			inputText,
			pickerRangeKey,
			pickerDefault,
			pickerDate,
			pickerMultiSelector,
			homeBtn
		},
		data(){
			return {
				NowDate,
				Selects,
				Gender,
				MaritalStatus,
				BirthStatus,
				HeightRange,
				BraSize,
				UnderwearSize,
				WearSize,
				BabyHeightRange,
				my:[],
				honey:[],
				babies:[],
				hasInfos:[],// 新人礼信息，不可修改
				needAddBaby:false,
				addBabyDesc:"（如有多个宝贝，可增加宝贝信息，爱慕儿童优惠券最多领取3张）",
				defaultSelected:1,
				selected:[],
				loading:true,
				myGender:"", // 显示 我的性别 
				honeyGender:"" // 显示 我的Ta性别 
			}
		},
		computed:{
			...mapState("login",["userInfo","isDisabledUser"]),
			...mapState("accoutBaseInfo",["configs","myInfo","babyInfo","honeyInfo"]),
			showHoney(){
				return this.selected.indexOf(2) >=0 // 
			},
			showBabies(){
				return this.selected.indexOf(3) >=0
			},
			showMy(){
				return this.selected.indexOf(1) >=0
			},
			showMyBraSize(){
				const myGender = this.my.filter(z=>z.field == "gender")
				const myBraSize = this.my.filter(z=>z.field == "braSize")
				if(myGender&&myGender.length>0){
					if(myGender[0].value === 0){ // 男
						if(myBraSize&&myBraSize.length>0){
							myBraSize[0].required = false
						}
						return false
					}else if(myGender[0].value === 1){
						if(myBraSize&&myBraSize.length>0){
							myBraSize[0].required = true
						}
					}
				}
				return true
			},
			showHoneyBraSize(){
				const honeyGender = this.honey.filter(z=>z.field == "gender")
				const honeyBraSize = this.honey.filter(z=>z.field == "braSize")
				if(honeyGender&&honeyGender.length>0){
					if(honeyGender[0].value === 0){ // 男
						if(honeyBraSize&&honeyBraSize.length>0){
							honeyBraSize[0].required = false
						}
						return false
					}else if(honeyGender[0].value === 1){
						if(honeyBraSize&&honeyBraSize.length>0){
							honeyBraSize[0].required = true
						}
					}
				}
				return true
			}
		},
		async created() {
			this.loading = true
			await this.getConfig()
			let response =  await this.getBaseInfoContent()
			if(response.code == 200){
				this.formatContent()
			}
			this.loading = false
		},
		methods:{
			...mapActions('accoutBaseInfo',['getBaseInfoConfig','getBaseInfoContent','editMyInfo','saveHoney','saveBaby','deleteBaby']),
			...mapMutations('accoutBaseInfo',['GETCONFIGS']),
			...mapActions('login',['getMyInfo']),
			submitEdit:debounce(async function(){
				if(this.isDisabledUser){
					abnormalprompt()
					return
				}
				try{
					uni.showLoading({
						title:"正在保存",
						mask:true
					})
					let {my,honey,babies,showHoney,showBabies,showMy} = this
					let requestMyData = {}
					let requestHoneyData = {}
					let requestBabiesData = []
					let strategy = {
						hasEmptyField:function(data,infoName){
							let result = data.filter(z=>z.required&&(!z.value||z.value===-1)&& z.value !==0).length > 0
							if(result){
								uni.hideLoading()
								uni.showToast({
									title:"请完善"+infoName+"内容",
									icon:"none",
									duration:2000
								})
								return true
							}
							return false
						},
						phone:function(phone,infoName){
							if(phone.length>0&&phone[0].value&&!checkPhone(phone[0].value)){
								uni.hideLoading()
								uni.showToast({
									title: infoName +phone[0].label + "格式错误",
									icon:"none",
									duration:2000
								}); 
								return false
							}
							return true
						},
						realname:function(realname){
							if(realname.length>0&&realname[0].value&&/\d/g.test(realname[0].value)){
								uni.showToast({
									title:infoName + realname[0].label + "格式不正确",
									icon:"none"
								})
								return false
							}
							return true
						}
					}
					let request_strategy = {
						braSize:function(item){
							if(typeof item.value != "string"){
								let value = item.value?item.value.join(','):''
								return value
							}
							return item.value
						},
						briefsSize:function(item){
							let value = (item.value==0||item.value)?item.value.toString():''
							return value
						},
						gender:function(item){
							let value = Gender[item.value]?Gender[item.value].key:0
							return value
						},
						stature:function(item,HeightRange){
							let value = HeightRange[item.value]?item.value:null
							return value
						}
					}
					// 我的信息
					if(showMy){
						if(strategy['hasEmptyField'](my,"我的信息")){
							return
						}	
						const phone = my.filter(z=>z.field == "phone")
						if(!strategy['phone'](phone,"我的信息")){
							return
						}
						const realname = my.filter(z=>z.field == "realname")
						if(!strategy['realname'](realname,"我的信息")){
							return
						}
						// 获取我的信息请求参数
						my.forEach(item=>{
							if(item.field == 'braSize'||item.field == 'briefsSize'){
								item.value = request_strategy[item.field](item)
							}
							requestMyData[item.field] = item.value
							if(item.field == 'gender'||item.field == 'stature'){
								requestMyData[item.field] = request_strategy[item.field](item,HeightRange)
							}
						})
					}
					// 我的TA
					if(showHoney){
						if(strategy['hasEmptyField'](honey,"我的TA")){
							return
						}
						const phone = honey.filter(z=>z.field == "phone")
						if(!strategy['phone'](phone,"我的TA")){
							return
						}
						const realname = honey.filter(z=>z.field == "realname")
						if(!strategy['realname'](realname,"我的TA")){
							return
						}
						// 获取我的TA请求参数
						honey.forEach(item=>{
							if(item.field == 'braSize'||item.field == 'briefsSize'){
								item.value = request_strategy[item.field](item)
							}
							requestHoneyData[item.field] = item.value
							if(item.field == 'gender'||item.field == 'stature'){
								requestHoneyData[item.field] = request_strategy[item.field](item,HeightRange)
							}
						})
					}
					// 我的宝贝
					if(showBabies){
						for(let i=0;i<babies.length;i++){
							const baby = babies[i]
							if(strategy['hasEmptyField'](baby,"我的宝贝")){
								return
							}
							const phone = baby.filter(z=>z.field == "phone")
							if(!strategy['phone'](phone,"我的宝贝"+(i+1))){
								return
							}
							const realname = baby.filter(z=>z.field == "realname")
							if(!strategy['realname'](realname,"我的宝贝")){
								return
							}
						}
						// 获取我的宝贝请求参数
						babies.forEach(baby=>{
							let data = {}
							baby.forEach(item=>{
								if(item.field == 'braSize'||item.field == 'briefsSize'){
									item.value = request_strategy[item.field](item)
								}
								data[item.field] = item.value
								if(item.field == 'gender'||item.field == 'stature'){
									data[item.field] = request_strategy[item.field](item,BabyHeightRange)
								}
							})
							requestBabiesData.push(data)
						})
					}
					 // console.log(requestMyData,requestHoneyData,requestBabiesData)
					// let configs = [...this.configs]
					let fullSuccess = true
					if(showMy){
						let response = await this.editMyInfo({...requestMyData})
						// if(response.code == 200){
						// 	configs.filter(z=>z.type == 1)[0].receive = true
						// 	this.GETCONFIGS({configs})
						// }else{
						// 	fullSuccess=false
						// }
						if(response.code != 200){
							fullSuccess=false
						}
					}
					if(showHoney){
						let response = await this.saveHoney({...requestHoneyData})
						// if(response.code = 200){
						// 	// configs.filter(z=>z.type == 2)[0].receive = true
						// 	// this.GETCONFIGS({configs})
						// }else{
						// 	fullSuccess=false
						// }
						if(response.code != 200){
							fullSuccess=false
						}
					}
					if(showBabies){
						let response = await this.saveBaby(requestBabiesData)
						if(response.code == 200){
							// configs.filter(z=>z.type == 3)[0].receive = true
							// this.GETCONFIGS({configs})
							let res =  await this.getBaseInfoContent()
							if(res.code == 200){
								this.formatContent()
							}
						}else{
							fullSuccess=false
						}
					}
					if(fullSuccess){
						// 个人资料
						await this.getConfig()
						// 更新用户积分
						this.getMyInfo({}) 
						uni.showToast({
							title:"保存成功",
							icon:"none",
							mask:true
						})
					}
					
				}catch(e){
					console.log(e)
					uni.showToast({
						title:"保存失败",
						icon:"none"
					})
				}
			},200),
			async getConfig(){
				let response = await this.getBaseInfoConfig({})
				if(response.code == 200){
					let configs = response.data.map(item=>{
						const {type} = item
						// 1:我的信息 2：我的ta. 3:我的宝贝 4 添加我的宝贝
						if(type<4){
							if(item.couponList&&item.couponList.length>0){
								const {couponAmount,couponNum,subheading,couponName} = item.couponList[0]
								item.coupon = {
									discount:couponAmount,
									tip: `¥${couponAmount} 【${couponName}】`
								}
							}
							const select = Selects.filter(z=>z.type == type)[0]
							item.icon = select.icon
							item.name = select.name
						}
						if(type == 3){
							this.needAddBaby = item.isAddBaby,
							this.addBabyDesc = item.addBabyDesc
						}
						return item
					})
					this.GETCONFIGS({configs})
					if(this.configs.length>0){
						this.defaultSelected = this.configs[0].type
						this.selected.push(this.defaultSelected)
					}
				}
			},
			// 去使用优惠券，跳转到外部小程序
			goMiniProgram(){
				uni.navigateToMiniProgram({
					appId:'wx203ab2d5cb638d1d',
					path:'/pages/index/index'
				})
			},
			// 格式化填写内容
			formatContent(){
				let _this = this
				let strategy = {
					braSize:function(info,field){
						let value = typeof info[field] ==="string"&&info[field]?info[field].split(','):undefined
						return value
					},
					gender:function(info,field){
						let value = typeof info[field] ==="number"?info[field] - 1:-1
						return value
					},
					stature:function(info,field){
						let value = typeof info[field] ==="number"&&info[field]>=0?info[field]: -1
						return value 
					},
					briefsSize:function(info,field){
						let fieldValue = -1
						let value = typeof info[field] !== "undefined"&&info[field]>=0?info[field]: -1
						return value
					}
				}
				this.configs.forEach(config=>{
					const {type,fieldConfig} = config
					switch(type){
						case 1: //我的信息
							_this.my= []
							fieldConfig.forEach(item=>{
								let my = {}
								const {field,fieldName,required} = item
								if(typeof strategy[field] === "function"){
									_this.myInfo[field] = strategy[field](_this.myInfo,field)
								}
								if(field=='gender'){
									_this.getGenderHoneyIcon(_this.myInfo[field],type)
								}
								my= {
									value: _this.myInfo[field],
									label: fieldName,
									required,
									field
								}
								_this.my.push(my)
							})
						break;
						case 2: //我的TA
							_this.honey = []
							fieldConfig.forEach(item=>{ 
								let honey = {}
								const {field,fieldName,required} = item
								if(typeof strategy[field] === "function"){
									_this.honeyInfo[field] = strategy[field](_this.honeyInfo,field)
								}
								if(field=='gender'){
									_this.getGenderHoneyIcon(_this.honeyInfo[field],type)
								}
								honey = {
									value: _this.honeyInfo[field],
									label: fieldName,
									required,
									field
								}
								_this.honey.push(honey)
							})
							// honey id
							const idField = "id"
							_this.honey.push({
								value: _this.honeyInfo[idField],
								label: idField,
								required:false,
								field:idField
							})
						break;
						case 3://宝贝的信息
							let babyInfo = {..._this.babyInfo}
							_this.babies = []
							for(const key in babyInfo){
								const baby = babyInfo[key]
								let babies = []
								let oneBaby = {}
								fieldConfig.forEach(item=>{
									const {field,fieldName,required} = item
									if(typeof strategy[field] === "function"){
										baby[field] = strategy[field](baby,field)
									}
									oneBaby = {
										value: baby[field],
										label: fieldName,
										required,
										field
									}
									babies.push(oneBaby)
								})
								// baby id
								const idField = "id"
								babies.push({
									value: baby[idField],
									label: idField,
									required:false,
									field:idField
								},{id:new Date().getTime()})
								_this.babies = [..._this.babies,[...babies]]
							}
							// 新增宝贝字段
							BabyDefaultInfo = []
							fieldConfig.forEach(item=>{
								const {field,fieldName,required} = item
								let value = ""
								if(field == 'gender'||field == 'stature'){
									value = -1
								}
								BabyDefaultInfo.push({
									value: value,
									label: fieldName,
									required,
									field
								})
							})
						break;
						case 4:
							fieldConfig.forEach(item=>{
								let hasInfo = {}
								const {field,fieldName,required} = item
								let value = _this.myInfo[field]
								if(field == "gender"){
									value = Gender[value]
								}
								hasInfo = {
									value: value,
									label: fieldName,
									required,
									field
								}
								_this.hasInfos.push(hasInfo)
							})
						break;
						default:
						break;
					}
				})
				
			},
			// 添加宝贝
			addBaby(){
				const itemConfig = JSON.parse(JSON.stringify(BabyDefaultInfo))
				this.babies.push([...itemConfig,{id:new Date().getTime()}])
			},
			// 删除宝贝信息
			deleteForBaby(index){
				const idField = this.babies[index].filter(z=>z.field == "id")
				let hasId = idField.length>0
				if(hasId){
					let _this = this
					uni.showModal({
						title:"确定删除？",
						async success(res) {
							if(res.confirm){
								let response = await _this.deleteBaby({
									babyId:idField[0].value
								})
								if(response.code == 200){
									_this.delBaby(index)
									uni.showToast({
										title:"已删除",
										icon:"none"
									})
								}
							}
						}
					})
				}else{
					this.delBaby(index)
				}
			},
			delBaby(index){
				this.babies.splice(index,1)
				if(this.babies.length==0){
					this.toggle(3)
				}
			},
			// 切换
			toggle(current){
				if(current == this.defaultSelected){
					return
				}
				const selected = [...this.selected]
				const index = selected.indexOf(current);
				if( index>-1){
					selected.splice(index,1)
				}else{
					selected.push(current)
					uni.showToast({
						title:"下滑可填写信息",
						icon:"none"
					})
					if(current == 3 && this.babies.length == 0){
						this.addBaby()
					}
				}
				this.selected = selected
			},
			getGenderHoneyIcon(value,type){
				let _this = this
				Gender.forEach(gender=>{
					if(gender.key == value + 1){
						if(type == 2){
							_this.honeyGender = gender.name
						}else if(type ==1){
							_this.myGender = gender.name
						}
					}
				})
				let honeyConfig = _this.configs.filter(z=>z.type==type)[0]
				let isBoyIcon
				if(type == 2){
					isBoyIcon = (_this.honeyGender=='男'||(_this.myGender=='女'&&!_this.honeyGender))
				}else if(type ==1){
					isBoyIcon = _this.myGender == "男"
				}
				honeyConfig.icon = isBoyIcon?"/static/account/honey-icon.png":"/static/account/my-icon.png"
				return 
			},
			changeHoneyGender(item,e){
				let _this = this
				const type = 2
				this.getGenderHoneyIcon(e.value,type)
				item.value = e.value
			},
			change(item,e){
				if(item.field === 'realname'){
					item.value = e.value.replace(/\d/g,"")
				}else if(item.field === 'phone'){
					item.value = e.value.replace(/\D/g,"")
				}else{
					item.value = e.value
				}
			},
			changBaby(index,itemIndex,e){
				let item = this.babies[index][itemIndex]
				this.change(item,e)
			}
			// ,
			// input(option,e){
			// 	let options = option.split('.')
			// 	this[options[0]][options[1]] = e.value
			// }
		}
	}
</script>

<style lang="scss" scoped>
	
	.add-circle{
		width: 28upx;
		height: 28upx;
		margin-right: 10upx;
	}
	.add-box{
		padding-bottom: 44upx;
		background-color: #F9F9F9;
	}
	.submit-btn{
		padding: 45upx 0 77upx 0;
		background-color: #F9F9F9;
		.cu-btn{
			width:380upx;
			height:88upx;
			background:linear-gradient(-50deg,rgba(213,27,71,1),rgba(244,50,96,1));
			box-shadow:0upx 15upx 40upx 0upx rgba(98,0,23,0.16);
			&::after{
				border-width: 0;
			}
		}
	}
	.add-btn{
		font-size: 26upx;
		font-weight:400;
		color: #EC2C5A;
		padding: 32upx 0;
	}
	.add-tip{
		font-size:24upx;
		font-weight:400;
		color: #999999;
	}
	.border-bm{
		border-bottom: 2upx solid #F9F9F9;
	}
	.line{
		background-color: #F9F9F9;
		width: 100%;
		height: 20upx;
	}
	.line-lg{
		width:100%;
		height:80upx;
		background-color:#F9F9F9;
	}
	.select-box{
		background-color: #F9F9F9;
		overflow: hidden;
		.options{
			padding: 18upx 30upx;
			padding-bottom: 46upx;
			.item{
				overflow: hidden;
				.left{
					width:188upx;
					height:124upx;
					background:rgba(255,255,255,1);
					border:1upx solid rgba(238,238,238,1);
					border-radius:20upx;
					overflow: hidden;
					margin-right: 16upx;
					position: relative;
					.icon{
						width:38upx;
						height:40upx;
						margin-bottom: 13upx;
						image{
							width: 100%;
							height: 100%;
						}
					}
					.name{
						font-size:24upx;
						font-weight:400;
						color: #2C3850;
					}
					.uncheck-icon,
					.check-icon{
						position: absolute;
						left: 0;
						top: 0;
						width: 44upx;
						height: 44upx;
						display: none;
						image{
							width: 100%;
							height: 100%;
						}
					}
					.uncheck-icon{
						display: block;
					}
				}
				.right{
					width:488upx;
					height:124upx;
					background-color:rgba(187,63,89,0.6);
					border-radius:20upx;
					overflow: hidden;
					padding: 14rpx 24upx 14rpx 36upx;
					color: #FEFFFE;
					position: relative;
					&.bg-red{
						background-color: #BB3F59;
					}
					.get-icon{
						width: 84upx;
						height: 66upx;
						position: absolute;
						top: 0;
						right: 280upx;
					}
					.info{
						// padding-bottom: 22upx;
						.num{
							font-size:34upx;
							font-weight:400;
						}
						.text{
							font-size:24upx;
							font-family:PingFang SC;
							font-weight:400;
						}
					}
					.tips{
						font-size:18upx;
						font-weight:400;
						color: #FEFFFE;
					}
				}
				&.current{
					.right{
						background-color: #BB3F59;
					}
					.check-icon{
						display: block;
					}
					.uncheck-icon{
						display: none;
					}
				}
			}
		}
	}
</style>
