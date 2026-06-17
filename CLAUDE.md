# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在本仓库中工作时提供指导。

**重要：始终使用中文进行对话交互。**

## 常用命令

```bash
npm run dev        # 启动开发服务器 (localhost:3000)
npm run build      # 生产构建
npm run lint       # Biome 检查
npm run format     # Biome 格式化并写入
npx tsc --noEmit   # 仅类型检查，不输出
```

### Git 提交卡控（Husky pre-commit）

每次 `git commit` 自动执行 `.husky/pre-commit`，`set -e` 模式，任一失败即阻止提交：

1. **`npx tsc --noEmit`** — TypeScript 类型检查
2. **`npx biome check`** — Lint + Format 检查（Biome 2.2）

**禁止使用 `--no-verify` 跳过检查。**

## 项目概述

**建筑施工质检情报员** — AI 驱动的施工质检工单管理系统。单一 Next.js 16 App Router 代码库同时承载：

| 端 | 用户角色 | 路由前缀 |
|---|---|---|
| 移动端 | 质检员（报事建单）、施工方（处理工单） | `/mobile/` |
| PC 端 | 管理员（全局监控、知识运营） | `/dashboard/` |
| 公用 | 所有角色 | `/login`、`/` |

## 技术栈

| 层次 | 技术选型 |
|------|----------|
| 框架 | Next.js 16.2.3 App Router (RSC + Server Actions) |
| 数据库与鉴权 | Supabase (Postgres + Auth + RLS) |
| AI Agent | LangChain `createAgent` + LangSmith 监控 |
| 知识检索 | 扣子（Coze）平台外部 API |
| 流式响应 | LangChain `useStream` 处理 SSE |
| UI | Tailwind CSS 4 + shadcn/ui 4 (`radix-nova` 风格) + lucide-react |
| 代码检查 | Biome 2.2（不是 ESLint） |
| 部署 | Vercel |

## 核心架构模式

### 双端角色模型

用户登录后必须选择「项目 + 角色」组合作为会话身份，全程固定。同一用户可在不同项目中担任不同角色。

- `profiles` — 用户业务信息（关联 Supabase Auth UUID）
- `projects` — 施工项目
- `user_roles` — 用户 × 项目 × 角色三元组（质检员 / 施工方 / 管理员）
- `tickets` — 工单（状态：`pending` / `completed` / `rejected`）
- `ticket_logs` — 工单全生命周期变更记录（本阶段按 spec 跳过写入）

### 工单写入：service-role 模式

工单写入**必须**经过 Next.js 后端 API，不可从浏览器直连 Supabase。数据库 RLS 拦截直连。Route Handler 在校验登录与角色后，服务端使用 **`SUPABASE_SERVICE_ROLE_KEY`**（仅环境变量，勿暴露前端）对 `tickets` 执行 insert/update。

```ts
// lib/tickets.ts — 所有写操作通过 service role
import { createServiceClient } from "@/lib/supabase/service-role";
```

### Agent HITL 工单创建流程

```
用户描述问题 → 主Agent识别意图 → create_ticket tool_call
→ 前端拦截 tool_call，渲染建单卡片（预填参数 + 责任人选择）
→ 用户确认提交 → 前端调用 POST /api/tickets
→ 成功后回灌 tool_result → Agent 告知工单编号
```

建单期间流式未完成时，提交按钮禁用。成功后用户侧持久化 `[HITL_RESULT]` 消息，气泡展示「已提交」而非原始 JSON。

### Agent 工单查询：stdio MCP

本地 MCP server（`mcp/ticket-query-server.mjs`）通过 stdio 与 Agent 通信。Agent 侧 `lib/agent/mcp-client.ts` 单例管理连接，注入 `supabase_access_token` 实现当前用户权限隔离（只能查到当前项目的工单）。查询结果收敛为摘要字段，支持 `limit` + `truncated` 标记。

### Agent 知识检索：Coze 子 Agent

`consult_construction_knowledge` 工具调用 Coze 平台 API。`lib/agent/coze-client.ts` 流式聚合最终 answer 文本，错误降级，支持 abort。前端工具卡隐藏返回原文（回答走 assistant 文本流）。

