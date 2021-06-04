// 页面跳转
export function navigatorToPage(url, type, miniappId, displayPage, isRedirect) { //type: 跳转到 1、小程序页面 2 web地址 3 其他小程序
	return new Promise((resolve, reject) => {
		switch (type) {
			case 1: // 小程序内部页面
				let tabbars = ['pages/index/index', 'pages/brarts/index', 'pages/activity/index',
					'pages/training/index',
					'pages/account/index'
				]
				if (tabbars.indexOf(url) > -1) {
					uni.switchTab({
						url: '/' + url
					})
				} else if (isRedirect) {
					uni.redirectTo({
						url: '/' + url
					})
				} else {
					uni.navigateTo({
						url: '/' + url
					})
				}
				break;
			case 2: //  webview 
				uni.navigateTo({
					url: '/pages/webview/index?url=' + url
				})
				break;
			case 3: // 跳转到外部小程序
				uni.navigateToMiniProgram({
					appId: miniappId,
					path: url,
					success() {
						resolve()
					}
				})
				break;
			default:
				break;
		}
	})
}
//日期 格式化 2020-8-26
export function getNowDate() {
	const now = new Date()
	const year = now.getFullYear()
	let month = now.getMonth() + 1
	month = month < 10 ? ('0' + month) : month
	let day = now.getDate()
	day = day < 10 ? ('0' + day) : day
	return year + '-' + month + '-' + day
}
//日期 格式化 2020年8月26日 16:13 
export function getFullDate(date) {
	const currentYear = new Date().getFullYear()
	const now = new Date(date)
	const year = now.getFullYear()
	let month = now.getMonth() + 1
	month = month < 10 ? ('0' + month) : month
	let day = now.getDate()
	day = day < 10 ? ('0' + day) : day;
	let hour = now.getHours()
	hour = hour < 10 ? ('0' + hour) : hour;
	let minutes = now.getMinutes()
	minutes = minutes < 10 ? ('0' + minutes) : minutes;
	if (currentYear == year) {
		return month + '月' + day + '日 ' + hour + ':' + minutes
	} else {
		return year + '年' + month + '月' + day + '日 ' + hour + ':' + minutes
	}
}
// 检查用户授权
export function checkForAuthorization(scope) {
	return new Promise((resolve, reject) => {
		uni.getSetting({
			success(res) {
				// console.log(res.authSetting)
				if (!res.authSetting[scope]) {
					uni.authorize({
						scope,
						success() {
							resolve()
						},
						fail() {
							uni.hideLoading();
							uni.showModal({
								title: '温馨提示',
								content: '您已拒绝授权，是否去设置打开？',
								confirmText: "确认",
								cancelText: "取消",
								success: function(res) {
									if (res.confirm) {
										uni.hideLoading();
										uni.openSetting({
											success: (res) => {
												res.authSetting[scope] =
													true
												resolve()
											}
										});
									} else {
										reject({
											errMsg: '用户拒绝授权'
										})
									}
								},
								fail(res) {
									reject(res)
								}
							});

						}
					})
				} else {
					resolve()
				}
			},
			fail(res) {
				reject(res)
			}
		})
	})
}
// 节流
export function throttle(fn, gapTime) {
	if (gapTime == null || gapTime == undefined) {
		gapTime = 1500
	}

	let _lastTime = null
	return function() {
		let _nowTime = +new Date()
		if (_nowTime - _lastTime > gapTime || !_lastTime) {
			console.log(5)
			fn()
			_lastTime = _nowTime
		}
	}
}
// 防抖
export function debounce(func, wait) {
	let timeout;
	return function() {
		let context = this;
		let args = arguments;
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => {
			func.apply(context, args)
		}, wait);
	}
}
// 用户账号在中台停用提示
export function abnormalprompt() {
	uni.showToast({
		title: "会员卡状态异常，请联系门店或人工客服！",
		icon: "none",
		mask: true
	})
}
// 获取当前帐号信息
const accountInfo = wx.getAccountInfoSync();
// env类型
export const env = accountInfo.miniProgram.envVersion;
