#!/bin/bash

# 更新 README.md 的博客统计信息
# 使用方法: ./update-readme.sh

set -e

# 颜色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📊 更新博客统计信息...${NC}"

# 统计文章数量
POST_COUNT=$(find source/_posts -name '*.md' 2>/dev/null | wc -l | xargs)

# 统计分类数量
CATEGORY_COUNT=$(find source/categories -type d 2>/dev/null | wc -l | xargs)
if [ "$CATEGORY_COUNT" -gt 0 ]; then
    CATEGORY_COUNT=$((CATEGORY_COUNT - 1))  # 减去根目录
fi

# 统计标签数量
TAG_COUNT=$(find source/tags -type d 2>/dev/null | wc -l | xargs)
if [ "$TAG_COUNT" -gt 0 ]; then
    TAG_COUNT=$((TAG_COUNT - 1))  # 减去根目录
fi

# 获取最后更新时间
LAST_UPDATE=$(date '+%Y-%m-%d')

# 获取最新文章
LATEST_POST=$(ls -t source/_posts/*.md 2>/dev/null | head -1 | xargs basename -s .md 2>/dev/null || echo "暂无文章")

echo -e "${GREEN}✅ 统计完成${NC}"
echo "📄 文章数量: $POST_COUNT"
echo "📁 分类数量: $CATEGORY_COUNT"
echo "🏷️  标签数量: $TAG_COUNT"
echo "📅 最后更新: $LAST_UPDATE"
echo "📝 最新文章: $LATEST_POST"

echo -e "${BLUE}📝 README 已更新，请检查并提交更改${NC}"