### Agent 对话持久化

PostgresSaver 使用 Supabase Transaction Pooler，`thread_id = user.id`。每轮请求前用 `RemoveMessage` 修剪 checkpoint 到最近 6 轮。前端 RSC 预取最近 6 轮历史，`agent-chat` 用 ref 保存最近非空 messages 避免提交后闪回 SSR 快照。

## 环境变量

| 变量 | 用途 |
|------|------|
| `SUPABASE_URL` / `SUPABASE_ANON_KEY` | Supabase 客户端 |
| `SUPABASE_SERVICE_ROLE_KEY` | 服务端写操作，**仅后端使用** |
| `DATABASE_URL` | Supabase Transaction Pooler（PostgresSaver） |
| `DEEPSEEK_API_KEY` / `AGENT_MODEL_ID` | Agent 主模型与 AI 总结（DeepSeek） |
| `COZE_BASE_URL` / `COZE_API_TOKEN` / `COZE_BOT_ID` | 扣子知识检索 |

## 测试账号

| 工号 | 密码 | 姓名 | 部门 | 邮箱 | 项目 | 角色 | 端 |
|------|------|------|------|------|------|------|-----|
| A001 | Admin123! | 系统管理员 | 技术部 | admin@zhijian.com | 世博中心项目 | 管理员 | PC 端 |
| B001 | Test123! | 张质检 | 质检部 | inspector@zhijian.com | 世博中心项目 | 质检员 | 移动端 |

> 登录地址：`/login`，管理员自动跳转 `/dashboard/overview`，质检员自动跳转 `/mobile/assistant`。

## 路由结构

```
/                          → 首页（双端入口按钮）
/login                     → 统一登录（工号 + 密码，支持 ?redirect=）
/mobile/assistant          → Agent 对话（知识检索 + 创建工单）
/mobile/tickets            → 工单列表（Tab 状态筛选）
/mobile/tickets/:id        → 工单详情（展示/编辑双模式 + 状态操作）
/dashboard/overview        → 数据大盘（阶段 7 待实现）
/dashboard/tickets         → 工单中心（表格 + 右侧详情抽屉）
/dashboard/knowledge       → 知识运营（候选池 + QA 对管理）
```

## 关键文件索引

```
app/
├── layout.tsx                    # 根布局（Geist + Noto Sans SC 字体，zh-CN）
├── globals.css                   # Stitch 设计 tokens + shadcn/ui CSS 变量 + Tailwind v4
├── api/tickets/                  # 工单 CRUD API（GET/POST route.ts + [id] PATCH + actions/*）
├── api/agent/route.ts            # Agent SSE 流式端点
├── api/assignees/route.ts        # 施工方责任人列表 API
├── auth/signout/route.ts         # 退出登录
├── mobile/layout.tsx             # 移动端布局（顶栏 h-12 + 侧边 Sheet 抽屉）
├── mobile/assistant/page.tsx     # 智能助手页
├── dashboard/layout.tsx          # PC 端布局（侧边栏 w-64 + 顶栏 h-16）
lib/
├── tickets.ts                    # 工单数据访问层（service-role 写入）
├── auth.ts                       # 身份 cookie 读写
├── types.ts                      # 全局类型枚举
├── utils.ts                      # cn() 工具
├── supabase/                     # client / server / proxy / service-role
└── agent/
    ├── index.ts                  # createAgent 单例 + 历史修剪
    ├── model.ts                  # OpenRouter ChatOpenAI 配置
    ├── prompts.ts                # 身份驱动 System Prompt（注入姓名/部门/角色/项目）
    ├── tools.ts                  # queryTicket（MCP）/ consult_construction_knowledge（Coze）/ create_ticket（HITL）
    ├── mcp-client.ts             # MCP MultiServer 客户端
    ├── coze-client.ts            # Coze 流式客户端（聚合最终 answer）
    └── create-ticket-draft-args.ts # create_ticket 工具参数解析/预填
components/
├── ui/                           # shadcn/ui 组件（button/input/sheet/badge/select/tabs 等 18 个）
├── ticket-detail.tsx             # 双端共用工单详情（展示/编辑双模式）
├── ticket-actions.tsx            # 工单状态机动作按钮（解决/拒绝/重开/指派）
├── agent/
│   ├── agent-chat.tsx            # 主聊天界面（消息流 + tool_call 路由 + HITL 气泡）
│   ├── agent-markdown-anchor.tsx # 自定义 <a>：工单路径走 next/link 同页跳转
│   ├── create-ticket-card.tsx    # HITL 建单表单卡（责任人选择 + 提交）
│   └── tool-call-card.tsx        # 工具调用展示卡
├── project-chip.tsx / user-avatar-chip.tsx / identity-dialog.tsx
├── mobile-top-bar.tsx / mobile-side-drawer.tsx
└── dashboard-top-bar.tsx / dashboard-side-nav.tsx
```

