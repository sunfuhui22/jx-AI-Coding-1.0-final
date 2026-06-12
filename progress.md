# 开发步骤大纲

> 策略：垂直切片，逐模块推进。每个阶段聚焦一个模块或页面，全栈贯通（前端 → API → 数据库）。

## 阶段 1：项目初始化

- 创建 Next.js 16 (App Router) 项目，配置 TypeScript
- 安装并配置 Tailwind CSS 4、shadcn/ui 4、lucide-react
- 定义全局类型枚举与接口（角色、工单状态、严重程度、专业类型等）
- 搭建基础路由骨架：`/`、`/login`、`/mobile/*`、`/dashboard/*`
- 首页（`/`）— 移动端入口 + PC 后台入口两个大按钮
- 全局样式：Stitch 设计系统 CSS 变量，白底浅蓝简约风格

## 阶段 2：登录与身份系统

- 配置 Supabase（Auth + Database），准备种子数据脚本
- 创建业务数据表：`profiles`、`projects`、`user_roles`，配置 RLS 策略
- 实现登录页（`/login`）— 工号 + 密码登录，对接 Supabase Auth，支持 `?redirect=` 回跳
- 实现身份选择弹框 — 选择「项目 + 角色」组合，写入会话 cookie
- 用户小组件（UserAvatarChip）+ 项目小组件（ProjectChip）
- 鉴权守卫：移动端需登录，PC 端需管理员角色
- 导航用户模块：退出登录、切换身份入口

## 阶段 3：工单数据层与 API

- 创建 `tickets` 表（含全部字段：状态、严重程度、专业类型、描述、位置、图片、归因等）
- 创建 `ticket_logs` 表（变更记录：操作人、动作、字段 diff、说明）
- 工单列表 API — `GET /api/tickets`（按项目 + 状态筛选，分页）
- 工单详情 API — `GET /api/tickets/[id]`
- 工单创建 API — `POST /api/tickets`（校验角色：仅质检员可创建）
- 工单编辑 API — `PATCH /api/tickets/[id]`（发起人或责任人可编辑）
- 状态机动作 API — 解决/拒绝/指派他人/重新打开
- 所有写操作使用 service role，变更时自动写入 `ticket_logs`
- 补充测试工单种子数据

## 阶段 4：核心工单组件

- 工单详情组件（`ticket-detail`）— 展示模式（所有字段渲染）+ 编辑模式（表单控件）
- 工单动作组件（`ticket-actions`）— 按身份 + 状态动态渲染操作按钮（解决/拒绝/指派/重开/编辑）
- 状态机逻辑：按钮触发 → 弹窗收集必填信息 → API 调用 → 状态更新
- 用户导航组件（`IdentityDialog`）— 复用阶段 2 的身份选择弹框

## 阶段 5：移动端页面

- 移动端通用布局 — 顶栏（汉堡菜单 + 标题）+ 侧边抽屉（智能助手 / 工单列表 + 用户区）
- 工单列表页（`/mobile/tickets`）— Tab 状态筛选（待处理/已完成/已拒绝）、列表卡片、空态/加载态
- 工单详情页（`/mobile/tickets/[id]`）— 集成工单详情组件 + 工单动作组件
- 列表 ↔ 详情页滑动过渡动画

## 阶段 6：Agent 对话模块

- 主 Agent 后端（LangChain `createAgent`）— SSE 流式端点 `POST /api/agent`
- 身份驱动 System Prompt — 注入姓名/部门/角色/项目，意图路由规则
- PostgresSaver 对话持久化 — thread_id = user.id，保留最近 6 轮
- MCP 工单查询工具 — 本地 stdio server，查询当前项目工单
- Coze 知识子 Agent — 施工规范知识检索，返回最终文本
- HITL 建单工具 — `create_ticket` tool_call → 前端渲染确认卡片 → 用户提交 → API 创建
- Agent 对话页 UI（`/mobile/assistant`）— 消息流、输入区、工具调用卡、HITL 建单卡、加载态
- 前端 SSE 流式对接（`useStream`），Agent 响应期间禁用输入

## 阶段 7：PC 端管理模块

- PC 端通用布局 — 顶栏（标题 + 用户区）+ 左侧菜单导航（数据大盘/工单中心/知识运营）
- 工单中心页（`/dashboard/tickets`）— 高级筛选 + 数据表格 + 右侧详情抽屉
- 数据大盘页（`/dashboard/overview`）— 统计指标卡片 + 严重程度分布图表
- 知识运营页（`/dashboard/knowledge`）— 候选池列表 + AI 总结转化弹窗 + QA 对管理 + CSV 导出

## 阶段 8：联调收尾与部署

- 端到端流程走查：质检员报事 → 施工方处理 → 管理员监控 → 知识沉淀
- Bug 修复与边界体验优化
- 部署到 Vercel（环境变量配置、域名绑定）
