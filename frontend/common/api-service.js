/**
 * API服务
 */
import config from '../static/config.js'

class ApiService {
  constructor() {
    this.baseUrl = config.BACKEND_URL;
  }

  // 设置后端地址
  setBaseUrl(url) {
    this.baseUrl = url;
  }

  // 创建用户
  async createUser(userData) {
    try {
      const response = await uni.request({
        url: `${this.baseUrl}/users/`,
        method: 'POST',
        data: userData,
        header: {
          'Content-Type': 'application/json'
        },
        timeout: config.REQUEST_TIMEOUT
      });
      return response.data;
    } catch (error) {
      console.error('创建用户失败:', error);
      throw error;
    }
  }

  // 获取用户信息
  async getUser(userId) {
    try {
      const response = await uni.request({
        url: `${this.baseUrl}/users/${userId}`,
        method: 'GET',
        timeout: config.REQUEST_TIMEOUT
      });
      return response.data;
    } catch (error) {
      console.error('获取用户失败:', error);
      throw error;
    }
  }

  // 更新用户
  async updateUser(userId, userData) {
    try {
      const response = await uni.request({
        url: `${this.baseUrl}/users/${userId}`,
        method: 'PUT',
        data: userData,
        header: {
          'Content-Type': 'application/json'
        },
        timeout: config.REQUEST_TIMEOUT
      });
      return response.data;
    } catch (error) {
      console.error('更新用户失败:', error);
      throw error;
    }
  }

  // 用户打卡
  async userCheckin(userId) {
    try {
      const response = await uni.request({
        url: `${this.baseUrl}/users/${userId}/checkin`,
        method: 'POST',
        timeout: config.REQUEST_TIMEOUT
      });
      return response.data;
    } catch (error) {
      console.error('打卡失败:', error);
      throw error;
    }
  }

  // 获取用户超时配置
  async getTimeoutConfig(userId) {
    try {
      const response = await uni.request({
        url: `${this.baseUrl}/users/${userId}/timeout-config`,
        method: 'GET',
        timeout: config.REQUEST_TIMEOUT
      });
      return response.data;
    } catch (error) {
      console.error('获取超时配置失败:', error);
      throw error;
    }
  }

  // 健康检查
  async healthCheck() {
    try {
      const response = await uni.request({
        url: `${this.baseUrl}/health`,
        method: 'GET',
        timeout: config.REQUEST_TIMEOUT
      });
      return response.data;
    } catch (error) {
      console.error('健康检查失败:', error);
      throw error;
    }
  }
}

export default new ApiService();