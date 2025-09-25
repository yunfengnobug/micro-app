# 使用指南 (Usage Guide)

## 🚀 快速启动

### 方法一：使用 npm 命令（推荐）

```bash
# 进入项目根目录
cd C:\Users\admin\Desktop\micro-app

# 启动所有项目
npm run dev
```

### 方法二：使用批处理脚本

```bash
# 双击 start.bat 文件
# 或在命令行中运行
start.bat
```

## 📱 访问地址

启动成功后，你可以通过以下地址访问各个应用：

| 应用     | 本地地址              | 网络地址                   | 端口 |
| -------- | --------------------- | -------------------------- | ---- |
| 主应用   | http://localhost:8000 | http://192.168.129.49:8000 | 8000 |
| 子应用 1 | http://localhost:8001 | http://192.168.129.49:8001 | 8001 |
| 子应用 2 | http://localhost:8002 | http://192.168.129.49:8002 | 8002 |

## 🛠️ 开发工作流

### 1. 首次使用

```bash
# 安装所有依赖
npm run install:all

# 启动开发服务器
npm run dev
```

### 2. 日常开发

```bash
# 启动所有项目（最常用）
npm run dev

# 或者单独启动某个项目
npm run dev:main        # 只启动主应用
npm run dev:child-one   # 只启动子应用1
npm run dev:child-two   # 只启动子应用2
```

### 3. 构建项目

```bash
# 构建所有项目
npm run build

# 单独构建
npm run build:main
npm run build:child-one
npm run build:child-two
```

### 4. 预览构建结果

```bash
# 预览所有项目
npm run preview

# 单独预览
npm run preview:main
npm run preview:child-one
npm run preview:child-two
```

## 🔧 维护命令

### 依赖管理

```bash
# 重新安装所有依赖
npm run install:all

# 单独安装某个项目依赖
npm run install:main
npm run install:child-one
npm run install:child-two
```

### 清理项目

```bash
# 清理所有项目的node_modules和dist
npm run clean

# 单独清理某个项目
npm run clean:main
npm run clean:child-one
npm run clean:child-two
```

### 代码格式化

```bash
# 格式化所有项目代码
npm run format

# 单独格式化某个项目
npm run format:main
npm run format:child-one
npm run format:child-two
```

### 类型检查

```bash
# 检查所有项目类型
npm run type-check

# 单独检查某个项目
npm run type-check:main
npm run type-check:child-one
npm run type-check:child-two
```

## 🎯 主要特性

### 主应用 (main-app)

- 使用 Ant Design Vue 布局组件
- 侧边栏菜单导航
- 响应式设计
- 支持菜单折叠
- 路由管理

### 子应用 (child-one & child-two)

- 独立的 Vue3 应用
- 可以单独开发和部署
- 支持微前端架构

## 🔍 故障排除

### 端口冲突

如果遇到端口被占用的问题：

```bash
# 查看端口占用情况
netstat -ano | findstr :8000
netstat -ano | findstr :8001
netstat -ano | findstr :8002

# 杀死占用端口的进程
taskkill /PID <进程ID> /F
```

### 依赖问题

```bash
# 清理并重新安装依赖
npm run clean
npm run install:all
```

### 启动失败

```bash
# 检查Node.js版本
node --version  # 应该 >= 20.19.0

# 检查npm版本
npm --version   # 应该 >= 8.0.0
```

## 📝 开发注意事项

1. **确保 Node.js 版本正确**: 需要 Node.js >= 20.19.0
2. **网络访问**: 所有应用都配置了 `host: true`，支持局域网访问
3. **热重载**: 修改代码后会自动刷新浏览器
4. **并发启动**: 使用 `concurrently` 同时运行多个开发服务器
5. **TypeScript 支持**: 所有项目都支持 TypeScript 类型检查

## 🎨 自定义配置

如需修改端口或其他配置，请编辑各项目的 `vite.config.ts` 文件：

- `main-app/vite.config.ts` - 主应用配置
- `child-one/vite.config.ts` - 子应用 1 配置
- `child-two/vite.config.ts` - 子应用 2 配置
