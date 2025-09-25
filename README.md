# 微前端项目 (Micro Frontend Project)

这是一个基于 Vue3 + Vite + TypeScript 的微前端项目，包含一个主应用和两个子应用。

## 项目结构

```
micro-app/
├── main-app/          # 主应用 (端口: 8000)
├── child-one/         # 子应用1 (端口: 8001)
├── child-two/         # 子应用2 (端口: 8002)
├── package.json       # 根目录配置
└── README.md
```

## 快速开始

### 1. 安装所有项目依赖

```bash
npm run install:all
```

### 2. 启动所有项目 (推荐)

```bash
npm run dev
```

这个命令会同时启动三个项目：

- 主应用: http://localhost:8000
- 子应用 1: http://localhost:8001
- 子应用 2: http://localhost:8002

### 3. 单独启动项目

```bash
# 只启动主应用
npm run dev:main

# 只启动子应用1
npm run dev:child-one

# 只启动子应用2
npm run dev:child-two
```

## 可用命令

### 开发命令

- `npm run dev` - 同时启动所有三个项目
- `npm run dev:main` - 启动主应用
- `npm run dev:child-one` - 启动子应用 1
- `npm run dev:child-two` - 启动子应用 2

### 构建命令

- `npm run build` - 构建所有项目
- `npm run build:main` - 构建主应用
- `npm run build:child-one` - 构建子应用 1
- `npm run build:child-two` - 构建子应用 2

### 预览命令

- `npm run preview` - 同时预览所有构建后的项目
- `npm run preview:main` - 预览主应用
- `npm run preview:child-one` - 预览子应用 1
- `npm run preview:child-two` - 预览子应用 2

### 依赖管理

- `npm run install:all` - 安装所有项目依赖
- `npm run install:main` - 安装主应用依赖
- `npm run install:child-one` - 安装子应用 1 依赖
- `npm run install:child-two` - 安装子应用 2 依赖

### 清理命令

- `npm run clean` - 清理所有项目的 node_modules 和 dist
- `npm run clean:main` - 清理主应用
- `npm run clean:child-one` - 清理子应用 1
- `npm run clean:child-two` - 清理子应用 2

### 代码格式化

- `npm run format` - 格式化所有项目代码
- `npm run format:main` - 格式化主应用代码
- `npm run format:child-one` - 格式化子应用 1 代码
- `npm run format:child-two` - 格式化子应用 2 代码

### 类型检查

- `npm run type-check` - 检查所有项目类型
- `npm run type-check:main` - 检查主应用类型
- `npm run type-check:child-one` - 检查子应用 1 类型
- `npm run type-check:child-two` - 检查子应用 2 类型

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **Vite** - 下一代前端构建工具
- **TypeScript** - JavaScript 的超集
- **Ant Design Vue** - 企业级 UI 组件库
- **Vue Router** - Vue.js 官方路由管理器
- **Pinia** - Vue 的状态管理库

## 端口配置

- 主应用 (main-app): http://localhost:8000
- 子应用 1 (child-one): http://localhost:8001
- 子应用 2 (child-two): http://localhost:8002

## 开发注意事项

1. 确保 Node.js 版本 >= 20.19.0
2. 建议使用 npm >= 8.0.0
3. 首次运行请使用 `npm run install:all` 安装所有依赖
4. 使用 `npm run dev` 可以同时启动所有项目，方便开发调试

## 许可证

MIT License
