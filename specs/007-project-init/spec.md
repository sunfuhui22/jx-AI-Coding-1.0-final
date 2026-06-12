# Feature Specification: 建筑施工质检情报员

**Feature Branch**: `007-project-init`
**Created**: 2026-06-12
**Updated**: 2026-06-12（与代码对齐）
**Status**: Implemented
**Input**: 建筑施工质检情报员 — AI 驱动的施工质检工单管理系统完整规格

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 项目骨架与首页入口 (Priority: P1) 🎯 MVP

作为用户，当我访问系统根路径时，我能看到首页，首页提供移动端和 PC 后台两个清晰的入口按钮，让我根据自己的角色选择进入相应的端。

**Why this priority**: 首页是整个系统的入口，没有首页用户无法导航到任何功能页面。

**Independent Test**: 启动开发服务器后访问 `localhost:3000`，能看到包含「移动端」和「PC 管理端」两个入口按钮的首页。

**Acceptance Scenarios**:

1. **Given** 用户未登录，**When** 访问根路径 `/`，**Then** 看到首页，包含移动端入口和 PC 后台入口两个大按钮
2. **Given** 用户在首页，**When** 点击移动端入口，**Then** 跳转到 `/mobile/assistant` 路由
3. **Given** 用户在首页，**When** 点击 PC 后台入口，**Then** 跳转到 `/dashboard/overview` 路由

---

### User Story 2 - 路由骨架搭建 (Priority: P1)

作为开发者，系统需具有完整的前端路由骨架，覆盖所有核心页面路径，确保各端功能页面可访问。

**Why this priority**: 路由骨架是所有页面开发的前置依赖，必须在早期完成。

**Independent Test**: 启动开发服务器后，能分别访问所有核心路由（即使页面内容为占位），不会出现 404。

**Acceptance Scenarios**:

1. **Given** 开发服务器运行中，**When** 访问 `/login`，**Then** 返回登录页，HTTP 状态码 200
2. **Given** 开发服务器运行中，**When** 访问 `/mobile/assistant`、`/mobile/tickets`、`/mobile/tickets/:id`，**Then** 均返回对应页面，HTTP 状态码 200
3. **Given** 开发服务器运行中，**When** 访问 `/dashboard/overview`、`/dashboard/tickets`、`/dashboard/knowledge`，**Then** 均返回对应页面，HTTP 状态码 200
4. **Given** 开发服务器运行中，**When** 访问 API 路由 `/api/tickets`、`/api/agent`、`/api/assignees`、`/auth/signout`，**Then** 返回对应响应

---

### User Story 3 - 全局类型定义 (Priority: P1)

作为开发者，项目中定义了全局共享的类型枚举和接口（角色、工单状态、严重程度、专业类型等），确保所有模块引用一致的数据结构。

**Why this priority**: 类型定义是所有业务逻辑的基础，前后端共享类型可避免数据结构不一致。

**Independent Test**: 检查 `lib/types.ts` 文件，包含角色、工单状态、严重程度、专业类型等类型定义及 Profile、Project、UserRole、Ticket、TicketLog 等实体接口，可在任意文件中通过 `@/lib/types` 导入使用。

**Acceptance Scenarios**:

1. **Given** 项目代码库已初始化，**When** 查看 `lib/types.ts`，**Then** 包含 `Role`（质检员/施工方/管理员）、`TicketStatus`（待处理/已完成/已拒绝）、`Severity`（轻微/一般/严重/紧急）、`SpecialtyType`（建筑设计专业/结构专业/给排水专业）、`TicketAction`、`ProjectType` 等类型定义
2. **Given** 项目代码库已初始化，**When** 查看 `lib/types.ts`，**Then** 包含 `Profile`、`Project`、`UserRole`、`Ticket`、`TicketLog`、`IdentityOption`、`LoginResult` 等实体接口
3. **Given** 编辑器中编写代码，**When** 从 `@/lib/types` 导入任一类型，**Then** TypeScript 类型检查通过，提供完整的智能提示

---

### User Story 4 - 全局样式与设计系统 (Priority: P2)

作为用户，系统界面呈现统一的简约风格——白底浅蓝配色，无粗实线边框，视觉清爽专业，遵循 Stitch 设计系统（Material Design 3 音调分层法）。

**Why this priority**: 全局样式影响所有页面的视觉一致性，但可在后续开发中逐步完善。

**Independent Test**: 启动开发服务器后访问任意页面，视觉检查确认白底浅蓝风格、无渐变/重阴影/粗黑边框。

**Acceptance Scenarios**:

