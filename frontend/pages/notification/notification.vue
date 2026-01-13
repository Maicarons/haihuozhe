<template>
	<view class="container">
		<custom-nav-bar :title="title" :left-icon="leftIcon" :right-icon="rightIcon" @clickLeft="back" @clickRight="addNewTarget"></custom-nav-bar>
		
		<view class="content">
			<view class="target-list">
				<view class="target-item" v-for="(item, index) in notificationTargets" :key="index">
					<view class="target-info">
						<uni-icons :type="item.icon" size="24" :color="item.color"></uni-icons>
						<view class="info-text">
							<text class="target-name">{{ item.name }}</text>
							<text class="target-desc">{{ item.description }}</text>
						</view>
					</view>
					<switch :checked="item.enabled" @change="toggleTarget(item, index)" />
				</view>
			</view>
			
			<view v-if="notificationTargets.length === 0" class="empty-state">
				<uni-icons type="email" size="64" color="#ccc"></uni-icons>
				<text class="empty-text">暂无推送目标，请点击右上角添加</text>
			</view>
			
			<!-- 同步到后端按钮 -->
			<view class="sync-section" v-if="backendConnected">
				<button class="sync-btn" @click="syncToBackend">同步到后端</button>
			</view>
		</view>
		
		<!-- 右下角浮动按钮 -->
		<view class="fab-button" @click="addNewTarget">
			<uni-icons type="plusempty" size="24" color="#ffffff"></uni-icons>
		</view>
	</view>
</template>

<script>
	import apiService from '@/common/api-service.js'
	
	export default {
		data() {
			return {
				title: '推送管理',
				leftIcon: 'back',
				rightIcon: 'plus',
				notificationTargets: [
					{
						id: 2,
						name: '钉钉推送',
						description: '通过钉钉机器人发送通知',
						type: 'dingtalk',
						icon: 'paperplane',
						color: '#2196F3',
						enabled: true,
						config: {}
					}
				],
				backendConnected: false,
				userId: '' // 用户ID
			}
		},
		onLoad() {
			this.getUserId()
			this.loadNotificationTargets()
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
			loadNotificationTargets() {
				// 从本地存储加载推送目标
				try {
					const storedTargets = uni.getStorageSync('notification_targets')
					if (storedTargets && storedTargets.length > 0) {
						this.notificationTargets = storedTargets
					}
				} catch (e) {
					console.error('加载推送目标失败:', e)
				}
			},
			saveNotificationTargets() {
				// 保存推送目标到本地存储
				try {
					uni.setStorageSync('notification_targets', this.notificationTargets)
				} catch (e) {
					console.error('保存推送目标失败:', e)
				}
			},
			back() {
				uni.navigateBack()
			},
			addNewTarget() {
				uni.navigateTo({
					url: '/pages/add-notification/add-notification'
				})
			},
			toggleTarget(target, index) {
				this.notificationTargets[index].enabled = !this.notificationTargets[index].enabled
				console.log(`切换${target.name}状态: ${this.notificationTargets[index].enabled}`)
				this.saveNotificationTargets()
			},
			async syncToBackend() {
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
							timeout_duration: 24, // 默认24小时
							push_rules: [],
							timezone: "Asia/Shanghai"
						}
					}
					
					// 转换本地推送目标为后端格式
					const pushRules = this.notificationTargets.map((target, index) => ({
						id: target.id.toString(),
						type: target.type,
						enabled: target.enabled,
						config: target.config || {}
					}))
					
					// 更新用户数据
					userData.push_rules = pushRules
					
					// 发送到后端
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
	
	.target-list {
		background-color: #ffffff;
		border-radius: 8px;
		overflow: hidden;
	}
	
	.target-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15px;
		border-bottom: 1px solid #f0f0f0;
	}
	
	.target-item:last-child {
		border-bottom: none;
	}
	
	.target-info {
		display: flex;
		align-items: center;
		flex: 1;
	}
	
	.info-text {
		display: flex;
		flex-direction: column;
		margin-left: 10px;
		flex: 1;
	}
	
	.target-name {
		font-weight: bold;
		font-size: 16px;
		color: #333;
	}
	
	.target-desc {
		font-size: 12px;
		color: #999;
		margin-top: 4px;
	}
	
	.empty-state {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 60vh;
		text-align: center;
	}
	
	.empty-text {
		margin-top: 20px;
		color: #999;
		font-size: 14px;
	}
	
	.fab-button {
		position: fixed;
		bottom: 30px;
		right: 30px;
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background-color: #007AFF;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
		z-index: 999;
	}
	
	.sync-section {
		margin-top: 20px;
		padding: 0 15px;
	}
	
	.sync-btn {
		background-color: #007AFF;
		color: white;
		border: none;
		border-radius: 4px;
		padding: 12px;
		font-size: 16px;
		width: 100%;
	}
</style>