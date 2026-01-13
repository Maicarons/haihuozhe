<template>
	<view class="container">
		<custom-nav-bar :title="title" :left-icon="leftIcon" @clickLeft="back"></custom-nav-bar>
		
		<view class="content">
			<view class="form-section">
				<text class="section-title">选择推送方式</text>
				<radio-group @change="onTypeChange">
					<view class="radio-options">
						<label class="radio-item" v-for="(option, index) in typeOptions" :key="index">
							<radio :value="option.value" :checked="selectedType === option.value" color="#007AFF" />
							<view class="option-info">
								<uni-icons :type="option.icon" size="20" :color="option.color"></uni-icons>
								<text>{{ option.label }}</text>
							</view>
						</label>
					</view>
				</radio-group>
			</view>
			
			<view class="form-section" v-if="selectedType">
				<text class="section-title">配置{{ getTypeLabel(selectedType) }}参数</text>
				<view class="config-form">
					<!-- 钉钉配置 -->
					<view v-if="selectedType === 'dingtalk'" class="config-fields">
						<view class="input-group">
							<text class="input-label">机器人Webhook</text>
							<input class="input-field" type="text" placeholder="请输入钉钉机器人Webhook地址" v-model="config.dingtalk.webhook_url" />
						</view>
						<view class="input-group">
							<text class="input-label">安全密钥（可选）</text>
							<input class="input-field" type="text" placeholder="请输入安全密钥，如未设置请留空" v-model="config.dingtalk.secret" />
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="submit-section">
			<button class="submit-btn" @click="saveConfig" :disabled="!selectedType">保存配置</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '添加推送目标',
				leftIcon: 'back',
				selectedType: '',
				typeOptions: [
					{ value: 'dingtalk', label: '钉钉推送', icon: 'paperplane', color: '#2196F3' }
				],
				config: {
					dingtalk: {
						webhook_url: '',
						secret: ''
					}
				}
			}
		},
		methods: {
			back() {
				uni.navigateBack()
			},
			onTypeChange(e) {
				this.selectedType = e.detail.value
			},
			getTypeLabel(typeValue) {
				const option = this.typeOptions.find(opt => opt.value === typeValue)
				return option ? option.label : ''
			},
			saveConfig() {
				if (!this.selectedType) {
					uni.showToast({
						title: '请选择推送方式',
						icon: 'none'
					})
					return
				}
				
				// 这里应该验证必填字段
				const isValid = this.validateConfig()
				if (!isValid) {
					return
				}
				
				// 获取现有推送目标
				let notificationTargets = uni.getStorageSync('notification_targets') || []
				
				// 生成新ID（使用时间戳确保唯一性）
				const newId = Date.now()
				
				// 创建新的推送目标
				const newTarget = {
					id: newId,
					name: this.getTypeLabel(this.selectedType),
					description: this.getDescription(this.selectedType),
					type: this.selectedType,
					icon: this.getIconByType(this.selectedType),
					color: this.getColorByType(this.selectedType),
					enabled: true,
					config: this.config[this.selectedType]
				}
				
				// 添加到推送目标列表
				notificationTargets.push(newTarget)
				
				// 保存到本地存储
				uni.setStorageSync('notification_targets', notificationTargets)
				
				uni.showToast({
					title: '配置保存成功',
					icon: 'success'
				})
				
				setTimeout(() => {
					uni.navigateBack()
				}, 1500)
			},
			getDescription(type) {
				switch(type) {
					case 'dingtalk':
						return '通过钉钉机器人发送通知'
					default:
						return '推送通知'
				}
			},
			getIconByType(type) {
				switch(type) {
					case 'dingtalk':
						return 'paperplane'
					default:
						return 'email'
				}
			},
			getColorByType(type) {
				switch(type) {
					case 'dingtalk':
						return '#2196F3'
					default:
						return '#9C27B0'
				}
			},
			validateConfig() {
				const config = this.config[this.selectedType]
				
				switch(this.selectedType) {
					case 'dingtalk':
						if (!config.webhook_url) {
							uni.showToast({
								title: '请输入钉钉机器人Webhook',
								icon: 'none'
							})
							return false
						}
						break
				}
				
				return true
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
	
	.form-section {
		background-color: #ffffff;
		border-radius: 8px;
		padding: 15px;
		margin-bottom: 15px;
	}
	
	.section-title {
		font-size: 16px;
		font-weight: bold;
		color: #333;
		margin-bottom: 15px;
		display: block;
	}
	
	.radio-options {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	
	.radio-item {
		display: flex;
		align-items: center;
		padding: 10px 0;
	}
	
	.option-info {
		display: flex;
		align-items: center;
		margin-left: 10px;
		flex: 1;
	}
	
	.config-form {
		margin-top: 10px;
	}
	
	.config-fields {
		display: flex;
		flex-direction: column;
		gap: 15px;
	}
	
	.input-group {
		display: flex;
		flex-direction: column;
	}
	
	.input-label {
		font-size: 14px;
		color: #666;
		margin-bottom: 5px;
	}
	
	.input-field {
		padding: 10px;
		border: 1px solid #e5e5e5;
		border-radius: 4px;
		font-size: 14px;
	}
	
	.picker-field {
		padding: 10px;
		border: 1px solid #e5e5e5;
		border-radius: 4px;
		font-size: 14px;
		color: #666;
		background-color: #fafafa;
	}
	
	.submit-section {
		padding: 15px;
	}
	
	.submit-btn {
		background-color: #007AFF;
		color: white;
		border: none;
		border-radius: 4px;
		padding: 15px;
		font-size: 16px;
	}
	
	.submit-btn:disabled {
		background-color: #ccc;
	}
</style>