<template>
	<view class="page">
		<div class="bg-red"></div>
		<div class="abs bg">
			<div class="abs userinfo flex flex-direction justify-center align-center">
			     <div class="name">{{userInfo.nickName}}</div>
				 <div class="avatar">
					 <image :src="userInfo.avatarUrl" mode="aspectFill"></image>
				 </div>
			 </div>
			<div class="result flex-direction flex justify-center justify-between">
			    <div class="box flex justify-between align-center">
			         <div class="count flex justify-center">
			             <text class="align-self-baseline text-red-bold margin-right-sm">{{score}}</text>
			             <text class="align-self-baseline text-red-xs-o">分</text>
			         </div>
			         <div class="text flex-direction flex text-black flex-sub">
			             <text style="margin-bottom: 16upx;">您的美胸得分</text>
			             <text>超过了全国<text class="text-red-xs">{{rank}}</text>的仙女</text>
			         </div>
			    </div>
			    <div class="line"></div>
			    <div class="box flex justify-between align-center">
			         <div class="count flex justify-center">
			             <text class="text-red-bold">{{cup}}</text>
			         </div>
			         <div class="text text-black flex-sub">
			             <text>建议内衣尺码</text>
			             <text class="text-df">{{underBust}}{{cup}}</text>
			         </div>
			    </div>
			</div>
			<div class="report flex flex-direction align-center justify-center">
				<text class="bg-text">ANALYSIS</text>
				<div class="title">胸部健康分析 <image @click="toggleATip" src="/static/training/evaluation/report/tip.png"mode="aspectFit"></image></div>
				<div class="tip" v-show="showATip">根据测试，结合【爱慕人体工学研究院】的数据研究</div>
				<div class="item flex-direction flex margin-bottom" v-for="(item,index) in list" :key="index">
					<div class="item-title flex align-end justify-center">{{item.analysisPre}} <text class="text-black-lg">{{item.type}}</text> {{item.analysisAfter}}</div>
					<div class="flex item-content">
						<image :src="item.analysisImage" alt="" class="left-img" mode="aspectFit"></image>
						<div class="text">{{item.analysis}}</div>
					</div>
				</div>
			</div>
			<div class="report flex flex-direction align-center justify-center">
				<text class="bg-text">ADVICE</text>
				<div class="title">美胸健康建议 <image @click="toggleSTip" src="/static/training/evaluation/report/tip.png" width="15" mode="aspectFit"></image></div>
				<div class="tip" v-show="showSTip">针对您的胸部状况，结合【爱慕】品牌20多年的中国女性胸部健康及美学研究成果，给您提供以下建议</div>
				<div class="item flex-direction flex margin-bottom" v-for="(item,index) in list" :key="index" >
					<div class="flex  justify-center" :class="{'item-title align-end':item.type=='很完美','item-title-lg flex-direction align-center':item.type!='很完美'}">
						<text class="flex align-end">
							<text>{{item.suggestPre}} </text>
							<text class="text-black-lg"  style="padding:0 0.5upx" v-if="item.type!='很完美'"> {{item.type}}</text>{{item.suggestAfter}}
						</text>
						<text class="advice" v-if="item.type!='很完美'">我们建议</text>
					</div>
					<div class="flex flex-direction align-center item-content" style="padding: 0;">
						<image :src="item.suggestImage" alt="" class="top-img" mode="aspectFit"></image>
						<div class="text" style="padding:0 50upx 50upx;">{{item.suggest}}</div>
					</div>
				</div>
			</div>
			<view class="flex justify-center margin-bottom-lg">
				<button class="cu-btn lines-red lg round flex align-center" @click="goRecord"><text>查看历史报告</text><text class="cuIcon-right"></text></button>
			</view>
			<view class="course-title flex flex-direction justify-center align-center">
				<text class="bg-text">TRAING</text>
				<text class="sm">已为您生成</text>
				<text class="lg">专属美胸课程</text>
			</view>
			<list-item-card-h :list="courseList" :showStart="false" @goDetail="goDetail"></list-item-card-h>
			<view class="flex justify-center margin-bottom-lg" v-if="courseList.length>0">
				<button class="cu-btn lines-red lg round flex align-center" @click="goTraining"><text>查看更多课程</text><text class="cuIcon-right"></text></button>
			</view>
		</div>
	</view>
	
</template>

