#!/usr/bin/env node

/**
 * 微前端项目仓库拉取脚本
 * 运行: npm run pull
 */

import { execSync } from 'child_process'
import fs from 'fs'

// 🔧 配置区域 - 请修改为您的实际配置
const APPS_CONFIG = [
  {
    name: 'main-app',
    displayName: '主应用',
    repoUrl: 'https://github.com/yunfengnobug/main-app.git',
    branch: 'main'
  },
  {
    name: 'child-one',
    displayName: '子应用1',
    repoUrl: 'https://github.com/yunfengnobug/child-one.git',
    branch: 'main'
  },
  {
    name: 'child-two',
    displayName: '子应用2',
    repoUrl: 'https://github.com/yunfengnobug/child-two.git',
    branch: 'main'
  }
]

// 简单的日志函数
const log = {
  info: (msg) => console.log(`\x1b[36m✓\x1b[0m ${msg}`),
  success: (msg) => console.log(`\x1b[32m✅\x1b[0m ${msg}`),
  error: (msg) => console.log(`\x1b[31m❌\x1b[0m ${msg}`),
  warning: (msg) => console.log(`\x1b[33m⚠️\x1b[0m ${msg}`)
}

// 执行命令
function run(command, cwd = process.cwd(), options = {}) {
  try {
    const result = execSync(command, {
      cwd,
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options
    })
    return { success: true, output: result }
  } catch (error) {
    if (!options.silent) {
      console.error(`命令执行失败: ${command}`)
      console.error(error.message)
    }
    return { success: false, output: error.message }
  }
}

// 检查是否为Git仓库
function isGitRepo(path) {
  return fs.existsSync(`${path}/.git`)
}

// 处理单个应用
async function processApp(config) {
  const { name, displayName, repoUrl, branch } = config

  // 输出开始拉取的仓库信息
  console.log(`\n正在拉取: ${displayName} - ${repoUrl}`)

  // 检查目录是否存在
  if (fs.existsSync(name)) {
    // 目录存在，检查是否为Git仓库
    if (isGitRepo(name)) {
      // 是Git仓库，拉取更新
      const pullResult = run(`git pull origin ${branch}`, name, { silent: true })
      if (pullResult.success) {
        log.success(`${displayName} 拉取成功`)
      } else {
        log.error(`${displayName} 拉取失败: ${pullResult.output}`)
      }
    } else {
      // 不是Git仓库，删除目录重新克隆
      try {
        if (process.platform === 'win32') {
          run(`rmdir /s /q ${name}`, process.cwd(), { silent: true })
        } else {
          run(`rm -rf ${name}`, process.cwd(), { silent: true })
        }
      } catch (error) {
        log.error(`${displayName} 拉取失败: 删除目录失败 - ${error.message}`)
        return
      }

      // 克隆仓库
      const cloneResult = run(`git clone -b ${branch} ${repoUrl} ${name}`, process.cwd(), {
        silent: true
      })
      if (cloneResult.success) {
        log.success(`${displayName} 拉取成功`)
      } else {
        log.error(`${displayName} 拉取失败: ${cloneResult.output}`)
      }
    }
  } else {
    // 目录不存在，克隆仓库
    const cloneResult = run(`git clone -b ${branch} ${repoUrl} ${name}`, process.cwd(), {
      silent: true
    })
    if (cloneResult.success) {
      log.success(`${displayName} 拉取成功`)
    } else {
      log.error(`${displayName} 拉取失败: ${cloneResult.output}`)
    }
  }
}

// 主函数
async function main() {
  // 检查环境
  try {
    execSync('git --version', { stdio: 'ignore' })
  } catch (error) {
    log.error('Git 未安装，请先安装 Git')
    process.exit(1)
  }

  // 处理每个应用
  for (const config of APPS_CONFIG) {
    try {
      await processApp(config)
    } catch (error) {
      log.error(`${config.displayName} 拉取失败: ${error.message}`)
    }
  }

  console.log('\n💡 下一步操作:')
  console.log('• 使用 npm run install:all 安装所有依赖')
  console.log('• 使用 npm run dev 启动所有应用的开发服务')
  console.log('• 检查各应用的配置文件')
}

// 运行脚本
main().catch((error) => {
  log.error(`执行失败: ${error.message}`)
  process.exit(1)
})
