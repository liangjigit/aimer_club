<template>
	<view class="imt-calendar">
		<view class="calendar-month-wrapper align-center padding-lr">
			<view class="calendar-icon" @click="current&&current--">
				<image src="/static/training/evaluation/left-arrow-red-icon.png" mode="aspectFit" v-if="current"></image>
				<image src="/static/training/evaluation/left-arrow-icon.png" mode="aspectFit" v-else></image>
			</view>
			<view class="calendar-month">{{currentTime}}</view>
			<view class="calendar-icon" @click="current == calendar.length-1 || current++">
				<image src="/static/training/evaluation/right-arrow-icon.png" mode="aspectFit" v-if="current == calendar.length-1"></image>
				<image src="/static/training/evaluation/right-arrow-red-icon.png" mode="aspectFit" v-else></image>
			</view>
		</view>
		<view class="calendar-week-wrapper justify-center">
			<view class="calendar-week" v-for="(item,index) in week" :key="index">{{item}}</view>
		</view>
		<swiper class="calendar-date-swiper" :current="current" @change="current = $event.detail.current">
			<swiper-item class="calendar-date-wrapper" v-for="(item,index) in calendar" :key="index">
				<view class="calendar-date" v-for="(value,key) in item" :key="key" @click="onclick(value.selected,value.date)" :style="{background:value.selected&&color,color:value.selected&&'#fff'}">{{value.date}}</view>
				<view class="calendar-date" v-for="item in (35-item.length)"></view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				week: ['日', '一', '二', '三', '四', '五', '六'],
				current: '',
				startYear: '',
				startMonth: '',
				calendar: []
			}
		},
		props: {
			selected: Array,
			color: {
				type: String,
				default: '#EC2C5A'
			}
		},
		
		methods: {
			init() {
				let year = new Date().getFullYear()
				let month = new Date().getMonth()
				this.startYear = this.selected.length ? this.selected[0].substr(0, 4) : `${year}`
				this.startMonth = this.selected.length ? this.selected[0].substr(5, 2) - 1 : month
				this.calendar = [...Array((year - this.startYear) * 12 + month - this.startMonth + 1).keys()].map(i => this.getDate(
					this.format(i)))
				this.selected.forEach(i => {
					let time = i.split('-')
					this.calendar[time[1] - this.startMonth - 1 + (time[0] - this.startYear) * 12][time[2] - 1 + new Date(
						`${time[0]}-${time[1]}`).getDay()].selected = true
				})
				this.current = this.calendar.length - 1
			},
			getDate(e) {
				let time = e.split('-')
				return [...Array(new Date(`${time[0]}-${time[1]}`).getDay())].map(i => ({
					date: ''
				})).concat([...Array([4, 6, 9, 11].includes(time[1] * 1) ? 30 : (time[1] != 2 ? 31 : (time[0] % 4 == 0 ? 29 : 28)))
					.keys()
				].map(i => ({
					date: i + 1
				})))
			},
			format(e) {
				let time = new Date(new Date(this.startYear).setMonth(this.startMonth + e))
				return `${time.getFullYear()}-${(time.getMonth()<9 && '0')+(time.getMonth()+1)}`
			},
			// formatChar(e) {
			// 	let time = new Date(new Date(this.startYear).setMonth(this.startMonth + e))
			// 	return `${time.getFullYear()}年${(time.getMonth()<9 && '0')+(time.getMonth()+1)}月`
			// }
			onclick(isSelected,day){
				if(isSelected){
					day = Number(day)<10?('0'+day):day;
					this.$emit('click',{date:this.currentTime+'-'+day})
				}
			}
		},
		computed: {
			currentTime() {
				return this.format(this.current)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.imt-calendar {
		width: 690upx;
		padding-left: 10upx;
		padding-right: 10upx;
		margin: auto;
		background: #fff;
		text-align: center;
		background:rgba(255,255,255,1);
		box-shadow:0upx 8upx 10upx 0upx rgba(182, 184, 183, 0.35);
		border-radius:18upx;
	}

	.calendar-month-wrapper {
		display: flex;
		justify-content: space-between;
	}

	.calendar-icon {
		width: 35upx;
		height:35upx;
		
		image{
			width: 100%;
			height:100%; 
		}
	}

	.calendar-month {
		font-size: 32upx;
		line-height: 100upx;
		color: #EC2C5A;
	}

	.reserve {
		transform: rotate(180deg);
	}

	.calendar-week-wrapper {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.calendar-week {
		font-size: 32upx;
		width: 48upx;
		height: 48upx;
		margin: 14upx 20upx;
		color: #2E2F2F;
	}

	.calendar-date-swiper {
		height: 500upx;
	}

	.calendar-date-wrapper {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.calendar-date {
		width: 48upx;
		height: 48upx;
		font-size: 32upx;
		line-height: 48upx;
		border-radius: 50%;
		margin: 14upx 20upx;
		color: #111111;
	}
</style>