1. **Given** 用户访问任意页面，**When** 查看页面背景，**Then** 背景为白色，主色调为浅蓝色系（通过 `--stitch-*` CSS 变量引用）
2. **Given** 用户查看页面元素，**When** 检查边框样式，**Then** 无粗实线边框分隔区域，区域分隔使用色调偏移或 20% 透明度
3. **Given** 页面包含导航元素，**When** 查看激活态导航项，**Then** 显示 primary-container 背景色 + on-primary-container 文字色
4. **Given** 系统使用图标，**When** 查看图标，**Then** 仅使用 lucide-react，导航 `size-5`，品牌 `size-6`

---

### User Story 5 - 用户鉴权与身份选择 (Priority: P1)

作为用户，我可以通过工号+密码登录系统，登录后从我的项目-角色组合中选择一个作为当前会话身份。系统根据角色自动路由到对应端（质检员/施工方→移动端，管理员→PC 后台）。

**Why this priority**: 鉴权与身份是所有业务操作的前置条件，必须在功能开发前完成。

**Independent Test**: 使用有效凭据登录，选择「质检员」角色后能进入移动端助手页；选择「管理员」角色后能进入 PC 后台。

**Acceptance Scenarios**:

1. **Given** 用户未登录，**When** 访问任意受保护路由，**Then** 重定向到 `/login` 页面（支持 `?redirect=` 参数记录目标路径）
2. **Given** 用户在登录页，**When** 输入正确工号+密码并提交，**Then** 登录成功，若用户有多重身份则展示身份选择界面
3. **Given** 用户登录成功但未选择身份，**When** 在身份选择对话框中点击某个「项目 + 角色」，**Then** 身份写入 Cookie（7 天有效期），页面跳转到对应端
4. **Given** 用户已选择身份，**When** 访问 PC 后台路由但角色非管理员，**Then** 重定向到移动端助手页
5. **Given** 用户已登录，**When** 点击退出登录，**Then** 清除身份 Cookie 并跳转到登录页

---

### User Story 6 - AI Agent 智能助手 (Priority: P1)

作为质检员/施工方，我可以在移动端与 AI 助手对话，助手能帮我查询工单、检索建筑施工规范知识，以及发起建单流程。

**Why this priority**: Agent 是系统的核心交互界面，质检员通过它与系统交互完成报事建单。

**Independent Test**: 在移动端助手页输入"帮我查一下最近的工单"，Agent 返回工单列表；输入"混凝土浇筑有哪些规范要求"，Agent 返回知识库回答。

**Acceptance Scenarios**:

1. **Given** 用户身份已确定为质检员，**When** 在助手页输入建单意图（如"3 号楼 5 层卫生间墙面空鼓，帮我报一下"），**Then** Agent 发起 `create_ticket` HITL 流程，前端展示建单确认卡片
2. **Given** 用户身份已确定为质检员/施工方，**When** 在助手页输入工单查询意图，**Then** Agent 调用 `queryTicket` 工具，返回当前项目下的工单列表（含链接）
3. **Given** 用户身份已确定，**When** 在助手页输入施工知识问题，**Then** Agent 调用 `consult_construction_knowledge` 工具，返回 Coze 知识库检索结果
4. **Given** 用户身份为施工方/管理员，**When** 在助手页尝试建单，**Then** Agent 拒答并提示"当前身份无报事权限"
5. **Given** 用户发送与建筑施工质检无关的话题，**When** Agent 判断意图，**Then** 礼貌拒答并告知能力范围
6. **Given** Agent 对话进行中，**When** 流式响应返回工具调用，**Then** 前端渲染对应的工具卡片（工单查询卡 / 知识检索卡 / 建单草稿卡）

---

### User Story 7 - 工单 CRUD 与状态机 (Priority: P1)

作为质检员，我可以创建工单记录现场问题；作为施工方，我可以处理（解决/拒绝）指派给我的工单；作为质检员，我还可以重新打开被拒绝的工单。所有状态变更通过后端 API 以 service-role 权限写入数据库。

**Why this priority**: 工单是系统的核心业务实体，CRUD 和状态流转是业务闭环的关键。

**Independent Test**: 质检员创建工单 → 施工方标记解决 → 质检员验证；或施工方拒绝 → 质检员重新打开。

**Acceptance Scenarios**:

