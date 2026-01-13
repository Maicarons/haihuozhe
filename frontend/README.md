# 海活者 (Hai Huo Zhe)

一个打卡应用，提醒用户还"活着"。

## 功能特性

- 巨大的圆形打卡按钮
- 自定义导航栏
- 个人设置（打卡周期、声音、推送等）
- 日历视图显示打卡历史
- 推送管理（微信、钉钉、短信、邮件）

## 技术栈

- [uni-app](https://uniapp.dcloud.io/)
- [uni-ui](https://uniapp.dcloud.net.cn/component/uniui/uni-ui.html)

## 页面结构

- 主页：包含打卡按钮和倒计时
- 设置页：配置打卡周期和其他设置
- 日历页：显示打卡历史
- 推送管理页：管理推送渠道

## 后端服务

后端使用FastAPI框架，部署在Vercel平台，提供以下功能：

- 监控用户打卡超时
- 自动推送通知（邮件、短信、微信、钉钉）
- RESTful API接口

后端位于 [backend](./backend/) 目录。

## 项目简介

"还活着 Haihuozhe"是一个简洁实用的应用程序，旨在帮助用户检测和确认用户的存活状态。该应用利用现代Web技术栈构建，支持跨平台运行。

## 技术架构

- **前端框架**: [uni-app](https://uniapp.dcloud.io/)
- **UI组件库**: [uni-ui](https://ext.dcloud.net.cn/plugin?id=55)
- **编程语言**: Vue.js 3
- **构建工具**: DCloud HBuilderX生态

## 文件结构

```
haihuozhe/
├── App.vue                 # 应用入口组件
├── main.js                 # 主JavaScript入口文件
├── manifest.json           # 应用配置文件
├── pages.json              # 页面路由配置
├── index.html              # HTML模板
├── uni.promisify.adaptor.js # uni-app API适配器
├── uni.scss                # 全局样式
├── androidPrivacy.json     # Android隐私协议配置
├── README.md               # 项目说明文档
├── pages/                  # 页面文件目录
│   └── index/
│       └── index.vue       # 首页组件
├── static/                 # 静态资源目录
├── common/                 # 公共资源目录
├── components/             # 自定义组件目录


```

## 功能特性

- 跨平台支持（iOS、Android、H5、小程序等）
- 实时状态检测
- 用户友好的界面设计
- 基于uni-ui组件库的现代化UI

## 安装与运行

1. 确保已安装[HBuilderX](https://www.dcloud.io/hbuilderx.html)
2. 克隆项目到本地
3. 使用HBuilderX打开项目

## 许可证

AGPL v3.0 License