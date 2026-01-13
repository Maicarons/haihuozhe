<template>
	<view class="container">
		<custom-nav-bar :title="title" :left-icon="leftIcon" @clickLeft="back"></custom-nav-bar>
		
		<view class="content">
			<view class="calendar-stats">
				<view class="stat-item">
					<text class="stat-number">{{ aliveDays.length }}</text>
					<text class="stat-label">存活天数</text>
				</view>
				<view class="stat-item">
					<text class="stat-number">{{ streakDays }}</text>
					<text class="stat-label">连续天数</text>
				</view>
			</view>
			
			<uni-calendar 
				:insert="true"
				:lunar="true"
				:selected="selectedDays"
				:disable-date="disableDateFunction"
				@monthSwitch="onMonthChange"
			/>
			
			<view class="legend">
				<view class="legend-item">
					<view class="legend-color alive-color"></view>
					<text>已标记还活着</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '日历',
				leftIcon: 'back',
				aliveDays: [] // 从本地存储加载
			}
		},
		onLoad() {
			this.loadCalendarData()
		},
		computed: {
			selectedDays() {
				// 将存活日期转换为uni-calendar期望的格式
				return this.aliveDays.map(day => ({
					date: day.date,
					info: day.info,
					background: day.background,
					color: day.color
				}))
			},
			streakDays() {
				if (this.aliveDays.length === 0) return 0;
				
				// 按日期排序
				const sortedDays = [...this.aliveDays].sort((a, b) => new Date(a.date) - new Date(b.date));
				
				if (sortedDays.length === 0) return 0;
				
				// 计算连续天数
				let streak = 0;
				const today = new Date();
				today.setHours(0, 0, 0, 0); // 设置为当天的开始时间
				
				// 检查今天是否已打卡
				const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
				const todayCheckedIn = sortedDays.some(day => day.date === todayStr);
				
				if (todayCheckedIn) {
					// 如果今天已打卡，计算连续天数直到今天
					let currentIndex = sortedDays.length - 1;
					let expectedDate = new Date(today);
					
					while (currentIndex >= 0) {
						const day = new Date(sortedDays[currentIndex].date);
						day.setHours(0, 0, 0, 0);
						
						if (day.getTime() === expectedDate.getTime()) {
							streak++;
							expectedDate.setDate(expectedDate.getDate() - 1);
							currentIndex--;
						} else {
							// 如果日期不连续，检查是否只差一天（如果今天还没打卡）
							const diffTime = expectedDate.getTime() - day.getTime();
							const diffDays = diffTime / (1000 * 3600 * 24);
							
							if (diffDays === 1) {
								// 只差一天，可能是昨天
								streak++;
								break;
							} else {
								// 间隔超过一天，停止计算
								break;
							}
						}
					}
				} else {
					// 如果今天没打卡，计算到昨天的连续天数
					const yesterday = new Date(today);
					yesterday.setDate(yesterday.getDate() - 1);
					yesterday.setHours(0, 0, 0, 0);
					
					let currentIndex = sortedDays.length - 1;
					let expectedDate = yesterday;
					let hasYesterday = false;
					
					// 检查是否有昨天的打卡
					const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth()+1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
					hasYesterday = sortedDays.some(day => day.date === yesterdayStr);
					
					if (hasYesterday) {
						// 从昨天开始计算连续天数
						while (currentIndex >= 0) {
							const day = new Date(sortedDays[currentIndex].date);
							day.setHours(0, 0, 0, 0);
							
							if (day.getTime() === expectedDate.getTime()) {
								streak++;
								expectedDate.setDate(expectedDate.getDate() - 1);
								currentIndex--;
							} else {
								// 检查是否是连续的日期
								const diffTime = expectedDate.getTime() - day.getTime();
								const diffDays = diffTime / (1000 * 3600 * 24);
								
								if (diffDays === 1) {
									streak++;
									break;
								} else {
									break;
								}
							}
						}
					}
				}
				
				return streak;
			}
		},
		watch: {
			aliveDays: {
				handler(newVal) {
					this.saveCalendarData();
				},
				deep: true
			}
		},
		methods: {
			loadCalendarData() {
				try {
					const calendarData = uni.getStorageSync('calendar_data') || []
					this.aliveDays = calendarData
				} catch (e) {
					console.error('加载日历数据失败:', e)
					this.aliveDays = []
				}
			},
			saveCalendarData() {
				try {
					uni.setStorageSync('calendar_data', this.aliveDays)
				} catch (e) {
					console.error('保存日历数据失败:', e)
				}
			},
			back() {
				uni.navigateBack()
			},
			disableDateFunction(date) {
				// 禁用所有日期的点击，只允许查看
				// 如果要允许今日打卡，可以取消下面的注释
				/*
				const today = new Date();
				today.setHours(0, 0, 0, 0); // 设置为当天的开始时间
				const currentDate = new Date(date);
				currentDate.setHours(0, 0, 0, 0); // 设置为传入日期的开始时间
				
				// 只启用今天及以前的日期
				return currentDate.getTime() > today.getTime();
				*/
				
				// 目前禁用所有日期的点击
				return false;
			},
			onMonthChange(e) {
				console.log('月份切换:', e)
				// 月份切换时的处理
			}
		}
	}
</script>

<style>
	.container {
		flex: 1;
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #f5f5f5;
	}
	
	.content {
		flex: 1;
		padding: 10px;
	}
	
	.calendar-stats {
		display: flex;
		justify-content: space-around;
		background-color: #ffffff;
		border-radius: 8px;
		padding: 15px;
		margin-bottom: 10px;
	}
	
	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.stat-number {
		font-size: 24px;
		font-weight: bold;
		color: #007AFF;
	}
	
	.stat-label {
		font-size: 12px;
		color: #666;
		margin-top: 5px;
	}
	
	.legend {
		display: flex;
		justify-content: center;
		margin-top: 15px;
		background-color: #ffffff;
		border-radius: 8px;
		padding: 15px;
	}
	
	.legend-item {
		display: flex;
		align-items: center;
		gap: 5px;
	}
	
	.legend-color {
		width: 12px;
		height: 12px;
		border-radius: 50%;
	}
	
	.alive-color {
		background-color: #4CAF50;
	}
</style>