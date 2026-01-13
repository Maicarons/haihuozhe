<template>
	<view class="container">
		<!-- 自定义导航栏 -->
		<custom-nav-bar :title="title" :left-icon="leftIcon" :right-icon="rightIcon" @clickLeft="showMenu" @clickRight="toSettingPage">
		</custom-nav-bar>

		<!-- 巨大的圆形按钮 -->
		<view class="main-content">
			<button class="circle-button" @click="onCircleButtonClick" :disabled="checkinLoading">
				<text class="button-text">{{ checkinLoading ? '打卡中...' : '还活着' }}</text>
			</button>
			
			<!-- 显示倒计时或下次打卡时间 -->
			<view class="countdown-display">
				<text class="countdown-text">{{ countdownText }}</text>
			</view>
			
			<!-- 后端连接状态 -->
			<view class="status-display">
				<text class="status-text" :style="{ color: backendConnected ? '#4CAF50' : '#FF5722' }">
					{{ backendConnected ? '后端连接正常' : '后端连接异常' }}
				</text>
			</view>
		</view>

		<!-- 弹出菜单 -->
		<uni-popup ref="popup" type="left">
			<view class="popup-menu">
				<view class="menu-item" @click="navigateTo('home')">
					<uni-icons type="home" size="20" color="#000000"></uni-icons>
					<text>主页</text>
				</view>
				<view class="menu-item" @click="navigateTo('calendar')">
					<uni-icons type="calendar" size="20" color="#000000"></uni-icons>
					<text>日历</text>
				</view>
				<view class="menu-item" @click="navigateTo('notification')">
					<uni-icons type="email" size="20" color="#000000"></uni-icons>
					<text>推送</text>
				</view>
				<view class="menu-item" @click="navigateTo('setting')">
					<uni-icons type="settings" size="20" color="#000000"></uni-icons>
					<text>设置</text>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { getCurrentDateString, hasCheckedIn, getNextCheckinDate, getTimeRemaining } from '@/common/checkin-utils.js'
	import apiService from '@/common/api-service.js'
	
	// UUID v4 生成器
	function generateUUID() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			const r = Math.random() * 16 | 0
			const v = c == 'x' ? r : (r & 0x3 | 0x8)
			return v.toString(16)
		})
	}
	
	export default {
		data() {
			return {
				title: '还活着',
				leftIcon: 'list',
				rightIcon: 'settings',
				countdownText: '加载中...',
				settings: {
					checkinPeriod: 'daily'
				},
				lastCheckinDate: null,
				countdownInterval: null,
				backendConnected: false,
				checkinLoading: false,
				userId: '' // 初始化为空，将在onLoad中设置
			}
		},
		onLoad() {
			this.setUserId() // 在加载时设置用户ID
			this.initApp()
		},
		onShow() {
			// 页面显示时重新加载设置
			this.loadSettings()
		},
		onUnload() {
			if (this.countdownInterval) {
				clearInterval(this.countdownInterval)
			}
		},
		methods: {
			setUserId() {
				// 尝试从本地存储获取用户ID
				const storedUserId = uni.getStorageSync('user_id')
				if (storedUserId) {
					this.userId = storedUserId
				} else {
					// 如果本地没有存储，则生成新的UUID用户ID并保存
					this.userId = 'user_' + generateUUID()
					uni.setStorageSync('user_id', this.userId)
				}
			},
			async initApp() {
				await this.checkBackendConnection()
				this.loadSettings()
				await this.syncUserData()
				this.updateCountdown()
				
				// 每秒更新倒计时
				this.countdownInterval = setInterval(() => {
					this.updateCountdown()
				}, 1000)
			},
			async checkBackendConnection() {
				try {
					await apiService.healthCheck()
					this.backendConnected = true
				} catch (error) {
					console.error('后端连接失败:', error)
					this.backendConnected = false
				}
			},
			loadSettings() {
				try {
					const settings = uni.getStorageSync('app_settings')
					if (settings) {
						this.settings = settings
					} else {
						// 如果没有设置，默认为每日打卡
						this.settings = { checkinPeriod: 'daily', timeout_duration: 24 }
						uni.setStorageSync('app_settings', this.settings)
					}
				} catch (e) {
					console.error('加载设置失败:', e)
					this.settings = { checkinPeriod: 'daily', timeout_duration: 24 }
				}
			},
			async syncUserData() {
				// 尝试从后端获取用户数据
				try {
					const userData = await apiService.getUser(this.userId)
					this.lastCheckinDate = userData.last_checkin_time ? new Date(userData.last_checkin_time) : null
				} catch (error) {
					// 用户不存在，创建新用户
					const defaultUserData = {
						user_id: this.userId,
						timeout_duration: this.settings.timeout_duration || 24,
						push_rules: [],
						timezone: "Asia/Shanghai"
					}
					try {
						await apiService.createUser(defaultUserData)
					} catch (createError) {
						console.error('创建用户失败:', createError)
					}
				}
			},
			async onCircleButtonClick() {
				if (this.checkinLoading) return
				
				this.checkinLoading = true
				
				try {
					// 调用后端API打卡
					const result = await apiService.userCheckin(this.userId)
					console.log('打卡成功:', result)
					
					// 更新本地记录
					this.lastCheckinDate = new Date()
					
					// 更新日历中的打卡记录
					const today = getCurrentDateString()
					this.updateCalendarData(today)
					
					uni.showToast({
						title: '打卡成功！',
						icon: 'success'
					})
				} catch (error) {
					console.error('打卡失败:', error)
					uni.showToast({
						title: '打卡失败，请稍后重试',
						icon: 'none',
						duration: 2000
					})
				} finally {
					this.checkinLoading = false
				}
			},
			updateCalendarData(date) {
				// 保存到日历数据
				try {
					let calendarData = uni.getStorageSync('calendar_data') || []
					const exists = calendarData.some(item => item.date === date)
					
					if (!exists) {
						calendarData.push({
							date: date,
							info: '还活着',
							background: '#4CAF50',
							color: '#fff'
						})
						uni.setStorageSync('calendar_data', calendarData)
					}
				} catch (e) {
					console.error('更新日历数据失败:', e)
				}
			},
			showMenu() {
				this.$refs.popup.open()
			},
			toSettingPage() {
				uni.navigateTo({
					url: '/pages/setting/setting'
				})
			},
			navigateTo(page) {
				this.$refs.popup.close()
				switch(page) {
					case 'home':
						uni.switchTab({
							url: '/pages/index/index'
						})
						break
					case 'calendar':
						uni.navigateTo({
							url: '/pages/calendar/calendar'
						})
						break
					case 'notification':
						uni.navigateTo({
							url: '/pages/notification/notification'
						})
						break
					case 'setting':
						uni.navigateTo({
							url: '/pages/setting/setting'
						})
						break
				}
			},
			updateCountdown() {
				if (!this.lastCheckinDate) {
					this.countdownText = '尚未打卡'
					return
				}
				
				const now = new Date()
				const hasCheckedInToday = hasCheckedIn(this.settings.checkinPeriod, this.lastCheckinDate, now)
				
				if (hasCheckedInToday) {
					// 已打卡，显示下次打卡开始时间
					const nextCheckinDate = getNextCheckinDate(this.settings.checkinPeriod, this.lastCheckinDate)
					const timeRemaining = getTimeRemaining(nextCheckinDate)
					this.countdownText = `下次打卡: ${timeRemaining}后`
				} else {
					// 未打卡，显示距离上次打卡的时间
					const timeDiff = now - new Date(this.lastCheckinDate)
					const hours = Math.floor(timeDiff / (1000 * 60 * 60))
					const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
					const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)
					
					if (hours < 24) {
						this.countdownText = `已 ${hours}小时${minutes}分钟${seconds}秒 未打卡`
					} else {
						const days = Math.floor(hours / 24)
						this.countdownText = `已 ${days}天${hours % 24}小时 未打卡`
					}
				}
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
	}

	.main-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: #f5f5f5;
	}

	.circle-button {
		width: 200px;
		height: 200px;
		border-radius: 50%;
		background-color: #007AFF;
		border: none;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	}

	.button-text {
		font-size: 24px;
		font-weight: bold;
		color: white;
		text-align: center;
	}

	.countdown-display {
		margin-top: 30px;
		padding: 10px 20px;
		background-color: #ffffff;
		border-radius: 20px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.countdown-text {
		font-size: 16px;
		color: #333;
		text-align: center;
	}
	
	.status-display {
		margin-top: 10px;
		padding: 5px 15px;
		background-color: #f0f0f0;
		border-radius: 15px;
	}
	
	.status-text {
		font-size: 14px;
	}

	.popup-menu {
		width: 200px;
		padding: 20px;
		display: flex;
		flex-direction: column;
		justify-content: center; /* 垂直居中菜单项 */
		gap: 20px;
		height: 100vh;
		background-color: #ffffff;
		padding-top: 100px; /* 为顶部留出空间 */
	}

	.menu-item {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px;
		cursor: pointer;
	}
</style>