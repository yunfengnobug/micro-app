#!/usr/bin/env node

/**
 * 微前端项目仓库拉取脚本
 * 运行: npm run pull
 */

const { execSync } = require('child_process')
const fs = require('fs')

// 🔧 配置区域 - 请修改为您的实际配置
const APPS_CONFIG = [
  {
    name: 'main-app',
    displayName: '主应用',
    repoUrl: 'https://github.com/yunfengnobug/main-app.git',
    nodeVersion: '22.14.0',
    branch: 'main',
    packageManager: 'npm' // npm, yarn, pnpm
  },
  {
    name: 'child-one',
    displayName: '子应用1',
    repoUrl: 'https://github.com/yunfengnobug/child-one.git',
    nodeVersion: '22.14.0',
    branch: 'main',
    packageManager: 'npm'
  },
  {
    name: 'child-two',
    displayName: '子应用2',
    repoUrl: 'https://github.com/yunfengnobug/child-two.git',
    nodeVersion: '22.14.0',
    branch: 'main',
    packageManager: 'npm'
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
    return { success: false, error: error.message, output: error.stdout }
  }
}

// 检查是否为Git仓库
function isGitRepo(dir) {
  return fs.existsSync(dir) && fs.existsSync(`${dir}/.git`)
}

// 检查NVM是否可用
function checkNvmAvailable() {
  try {
    execSync('nvm --version', { stdio: 'ignore' })
    return true
  } catch (error) {
    return false
  }
}

// 检查Node版本是否已安装
function checkNodeVersionInstalled(version) {
  try {
    const result = execSync('nvm list', { encoding: 'utf8', stdio: 'pipe' })
    return result.includes(version)
  } catch (error) {
    return false
  }
}

// 配置淘宝源
function setupTaobaoMirror() {
  log.info('配置淘宝源...')

  // 设置 nvm 淘宝源
  const nvmMirrorResult = run(
    'nvm node_mirror https://npmmirror.com/mirrors/node/',
    process.cwd(),
    { silent: true }
  )
  const nvmNpmMirrorResult = run(
    'nvm npm_mirror https://npmmirror.com/mirrors/npm/',
    process.cwd(),
    { silent: true }
  )

  if (nvmMirrorResult.success && nvmNpmMirrorResult.success) {
    log.success('NVM 淘宝源配置完成')
  } else {
    log.warning('NVM 淘宝源配置失败，使用默认源')
  }
}

// 安装Node版本
function installNodeVersion(version) {
  log.info(`正在安装 Node.js ${version}...`)

  // 先配置淘宝源
  setupTaobaoMirror()

  const result = run(`nvm install ${version}`)
  if (result.success) {
    log.success(`Node.js ${version} 安装完成`)
    return true
  } else {
    log.error(`Node.js ${version} 安装失败`)
    return false
  }
}

// 切换到指定Node版本
function switchToNodeVersion(version) {
  log.info(`切换到 Node.js ${version}`)
  const result = run(`nvm use ${version}`)
  if (result.success) {
    log.success(`已切换到 Node.js ${version}`)
    return true
  } else {
    log.error(`切换到 Node.js ${version} 失败`)
    return false
  }
}

// 切换Node版本并执行命令
function runWithNodeVersion(command, nodeVersion, cwd = process.cwd()) {
  if (!checkNvmAvailable()) {
    log.warning(`NVM 不可用，使用当前Node版本执行: ${command}`)
    return run(command, cwd)
  }

  // 使用 nvm exec 在指定Node版本下执行命令
  const nvmCommand = `nvm exec ${nodeVersion} ${command}`
  log.info(`使用 Node.js ${nodeVersion} 执行: ${command}`)
  return run(nvmCommand, cwd)
}

// 获取包管理器的安装命令
function getInstallCommand(packageManager) {
  const commands = {
    npm: 'npm install',
    yarn: 'yarn install',
    pnpm: 'pnpm install'
  }
  return commands[packageManager] || 'npm install'
}

