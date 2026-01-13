# 还活着 (Haihuozhe)

## 项目概述

"还活着"是一个按照周期打卡的应用，如果用户超时未打卡，系统会向用户规定的目标发送通知。该项目采用前后端分离架构，前端使用Uniapp开发，后端使用FastAPI开发。

## 功能特性

- 🔔 定期打卡提醒
- ⏰ 超时检测
- 📱 多种推送方式支持
- 🌍 跨平台前端应用
- 🚀 高性能后端服务
- 📊 打卡记录管理
- ⚙️ 灵活的配置选项

## 技术栈

### 前端
- **框架**: Uniapp
- **UI组件库**: Uni-UI
- **开发语言**: Vue.js
- **构建工具**: Vite

### 后端
- **框架**: FastAPI
- **开发语言**: Python 3.10+
- **数据库**: SQLite
- **定时任务**: APScheduler
- **ORM**: 原生SQL (计划迁移到SQLAlchemy)
- **部署平台**: Vercel

## 项目结构

```
haihuozhe/
├── frontend/          # 前端代码
│   ├── common/        # 通用工具和服务
│   ├── components/    # 自定义组件
│   ├── pages/         # 页面组件
│   ├── static/        # 静态资源
│   ├── uni_modules/   # Uni-UI组件库
│   └── unpackage/     # 构建输出目录
├── backend/           # 后端代码
│   ├── db/            # 数据库操作
│   ├── models/        # 数据模型
│   ├── services/      # 业务逻辑和服务
│   ├── utils/         # 工具函数
│   └── app.py         # 主应用入口
├── README.md          # 项目说明文档
├── LICENSE            # 许可证文件
└── .gitignore         # Git忽略配置
```

## 安装和运行

### 后端安装和运行

1. 进入后端目录

```bash
cd backend
```

2. 安装依赖

```bash
pip install -r requirements.txt
```

3. 运行后端服务

```bash
# 使用run.cmd脚本 (Windows)
run.cmd

# 或直接使用uvicorn运行
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

### 前端安装和运行

1. 进入前端目录

```bash
cd frontend
```

2. 安装依赖

```bash
npm install
```

3. 运行前端开发服务器

```bash
# H5开发
npm run dev:h5

# 小程序开发 (根据需要选择)
npm run dev:mp-weixin
npm run dev:mp-alipay
# 其他平台参考Uniapp文档
```

## API文档

后端服务启动后，可以通过以下地址访问API文档：

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 配置说明

### 后端配置

后端支持通过环境变量或配置文件进行配置。主要配置项包括：

- `DATABASE_URL`: 数据库连接URL
- `PORT`: 服务端口
- `LOG_LEVEL`: 日志级别

### 前端配置

前端配置文件位于 `frontend/static/config.js`，主要配置项包括：

- `BACKEND_URL`: 后端API地址
- `REQUEST_TIMEOUT`: 请求超时时间

## 推送服务

目前支持的推送方式：
- ✅ 钉钉推送

计划支持：
- 📧 邮件推送
- 📱 短信推送
- 💬 微信推送
- 💼 Slack推送

## 部署说明

### 后端部署到Vercel

1. 确保已安装Vercel CLI

```bash
npm install -g vercel
```

2. 登录Vercel

```bash
vercel login
```

3. 部署后端服务

```bash
cd backend
vercel
```

4. 按照提示完成部署配置

### 前端部署

前端可以部署到各种平台，具体部署方式请参考Uniapp文档。

## 开发说明

### 提交代码

1. 确保代码符合项目规范
2. 编写必要的测试
3. 更新文档
4. 提交代码到对应的GitHub仓库

### 分支管理

- `main`: 主分支，用于发布稳定版本
- `develop`: 开发分支，用于集成新功能
- `feature/*`: 特性分支，用于开发具体功能
- `bugfix/*`: 修复分支，用于修复bug

## 许可证

本项目采用AGPL许可证，详情请查看LICENSE文件。

## 贡献

欢迎提交Issue和Pull Request！

## 联系方式

如有问题或建议，欢迎通过以下方式联系：

- GitHub Issues: [https://github.com/Maicarons/haihuozhe/issues](https://github.com/Maicarons/haihuozhe/issues)

## 更新日志

### v1.0.0 (2026-01-13)
- 初始版本发布
- 实现基本的打卡和超时检测功能
- 支持钉钉推送
- 前后端分离架构

---

**还活着** - 让生活更有规律，让关心更及时！