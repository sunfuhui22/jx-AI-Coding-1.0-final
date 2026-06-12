# Implementation Plan: 项目初始化

**Branch**: `007-project-init` | **Date**: 2026-06-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-project-init/spec.md`

## Summary

搭建建筑施工质检情报员项目的工程骨架——基于 Next.js 16 App Router 的 TypeScript 单体仓库，集成 Tailwind CSS 4、shadcn/ui 4 组件库、lucide-react 图标库，定义全局类型枚举，铺设从首页到移动端和 PC 后台的完整路由骨架，并建立 Stitch 设计系统的 CSS 变量基础。本阶段的产出是后续所有模块开发的基底。

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Next.js 16.2.3 (App Router), React 19, Tailwind CSS 4, shadcn/ui 4 (radix-nova), lucide-react, Biome 2.2
**Storage**: N/A（阶段 2 引入 Supabase）
**Testing**: N/A（MVP 阶段不写测试，constitution 原则 IV）
**Target Platform**: Web（Vercel 部署，Node.js 运行时）
**Project Type**: Web application — Next.js App Router 单体仓库（前端 + Server Actions + Route Handlers）
**Performance Goals**: dev server 30 秒内启动，生产构建无报错
**Constraints**: `tsc --noEmit` 零错误，`biome check` 零错误
**Scale/Scope**: ~10 个路由页面，4 个核心枚举类型，单一共享类型文件

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 原则 | 状态 | 说明 |
|------|------|------|
| I. MVP 优先交付 | ✅ 通过 | 阶段 1 只做路由骨架和类型定义，不涉及业务逻辑，是最小可行基底 |
| II. 核心路径正确性 | ✅ 通过 | 路由路径严格匹配 PRD 定义的 `/mobile/*` 和 `/dashboard/*` 结构 |
| III. 最小抽象 | ✅ 通过 | 类型枚举内联于单一 `lib/types.ts` 文件，路由页面直接使用 Next.js App Router 约定，无额外抽象层 |
| IV. 实用技术栈 | ✅ 通过 | 全部使用 PRD 指定技术栈：Next.js + Tailwind + shadcn/ui + lucide-react + Biome |
| 中文界面 | ✅ 通过 | 根布局 `html lang="zh-CN"`，首页按钮使用中文文案 |

**无违规项，无需 Complexity Tracking。**

## Project Structure

### Documentation (this feature)

```text
specs/007-project-init/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (skip — no external interfaces in phase 1)
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
app/
├── layout.tsx                    # 根布局（Geist + Noto Sans SC 字体，zh-CN）
├── globals.css                   # Stitch 设计 tokens + shadcn/ui CSS 变量 + Tailwind v4
├── page.tsx                      # 首页（/）— 移动端入口 + PC 后台入口两个大按钮
├── login/
│   └── page.tsx                  # 登录页占位
├── mobile/
│   ├── layout.tsx                # 移动端布局占位
│   ├── assistant/
│   │   └── page.tsx              # 智能助手页占位
│   └── tickets/
│       ├── page.tsx              # 工单列表页占位
│       └── [id]/
│           └── page.tsx          # 工单详情页占位
└── dashboard/
    ├── layout.tsx                # PC 端布局占位
    ├── overview/
    │   └── page.tsx              # 数据大盘页占位
    ├── tickets/
    │   └── page.tsx              # 工单中心页占位
    └── knowledge/
        └── page.tsx              # 知识运营页占位

lib/
├── types.ts                      # 全局类型枚举与接口
└── utils.ts                      # cn() 工具函数（Tailwind 类名合并）

components/
└── ui/                           # shadcn/ui 组件（按需安装）

mcp/                              # 本地 MCP server（后续阶段填充）
```

**Structure Decision**: 采用 Next.js App Router 单一项目结构（Option 2: Web application 的变体）。前后端代码共存于 `app/` 目录，通过 RSC + Server Actions + Route Handlers 实现全栈。此结构是 Next.js 16 推荐模式，也是 constitution 强制要求。

## Complexity Tracking

> 无违规项，无需填写。