1. **Given** 用户身份为质检员，**When** 在 AI 助手中完成建单卡片并提交，**Then** 工单创建成功，状态为「待处理」，Agent 回复工单编号和链接
2. **Given** 用户有权限，**When** 查看工单详情页，**Then** 展示工单完整信息（描述、位置、严重程度、专业类型、图片、创建人、责任人、状态）
3. **Given** 工单状态为「待处理」，**When** 施工方点击「解决」，**Then** 工单状态变更为「已完成」
4. **Given** 工单状态为「待处理」，**When** 施工方点击「拒绝」，**Then** 工单状态变更为「已拒绝」
5. **Given** 工单状态为「已拒绝」，**When** 质检员点击「重新打开」，**Then** 工单状态恢复为「待处理」
6. **Given** 用户有编辑权限，**When** 在工单详情页切换为编辑模式并修改字段，**Then** 工单信息更新成功
7. **Given** 数据库 RLS 已启用，**When** 浏览器直连 Supabase 尝试写入 tickets 表，**Then** 操作被拒绝（仅 service-role 可写）

---

### User Story 8 - PC 管理端 (Priority: P2)

作为管理员，我可以在 PC 后台全局监控所有工单、管理知识库，通过侧边栏导航在三大模块间切换。

**Why this priority**: 管理端为管理员提供全局视图，但质检员/施工方的移动端体验优先级更高。

**Independent Test**: 以管理员身份登录后，能看到侧边栏导航，进入工单中心查看所有工单表格。

**Acceptance Scenarios**:

1. **Given** 管理员登录并选择管理员身份，**When** 进入 PC 后台，**Then** 左侧显示固定侧边栏（w-64），包含「数据大盘」「工单中心」「知识运营」三个导航项
2. **Given** 管理员在工单中心页，**When** 点击某条工单，**Then** 右侧抽屉展开显示工单详情
3. **Given** 管理员在知识运营页，**When** 查看页面，**Then** 可管理候选知识条目和 QA 对
4. **Given** 管理员在任意 PC 端页面，**When** 查看顶栏，**Then** 显示当前用户名、部门、身份信息和身份切换入口

---

### User Story 9 - 移动端工单管理 (Priority: P1)

作为质检员/施工方，我可以在移动端查看工单列表（按状态 Tab 筛选），进入工单详情查看完整信息，并根据角色权限执行状态操作。

**Why this priority**: 移动端是质检员现场报事和施工方处理工单的主要界面。

**Independent Test**: 登录后进入移动端工单列表，Tab 切换正常，点击工单进入详情页。

**Acceptance Scenarios**:

1. **Given** 用户在移动端，**When** 查看工单列表页，**Then** 顶部显示状态 Tab（待处理/已完成/已拒绝），可切换筛选
2. **Given** 用户在移动端工单列表，**When** 点击某条工单，**Then** 跳转到工单详情页 `/mobile/tickets/:id`
3. **Given** 用户在工单详情页，**When** 查看页面元素，**Then** 包含顶栏（返回按钮 + 工单编号）、工单信息区、状态操作按钮区
4. **Given** 用户在移动端任意页面，**When** 点击顶栏菜单按钮，**Then** 侧边 Sheet 抽屉展开，显示导航项和身份信息

---

### User Story 10 - 知识检索集成 (Priority: P2)

作为质检员/施工方，当我在 Agent 对话中咨询建筑施工规范、验收标准、施工做法等问题时，系统通过 Coze 平台检索专业知识库，返回准确的回答。

**Why this priority**: 知识检索增强 Agent 的专业能力，但核心工单流程不依赖它。

**Independent Test**: 在 Agent 对话中输入"混凝土养护时间规范"，系统返回来自 Coze 知识库的专业回答而非通用 LLM 知识。

**Acceptance Scenarios**:

1. **Given** 用户在 Agent 对话中输入知识类问题，**When** Agent 调用 `consult_construction_knowledge` 工具，**Then** Coze 平台流式返回专业知识，前端以 assistant 文本流形式展示
2. **Given** Coze API 调用失败或超时，**When** 错误发生，**Then** 系统降级处理，返回友好错误提示而非崩溃
3. **Given** 用户发起知识检索后想取消，**When** 触发 abort，**Then** 请求中止，Agent 停止等待

---

### User Story 11 - 对话持久化与历史 (Priority: P2)

作为用户，我关闭页面后重新打开 Agent 对话，能看到最近的对话历史，不需要从头开始。

**Why this priority**: 对话持久化提升用户体验连续性，但不影响核心业务流程。

**Independent Test**: 进行几轮对话后刷新页面，最近 6 轮对话仍然可见。

**Acceptance Scenarios**:

