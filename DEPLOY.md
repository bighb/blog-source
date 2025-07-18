# 🌳 博客简化部署指南

## 📝 日常写作流程

### 1. 创建新文章
```bash
npm run new "文章标题"
```

### 2. 本地预览（可选）
```bash
npm run dev
# 访问 http://localhost:4000 预览
```

### 3. 发布文章
```bash
npm run publish
```
或者手动：
```bash
git add .
git commit -m "✨ 新增：文章标题"
git push
```

## 🚀 自动部署

- ✅ 推送到 `main` 分支后自动触发部署
- ✅ GitHub Actions 自动构建并发布到 GitHub Pages
- ✅ 无需手动执行任何部署命令

## 🛠️ 常用命令

| 命令 | 说明 |
|------|------|
| `npm run new "标题"` | 创建新文章 |
| `npm run dev` | 本地开发服务器 |
| `npm run build` | 构建静态文件 |
| `npm run clean` | 清理缓存 |
| `npm run publish` | 快速发布（git 提交并推送） |
| `npm run blog` | 博客管理工具 |
| `npm run maintenance` | 维护工具 |

## 📁 文件结构

```
├── source/_posts/          # 博客文章
├── themes/                 # 主题文件
├── .github/workflows/      # 自动部署配置
├── _config.yml            # 博客配置
└── package.json           # 项目依赖
```

## ⚠️ 注意事项

1. **不要使用** `hexo deploy` 或 `npm run deploy`（已移除）
2. **推荐流程**：写作 → 本地预览 → git 推送 → 自动部署
3. **部署分支**：GitHub Pages 使用 `gh-pages` 分支
4. **源码分支**：源码保存在 `main` 分支

## 🔧 故障排除

如果自动部署失败：
1. 检查 GitHub Actions 日志
2. 确保 `source/_posts/` 目录下有文章
3. 检查 `_config.yml` 配置是否正确
