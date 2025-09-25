# 微前端路由统一方案

## 概述

这个方案提供了一个统一的微前端路由处理工具，可以自动检测并适配 history 和 hash 路由模式，让子应用的配置最小化。

## 主要特性

1. **自动检测路由模式** - 无需手动配置，自动识别 history 或 hash 路由
2. **统一的 API** - 所有子应用使用相同的初始化方式
3. **最小化配置** - 子应用只需要一行代码即可完成路由监听
4. **调试支持** - 开发环境下可启用调试日志
5. **错误处理** - 内置路由跳转错误处理

## 使用方法

### 子应用配置

每个子应用只需要在 `main.ts` 中添加一行代码：

```typescript
import setupMicroAppRouter from './utils/micro-app-router'

// 应用初始化代码...
app.mount('#app')

// 启用微前端路由处理（一行代码搞定！）
setupMicroAppRouter(router, {
  debug: import.meta.env.DEV // 开发环境下启用调试日志
})
```

### 路由模式支持

- **History 模式**: 使用 `createWebHistory()` (如子应用 1)
- **Hash 模式**: 使用 `createWebHashHistory()` (如子应用 2)

工具会自动检测当前使用的路由模式并相应处理，无需手动配置。

## 对比旧方案

### 之前的问题

- 子应用 1: 需要手动写路由监听函数
- 子应用 2: 使用 hash 路由，处理方式不一致
- 配置复杂，每个子应用都需要不同的设置

### 现在的优势

- **统一配置**: 所有子应用使用相同的初始化方式
- **自动适配**: 无需关心路由模式，工具自动处理
- **最小配置**: 只需要一行代码
- **调试友好**: 开发环境下可查看详细日志

## 文件结构

```
child-one/
├── src/
│   ├── utils/
│   │   └── micro-app-router.ts  # 统一路由工具
│   └── main.ts                  # 应用入口，调用路由工具

child-two/
├── src/
│   ├── utils/
│   │   └── micro-app-router.ts  # 统一路由工具（相同代码）
│   └── main.ts                  # 应用入口，调用路由工具
```

## 调试

在开发环境下，设置 `debug: true` 可以看到详细的路由处理日志：

```
# 子应用1 (History模式)
[MicroAppRouter] 检测到路由模式: history
[MicroAppRouter] 接收到路由跳转请求: /home
[MicroAppRouter] 执行路由跳转 {from: "/", to: "/home"}
[MicroAppRouter] 路由处理器初始化完成

# 子应用2 (Hash模式)
[MicroAppRouter] 检测到路由模式: hash
[MicroAppRouter] 接收到路由跳转请求: /about
[MicroAppRouter] 执行路由跳转 {from: "/home", to: "/about"}
[MicroAppRouter] 路由处理器初始化完成
```

## 总结

这个统一方案让微前端路由处理变得非常简单：

1. 复制 `micro-app-router.ts` 到子应用的 `utils` 目录
2. 在 `main.ts` 中调用 `setupMicroAppRouter(router)`
3. 完成！无需其他配置

子应用现在可以专注于业务逻辑，而不用担心复杂的路由配置问题。