// 检查包管理器是否可用
function checkPackageManagerAvailable(packageManager, nodeVersion) {
  if (packageManager === 'npm') return true // npm 随 Node.js 安装

  try {
    if (checkNvmAvailable() && nodeVersion) {
      // 在指定Node版本下检查包管理器
      const result = run(`nvm exec ${nodeVersion} ${packageManager} --version`, process.cwd(), {
        silent: true
      })
      return result.success
    } else {
      execSync(`${packageManager} --version`, { stdio: 'ignore' })
      return true
    }
  } catch (error) {
    return false
  }
}

// 配置包管理器淘宝源
function setupPackageManagerMirror(packageManager) {
  log.info(`配置 ${packageManager} 淘宝源...`)

  const mirrorCommands = {
    npm: 'npm config set registry https://registry.npmmirror.com/',
    yarn: 'yarn config set registry https://registry.npmmirror.com/',
    pnpm: 'pnpm config set registry https://registry.npmmirror.com/'
  }

  const mirrorCmd = mirrorCommands[packageManager]
  if (mirrorCmd) {
    const result = run(mirrorCmd, process.cwd(), { silent: true })
    if (result.success) {
      log.success(`${packageManager} 淘宝源配置完成`)
    } else {
      log.warning(`${packageManager} 淘宝源配置失败`)
    }
  }
}

// 安装包管理器
function installPackageManager(packageManager, nodeVersion) {
  log.info(`正在安装 ${packageManager}...`)

  // 先配置npm淘宝源（用于安装包管理器）
  setupPackageManagerMirror('npm')

  const installCommands = {
    yarn: 'npm install -g yarn',
    pnpm: 'npm install -g pnpm'
  }

  const installCmd = installCommands[packageManager]
  if (!installCmd) {
    log.error(`不支持的包管理器: ${packageManager}`)
    return false
  }

  let result
  if (checkNvmAvailable() && nodeVersion) {
    result = run(`nvm exec ${nodeVersion} ${installCmd}`)
  } else {
    result = run(installCmd)
  }

  if (result.success) {
    log.success(`${packageManager} 安装完成`)
    // 为新安装的包管理器配置淘宝源
    setupPackageManagerMirror(packageManager)
    return true
  } else {
    log.error(`${packageManager} 安装失败`)
    return false
  }
}

// 处理单个应用
async function processApp(config) {
  const { name, displayName, repoUrl, nodeVersion, branch, packageManager } = config

  console.log(`\n${'='.repeat(50)}`)
  log.info(`处理 ${displayName} (${name})`)
  console.log(`${'='.repeat(50)}`)

  if (!repoUrl) {
    log.warning('仓库地址未配置，跳过')
    return
  }

  // 处理Node版本
  if (checkNvmAvailable() && nodeVersion) {
    log.info(`检查 Node.js 版本: ${nodeVersion}`)

    if (!checkNodeVersionInstalled(nodeVersion)) {
      log.warning(`Node.js ${nodeVersion} 未安装，正在安装...`)
      if (!installNodeVersion(nodeVersion)) {
        log.error(`Node.js ${nodeVersion} 安装失败`)
        return
      }
    }

    // 切换到指定版本
    if (!switchToNodeVersion(nodeVersion)) {
      log.error(`切换到 Node.js ${nodeVersion} 失败`)
      return
    }

    log.success(`Node.js ${nodeVersion} 已准备就绪`)
  } else if (nodeVersion) {
    log.warning(`NVM 不可用，无法切换到 Node.js ${nodeVersion}，使用当前版本`)
  }

  // 处理Git仓库
  if (isGitRepo(name)) {
    // 更新现有仓库
    log.info('仓库已存在，正在更新...')

    // 切换到指定分支
    if (branch && branch !== 'main') {
      run(`git checkout ${branch}`, name)
    }

    const pullResult = run('git pull', name)
    if (pullResult.success) {
      log.success('仓库更新完成')
    } else {
      log.error('仓库更新失败')
      return
    }
  } else if (fs.existsSync(name)) {
    log.warning(`目录 ${name} 已存在但不是Git仓库`)
    return
  } else {
    // 克隆新仓库
    log.info('正在克隆仓库...')

    let cloneCmd = `git clone ${repoUrl} ${name}`
    if (branch && branch !== 'main') {
      cloneCmd = `git clone -b ${branch} ${repoUrl} ${name}`
    }

    const cloneResult = run(cloneCmd)
    if (cloneResult.success) {
      log.success('仓库克隆完成')
    } else {
      log.error('仓库克隆失败')
      return
    }
  }

  // 安装依赖
  if (fs.existsSync(`${name}/package.json`)) {
    log.info(`使用 ${packageManager} 安装依赖...`)

    // 检查包管理器是否可用
    if (!checkPackageManagerAvailable(packageManager, nodeVersion)) {
      log.warning(`${packageManager} 不可用，正在安装...`)
      if (!installPackageManager(packageManager, nodeVersion)) {
        log.error(`${packageManager} 安装失败，回退到 npm`)
        config.packageManager = 'npm' // 修改配置中的包管理器
      }
    }

    // 确保包管理器配置了淘宝源
    setupPackageManagerMirror(config.packageManager)

    const installCmd = getInstallCommand(config.packageManager)

    let installResult
    if (checkNvmAvailable() && nodeVersion) {
      // 使用指定的Node版本执行安装
      installResult = runWithNodeVersion(installCmd, nodeVersion, name)
    } else {
      // 使用当前Node版本执行安装
      installResult = run(installCmd, name)
    }

    if (installResult.success) {
      log.success('依赖安装完成')
    } else {
      log.warning('依赖安装失败，请手动安装')
    }
  } else {
    log.info('未找到 package.json，跳过依赖安装')
  }

  log.success(`${displayName} 处理完成`)
}

