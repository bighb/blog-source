#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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
    const process = exec(command);
    
    process.stdout.on('data', (data) => {
      console.log(data.toString());
    });
    
    process.stderr.on('data', (data) => {
      console.error(data.toString());
    });
    
    process.on('close', (code) => {
      if (code === 0) {
        log(`✅ ${description} 完成`, 'green');
        resolve();
      } else {
        log(`❌ ${description} 失败`, 'red');
        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });
}

function getCurrentDateTime() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

async function createNewPost() {
  return new Promise((resolve) => {
    rl.question('📝 请输入文章标题: ', async (title) => {
      if (!title.trim()) {
        log('❌ 标题不能为空', 'red');
        resolve();
        return;
      }
      
      try {
        await runCommand(`hexo new post "${title}"`, '创建新文章');
        
        // 获取生成的文件路径
        const date = getCurrentDateTime();
        const postPath = path.join('source', '_posts', `${date}.md`);
        
        if (fs.existsSync(postPath)) {
          log(`📄 文章已创建: ${postPath}`, 'green');
          log('💡 提示: 你可以使用 Typora 或其他 Markdown 编辑器来编辑文章', 'yellow');
        }
      } catch (error) {
        log(`❌ 创建文章失败: ${error.message}`, 'red');
      }
      resolve();
    });
  });
}

async function previewBlog() {
  try {
    await runCommand('hexo clean', '清理缓存');
    await runCommand('hexo generate', '生成静态文件');
    log('🌐 启动本地预览服务器...', 'blue');
    log('📱 预览地址: http://localhost:4000', 'cyan');
    log('⚠️  按 Ctrl+C 停止服务器', 'yellow');
    
    exec('hexo server');
  } catch (error) {
    log(`❌ 预览失败: ${error.message}`, 'red');
  }
}

async function deployBlog() {
  try {
    log('🚀 开始部署博客...', 'magenta');
    await runCommand('hexo clean', '清理缓存');
    await runCommand('hexo generate', '生成静态文件');
    
    // 检查是否有 GitHub Actions
    if (fs.existsSync('.github/workflows/deploy.yml')) {
      log('🔄 检测到 GitHub Actions 部署配置', 'blue');
      log('💡 推荐使用 Git 推送来触发自动部署:', 'yellow');
      log('   git add .', 'cyan');
      log('   git commit -m "更新博客内容"', 'cyan');
      log('   git push', 'cyan');
      
      rl.question('是否继续使用传统部署方式? (y/N): ', async (answer) => {
        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
          await runCommand('hexo deploy', '部署到 GitHub Pages');
          log('🎉 博客部署完成!', 'green');
        } else {
          log('ℹ️  已取消部署', 'blue');
        }
        showMenu();
      });
      return;
    } else {
      await runCommand('hexo deploy', '部署到 GitHub Pages');
      log('🎉 博客部署完成!', 'green');
    }
  } catch (error) {
    log(`❌ 部署失败: ${error.message}`, 'red');
  }
}

async function quickPublish() {
  try {
    log('⚡ 开始快速发布博客...', 'magenta');
    await runCommand('hexo clean', '清理缓存');
    await runCommand('hexo generate', '生成静态文件');
    await runCommand('hexo deploy', '部署到 GitHub Pages');
    log('🎉 博客快速发布完成!', 'green');
  } catch (error) {
    log(`❌ 快速发布失败: ${error.message}`, 'red');
  }
}

async function updateDependencies() {
  try {
    log('📦 开始更新依赖...', 'magenta');
    await runCommand('npm install', '安装最新依赖');
    log('🎉 依赖更新完成!', 'green');
  } catch (error) {
    log(`❌ 更新依赖失败: ${error.message}`, 'red');
  }
}

function showMenu() {
  console.log('\n' + '='.repeat(50));
  log('🌳 可可的大树 - 博客管理工具', 'magenta');
  console.log('='.repeat(50));
  console.log('1. 📝 创建新文章');
  console.log('2. 🌐 本地预览');
  console.log('3. 🚀 部署博客');
  console.log('4. ⚡ 快速发布 (推荐)');
  console.log('5. 📊 查看状态');
  console.log('6. 🔧 清理缓存');
  console.log('7. 📈 更新依赖');
  console.log('0. 👋 退出');
  console.log('='.repeat(50));
  
  rl.question('请选择操作 (0-7): ', async (choice) => {
    switch (choice) {
      case '1':
        await createNewPost();
        showMenu();
        break;
      case '2':
        await previewBlog();
        break;
      case '3':
        await deployBlog();
        showMenu();
        break;
      case '4':
        await quickPublish();
        showMenu();
        break;
      case '5':
        await showStatus();
        showMenu();
        break;
      case '6':
        await runCommand('hexo clean', '清理缓存');
        showMenu();
        break;
      case '7':
        await updateDependencies();
        showMenu();
        break;
      case '0':
        log('👋 再见!', 'green');
        rl.close();
        break;
      default:
        log('❌ 无效选择，请重新输入', 'red');
        showMenu();
    }
  });
}

async function showStatus() {
  try {
    log('📊 博客状态信息:', 'blue');
    
    // 统计文章数量
    const postsDir = path.join('source', '_posts');
    if (fs.existsSync(postsDir)) {
      const posts = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
      log(`📄 文章总数: ${posts.length}`, 'green');
    }
    
    // 检查依赖
    if (fs.existsSync('package.json')) {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      log(`📦 Hexo 版本: ${pkg.hexo?.version || '未知'}`, 'green');
    }
    
    // 检查主题
    if (fs.existsSync('_config.yml')) {
      const config = fs.readFileSync('_config.yml', 'utf8');
      const themeMatch = config.match(/theme:\s*(.+)/);
      if (themeMatch) {
        log(`🎨 当前主题: ${themeMatch[1].trim()}`, 'green');
      }
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
    log(`❌ 获取状态失败: ${error.message}`, 'red');
  }
}

// 启动应用
log('🌳 欢迎使用博客管理工具!', 'green');
showMenu();
