import {mapState,mapMutations} from 'vuex'
export default {
	computed:{
		...mapState('login',['userInfo','redirectUrl']),
	},
	onUnload() {
		if(this.redirectUrl){
			if(this.isLogin){
				const token = uni.getStorageSync('token');
				const getPhone = uni.getStorageSync('getPhone');
				if(token&&!getPhone){
					this.clearRedirectUrl()
				}
			}
		} 
	},
	methods:{
		...mapMutations('poster',['GETSHAREINFO']),
		...mapMutations('login',['GETREDIRECTURL']),
		setShareInfo(shareTitle,title,shareImg,previewImg,statistics){
			let inviteUserId = undefined
			if(this.userInfo){
				inviteUserId = this.userInfo.id
			}
			var pages = getCurrentPages();
			var page = pages[pages.length - 1];
			let path = '/' + page.route + '?code='+this.code+'&inviteUserId='+ inviteUserId
			this.GETSHAREINFO({shareInfo:{
					title: shareTitle || title,
					image: shareImg || "",
					type: "share",
					poster: previewImg,
					path: path,
					statistics,
					code:this.code
				}
			})
		},
		// 重定向页面Url
		getRedirectUrl(){
			let pages = getCurrentPages();
			let page = pages[pages.length - 1];
			// let {scene} = page.options
			let param = ''
			for(const key in page.options){
				console.log(page.options[key])
				param += key+'='+page.options[key]
			}
			let path = page.route + (param?'?'+param:'');
			this.GETREDIRECTURL({redirectUrl:{url:path,type:1}}) //小程序内部页面
		},
		// 清除重定向
		clearRedirectUrl(){
			this.GETREDIRECTURL({redirectUrl:null})
		}
	}
}