// 全局配置
const config = {
  // 后端API地址 - 可以从环境变量或构建时配置
  BACKEND_URL: process.env.VUE_APP_BACKEND_URL || 'http://localhost:8000',
  
  // API端点
  API_ENDPOINTS: {
    USERS: '/users/',
    HEALTH: '/health'
  },
  
  // 请求超时时间（毫秒）
  REQUEST_TIMEOUT: 10000
}

export default config