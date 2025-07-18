---
title: GitHub Actions 从入门到实践
date: 2025-07-18 15:42:00
tags:
  - GitHub Actions
  - CI/CD
  - 自动化
  - DevOps
  - 最佳实践
categories:
  - 技术
description: 深入了解 GitHub Actions 的核心概念
---

# GitHub Actions 完全指南：从入门到实践

GitHub Actions 是 GitHub 提供的强大 CI/CD 平台，让开发者能够直接在代码仓库中自动化软件开发工作流程。本文将从基础概念开始，逐步深入到实际应用场景。

## 🎯 核心概念

### Workflow（工作流）
工作流是由一个或多个作业组成的可配置自动化过程，定义在 `.github/workflows/` 目录下的 YAML 文件中。

### Jobs（作业）
作业是在同一运行器上执行的一组步骤，可以并行或串行运行。

### Steps（步骤）
步骤是作业中的单个任务，可以运行命令或使用 Action。

### Actions（动作）
Actions 是可重用的代码单元，可以是自定义的，也可以使用社区提供的。

### Runners（运行器）
运行器是执行工作流的服务器，GitHub 提供托管运行器，也支持自托管运行器。

## 🛠️ 基本语法结构

```yaml
name: 工作流名称

on:
  # 触发条件
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  job_name:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: 步骤名称
        run: echo "Hello GitHub Actions"
```

## 🚀 触发事件详解

### 1. 代码推送触发
```yaml
on:
  push:
    branches: [ main, develop ]
    paths: 
      - 'src/**'
      - '!docs/**'
    tags:
      - 'v*'
```

### 2. Pull Request 触发
```yaml
on:
  pull_request:
    types: [ opened, synchronize, reopened ]
    branches: [ main ]
```

### 3. 定时触发
```yaml
on:
  schedule:
    - cron: '0 2 * * 1-5'  # 周一到周五凌晨2点
```

### 4. 手动触发
```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: '部署环境'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production
```

## 💼 实际应用场景

### 1. Node.js 项目 CI/CD

```yaml
name: Node.js CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16, 18, 20]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: 设置 Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: 安装依赖
        run: npm ci
      
      - name: 运行测试
        run: npm test
      
      - name: 代码覆盖率
        uses: codecov/codecov-action@v3

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: 设置 Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: 安装依赖
        run: npm ci
      
      - name: 构建项目
        run: npm run build
      
      - name: 部署到服务器
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/app
            git pull origin main
            npm install --production
            pm2 restart app
```

### 2. Docker 镜像构建与推送

```yaml
name: Docker Build & Push

on:
  push:
    branches: [ main ]
    tags: [ 'v*' ]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    
    steps:
      - name: 检出代码
        uses: actions/checkout@v4
      
      - name: 设置 Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: 登录容器注册表
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: 提取元数据
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
      
      - name: 构建并推送
        uses: docker/build-push-action@v5
        with:
          context: .
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

### 3. Hexo 博客自动部署

```yaml
name: Hexo Deploy

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: 检出源码
        uses: actions/checkout@v4
        with:
          submodules: true  # 包含主题子模块
          fetch-depth: 0
      
      - name: 设置 Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: 安装依赖
        run: npm install
      
      - name: 清理并生成
        run: |
          npm run clean
          npm run build
      
      - name: 部署到 GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
          publish_branch: gh-pages
          commit_message: 'Deploy: ${{ github.event.head_commit.message }}'
```

## 🔐 密钥管理

### 1. 仓库密钥
在仓库设置中添加密钥：
- `Settings` → `Secrets and variables` → `Actions`
- 添加 `Repository secrets`

### 2. 环境密钥
```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production  # 使用环境密钥
    steps:
      - name: 部署
        env:
          API_KEY: ${{ secrets.PROD_API_KEY }}
        run: echo "部署到生产环境"
```

### 3. 密钥使用最佳实践
```yaml
steps:
  - name: 安全使用密钥
    env:
      SECRET_VALUE: ${{ secrets.MY_SECRET }}
    run: |
      # ✅ 推荐：通过环境变量使用
      curl -H "Authorization: Bearer $SECRET_VALUE" api.example.com
      
      # ❌ 避免：直接在命令中使用
      # curl -H "Authorization: Bearer ${{ secrets.MY_SECRET }}" api.example.com
```

## 🎨 高级功能

### 1. 矩阵策略
```yaml
jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node-version: [16, 18, 20]
        include:
          - os: ubuntu-latest
            node-version: 20
            experimental: true
        exclude:
          - os: windows-latest
            node-version: 16
    
    runs-on: ${{ matrix.os }}
    continue-on-error: ${{ matrix.experimental || false }}
```

### 2. 条件执行
```yaml
steps:
  - name: 仅在主分支运行
    if: github.ref == 'refs/heads/main'
    run: echo "主分支部署"
  
  - name: 仅在 PR 中运行
    if: github.event_name == 'pull_request'
    run: echo "PR 检查"
  
  - name: 仅在失败时运行
    if: failure()
    run: echo "构建失败处理"
