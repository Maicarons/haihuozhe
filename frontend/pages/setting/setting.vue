<template>
	<view class="container">
		<custom-nav-bar :title="title" :left-icon="leftIcon" @clickLeft="back"></custom-nav-bar>
		
		<view class="content">
			<uni-collapse>
				<uni-collapse-item title="打卡周期">
					<view class="collapse-content">
						<view class="setting-option" @click="setCheckinPeriod('daily')">
							<text>每日打卡</text>
							<switch @change="onCheckinPeriodChange" :checked="checkinPeriod === 'daily'" />
						</view>
						<view class="setting-option" @click="setCheckinPeriod('weekly')">
							<text>每周打卡</text>
							<switch @change="onCheckinPeriodChange" :checked="checkinPeriod === 'weekly'" />
						</view>
						<view class="setting-option" @click="setCheckinPeriod('monthly')">
							<text>每月打卡</text>
							<switch @change="onCheckinPeriodChange" :checked="checkinPeriod === 'monthly'" />
						</view>
						<view class="setting-option">
							<text>Cron表达式</text>
							<input type="text" class="cron-input" v-model="customCron" placeholder="输入自定义Cron表达式" @blur="onCustomCronChange" />
						</view>
						<view class="cron-presets">
							<view class="preset-item" @click="applyCronPreset('daily')">
								<text>每天 00:00</text>
							</view>
							<view class="preset-item" @click="applyCronPreset('weekly')">
								<text>每周一 00:00</text>
							</view>
							<view class="preset-item" @click="applyCronPreset('monthly')">
								<text>每月1号 00:00</text>
							</view>
						</view>
					</view>
				</uni-collapse-item>
				
				<uni-collapse-item title="超时设置">
					<view class="collapse-content">
						<view class="setting-option">
							<text>超时时间（小时）</text>
							<input type="number" class="timeout-input" v-model.number="timeoutDuration" @blur="onTimeoutDurationChange" />
						</view>
						<view class="setting-option">
							<text>后端连接状态</text>
							<text class="status-text" :style="{ color: backendConnected ? '#4CAF50' : '#FF5722' }">
								{{ backendConnected ? '已连接' : '未连接' }}
							</text>
						</view>
						<button class="sync-btn" @click="syncWithBackend">同步到后端</button>
					</view>
				</uni-collapse-item>
				
				<uni-collapse-item title="声音设置">
					<view class="collapse-content">
						<view class="setting-option">
							<text>开启提示音</text>
							<switch @change="onSoundChange" :checked="soundEnabled" />
						</view>
						<view class="setting-option">
							<text>震动提醒</text>
							<switch @change="onVibrateChange" :checked="vibrateEnabled" />
						</view>
						<slider class="sound-slider" min="0" max="100" :value="volumeLevel" @change="onVolumeChange" show-value></slider>
					</view>
				</uni-collapse-item>
				
				<uni-collapse-item title="推送设置">
					<view class="collapse-content">
						<view class="setting-option">
							<text>允许推送通知</text>
							<switch @change="onPushNotificationChange" :checked="pushEnabled" />
						</view>
						<view class="setting-option">
							<text>静默推送</text>
							<switch @change="onSilentPushChange" :checked="silentPushEnabled" />
						</view>
						<view class="time-setting">
							<text>推送时间段</text>
							<view class="time-range">
								<input type="digit" class="time-input" placeholder="08:00" v-model="pushStartTime" />
								<text> - </text>
								<input type="digit" class="time-input" placeholder="22:00" v-model="pushEndTime" />
							</view>
						</view>
					</view>
				</uni-collapse-item>
				
				<uni-collapse-item title="隐私设置">
					<view class="collapse-content">
						<view class="setting-option">
							<text>数据同步</text>
							<switch @change="onDataSyncChange" :checked="dataSyncEnabled" />
						</view>
						<view class="setting-option">
							<text>位置信息</text>
							<switch @change="onLocationChange" :checked="locationEnabled" />
						</view>
					</view>
				</uni-collapse-item>
				
				<uni-collapse-item title="其他设置">
					<view class="collapse-content">
						<view class="setting-option">
							<text>自动更新</text>
							<switch @change="onAutoUpdateChange" :checked="autoUpdateEnabled" />
						</view>
						<view class="setting-option">
							<text>清除缓存</text>
							<button class="clear-cache-btn" @click="clearCache">清除</button>
						</view>
					</view>
				</uni-collapse-item>
			</uni-collapse>
		</view>
	</view>