// 主函数
async function main() {
  console.log('🚀 微前端项目仓库拉取工具')
  console.log('='.repeat(60))

  // 显示配置概览
  console.log('\n📋 应用配置概览:')
  APPS_CONFIG.forEach((config, index) => {
    console.log(`${index + 1}. ${config.displayName} (${config.name})`)
    console.log(`   📦 仓库: ${config.repoUrl}`)
    console.log(`   🌿 分支: ${config.branch}`)
    console.log(`   ⚙️  Node版本: ${config.nodeVersion}`)
    console.log(`   📋 包管理器: ${config.packageManager}`)
  })

  // 检查环境
  console.log('\n🔍 环境检查:')

  // 检查Git
  try {
    execSync('git --version', { stdio: 'ignore' })
    log.success('Git 已安装')
  } catch (error) {
    log.error('Git 未安装，请先安装 Git')
    process.exit(1)
  }

  // 检查NVM
  if (checkNvmAvailable()) {
    log.success('NVM 可用，支持Node版本管理')
  } else {
    log.warning('NVM 不可用，将使用当前Node版本')
  }

  // 处理每个应用
  console.log('\n🚀 开始处理应用...')
  for (const config of APPS_CONFIG) {
    try {
      await processApp(config)
    } catch (error) {
      log.error(`处理 ${config.displayName} 时发生错误: ${error.message}`)
    }
  }

  console.log('\n🎉 所有应用处理完成!')
  console.log('\n💡 下一步操作:')
  console.log('• npm run dev - 启动所有应用的开发服务')
  console.log('• 检查各应用的配置文件')

  // 显示应用状态摘要
  console.log('\n📊 应用状态摘要:')
  APPS_CONFIG.forEach((config) => {
    const exists = fs.existsSync(config.name)
    const isRepo = isGitRepo(config.name)
    const hasPackage = exists && fs.existsSync(`${config.name}/package.json`)
    const hasNodeModules = exists && fs.existsSync(`${config.name}/node_modules`)

    console.log(
      `${config.displayName}: ${exists ? '✅' : '❌'} 目录 | ${isRepo ? '✅' : '❌'} Git | ${
        hasPackage ? '✅' : '❌'
      } package.json | ${hasNodeModules ? '✅' : '❌'} 依赖`
    )
  })
}

// 运行脚本
main().catch((error) => {
  log.error(`执行失败: ${error.message}`)
  process.exit(1)
})
