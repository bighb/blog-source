# 🌳 可可的大树 - 个人博客

> 基于 Hexo + GitHub Pages 的个人博客，使用 Minimalism 主题

## 📋 目录

- [🏗️ 技术架构](#️-技术架构)
- [🚀 快速开始](#-快速开始)
- [📝 写作流程](#-写作流程)
- [🔧 部署方式](#-部署方式)
- [🛠️ 开发指南](#️-开发指南)
- [📁 项目结构](#-项目结构)

## 🏗️ 技术架构

### 核心技术栈
- **静态站点生成**: [Hexo](https://hexo.io/) v7.2.0
- **主题**: [Minimalism](https://github.com/f-dong/hexo-theme-minimalism) - 简洁优雅的响应式主题
- **部署平台**: GitHub Pages
- **CI/CD**: GitHub Actions
- **内容格式**: Markdown
- **版本控制**: Git

### 特性支持
- ✅ 响应式设计
- ✅ 深色/浅色主题切换
- ✅ 代码高亮
- ✅ 数学公式支持
- ✅ 评论系统 (可选)
- ✅ RSS 订阅
- ✅ SEO 优化
- ✅ 自动化部署

## 🚀 快速开始

### 环境要求
- Node.js >= 14.0.0
- npm 或 yarn
- Git

### 本地开发
```bash
# 克隆项目
git clone https://github.com/bighb/blog.git
cd blog

# 安装依赖
npm install

# 启动博客管理工具 (推荐)
npm run blog

# 或使用传统命令
npm run dev  # 开发模式
npm run preview  # 预览模式
```

## 📝 写作流程

### 方式一：使用博客管理工具 (推荐)
```bash
npm run blog
```
然后按照交互式菜单操作：
1. 选择 "创建新文章"
2. 输入文章标题
3. 使用编辑器编写内容
4. 本地预览检查
5. 推送到 GitHub 自动部署

### 方式二：传统命令行
```bash
# 创建新文章
npm run new "文章标题"

# 本地预览
npm run preview

# 手动部署 (不推荐，建议使用 Git 推送)
npm run deploy
```

### 文章模板
新文章会使用以下模板：
```markdown
---
title: 文章标题
date: YYYY-MM-DD HH:mm:ss
tags:
  - 标签1
  - 标签2
categories: 分类名
---

文章内容...
```

## 🔧 部署方式

### 自动化部署 (推荐)
项目配置了 GitHub Actions，只需推送代码即可自动部署：

```bash
git add .
git commit -m "新增文章: 文章标题"
git push
```

**部署流程**：
1. 代码推送到 `main/master` 分支
2. GitHub Actions 自动触发
3. 代码质量检查
4. 构建静态文件
5. 部署到 GitHub Pages
6. 自动生成部署报告

### 手动部署
```bash
npm run clean
npm run build
npm run deploy
```

## 🛠️ 开发指南

### 项目脚本
```bash
npm run blog      # 启动博客管理工具
npm run dev       # 开发模式 (clean + build + server)
npm run build     # 构建静态文件
npm run clean     # 清理缓存
npm run server    # 启动本地服务器
npm run preview   # 预览模式 (clean + build + server)
npm run new       # 创建新文章
npm run deploy    # 部署到 GitHub Pages
```

### 配置文件
- `_config.yml`: Hexo 主配置文件
- `_config.minimalism.yml`: 主题配置文件
- `package.json`: 项目依赖和脚本
- `.github/workflows/`: GitHub Actions 配置

### 主题定制
主题配置位于 `_config.minimalism.yml`，支持：
- 菜单导航配置
- 社交链接设置
- 评论系统配置
- 深色主题设置
- CDN 配置

## 📁 项目结构

```
blog/
├── 📁 .github/workflows/     # GitHub Actions 配置
│   ├── blog-ci-cd.yml       # 主要的 CI/CD 流程
│   └── deploy.yml           # 简化的部署流程
├── 📁 source/               # 源文件目录
│   ├── 📁 _posts/           # 博客文章 (Markdown)
│   ├── 📁 images/           # 图片资源
│   ├── 📁 about/            # 关于页面
│   └── 📁 tags/             # 标签页面
├── 📁 themes/               # 主题目录
│   ├── 📁 minimalism/       # Minimalism 主题
│   └── 📁 cactus/           # Cactus 主题 (备用)
├── 📁 public/               # 生成的静态文件 (自动生成)
├── 📁 scaffolds/            # 文章模板
├── 📄 _config.yml           # Hexo 主配置
├── 📄 _config.minimalism.yml # 主题配置
├── 📄 package.json          # 项目配置
├── 📄 blog-manager.js       # 博客管理工具
└── 📄 README.md            # 项目说明
```

### 废弃的脚本文件
以下脚本已被新的管理工具替代，建议删除：
- ~~`new-post.sh`~~ → 使用 `npm run blog`
- ~~`push.sh`~~ → 使用 Git 推送 + GitHub Actions
- ~~`watch.sh`~~ → 使用 `npm run dev`

## 🔗 相关链接

- [博客地址](https://bighb.github.io)
- [Hexo 文档](https://hexo.io/docs/)
- [Minimalism 主题文档](https://minimalism.codeover.cn/docs/start)
- [GitHub Pages 文档](https://docs.github.com/pages)

## 📊 统计信息

- **博客创建时间**: 2024年
- **技术栈更新**: 2024年7月
- **自动化部署**: ✅ 已启用
- **主题版本**: Minimalism v1.3.11

---

<p align="center">
  <strong>🌳 用心记录，用爱分享</strong>
</p>
