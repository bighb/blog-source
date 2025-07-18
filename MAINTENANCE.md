# 📖 博客维护指南

这是"可可的大树"博客的维护说明文档。

## 🔄 日常维护任务

### 1. 主题更新

```bash
# 更新所有主题（保持自定义配置）
npm run themes

# 手动更新特定主题
cd themes/cactus && git pull origin master
cd themes/minimalism && git checkout custom-bighb
```

### 2. 依赖更新

```bash
# 更新npm依赖
npm run update-deps

# 检查过时的包
npm outdated
```

### 3. 内容备份

```bash
# 完整备份
npm run backup

# 手动备份文章
cp -r source/_posts/ backup/posts-$(date +%Y%m%d)/
```

## 🛠️ 维护命令

| 命令 | 功能 | 说明 |
|-----|------|------|
| `npm run check` | 健康检查 | 检查项目状态 |
| `npm run themes` | 更新主题 | 保持自定义配置 |
| `npm run submodules` | 更新子模块 | 同步远程更改 |
| `npm run backup` | 备份数据 | 备份文章和配置 |
| `npm run info` | 系统信息 | 显示环境信息 |

## 🎨 主题自定义维护

### minimalism 主题自定义分支管理

```bash
# 检查当前分支
cd themes/minimalism
git branch --show-current

# 确保在自定义分支
git checkout custom-bighb

# 查看自定义修改
git diff master..custom-bighb

# 如需合并上游更新
git fetch origin
git merge origin/master
# 解决冲突后提交
```

### 自定义功能列表

- ✅ 不蒜子访客统计
- ✅ 自定义头像和favicon
- ✅ 优化的社交链接
- ✅ 调整的footer布局

## 📅 维护计划

### 每周维护
- [ ] 检查网站可访问性
- [ ] 备份新文章
- [ ] 查看GitHub Actions状态

### 每月维护
- [ ] 更新npm依赖
- [ ] 更新主题（如有新版本）
- [ ] 检查并清理无用文件
- [ ] 性能检查

### 每季度维护
- [ ] 完整备份
- [ ] 安全检查
- [ ] 主题定制审查
- [ ] 文档更新

## 🚨 故障排除

### 部署失败
1. 检查GitHub Actions日志
2. 验证_config.yml配置
3. 确认主题子模块状态

### 主题问题
1. 确认在正确分支：`git branch --show-current`
2. 检查自定义修改：`git status`
3. 重置到最后已知工作状态

### 构建错误
1. 清理缓存：`npm run clean`
2. 重新安装依赖：`rm -rf node_modules && npm install`
3. 检查文章格式

## 📞 支持联系

- **GitHub Issues**: 在源码仓库创建Issue
- **主题问题**: 参考[minimalism主题文档](https://github.com/f-dong/hexo-theme-minimalism)
- **Hexo问题**: 参考[Hexo官方文档](https://hexo.io/docs/)

---

💡 **提示**: 定期维护可以确保博客稳定运行和最佳性能。
