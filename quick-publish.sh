#!/bin/bash

# 快速发布博客脚本 - macOS 优化版本
# 使用方法: ./quick-publish.sh "提交信息"

set -e  # 遇到错误立即退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查是否提供了提交信息
if [ $# -eq 0 ]; then
    echo -e "${YELLOW}请提供提交信息:${NC}"
    read -p "提交信息: " commit_message
else
    commit_message="$1"
fi

echo -e "${BLUE}🚀 开始发布博客...${NC}"

# 1. 检查工作区状态
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}📝 检测到未提交的更改${NC}"
else
    echo -e "${GREEN}✅ 工作区干净${NC}"
fi

# 2. 清理和构建
echo -e "${BLUE}🧹 清理缓存...${NC}"
npm run clean

echo -e "${BLUE}🏗️ 构建博客...${NC}"
npm run build

# 3. 提交更改
echo -e "${BLUE}📦 提交更改...${NC}"
git add .
git commit -m "✨ $commit_message" || echo -e "${YELLOW}⚠️ 没有新的更改需要提交${NC}"

# 4. 推送到远程仓库（博客源码）
if git remote get-url origin >/dev/null 2>&1; then
    echo -e "${BLUE}� 推送博客源码到GitHub...${NC}"
    git push origin main
else
    echo -e "${YELLOW}⚠️ 未配置远程仓库，跳过源码推送${NC}"
    echo -e "${BLUE}💡 建议执行: git remote add origin git@github.com:bighb/blog-source.git${NC}"
fi

# 5. 部署到GitHub Pages
echo -e "${BLUE}🚀 部署到GitHub Pages...${NC}"
git push

# 6. 使用Hexo部署到GitHub Pages
npm run deploy

echo -e "${GREEN}🎉 博客发布成功!${NC}"
echo -e "${BLUE}📍 访问地址: https://bighb.github.io${NC}"
echo -e "${YELLOW}⏰ GitHub Actions 部署需要 2-3 分钟${NC}"
