# 微前端项目

基于 Vue3 + Vite + TypeScript 的微前端项目，包含一个主应用和两个子应用。

## 🚀 快速开始

### 1. 拉取所有仓库

```bash
npm run pull
```

### 2. 安装依赖

```bash
npm run install:all
```

### 3. 启动开发服务

```bash
npm run dev
```

## 📱 访问地址

- **主应用**: http://localhost:8000
- **子应用1**: http://localhost:8001
- **子应用2**: http://localhost:8002

## 🛠️ 常用命令

### 开发

```bash
npm run dev          # 启动所有应用
npm run dev:main     # 只启动主应用
npm run dev:child-one   # 只启动子应用1
npm run dev:child-two   # 只启动子应用2
```

### 构建

```bash
npm run build        # 构建所有应用
npm run preview      # 预览构建结果
```

### 依赖管理

```bash
npm run install:all  # 安装所有依赖
npm run clean        # 清理所有 node_modules
```

### 代码质量

```bash
npm run format       # 格式化代码
npm run type-check   # 类型检查
```

## 📁 项目结构

```
micro-app/
├── main-app/          # 主应用 (端口: 8000)
├── child-one/         # 子应用1 (端口: 8001)
├── child-two/         # 子应用2 (端口: 8002)
├── pull-repos.js      # 仓库拉取脚本
├── start.bat          # Windows 启动脚本
└── package.json       # 根目录配置
```

## 🔧 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **Vite** - 下一代前端构建工具
- **TypeScript** - JavaScript 超集
- **Ant Design Vue** - UI 组件库
- **Vue Router** - 路由管理
- **Pinia** - 状态管理
- **@micro-zoe/micro-app** - 微前端框架

## 🎯 微前端路由

子应用使用统一的路由监听工具，支持：

- 自动检测路由模式 (history/hash)
- 统一的 API 接口
- 最小化配置
- 调试支持

### 子应用路由配置

```typescript
// main.ts
import { setupMicroAppRouter } from './utils/micro-app-router'

// 启动路由监听
setupMicroAppRouter(router)
```

## ⚠️ 环境要求

- Node.js >= 20.19.0
- npm >= 8.0.0

## 🔍 故障排除

### 端口冲突

```bash
# 查看端口占用
netstat -ano | findstr :8000

# 杀死进程
taskkill /PID <进程ID> /F
```

### 依赖问题

```bash
npm run clean
npm run install:all
```

### 启动失败

```bash
# 检查版本
node --version
npm --version
```

## 📝 开发注意事项

1. 首次使用请运行 `npm run pull` 拉取所有仓库
2. 确保 Node.js 版本符合要求
3. 修改代码后支持热重载
4. 所有应用支持局域网访问

## 📄 许可证

MIT License
