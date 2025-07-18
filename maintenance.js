#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// 颜色输出
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  return new Promise((resolve, reject) => {
    log(`🚀 ${description}...`, 'blue');
    exec(command, (error, stdout, stderr) => {
      if (error) {
        log(`❌ ${description} 失败: ${error.message}`, 'red');
        reject(error);
      } else {
        log(`✅ ${description} 完成`, 'green');
        if (stdout) console.log(stdout);
        resolve(stdout);
      }
    });
  });
}

async function checkUpdates() {
  try {
    log('🔍 检查依赖更新...', 'blue');
    await runCommand('npm outdated', '检查过期依赖');
  } catch (error) {
    log('📦 所有依赖都是最新的', 'green');
  }
}

async function updateDependencies() {
  try {
    await runCommand('npm update', '更新依赖');
    await runCommand('npm audit fix', '修复安全漏洞');
  } catch (error) {
    log('⚠️  更新过程中遇到问题，请手动检查', 'yellow');
  }
}

async function cleanCache() {
  try {
    await runCommand('npm run clean', '清理 Hexo 缓存');
    await runCommand('npm cache clean --force', '清理 npm 缓存');
    
    // 清理临时文件
    const tempFiles = ['db.json', '.deploy_git'];
    tempFiles.forEach(file => {
      if (fs.existsSync(file)) {
        fs.rmSync(file, { recursive: true, force: true });
        log(`🗑️  删除临时文件: ${file}`, 'yellow');
      }
    });
  } catch (error) {
    log('⚠️  清理过程中遇到问题', 'yellow');
  }
}

async function optimizeImages() {
  const imagesDir = path.join('source', 'images');
  if (fs.existsSync(imagesDir)) {
    const images = fs.readdirSync(imagesDir);
    log(`📸 发现 ${images.length} 个图片文件`, 'blue');
    
    // 统计图片大小
    let totalSize = 0;
    images.forEach(img => {
      const imgPath = path.join(imagesDir, img);
      const stats = fs.statSync(imgPath);
      totalSize += stats.size;
    });
    
    log(`💾 图片总大小: ${(totalSize / 1024 / 1024).toFixed(2)} MB`, 'cyan');
    
    if (totalSize > 50 * 1024 * 1024) { // 50MB
      log('⚠️  图片文件较大，建议优化或使用 CDN', 'yellow');
    }
  }
}

async function generateSitemap() {
  try {
    // 检查是否安装了 sitemap 插件
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const hasSitemapPlugin = packageJson.dependencies && packageJson.dependencies['hexo-generator-sitemap'];
    
    if (!hasSitemapPlugin) {
      log('📍 安装 sitemap 生成器...', 'blue');
      await runCommand('npm install hexo-generator-sitemap --save', '安装 sitemap 插件');
      
      // 添加配置到 _config.yml
      const configPath = '_config.yml';
      let config = fs.readFileSync(configPath, 'utf8');
      
      if (!config.includes('sitemap:')) {
        config += '\n\n# Sitemap\nsitemap:\n  path: sitemap.xml\n  template: ./sitemap_template.xml\n  rel: false\n';
        fs.writeFileSync(configPath, config);
        log('📍 已添加 sitemap 配置到 _config.yml', 'green');
      }
    }
    
    await runCommand('hexo generate', '生成站点地图');
    
    if (fs.existsSync('public/sitemap.xml')) {
      log('📍 站点地图生成成功: public/sitemap.xml', 'green');
    }
  } catch (error) {
    log('⚠️  站点地图生成失败', 'yellow');
  }
}

async function backupContent() {
  const backupDir = `backup_${new Date().toISOString().slice(0, 10)}`;
  
  try {
    if (!fs.existsSync('backups')) {
      fs.mkdirSync('backups');
    }
    
    const backupPath = path.join('backups', backupDir);
    fs.mkdirSync(backupPath);
    
    // 备份重要文件
    const filesToBackup = [
      'source/_posts',
      '_config.yml',
      '_config.minimalism.yml',
      'package.json'
    ];
    
    for (const file of filesToBackup) {
      if (fs.existsSync(file)) {
        await runCommand(`cp -r ${file} ${backupPath}/`, `备份 ${file}`);
      }
    }
    
    log(`💾 内容已备份到: ${backupPath}`, 'green');
  } catch (error) {
    log('⚠️  备份失败', 'yellow');
  }
}