</template>

<script>
	import apiService from '@/common/api-service.js'
	
	export default {
		data() {
			return {
				title: '设置',
				leftIcon: 'back',
				checkinPeriod: 'daily', // 默认每日打卡
				customCron: '',
				timeoutDuration: 24, // 默认24小时超时
				soundEnabled: true,
				vibrateEnabled: true,
				volumeLevel: 50,
				pushEnabled: true,
				silentPushEnabled: false,
				pushStartTime: '08:00',
				pushEndTime: '22:00',
				dataSyncEnabled: true,
				locationEnabled: false,
				autoUpdateEnabled: false,
				backendConnected: false,
				userId: '' // 从全局或其他地方获取用户ID
			}
		},
		onLoad() {
			this.getUserId()
			this.loadData()
			this.checkBackendConnection()
		},
		methods: {
			getUserId() {
				// 从本地存储获取用户ID
				this.userId = uni.getStorageSync('user_id') || ''
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
			loadData() {
				// 加载设置数据
				try {
					const settings = uni.getStorageSync('app_settings')
					if (settings) {
						this.checkinPeriod = settings.checkinPeriod || 'daily'
						this.customCron = settings.customCron || this.getDefaultCron(this.checkinPeriod)
						this.timeoutDuration = settings.timeout_duration !== undefined ? settings.timeout_duration : 24
						this.soundEnabled = settings.soundEnabled !== undefined ? settings.soundEnabled : true
						this.vibrateEnabled = settings.vibrateEnabled !== undefined ? settings.vibrateEnabled : true
						this.volumeLevel = settings.volumeLevel !== undefined ? settings.volumeLevel : 50
						this.pushEnabled = settings.pushEnabled !== undefined ? settings.pushEnabled : true
						this.silentPushEnabled = settings.silentPushEnabled !== undefined ? settings.silentPushEnabled : false
						this.pushStartTime = settings.pushStartTime || '08:00'
						this.pushEndTime = settings.pushEndTime || '22:00'
						this.dataSyncEnabled = settings.dataSyncEnabled !== undefined ? settings.dataSyncEnabled : true
						this.locationEnabled = settings.locationEnabled !== undefined ? settings.locationEnabled : false
						this.autoUpdateEnabled = settings.autoUpdateEnabled !== undefined ? settings.autoUpdateEnabled : false
					} else {
						// 如果没有设置，使用默认值并保存
						this.customCron = this.getDefaultCron(this.checkinPeriod)
						this.saveData()
					}
				} catch (e) {
					console.error('加载设置失败:', e)
					// 使用默认值
					this.customCron = this.getDefaultCron(this.checkinPeriod)
				}
			},
			getDefaultCron(period) {
				switch(period) {
					case 'daily':
						return '0 0 * * *' // 每天 00:00
					case 'weekly':
						return '0 0 * * 1' // 每周 1（周一）00:00
					case 'monthly':
						return '0 0 1 * *' // 每月1号 00:00
					default:
						return '0 0 * * *' // 每天 00:00
				}
			},
			saveData() {
				// 保存设置数据
				const settings = {
					checkinPeriod: this.checkinPeriod,
					customCron: this.customCron,
					timeout_duration: this.timeoutDuration,
					soundEnabled: this.soundEnabled,
					vibrateEnabled: this.vibrateEnabled,
					volumeLevel: this.volumeLevel,
					pushEnabled: this.pushEnabled,
					silentPushEnabled: this.silentPushEnabled,
					pushStartTime: this.pushStartTime,
					pushEndTime: this.pushEndTime,
					dataSyncEnabled: this.dataSyncEnabled,
					locationEnabled: this.locationEnabled,
					autoUpdateEnabled: this.autoUpdateEnabled
				}
				
				try {
					uni.setStorageSync('app_settings', settings)
				} catch (e) {
					console.error('保存设置失败:', e)
				}
			},
			async syncWithBackend() {
				if (!this.userId) {
					uni.showToast({
						title: '未获取到用户ID',
						icon: 'none'
					})
					return
				}
				
				if (!this.backendConnected) {
					uni.showToast({
						title: '后端未连接',
						icon: 'none'
					})
					return
				}
				
				try {
					// 获取当前用户数据
					let userData = {}
					try {
						userData = await apiService.getUser(this.userId)
					} catch (error) {
						// 用户不存在，创建新用户
						userData = {
							user_id: this.userId,
							timeout_duration: this.timeoutDuration,
							push_rules: [],
							timezone: "Asia/Shanghai"
						}
					}
					
					// 更新用户数据
					userData.timeout_duration = this.timeoutDuration
					
					await apiService.updateUser(this.userId, userData)
					
					uni.showToast({
						title: '同步成功',
						icon: 'success'
					})
				} catch (error) {
					console.error('同步到后端失败:', error)
					uni.showToast({
						title: '同步失败',
						icon: 'none'
					})
				}
			},
			back() {
				uni.navigateBack()
			},
			setCheckinPeriod(period) {
				this.checkinPeriod = period
				this.customCron = this.getDefaultCron(period)
				this.saveData()
			},
			onCheckinPeriodChange(e) {
				// 处理开关变化，实际上由setCheckinPeriod控制
			},
			onCustomCronChange() {
				// 当用户输入自定义cron时，更新设置
				this.saveData()
			},
			onTimeoutDurationChange() {
				// 验证输入值
				if (this.timeoutDuration <= 0) {
					this.timeoutDuration = 1
				}
				this.saveData()
			},
			applyCronPreset(type) {
				switch(type) {
					case 'daily':
						this.customCron = '0 0 * * *' // 每天 00:00
						break
					case 'weekly':
						this.customCron = '0 0 * * 1' // 每周一 00:00
						break
					case 'monthly':
						this.customCron = '0 0 1 * *' // 每月1号 00:00
						break
				}
				// 应用预设后，也更新周期类型
				this.checkinPeriod = type
				this.saveData()
			},
			onSoundChange(e) {
				this.soundEnabled = e.detail.value
				this.saveData()
			},
			onVibrateChange(e) {
				this.vibrateEnabled = e.detail.value
				this.saveData()
			},
			onVolumeChange(e) {
				this.volumeLevel = e.detail.value
				this.saveData()
			},
			onPushNotificationChange(e) {
				this.pushEnabled = e.detail.value
				this.saveData()
			},
			onSilentPushChange(e) {
				this.silentPushEnabled = e.detail.value
				this.saveData()
			},
			onDataSyncChange(e) {
				this.dataSyncEnabled = e.detail.value
				this.saveData()
			},
			onLocationChange(e) {
				this.locationEnabled = e.detail.value
				this.saveData()
			},
			onAutoUpdateChange(e) {
				this.autoUpdateEnabled = e.detail.value
				this.saveData()
			},
			clearCache() {
				uni.showModal({
					title: '确认',
					content: '确定要清除缓存吗？',
					success: (res) => {
						if(res.confirm) {
							uni.clearStorageSync()
							console.log('清除缓存')
							uni.showToast({
								title: '缓存已清除',
								icon: 'success'
							})
						}
					}
				})
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
	
	.collapse-content {
		padding: 15px;
		background-color: #ffffff;
	}
	
	.setting-option {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15px 0;
		border-bottom: 1px solid #f0f0f0;
	}
	
	.setting-option:last-child {
		border-bottom: none;
	}
	
	.sound-slider {
		margin-top: 15px;
		width: 100%;
	}
	
	.time-setting {
		display: flex;
		flex-direction: column;
		padding-top: 10px;
	}
	
	.time-range {
		display: flex;
		align-items: center;
		margin-top: 5px;
	}
	
	.time-input {
		width: 80px;
		padding: 5px;
		border: 1px solid #ddd;
		border-radius: 4px;
		text-align: center;
	}
	
	.clear-cache-btn {
		background-color: #ff3b30;
		color: white;
		font-size: 12px;
		padding: 5px 10px;
		margin: 0;
	}
	
	.cron-input {
		width: 100%;
		padding: 8px;
		border: 1px solid #ddd;
		border-radius: 4px;
		margin-top: 10px;
	}
	
	.timeout-input {
		width: 100px;
		padding: 5px;
		border: 1px solid #ddd;
		border-radius: 4px;
		text-align: center;
	}
	
	.status-text {
		font-size: 14px;
		font-weight: bold;
	}
	
	.cron-presets {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-top: 15px;
	}
	
	.preset-item {
		padding: 10px;
		background-color: #f0f0f0;
		border-radius: 4px;
		text-align: center;
		font-size: 14px;
		color: #333;
	}
	
	.sync-btn {
		background-color: #007AFF;
		color: white;
		border: none;
		border-radius: 4px;
		padding: 10px;
		margin-top: 15px;
		font-size: 16px;
	}
</style>