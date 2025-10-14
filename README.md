# Kaka的个人网站

这是一个使用现代技术栈构建的多语言个人网站项目，支持中文、英文、日语和韩语四种语言，并提供访客统计功能。

## 项目特点

- 🌏 支持多语言切换（中文、英文、日语、韩语）
- 🎨 精美的响应式设计
- ✍️ 个人文章展示
- 📊 访客统计系统
- 🚀 高性能前后端分离架构

## 技术栈

### 前端
- Vue 3 - 渐进式 JavaScript 框架
- TypeScript - 类型安全的 JavaScript 超集
- Vite - 下一代前端构建工具
- Element Plus - Vue 3 的组件库
- Vue I18n - Vue.js 的国际化插件
- Pinia - Vue 3 的状态管理方案

### 后端
- Node.js - JavaScript 运行时
- Express - Web 应用框架
- MongoDB - NoSQL 数据库
- JWT - 用户认证

### 部署
- Docker - 容器化部署
- Nginx - Web服务器
- 阿里云 - 轻量应用服务器

## 本地开发

### 环境要求
- Node.js >= 16
- MongoDB >= 4.4
- Docker (可选)

### 安装依赖

```bash
# 安装前端依赖
cd frontend
yarn install

# 安装后端依赖
cd ../backend
yarn install
```

### 开发服务器

```bash
# 启动前端开发服务器
cd frontend
yarn dev

# 启动后端服务器
cd ../backend
yarn dev
```

## 部署

### Docker 部署

```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d
```

## API 文档

API 文档使用 Swagger 生成，可在开发环境中访问：
http://localhost:8080/api-docs

## 项目结构

```
├── frontend/              # Vue 3 + Vite 前端项目
│   ├── src/
│   │   ├── components/   # 共用组件
│   │   ├── views/       # 页面组件
│   │   ├── stores/      # Pinia 状态管理
│   │   ├── locales/     # 多语言文件
│   │   └── types/       # TypeScript 类型定义
│   └── public/          # 静态资源
├── backend/              # Node.js + Express 后端项目
│   ├── src/
│   │   ├── controllers/ # 控制器
│   │   ├── models/      # 数据模型
│   │   └── routes/      # 路由定义
│   └── config/          # 配置文件
└── deploy/              # 部署相关文件
    ├── docker/         # Docker 配置
    └── nginx/          # Nginx 配置
```

## 网站域名

www.kaka.cc

## 作者

Kaka

Email: maggie_yu0509@163.com