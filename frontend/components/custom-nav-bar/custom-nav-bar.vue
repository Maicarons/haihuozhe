<template>
	<view class="nav-container" :style="{ paddingTop: safeAreaTop + 'px' }">
		<view class="nav-content">
			<view class="nav-left" @click="onLeftClick">
				<slot name="left">
					<uni-icons v-if="leftIcon" :type="leftIcon" size="24" color="#000000"></uni-icons>
					<text v-if="leftText">{{ leftText }}</text>
				</slot>
			</view>
			
			<view class="nav-center">
				<slot name="center">
					<text class="nav-title">{{ title }}</text>
				</slot>
			</view>
			
			<view class="nav-right" @click="onRightClick">
				<slot name="right">
					<uni-icons v-if="rightIcon" :type="rightIcon" size="24" color="#000000"></uni-icons>
					<text v-if="rightText">{{ rightText }}</text>
				</slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'CustomNavBar',
		props: {
			title: {
				type: String,
				default: ''
			},
			leftIcon: {
				type: String,
				default: ''
			},
			leftText: {
				type: String,
				default: ''
			},
			rightIcon: {
				type: String,
				default: ''
			},
			rightText: {
				type: String,
				default: ''
			},
			fixed: {
				type: Boolean,
				default: false
			},
			statusBar: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				statusBarHeight: 0,
				safeAreaTop: 0
			}
		},
		mounted() {
			// 获取状态栏高度和安全区域
			const systemInfo = uni.getSystemInfoSync()
			this.statusBarHeight = systemInfo.statusBarHeight || 0
			
			// 获取安全区域顶部距离
			if (systemInfo.safeArea) {
				this.safeAreaTop = systemInfo.safeArea.top || 0
			} else {
				// 兼容旧版本
				this.safeAreaTop = this.statusBarHeight
			}
		},
		methods: {
			onLeftClick() {
				this.$emit('clickLeft')
			},
			onRightClick() {
				this.$emit('clickRight')
			}
		}
	}
</script>

<style scoped>
	.nav-container {
		width: 100%;
	}

	.nav-content {
		display: flex;
		align-items: center;
		height: 44px;
		background-color: #ffffff;
		padding: 0 15px;
		box-sizing: border-box;
		position: relative;
		width: 100%;
	}
	
	.nav-left, .nav-right {
		width: 60px;
		display: flex;
		align-items: center;
	}
	
	.nav-center {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.nav-title {
		font-size: 18px;
		font-weight: bold;
		color: #000000;
	}
</style>