# 开发步骤大纲

> 策略：垂直切片，逐模块推进。每个阶段聚焦一个模块或页面，全栈贯通（前端 → API → 数据库）。

## 阶段 1：项目初始化 ✅

- [x] 创建 Next.js 16 (App Router) 项目，配置 TypeScript
- [x] 安装并配置 Tailwind CSS 4、shadcn/ui 4、lucide-react
- [x] 定义全局类型枚举与接口（角色、工单状态、严重程度、专业类型等）
- [x] 搭建基础路由骨架：`/`、`/login`、`/mobile/*`、`/dashboard/*`
- [x] 首页（`/`）— 移动端入口 + PC 后台入口两个大按钮
- [x] 全局样式：Stitch 设计系统 CSS 变量，白底浅蓝简约风格

## 阶段 2：登录与身份系统 ✅

- [x] 配置 Supabase（Auth + Database），准备种子数据脚本
- [x] 创建业务数据表：`profiles`、`projects`、`user_roles`，配置 RLS 策略
- [x] 实现登录页（`/login`）— 工号 + 密码登录，对接 Supabase Auth，支持 `?redirect=` 回跳
- [x] 实现身份选择弹框 — 选择「项目 + 角色」组合，写入会话 cookie
- [x] 用户小组件（UserAvatarChip）+ 项目小组件（ProjectChip）
- [x] 鉴权守卫：移动端需登录，PC 端需管理员角色
- [x] 导航用户模块：退出登录、切换身份入口

## 阶段 3：工单数据层与 API ✅

- [x] 创建 `tickets` 表（含全部字段：状态、严重程度、专业类型、描述、位置、图片、归因等）
- [x] 创建 `ticket_logs` 表（变更记录：操作人、动作、字段 diff、说明）
- [x] 工单列表 API — `GET /api/tickets`（按项目 + 状态筛选，分页）
- [x] 工单详情 API — `GET /api/tickets/[id]`
- [x] 工单创建 API — `POST /api/tickets`（校验角色：仅质检员可创建）
- [x] 工单编辑 API — `PATCH /api/tickets/[id]`（发起人或责任人可编辑）
- [x] 状态机动作 API — 解决/拒绝/指派他人/重新打开
- [x] 所有写操作使用 service role，变更时自动写入 `ticket_logs`
- [x] 补充测试工单种子数据

## 阶段 4：核心工单组件 ✅

- [x] 工单详情组件（`ticket-detail`）— 展示模式（所有字段渲染）+ 编辑模式（表单控件）
- [x] 工单动作组件（`ticket-actions`）— 按身份 + 状态动态渲染操作按钮（解决/拒绝/指派/重开/编辑）
- [x] 状态机逻辑：按钮触发 → 弹窗收集必填信息 → API 调用 → 状态更新
- [x] 用户导航组件（`IdentityDialog`）— 复用阶段 2 的身份选择弹框

## 阶段 5：移动端页面 ✅

- [x] 移动端通用布局 — 顶栏（汉堡菜单 + 标题）+ 侧边抽屉（智能助手 / 工单列表 + 用户区）
- [x] 工单列表页（`/mobile/tickets`）— Tab 状态筛选（待处理/已完成/已拒绝）、列表卡片、空态/加载态
- [x] 工单详情页（`/mobile/tickets/[id]`）— 集成工单详情组件 + 工单动作组件
- [x] 列表 ↔ 详情页滑动过渡动画

## 阶段 6：Agent 对话模块 ✅

- [x] 主 Agent 后端（LangChain `createAgent`）— SSE 流式端点 `POST /api/agent`
- [x] 身份驱动 System Prompt — 注入姓名/部门/角色/项目，意图路由规则
- [x] PostgresSaver 对话持久化 — thread_id = user.id，保留最近 6 轮
- [x] MCP 工单查询工具 — 本地 stdio server，查询当前项目工单
- [x] Coze 知识子 Agent — 施工规范知识检索，返回最终文本
- [x] HITL 建单工具 — `create_ticket` tool_call → 前端渲染确认卡片 → 用户提交 → API 创建
- [x] Agent 对话页 UI（`/mobile/assistant`）— 消息流、输入区、工具调用卡、HITL 建单卡、加载态
- [x] 前端 SSE 流式对接（`useStream`），Agent 响应期间禁用输入

## 阶段 7：PC 端管理模块 ✅

- [x] PC 端通用布局 — 顶栏（标题 + 用户区）+ 左侧菜单导航（数据大盘/工单中心/知识运营）
- [x] 工单中心页（`/dashboard/tickets`）— 高级筛选 + 数据表格 + 右侧详情抽屉（Sheet）
- [x] 数据大盘页（`/dashboard/overview`）— 统计指标卡片 + 严重程度分布图表
- [x] 知识运营页（`/dashboard/knowledge`）— 候选池列表 + AI 总结转化弹窗 + QA 对管理 + CSV 导出