async function showSystemInfo() {
  log('📊 系统信息:', 'magenta');
  
  try {
    const nodeVersion = await runCommand('node --version', '检查 Node.js 版本');
    const npmVersion = await runCommand('npm --version', '检查 npm 版本');
    
    if (fs.existsSync('package.json')) {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      log(`📦 Hexo 版本: ${pkg.hexo?.version || '未知'}`, 'cyan');
    }
    
    // 统计文章数量
    const postsDir = path.join('source', '_posts');
    if (fs.existsSync(postsDir)) {
      const posts = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
      log(`📄 文章总数: ${posts.length}`, 'cyan');
    }
    
    // 检查 Git 状态
    exec('git status --porcelain', (error, stdout) => {
      if (!error) {
        const changes = stdout.trim();
        if (changes) {
          log('🔄 Git 状态: 有未提交的更改', 'yellow');
        } else {
          log('✅ Git 状态: 工作区干净', 'green');
        }
      }
    });
    
  } catch (error) {
    log('⚠️  获取系统信息失败', 'yellow');
  }
}

// 更新主题
async function updateThemes() {
  try {
    log('🎨 更新主题...', 'blue');
    
    // 更新 cactus 主题
    log('更新 cactus 主题...', 'cyan');
    await runCommand('cd themes/cactus && git pull origin master', '更新 cactus 主题');
    
    // 更新 minimalism 主题（保持在自定义分支）
    log('检查 minimalism 主题状态...', 'cyan');
    const currentBranch = await new Promise((resolve) => {
      exec('cd themes/minimalism && git branch --show-current', (error, stdout) => {
        resolve(stdout.trim());
      });
    });
    
    if (currentBranch === 'custom-bighb') {
      log('当前在自定义分支，保持不变', 'green');
    } else {
      log('切换到自定义分支...', 'yellow');
      await runCommand('cd themes/minimalism && git checkout custom-bighb', '切换到自定义分支');
    }
    
    log('✅ 主题更新完成', 'green');
  } catch (error) {
    log(`❌ 主题更新失败: ${error.message}`, 'red');
  }
}

// 更新子模块
async function updateSubmodules() {
  try {
    log('🔄 更新Git子模块...', 'blue');
    await runCommand('git submodule update --remote', '更新子模块');
    log('✅ 子模块更新完成', 'green');
  } catch (error) {
    log(`❌ 子模块更新失败: ${error.message}`, 'red');
  }
}

async function main() {
  console.log('\n' + '='.repeat(60));
  log('🔧 博客维护工具', 'magenta');
  console.log('='.repeat(60));
  
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('用法: node maintenance.js [命令]');
    console.log('\n可用命令:');
    console.log('  check     🔍 检查更新');
    console.log('  update    📦 更新依赖');
    console.log('  clean     🧹 清理缓存');
    console.log('  optimize  🖼️  优化图片');
    console.log('  sitemap   📍 生成站点地图');
    console.log('  backup    💾 备份内容');
    console.log('  info      📊 显示系统信息');
    console.log('  all       🚀 执行所有维护任务');
    return;
  }
  
  const command = args[0];
  
  switch (command) {
    case 'check':
      await checkUpdates();
      break;
    case 'update':
      await updateDependencies();
      break;
    case 'clean':
      await cleanCache();
      break;
    case 'optimize':
      await optimizeImages();
      break;
    case 'sitemap':
      await generateSitemap();
      break;
    case 'backup':
      await backupContent();
      break;
    case 'info':
      await showSystemInfo();
      break;
    case 'all':
      log('🚀 执行完整维护流程...', 'magenta');
      await showSystemInfo();
      await checkUpdates();
      await cleanCache();
      await optimizeImages();
      await generateSitemap();
      await backupContent();
      log('🎉 维护完成!', 'green');
      break;
    case 'themes':
      await updateThemes();
      break;
    case 'submodules':
      await updateSubmodules();
      break;
    default:
      log(`❌ 未知命令: ${command}`, 'red');
  }
}

main().catch(error => {
  log(`❌ 执行失败: ${error.message}`, 'red');
  process.exit(1);
});
