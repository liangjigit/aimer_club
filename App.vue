<script>
	import Vue from 'vue'
	export default {
		onLaunch: function(options) {
			// console.log('App Launch')
			const updateManager = wx.getUpdateManager()
			updateManager.onCheckForUpdate(function(res) {
				// 请求完新版本信息的回调
				// console.log(res.hasUpdate)
			})
			updateManager.onUpdateReady(function() {
				wx.showModal({
					title: '更新提示',
					content: '新版本已经准备好，是否重启应用？',
					success: function(res) {
						if (res.confirm) {
							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							updateManager.applyUpdate()
						}
					}
				})
			})
			updateManager.onUpdateFailed(function() {
				// 新版本下载失败
				uni.showToast({
					title: "新版本下载失败",
					icon: "none"
				})
			})
			// join/index 需要自定义导航栏
			uni.getSystemInfo({
				success: function(e) {
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
					};
					// #endif 

					// #ifdef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					// #endif
				}
			})
		},
		onShow: function(options) {
			const {
				scene
			} = options
			uni.setStorageSync('globalScene', scene)
			if (getCurrentPages()[0] && getCurrentPages()[0].route == 'pages/index/index') {
				this.globalData.hotOpen = true
			}else{
				this.globalData.hotOpen = false
			}
			// console.log('App Show', scene)
		},
		onHide: function() {
			// console.log('App Hide')
		},
		globalData: {
			level: false,
			hotOpen: false
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "colorui/main.css";
	@import "colorui/icon.css";
	@import "app.css";

	image {
		will-change: transform
	}
</style>