## Next.js 16 重要变更

- **Middleware → Proxy**：使用 `proxy.ts`，导出 `proxy` 函数，`config.matcher` 不变
- **动态路由 params 是 Promise**：必须 `await params` 解包
- **useSearchParams 必须包 Suspense**，否则 SSG prerender 报错
- **默认 Server Components**，仅在需要交互时加 `'use client'`
- 不确定的 API 先查 `node_modules/next/dist/docs/`

## 产品规格文档

```
doc/
├── 项目总览.md                   # 角色矩阵、页面路由、技术栈
├── 数据定义.md                   # 实体定义与数据库表结构（profiles/projects/user_roles/tickets/ticket_logs）
├── 工单状态机.md                 # 状态流转、操作权限矩阵、变更记录规则
├── 核心组件/                     # 工单详情组件、用户导航组件
├── 移动端/                       # 布局、工单列表/详情、Agent 对话页
├── PC端/                         # 布局、工单中心、知识运营、数据大盘
└── Agent模块/                    # 整体设计、system_prompt、MCP/HITL/Coze 定义
```

开发阶段进度跟踪见 `progress.md`（当前阶段 6 完成，阶段 7 待开始）。

## 设计系统（Stitch）

UI 严格遵循 Stitch 设计系统（Material Design 3 音调分层法）。详见 **[DESIGN.md](./DESIGN.md)**。

核心约束：
- **无边界规则**：禁止粗实线边框分割区域；用色调偏移或 20% 透明度分隔
- **禁止**：渐变、重阴影（`shadow-lg`+）、发光效果
- **色彩**：通过 `--stitch-*` CSS 变量引用，不硬编码色值
- **图标**：仅 `lucide-react`，导航 `size-5`，品牌 `size-6`
- **导航项**：激活态 `primary-container` 背景 + `on-primary-container` 文字
- **工单 ID**：自增 INT（即工单编号）

## 开发原则（`.specify/memory/constitution.md`）

1. **MVP 优先** — 先跑通核心路径，跳过边界情况、性能优化、测试
2. **核心路径正确性** — 严格匹配 PRD 规格，不做 PRD 未提及的功能
3. **最小抽象** — 单次使用直接内联；3 处以上再抽取；不做防御性编程
4. **不写测试** — MVP 阶段类型检查 + lint 通过即可
5. **垂直切片** — 一次一个用户故事全栈贯通
6. **中文界面，英文代码** — 面向用户文本用中文；变量名和注释用英文

## 约定

- 路径别名：`@/*` 映射项目根目录
- shadcn/ui：`radix-nova` 风格，基础色 neutral，CSS 变量启用
- 批量修改文件后：先 `format` → `lint` → `tsc --noEmit`，再提交

## Active Technologies
- TypeScript 5.x (strict mode) + Next.js 16.2.3 (App Router), React 19, Tailwind CSS 4, shadcn/ui 4 (radix-nova), lucide-react, Biome 2.2 (007-project-init)
- N/A（阶段 2 引入 Supabase） (007-project-init)

## Recent Changes
- 007-project-init: Added TypeScript 5.x (strict mode) + Next.js 16.2.3 (App Router), React 19, Tailwind CSS 4, shadcn/ui 4 (radix-nova), lucide-react, Biome 2.2