<script>
	import {mapState,mapActions} from 'vuex'
	import listItemCardH from '@/pages/components/list-item/list-item-card-h.vue'
	export default{
		components:{
			listItemCardH
		},
		computed:{
			...mapState('trainingEvaluation',['dateList']),
			...mapState('login',['userInfo'])
		},
		data(){
			return{
				showATip:false,
				showSTip:false,
				courseList:[],//推荐课程
				list:[],
				underBust:"",
				score:"",
				rank:"",
				cup:""
			}
		},
		async onLoad(options){
			let {date} = options
			let response = await this.getReport({date,showCourse: true})
			if(response.code = 200){
				let {underBust,score,rank,nickname,cup,avatarUrl,analysisAndSuggest,courseList} = response.data
				let list = analysisAndSuggest.map(item=>{
					const {problem} = item
					item = {...item,...this.getDiffContent(problem)}
					return item 
				})
				this.underBust = underBust
 				this.score = score
				this.rank = rank
				this.cup = cup
				this.list = list
				this.courseList = courseList
			}
		},
		methods:{
			...mapActions('trainingEvaluation',['getReport']),
			toggleATip(){
				this.showATip = !this.showATip
			},
			toggleSTip(){
				this.showSTip = !this.showSTip
			},
			goDetail(options){
				let {code,title} = options
				uni.navigateTo({
					url:'/pages/training/detail/index?code='+code+'&title='+title
				})
			},
			goTraining(){
				uni.switchTab({
					url:'/pages/training/index'
				})
			},
			// 去历史记录
			goRecord(){
				uni.navigateTo({
					url:'/pages/training/evaluation/record'
				})
			},
			// 显示文字
			getDiffContent(problem,course){
				course = course || "爱慕美胸操"
				let analysisImage = ""
				let analysisPre = ""
				let analysisAfter =""
				let analysisCourse =""
				let suggestImage = ""
				let suggestPre = ""
				let suggestAfter = ""
				let type = problem
				switch(problem){
					case "副乳":
						analysisImage = "https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1597136413956"
						suggestImage = "https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1597136431380"
						analysisCourse = `但不用过于担心，通过练习专业的【${course}】，以及选择合适的内衣，会在一定程度上缓解这种困扰。`
						analysisPre = "您可能出现了"
						analysisAfter = "的迹象"
						suggestPre = "针对您胸部的"
						suggestAfter = "现象"
					break;
					case "下垂":
						analysisImage = "https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1597136453866"
						suggestImage = "https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1597136468374"
						analysisCourse = `但不用过于担心，通过练习专业的【${course}】，以及选择合适的内衣，会在一定程度上缓解这种困扰。`
						analysisPre = "您的胸部可能出现了"
						analysisAfter = "的迹象"
						suggestPre = "针对您胸部的"
						suggestAfter = "现象"
					break;
					case "外扩":
						analysisImage = "https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1597136490092"
						suggestImage = "https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1597136510046"
						analysisCourse = `但您不用过于担心，通过练习专业的【${course}】，以及选择合适的内衣，会在一定程度上缓解这种困扰。`
						analysisPre = "您的胸部出现了"
						analysisAfter = "的趋势"
						suggestPre = "针对您胸部的"
						suggestAfter = "趋势"
					break;
					case "贫乳":
						analysisImage = "https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1597136526402"
						suggestImage = "https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1597136541199"
						analysisCourse = `但不用过于担心，通过练习专业的【${course}】，以及选择合适的内衣，会在一定程度上缓解这种困扰。另外，您也不必刻意追求丰满胸部，自信的女人即使平胸也很美！`
						analysisPre = "您可能有"
						analysisAfter = "的困扰"
						suggestPre = "针对您的"
						suggestAfter = "困扰"
					break;
					case "骨盆前倾":
						analysisImage = "https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1597136564777"
						suggestImage = "https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1597136580607"
						analysisCourse = ""
						analysisPre = "您可能出现"
						analysisAfter = "的迹象"
						suggestPre = "针对您的"
						suggestAfter = ""
					break;
					case "您的胸型是纺锤型":
						analysisImage = "https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1597136649806"
						suggestImage = "https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1597136663054"
						analysisCourse = `但不用过于担心，通过练习专业的【${course}】，以及选择合适的内衣，就不会出现下垂情况。`
						analysisPre = "您的胸型是"
						analysisAfter = ""
						suggestPre = "针对您的"
						suggestAfter = "胸型"
						type = "纺锤型"
					break;
					case "您的胸型很完美":
						analysisImage = "https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1597136678869"
						suggestImage = "https://aimer-zt.oss-cn-beijing.aliyuncs.com/pictures_test/1597136695047"
						analysisCourse = `但是也不可以松懈，坚持练习专业的【${course}】，更有助于保持完美胸型哦！`
						analysisPre = "您的胸型"
						analysisAfter = ""
						suggestPre = "完美胸型"
						suggestAfter = "，也有建议~"
						type = "很完美"
					break;
					default:
					break;
				}
				return {
					type,
					course,
					analysisImage,
					analysisPre,
					analysisAfter,
					analysisCourse,
					suggestImage,
					suggestPre,
					suggestAfter
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
	.page{
		position: absolute;
		width: 100%;
		height: 100%;
		overflow-x: hidden;
	}
	.course-title,
	.report{
		position:relative;
		.bg-text{
			font-size:88upx;
			color: #FFFFFF;
			font-weight:600;
			position: absolute;
			top: 38upx;
			z-index:1;
		}
	}
	.course-title{
		.bg-text{
			top:-69rpx
		}
	}
	.course-title{
		margin-top: 92upx;
		padding-bottom: 60upx;
		text{
			color: #EC2C5A;
		}
		.sm{
			font-size:30upx;
			margin-bottom: 16upx;
			z-index: 2;
		}
		.lg{
			font-size:40upx;
			font-weight: 600;
			z-index: 2;
		}
	}
	.cu-btn{
		margin-top: 30upx;
		margin-bottom: 25upx;
		width:280upx;
		font-weight:500;
		height: 66upx;
		&[class*="lines-red"]::after {
			background:linear-gradient(-50deg,rgba(213,27,71,1),rgba(244,50,96,1));
			box-shadow:0px 15px 40px 0px rgba(98,0,23,0.16);
			border-radius:44px;
		}
		text{
			color: #FFFFFF;
			z-index: 2;
			font-size: 26upx;
			line-height: 1;
		}
	}
	.align-self-end{
	    align-self: flex-end;
	}
	.align-self-baseline{
	    align-self: baseline;
	}
	.bg-red{
	    width:1500upx;
	    height:1500upx;
	    border-radius: 100%;
	    background:linear-gradient(-50deg,rgba(213,27,71,1),rgba(244,50,96,1));
	    box-shadow:0 15upx 40upx 0 rgba(98,0,23,0.16);
	    position: absolute;
	    top: 50%;
	    margin-top: -1800upx;
	    left: 50%;
	    margin-left: -750upx;
	}
	.abs{
	    position: absolute;
	    top: 0;
	    left: 0;
	    right: 0;
	    bottom: 0;
	}
	.abs.bg{
	    width: 100%;
	    height: 100%;
	    padding-top: 300upx;
	}
	.abs.userinfo{
		padding-top: 50upx;
	    height: 371upx;
	    width: 100%;
	}
	.name{
		font-size:44upx;
		font-weight:500;
		color:rgba(255,255,255,1);
		line-height:100upx;
	}
	.avatar{
		width:150upx;
		height:150upx;
		background:rgba(255,255,255,1);
		border:4upx solid rgba(255,255,255,1);
		border-radius:50%;
		overflow: hidden; 
		image{
			width: 100%;
			height: 100%;
		}
	}
	.result{
	    width:572upx;
	    height:370upx;
	    background:rgba(255,255,255,1);
	    margin: 0 auto;
	    border-radius:40upx;
	    padding: 44upx;
		box-shadow: 0upx 20upx 60upx 0upx rgba(0,15,41,0.12);
	}
	.result .line{
	    width:100%;
	    height: 2upx;
	    background-color:rgba(204,204,204,1);
	}
	.result text{
	    line-height: 1;
	}
	.count{
		width: 210.2upx;
	}
	.text-red-bold {
	    font-size: 100upx;
	    font-weight:600;
	    color: #EC2C5A;
	}
	.text-red-xs-o{
	    font-size:28upx;
	    font-weight:500;
	    color: #EC2C5A;
	    opacity:0.6;
	}
	.text-red-xs{
	    color: #EC2C5A;
	    font-size: 26upx;
	    font-weight:400;
	}
	.text-black{
	    font-size:26upx;
	    font-family:PingFang SC;
	    font-weight:400;
	}
	.text-df{
	    font-size:26upx;
	    font-weight:400;
	    color: #EC2C5A;
	}
	.text-black-lg{
	    font-size:36upx;
	    font-weight:bold;
	}
	.title{
		z-index: 2;
	    font-size:40upx;
	    font-weight:600;
	    color: #EC2C5A;
	    margin: 94upx auto 40upx auto;
		image{
			width:30upx;
			height: 30upx;
			margin-left: 10upx;
		}
	}
	.tip{
		margin-bottom: 20upx; 
		color: #999;
		width: 80%;
		font-size:24upx;
		font-weight:300;
		text-align: center;
	}
	.item{
	    width:90%;
	    border-radius:30upx;
	    overflow: hidden;
	    background-color: #FFFFFF;
	    box-shadow:0upx 20upx 60upx 0upx rgba(0,15,41,0.12);
	}
	.item .item-title{
	    background:rgba(236,44,90,1);
	    min-height:80upx;
		padding-bottom: 24upx;
	    width: 100%;
	    color: #FFFFFF;
	    letter-spacing: 2upx;
	}
	.item .item-title-lg{
	    background:rgba(236,44,90,1);
	    min-height:138upx;
		padding-bottom: 24upx;
	    width: 100%;
	    color: #FFFFFF;
	    letter-spacing: 2px;
	}
	.item .item-title-lg .advice{
		margin-top: 26upx;
		line-height: 1;
	}
	.item .item-title .text-black-lg{
	    margin: 0 10upx;
	}
	.item .item-content{
	    padding: 50upx;
	    width: 100%;
	}
	.item .item-content .left-img{
		width: 206upx;
	    height:206upx;
		display: block;
	}
	.item .item-content .top-img{
	    height:273upx;
	}
	.item .item-content .text{
	    flex-wrap: wrap;
	    line-height:36upx;
	    font-size:24upx;
	    font-weight:300;
		flex: 1;
	}
</style>
