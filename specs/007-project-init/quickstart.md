# Quickstart: 项目初始化

**Feature**: 007-project-init
**Date**: 2026-06-12

## 前置条件

- Node.js 18+ (推荐 20 LTS)
- npm（项目已配置，不使用 yarn/pnpm）
- Git

## 快速启动

```bash
# 1. 克隆仓库
git clone <repo-url>
cd jx-AI-Coding-1.0-final

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
# 访问 http://localhost:3000

# 4. 类型检查
npx tsc --noEmit

# 5. 代码检查
npx biome check

# 6. 格式化
npm run format
```

## 验证清单

- [x] `npm run dev` 启动成功，http://localhost:3000 可访问
- [x] 首页显示「移动端入口」和「PC 后台入口」两个按钮
- [x] 点击按钮可跳转到对应路由
- [x] `/login` 可访问（占位内容）
- [x] `/mobile/assistant`、`/mobile/tickets`、`/mobile/tickets/1` 可访问
- [x] `/dashboard/overview`、`/dashboard/tickets`、`/dashboard/knowledge` 可访问
- [x] `npx tsc --noEmit` 零错误通过
- [x] `npx biome check` 零错误通过
- [x] `npm run build` 成功完成
- [x] 页面背景白色，主色调浅蓝，无粗实线边框

## 项目结构速览

```
app/               # Next.js App Router 页面
├── page.tsx       # 首页入口
├── login/         # 登录页
├── mobile/        # 移动端
└── dashboard/     # PC 后台
lib/
├── types.ts       # 全局类型枚举
└── utils.ts       # cn() 工具
components/ui/     # shadcn/ui 组件
```