1. **Given** 用户已进行过多轮 Agent 对话，**When** 刷新页面或重新打开助手页，**Then** 最近 6 轮对话通过 RSC 预取加载并展示
2. **Given** 对话轮数超过 6 轮，**When** 新请求发起，**Then** 系统自动修剪 checkpoint 保留最近 6 轮，更早的历史视为无效上下文
3. **Given** 用户在 HITL 建单确认后刷新页面，**When** 页面重新加载，**Then** 建单结果通过 `[HITL_RESULT]` 消息持久化，不会闪回 SSR 快照

---

### User Story 12 - 代码质量卡控 (Priority: P1)

作为开发者，每次 git commit 自动执行 TypeScript 类型检查和 Biome 代码检查，确保进入仓库的代码零类型错误、零 lint 违规。

**Why this priority**: 自动化卡控是代码质量的基础保障，防止问题代码进入仓库。

**Independent Test**: 故意引入类型错误后执行 `git commit`，提交被阻止并显示错误信息。

**Acceptance Scenarios**:

1. **Given** 代码通过 tsc 和 biome check，**When** 执行 `git commit`，**Then** 提交成功，Husky pre-commit hook 通过
2. **Given** 代码存在类型错误，**When** 执行 `git commit`，**Then** Husky 阻止提交并显示 `tsc --noEmit` 错误信息
3. **Given** 代码存在 lint 违规，**When** 执行 `git commit`，**Then** Husky 阻止提交并显示 `biome check` 错误信息
4. **Given** 开发者尝试跳过检查，**When** 使用 `--no-verify`，**Then** 按项目规范禁止使用此选项

---

### Edge Cases

- 访问未定义路由时返回 404 页面（Next.js 默认行为）
- 用户多身份（同一用户在不同项目中担任不同角色）时展示身份选择对话框
- 移动端和 PC 端的响应式布局在各主流屏幕尺寸下无明显错位
- HITL 建单期间流式未完成时，提交按钮禁用防止过早提交
- Agent 对话中工具调用失败时前端降级展示错误信息
- 服务端使用 `SUPABASE_SERVICE_ROLE_KEY` 写入数据库，前端不可获取此密钥
- Supabase RLS 拦截浏览器直连写入，仅 service-role 可绕过
- Coze API 调用支持 abort 取消

## Requirements *(mandatory)*

### Functional Requirements

#### 项目基础

- **FR-001**: 系统 MUST 基于 Next.js 16 App Router 架构搭建，支持 RSC（React Server Components）和 Server Actions
- **FR-002**: 系统 MUST 配置 TypeScript 严格模式，所有代码通过 `tsc --noEmit` 类型检查
- **FR-003**: 系统 MUST 集成 Tailwind CSS 4 作为样式框架
- **FR-004**: 系统 MUST 集成 shadcn/ui 4 组件库，使用 radix-nova 风格，基础色 neutral
- **FR-005**: 系统 MUST 集成 lucide-react 作为图标库
- **FR-006**: 系统 MUST 使用 Biome 2.2 作为代码检查工具（非 ESLint），提交前通过 biome check
- **FR-007**: 首页（`/`）MUST 包含两个导航按钮：移动端入口和 PC 后台入口
- **FR-008**: 路由骨架 MUST 覆盖全部核心路径：`/`、`/login`、`/mobile/assistant`、`/mobile/tickets`、`/mobile/tickets/:id`、`/dashboard/overview`、`/dashboard/tickets`、`/dashboard/knowledge`
- **FR-009**: `lib/types.ts` MUST 定义核心类型：`Role`、`TicketStatus`、`Severity`、`SpecialtyType`、`ProjectType`、`TicketAction` 及实体接口 `Profile`、`Project`、`UserRole`、`Ticket`、`TicketLog`、`IdentityOption`
- **FR-010**: 全局样式 MUST 定义 Stitch 设计系统 CSS 变量（`--stitch-*`），在 `globals.css` 中集中管理，遵循 Material Design 3 音调分层法
- **FR-011**: 根布局（`app/layout.tsx`）MUST 配置 Geist 和 Noto Sans SC 字体，html lang 设为 zh-CN
- **FR-012**: 项目 MUST 配置路径别名 `@/*` 映射项目根目录

#### 鉴权与会话

- **FR-013**: 系统 MUST 基于 Supabase Auth 实现工号+密码登录
- **FR-014**: 系统 MUST 实现「项目 + 角色」身份选择：用户登录后选择一组身份作为会话身份，写入 Cookie（httpOnly, 7 天有效期）
- **FR-015**: PC 后台（`/dashboard/*`）MUST 仅允许管理员角色访问，非管理员重定向到移动端
- **FR-016**: 系统 MUST 支持退出登录，清除身份 Cookie 并跳转到登录页

#### AI Agent