```

### 3. 工作流复用
```yaml
# .github/workflows/reusable-tests.yml
name: 可复用测试工作流

on:
  workflow_call:
    inputs:
      node-version:
        required: true
        type: string
    outputs:
      test-results:
        description: "测试结果"
        value: ${{ jobs.test.outputs.results }}

jobs:
  test:
    runs-on: ubuntu-latest
    outputs:
      results: ${{ steps.test.outputs.results }}
    steps:
      - uses: actions/checkout@v4
      - name: 测试
        id: test
        run: echo "results=passed" >> $GITHUB_OUTPUT
```

```yaml
# 调用可复用工作流
jobs:
  call-tests:
    uses: ./.github/workflows/reusable-tests.yml
    with:
      node-version: '18'
```

## 📊 性能优化

### 1. 缓存依赖
```yaml
steps:
  - uses: actions/checkout@v4
  
  - name: 缓存 Node 模块
    uses: actions/cache@v3
    with:
      path: ~/.npm
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      restore-keys: |
        ${{ runner.os }}-node-
  
  - name: 缓存 Docker 层
    uses: actions/cache@v3
    with:
      path: /tmp/.buildx-cache
      key: ${{ runner.os }}-buildx-${{ github.sha }}
      restore-keys: |
        ${{ runner.os }}-buildx-
```

### 2. 并行执行
```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - name: 代码检查
        run: npm run lint
  
  test:
    runs-on: ubuntu-latest
    steps:
      - name: 单元测试
        run: npm test
  
  deploy:
    needs: [lint, test]  # 等待前面的作业完成
    runs-on: ubuntu-latest
    steps:
      - name: 部署
        run: npm run deploy
```

## 🚨 错误处理与调试

### 1. 错误处理
```yaml
steps:
  - name: 可能失败的步骤
    id: risky-step
    continue-on-error: true
    run: exit 1
  
  - name: 处理失败
    if: steps.risky-step.outcome == 'failure'
    run: echo "处理失败情况"
  
  - name: 总是执行清理
    if: always()
    run: echo "清理资源"
```

### 2. 调试技巧
```yaml
steps:
  - name: 调试信息
    run: |
      echo "事件名称: ${{ github.event_name }}"
      echo "分支: ${{ github.ref }}"
      echo "提交 SHA: ${{ github.sha }}"
      echo "运行器: ${{ runner.os }}"
  
  - name: 启用调试日志
    run: echo "::debug::这是调试信息"
    
  - name: 设置输出
    id: debug
    run: echo "timestamp=$(date)" >> $GITHUB_OUTPUT
  
  - name: 使用输出
    run: echo "时间戳: ${{ steps.debug.outputs.timestamp }}"
```

## 📈 监控与通知

### 1. Slack 通知
```yaml
steps:
  - name: 通知 Slack
    if: always()
    uses: 8398a7/action-slack@v3
    with:
      status: ${{ job.status }}
      channel: '#ci-cd'
      webhook_url: ${{ secrets.SLACK_WEBHOOK }}
      fields: repo,message,commit,author,action,eventName,ref,workflow
```

### 2. 邮件通知
```yaml
steps:
  - name: 发送邮件
    if: failure()
    uses: dawidd6/action-send-mail@v3
    with:
      server_address: smtp.gmail.com
      server_port: 465
      username: ${{ secrets.MAIL_USERNAME }}
      password: ${{ secrets.MAIL_PASSWORD }}
      subject: "构建失败: ${{ github.repository }}"
      body: "构建在 ${{ github.ref }} 分支失败"
      to: admin@example.com
```

## 🎯 最佳实践

### 1. 工作流组织
- 保持工作流文件简洁，单一职责
- 使用有意义的作业和步骤名称
- 合理使用并行和串行执行

### 2. 安全考虑
- 最小权限原则
- 不在日志中暴露敏感信息
- 使用环境保护规则

### 3. 性能优化
- 合理使用缓存
- 避免不必要的重复构建
- 选择合适的运行器类型

### 4. 可维护性
- 使用可复用的工作流
- 文档化复杂的工作流程
- 定期更新 Actions 版本

## 🎉 总结

GitHub Actions 是现代软件开发不可或缺的工具，它提供了：

1. **灵活性** - 支持各种编程语言和平台
2. **可扩展性** - 丰富的社区 Actions
3. **集成性** - 与 GitHub 生态系统深度集成
4. **经济性** - 公共仓库免费使用

通过合理使用 GitHub Actions，可以显著提升开发效率，减少手动操作，确保代码质量。开始构建你的自动化工作流吧！

---

> 💡 **提示**: 这篇博客展示了 GitHub Actions 的完整应用场景，你可以根据自己的项目需求选择合适的工作流模板进行定制。

> 🔗 **相关资源**: 
> - [GitHub Actions 官方文档](https://docs.github.com/en/actions)
> - [Awesome Actions](https://github.com/sdras/awesome-actions)
> - [Actions Marketplace](https://github.com/marketplace?type=actions)