## 阶段 8：联调收尾与部署 🔄 ← 当前进度

- [x] **Open Design 风格重设计** — 全站 UI 统一为 Engineering Blue 风格
  - [x] 全局 CSS 设计令牌切换（`app/globals.css`）：主色 `#1e5fdb`、背景 `#f6f8fb`、点网格纹理
  - [x] 新增 Open Design 组件工具类：`.od-panel`、`.od-panel-header`、`.od-nav-item`
  - [x] PC 端数据大盘重设计 — 6 统计卡片 + 严重程度柱状图 + 近期活动 Feed + 快速操作
  - [x] PC 端工单中心 — 筛选 Chip 组 + 数据表 + 右侧 Sheet 抽屉
  - [x] PC 端知识运营 — 双栏 Panel 布局
  - [x] PC 端布局改为 Grid Shell：220px 侧边栏 + 弹性主内容区
  - [x] 移动端顶栏/抽屉风格统一
  - [x] 所有组件移除 Stitch 变量直接引用，改用标准 Tailwind + Open Design 类
- [x] **数据库初始化与修复**
  - [x] 创建 `profiles`、`projects`、`user_roles`、`tickets`、`ticket_logs` 五张表
  - [x] 修正 `NEXT_PUBLIC_SUPABASE_URL` 去掉 `/rest/v1/` 后缀
  - [x] 修复 RLS 策略：anon 可读 profiles（登录流程）、user_roles 去递归
  - [x] 补充 GRANT SELECT 权限
- [x] **登录链路修复**
  - [x] 登录 Action 改用 service role 查 user_roles（绕过 session 传递问题）
- [x] **测试账号与种子数据**
  - [x] 管理员：A001 / Admin123!（系统管理员，世博中心项目）
  - [x] 质检员：B001 / Test123!（张质检，世博中心项目）
  - [x] 12 条测试工单（待处理 5 / 已完成 4 / 已拒绝 3，覆盖所有严重程度和专业类型）
- [ ] 端到端流程走查：质检员报事 → 施工方处理 → 管理员监控 → 知识沉淀
- [ ] Bug 修复与边界体验优化
- [ ] 收紧 RLS 写入策略（INSERT/UPDATE 目前 open to all authenticated）
- [ ] 创建 `ticket_logs` 写入逻辑（表已建，写入未实现）
- [ ] 合并/清理重复的 RLS 迁移（本地迁移文件与远程数据库不一致）
- [ ] 部署到 Vercel（环境变量配置、域名绑定）
- [ ] 补全缺失环境变量：`COZE_API_TOKEN`、`COZE_BOT_ID`、`DATABASE_URL`

---

## 当前状态 (2026-06-17)

- **分支**: `007-project-init`
- **Agent 模型**: DeepSeek (`deepseek-chat`)
- **设计系统**: Engineering Blue（筑审 AI Open Design 风格）
- **数据库**: 五表就绪，12 条测试工单
- **测试账号**: 管理员 A001 + 质检员 B001
- **环境变量**: Supabase + DeepSeek 已配置
- **待补变量**: `COZE_API_TOKEN`、`COZE_BOT_ID`、`DATABASE_URL`
- **下一步**: 端到端流程走查 + RLS 收紧 + Vercel 部署

### 2026-06-17 更新记录

#### 设计系统迁移
- 全站从 Stitch (Material Design 3) 迁移至 Engineering Blue (Open Design)
- 移除组件中所有 `stitch-*` CSS 变量引用，改用标准 Tailwind + 语义化类名
- 新增 `.od-panel`、`.od-panel-header`、`.od-nav-item`、`.od-section-label`、`.od-filter-tab` 等可复用工具类
- 暗色模式同步适配

#### 数据库修复
| # | 问题 | 状态 |
|---|------|:--:|
| 1 | RLS INSERT/UPDATE 策略 `WITH CHECK (true)` | 待修 |
| 2 | `profiles`/`projects`/`user_roles` 三表无迁移文件 | ✅ 已创建 |
| 3 | `NEXT_PUBLIC_SUPABASE_URL` 含 `/rest/v1/` 后缀 | ✅ 已修 |
| 4 | `ticket_logs` 表未建 | ✅ 已建（写入逻辑待补） |
| 5 | 两段迁移 RLS 策略重复 | 待清理 |
| 6 | `getAllTickets` 中 Supabase `or()` 通配符 | ✅ 已修 |
| 7 | profiles RLS 阻止登录流程（anon 无法读） | ✅ 已修 |
| 8 | user_roles RLS 递归子查询导致策略失效 | ✅ 已修 |
| 9 | 登录 Action 跨客户端 session 丢失 | ✅ 已修（service role） |

#### 种子数据
- 12 条工单分布于：待处理(5)、已完成(4)、已拒绝(3)
- 覆盖专业：结构专业(7)、建筑设计专业(4)、给排水专业(3)
- 严重程度：紧急(4)、严重(4)、一般(3)、轻微(3)