- **FR-017**: 系统 MUST 基于 LangChain `createAgent` 构建 AI 助手，使用 OpenRouter ChatOpenAI 作为主模型
- **FR-018**: Agent MUST 通过 SSE 流式响应与前端通信（`/api/agent` Route Handler）
- **FR-019**: Agent MUST 注入身份驱动 System Prompt（姓名/部门/角色/项目），根据不同角色限制工具调用权限
- **FR-020**: Agent MUST 提供三个工具：`queryTicket`（工单查询 via MCP）、`consult_construction_knowledge`（知识检索 via Coze）、`create_ticket`（建单 HITL）
- **FR-021**: `queryTicket` MUST 通过本地 stdio MCP server 查询工单，注入 `supabase_access_token` 实现用户级权限隔离
- **FR-022**: `consult_construction_knowledge` MUST 调用 Coze 平台 API 检索建筑施工专业知识
- **FR-023**: `create_ticket` MUST 实现 HITL 流程：Agent 发起 → 前端拦截渲染建单卡片 → 用户选择责任人确认 → POST `/api/tickets` → tool_result 回灌 Agent → Agent 告知工单编号

#### 工单管理

- **FR-024**: 工单写入 MUST 经过 Next.js API Route Handler，服务端使用 service-role 密钥操作 Supabase，不可从浏览器直连
- **FR-025**: 系统 MUST 提供完整工单 CRUD API：`GET/POST /api/tickets`、`PATCH /api/tickets/:id`
- **FR-026**: 系统 MUST 提供工单状态操作 API：`POST /api/tickets/:id/actions/resolve|reject|reopen`
- **FR-027**: 系统 MUST 提供责任人列表 API：`GET /api/assignees`

#### 界面

- **FR-028**: 移动端 MUST 包含顶栏（h-12）+ 侧边 Sheet 抽屉导航
- **FR-029**: PC 端 MUST 包含固定侧边栏（w-64）+ 顶栏（h-16）
- **FR-030**: 工单编号 MUST 使用自增 INT（而非 UUID）

### Key Entities

- **Profile**: 用户档案 — id（Supabase Auth UUID）、工号、姓名、部门、头像
- **Project**: 施工项目 — id、名称、城市、甲方名称、类型
- **UserRole**: 用户角色关联 — 用户 × 项目 × 角色（质检员/施工方/管理员）
- **Ticket**: 工单 — id（自增）、状态（待处理/已完成/已拒绝）、严重程度、专业类型、描述、位置、图片、详情、根因、预防措施、知识库标记
- **TicketLog**: 工单变更记录 — 工单 ID、操作人、操作类型、字段差异、备注
- **Role**: 质检员（inspector）、施工方（constructor）、管理员（admin）
- **TicketStatus**: 待处理（pending）→ 已完成（completed）/ 已拒绝（rejected）；已拒绝可重开→待处理
- **Severity**: 轻微 → 一般 → 严重 → 紧急
- **SpecialtyType**: 建筑设计专业、结构专业、给排水专业
- **TicketAction**: 创建、解决、拒绝、指派他人、重新打开、编辑

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 开发者执行 `npm run dev` 后 30 秒内可访问首页
- **SC-002**: 开发者执行 `npm run build` 无错误完成生产构建（全部 17 个路由编译通过）
- **SC-003**: 所有核心路由访问均返回 HTTP 200（非 404）
- **SC-004**: `npx tsc --noEmit` 类型检查零错误通过
- **SC-005**: `npx biome check` 代码检查零错误通过
- **SC-006**: Agent SSE 流式响应延迟 < 3 秒首字
- **SC-007**: HITL 建单完整流程（用户输入 → Agent 发卡 → 确认 → 工单创建 → 回复编号）可在 30 秒内完成
- **SC-008**: 对话历史在页面刷新后不丢失（最近 6 轮）
- **SC-009**: Coze 知识检索降级友好，不会因外部 API 不可用导致系统崩溃

## Assumptions

- 开发者已安装 Node.js 18+ 环境
- 使用 npm 作为包管理器（项目已配置）
- 项目部署目标平台为 Vercel
- Supabase 作为数据库和鉴权后端，环境变量已配置
- OpenRouter API Key 和 Coze API Token 已配置在环境变量中
- 设计系统严格遵守 Stitch 无边界规则（无粗实线边框、无渐变、无重阴影）
- `DATABASE_URL` 指向 Supabase Transaction Pooler（用于 PostgresSaver 对话持久化）
- MCP server 运行在本地 stdio 模式，与 Agent 进程通信
- Git 提交卡控通过 Husky pre-commit hook 强制执行，禁止 `--no-verify` 跳过
