#  知识回顾

## 应用开发模式

[【AI Coding营】第3课：应用是如何构建的 ](https://he9za7tvkd.feishu.cn/wiki/Gw7YwFg5CiIIZDk0fHScqU5Unih)

- **应用架构：**前后端分离，API，数据库
- **开发流程：**开发，验证，版本管理，测试验收，部署，监控


## 工程化的 AI Coding 范式

[【AI Coding营】 第4课：如何进行可靠开发 ](https://he9za7tvkd.feishu.cn/wiki/PkMWwnFy1iDHYYktcTecG7X2nMc)

- **Agent Harness：**工作环境，单会话上下文管理，多会话连续记忆管理，技能与工具，多 Agent 编排
- **Spec Coding 流程**：写清并拆分需求，生成并调整 Spec，严格按照 Spec 开发，测试验收，执行版本管理


# 项目框架

[【AI Coding营】第5课：认识生产级项目 - 建筑施工质检情报员介绍](https://he9za7tvkd.feishu.cn/wiki/VaZ0w6khjig8jnk8YDQc9pT3n3c)

## 项目介绍

- **核心功能：**工单流转平台 + Agent
- **角色矩阵：**质检员+施工方+管理员三种角色，分别对应移动端+PC端
- **页面结构树：**

  - **公用界面：**登录 + 身份切换
  - **移动端：**Agent 对话界面，工单列表和详情页面
  - **PC端：**数据大盘，工单列表和详情页，知识转化页


## 技术工具

- [**speckit**](https://github.com/github/spec-kit)：强大的 spec coding 流程工具
- [**Next.js**](https://nextjs.org/)**：**前后端一体化开发
- [**Supabase**](https://supabase.com/)：数据库 + 身份管理
- [**Github**](https://github.com/)：版本管理同步
- [**LangChain**](https://www.langchain.com/)：主 Agent + 对话追踪
- [**Stitch**](https://stitch.withgoogle.com/)：界面原型（[本次项目链接](https://stitch.withgoogle.com/projects/16591807519307787618)）
- [**shadcn**](https://ui.shadcn.com/)**+**[**lucide**](https://lucide.dev/guide/react/)：前端UI组件库 + 图标包
- [**Vercel**](https://vercel.com)：一键部署
- [**扣子**](https://www.coze.cn/space/7603349048648843273/develop)：知识库 + RAG + 子Agent （[本项目永久非公开链接](https://www.coze.cn/space/7603349048648843273)）

  > 邀请你加入我的扣子空间"ai_coding"，链接将在 2026-06-06 16:28 过期
  >
  > 👉🏻 https://www.coze.cn/invite/oSPqes4VDYCQXHJiWQmf?type=1
- [**context7**](https://context7.com/)：让 AI Coding 自动查阅代码手册


## Skill / MCP 等安装

1. 推荐安装在全局的工具，丢给 AI 执行

```Markdown
全局安装以下工具
- SpecKit 本体： https://github.com/github/spec-kit
- npx plugins add vercel/vercel-plugin
- npx ctx7 setup
- npx skills add supabase/agent-skills
- npx skills add https://github.com/mattpocock/skills --skill grill-me
- npx skills add https://github.com/leonxlnx/taste-skill --skill design-taste-frontend
- npx skills add https://github.com/anthropics/skills --skill frontend-design
```

1. 推荐安装在项目内，同样丢给 AI 执行

````Markdown
在当前项目内安装以下工具
- npx skills add langchain-ai/langchain-skills --skill '*'
- Google Stitch MCP
```
[mcp_servers.stitch]
url = "https://stitch.googleapis.com/mcp"
[mcp_servers.stitch.http_headers]
"X-Goog-Api-Key" = "<YOUR_GCP_API_KEY>"

## Stitch Instructions

Get the images and code for the following Stitch project's screens:

## Project
Title: 智能质检工单
ID: 16591807519307787618

## Screens:
1. 工单详情组件 - 编辑模式 (并列铺满按钮)
    ID: 4bfa58a5b9364a04b633cd7f9f7ce024

2. 登录页 - 响应式极简版
    ID: 04485e32e5254cc9a549c78e188fc98d

3. 工单详情组件 - 展示模式 (响应式优化)
    ID: 66b4d022d24e44c5bb1e1373d1fa67bd

4. 移动端框架 - 简化用户组件版
    ID: 979ee4baa3974c6a9fcfa1637131007c

5. 通用页面框架 - 纯净版
    ID: e597b9ca31074e949532ec3367cb6094

Use a utility like `curl -L` to download the hosted URLs.
```
````

## 开发概览

1. **准备阶段**：准备 PRD，拆分开发阶段，设置 system prompt
2. **框架阶段**：配置环境和工具，初始化项目模板，搭建页面结构
3. **开发阶段**：分模块逐个开发

   1. 定义数据类型
   2. 使用假数据完成UI开发
   3. 配置数据库并连接到 API 真数据
   4. 测试验收
   5. 结束 spec 流程，提交代码

- **验收阶段**：按照用户路径完整测试核心功能
- **部署上线**：部署项目，确认工作正常，并持续监控线上数据


# 如何听这节课

AI Coding 非常灵活且具有随机性，不可能在大型项目上原样复刻操作


**课堂目标**：通过实操演示，教学生产级 AI Coding 的**思路和原理**

**不是目标**：跟做；1:1复刻

**如何自己实操：**

- 克隆直播实操代码库到你的电脑 `git clone ``https://github.com/RyanHaoo/jx-AI-Coding-1.0-final.git`
- 如果我在课堂上更新了 github，那大家在本地运行 `git pull`
- 进入该代码库，唤起 cc，让它 checkout 代码库到课堂上任意步骤

  - "checkout 到拆分 prd 阶段"
  - "checkout 到最终成果"


# 实战开发

## 准备阶段

1. **拆分细化PRD**

使用任何你熟悉的 Agent 工具（不推荐使用 AI Coding 工具，否则需要严格要求其专注于内容整理定义，避免 Agent 钻入兔子洞去研究技术细节）


示例：

```Markdown
帮我把以下的项目描述整理成更细的多个文件放在 "arch-on-bowstring/21-训练营/14-day3-4/doc" 文件夹里：
- 基础 PRD 文件：arch-on-bowstring/21-训练营/14-day3-4/02-PRD-建筑施工质检情报员.md
- Agent 核心链路：arch-on-bowstring/21-训练营/14-day3-4/大模型核心链路.md
- 昨天的项目介绍讲义：arch-on-bowstring/21-训练营/14-day3-4/03-项目介绍讲义.md

按照以下结构整理：
- 项目总览.md （包含项目介绍，用户角色和功能总览，整体技术栈、风格、各个子prd路径等）
  - 数据定义.md （包含实体列表和数据库表定义；包含用户/角色定义）
  - 工单状态机.md （包含工单的详细状态流转说明，着重关注被允许的变更路径和权限要求）
  - 核心组件
    - 工单组件.md （双端共用的工单详情组件，包含编辑/展示两个状态，还有多个按当前用户身份切换显隐的按钮及其逻辑）
    - 用户组件.md （双端共用的导航栏用户组件，包含一个当前用户的展示小组件，还有点击后的菜单栏，及其中"退出登录"逻辑、"切换身份"弹窗逻辑）
  - 移动端
    - 通用布局.md
    - 工单列表页.md
    - 工单详情页.md
    - Agent 对话页.md （只包含该页面本身的内容，具体 Agent 逻辑链接到 Agent 模块）
  - PC 端
    - 通用布局.md
    - 工单中心页.md （包含工单列表和工单详情抽屉）
    - 知识运营页.md （包含该页面的内容和完整操作逻辑）
    - 数据大盘页.md
  - Agent 模块
    - 整体设计.md （包含完整的流程、工具列表（不包含工具的参数定义）、使用的开发框架等）
    - system_prompt.txt （该 Agent 的系统提示词）
    - 工单查询MCP定义.md （包含工单 stdio MCP 的详细参数定义）
    - 工单创建HITL_tool定义.md （包含工具定义，还有前端卡片说明（复用工单组件））
    - 知识查询子Agent说明.md （包含整体的出入参说明，但不包含具体的调用api和方式定义，后期补充）

核心准则：这个文件夹后期要用于 AI Coding，但当前整理的主要目的不是做出精确的功能界面定义，而是做出**大致的文档框架**，便于后期开发时拆分深化

其它要求：
1. 功能界面请以输入的文件为准，只补充必要的结构使文档成立即可
2. 不要生成图表（包括ascii图表）等供人阅读的可视化内容
3. 当不同文档的内容存在交叉或关联时，使用文档链接引用，不要写入重复内容
```

1. **人工检查并细化文档**
2. **安装并初始化 speckit 全局指导**`/speckit-constitution 是一个复杂项目的MVP演示实现，快速按照给定的需求完成开发，确保核心路径正确并通过静态代码检查即可。避免过度抽象和防御性编程，不考虑可拓展性，不考虑边界情况和编写测试`
3. 拆分开发阶段

`当前是一个全新的空仓库，请先读取 @doc/项目总览.md，然后把它拆分成可行的 AI Coding 开发步骤和阶段，每个阶段聚焦在一件事、一个页面或一个模块，不要横跨太多部分，但也不要拆得过于细碎，导致阶段太多。整理成非常精简的开发步骤大纲，存放在 progress.md`


## 框架阶段

1. 安装 skill（见技术工具）
2. 初始化项目脚手架（见实操）
3. Spec Coding 完成页面框架开发


## 开发阶段

以下见实操