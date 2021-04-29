<template>
	<div class="count-down">
		<div class="no-activity">距离失效：<span>{{ surplus | filterTime }}</span></div>
	</div>
</template>
<script>
	/**
	 * 能力： 传递给组件一个活动时间，组件根据这个时间去进行计算
	 *1、当时间未到开始时间的时候： 展示倒计时
	 *2、当时间到了开始时间的时候： 活动进行中
	 *3、当时间超过了开始时间的时候：活动已经结束
	 */
	export default {
		name: 'CountDown',
		props: {
			// 活动结束时间戳
			startTimes: {
				type: Number,
				required: true,
				default: 0
			},
			// 活动结束时间戳
			endTimes: {
				type: Number,
				required: true,
				default: 0
			}
		},
		created() {
			this.computedSurplusTime()
		},
		data() {
			return {
				// 展示活动状态
				surplus: '',
				// 距离活动开始的秒数
				diffSeconds: 0,
				interval: undefined
			}
		},
		methods: {
			computedSurplusTime() {
				if (this.interval) {
					clearInterval(this.interval)
				}
				//当前时间
				const nowTime = new Date().getTime()
				const startTime = this.startTimes
				const endTime = this.endTimes
				// console.log(new Date(startTime))
				// console.log(new Date(endTime))
				/**
				 * 当前时间未到开始时间，活动未开始
				 */
				if (startTime > nowTime) {
					this.surplus = '活动未开始'
					return
				}
				/**
				 * 当前时间已超过结束时间，活动结束
				 */
				if (endTime < nowTime) {
					this.surplus = '活动已结束'
					return
				}
				//获取距离活动时间结束的秒数
				this.diffSeconds = Math.round((endTime - nowTime) / 1000)
				this.interval = setInterval(() => {
					this.diffSeconds -= 1
				}, 1000)
			},
			getDetailTime(time) {
				let year = new Date(time).getFullYear()
				let month = new Date(time).getMonth()
				let date = new Date(time).getDate()
				let hour = new Date(time).getHours()
				let minute = new Date(time).getMinutes()
				let second = new Date(time).getSeconds()
				return {
					year,
					month,
					date,
					hour,
					minute,
					second
				}
			},
		},
		watch: {
			diffSeconds(newV) {
				// 当前的秒数 / 3600，向下取整，获取到转化的小时数
				let hours = Math.floor(newV / 3600)
				if (hours >= 24) {
					const dates = Math.floor(hours / 24)
					newV -= (dates * 24 * 3600)
					hours = Math.floor(newV / 3600)
					// 当前秒数 / 60，向下取整
					// 获取到所有分钟数 3600 / 60 = 60分钟
					// 对60取模，超过小时数的分钟数
					const minutes = Math.floor(newV / 60) % 60
					this.surplus = dates + '天' + hours + '时' + minutes + '分'
				} else {
					// 当前秒数 / 60，向下取整
					// 获取到所有分钟数 3600 / 60 = 60分钟
					// 对60取模，超过小时数的分钟数
					const minutes = Math.floor(newV / 60) % 60
					// 当前的秒数 % 60，获取到 超过小时数、分钟数的秒数（秒数）
					const seconds = newV % 60
					// 拼装数据
					this.surplus = hours + ':' + minutes + ':' + seconds
				}
				/**
				 * 在当前秒数 变为 0， 需要修改展示数据
				 */
				if (newV === 0) {
					this.computedSurplusTime()
				}
			},
			surplus(n){
				if(n == '活动未开始' || n == '活动已结束'){
					this.$emit('activityIsOver')
				}
			}
		},
		filters: {
			filterTime(value) {
				// console.log(value)
				if (!value) {
					return ''
				}
				// value 不是时间格式 时：分： 秒
				if (value.indexOf(':') === -1) {
					return value
				}
				let result = ''
				const arr = value.split(':')
				// 对小时、分钟、0秒数 补0
				if (parseInt(arr[0]) < 10) {
					result = '0' + arr[0]
				} else {
					result = arr[0]
				}
				if (parseInt(arr[1]) < 10) {
					result = result + ':0' + arr[1]
				} else {
					result = result + ':' + arr[1]
				}
				if (parseInt(arr[2]) < 10) {
					result = result + ':0' + arr[2]
				} else {
					result = result + ':' + arr[2]
				}
				return result
			}
		}
	}
</script>

<style lang="scss" scoped>
	.no-activity {
		// width: 206px;
		// height: 22px;
		font-size: 22rpx;
		font-family: FZLanTingHei-R-GBK;
		font-weight: 400;
		color: #010101;
		line-height: 95rpx;

		span {
			color: #FFEA00;
		}
	}
</style>
