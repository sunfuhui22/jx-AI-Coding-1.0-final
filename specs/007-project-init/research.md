# Research: 项目初始化

**Feature**: 007-project-init
**Date**: 2026-06-12

## Research Tasks

本阶段技术选型全部由 PRD 和 constitution 预先确定，无需额外调研。以下记录关键决策的来源和依据。

## Decisions

### 1. Next.js 16 App Router

- **Decision**: 采用 Next.js 16.2.3 App Router，使用 RSC + Server Actions 模式
- **Rationale**: PRD 明确指定；App Router 是 Next.js 当前推荐架构，原生支持 React 19 RSC 和流式渲染
- **Alternatives considered**: Pages Router（已淘汰，不支持 RSC）

### 2. Tailwind CSS 4 + shadcn/ui 4

- **Decision**: Tailwind CSS 4 作为原子化 CSS 框架，shadcn/ui 4（radix-nova 风格）作为组件库
- **Rationale**: PRD 指定；两者深度集成 Next.js，shadcn/ui 提供无运行时开销的源码级组件
- **Alternatives considered**: CSS Modules（不够高效）、Ant Design（太重，不符合简洁风格）

### 3. Biome 2.2

- **Decision**: 使用 Biome 替代 ESLint + Prettier 进行 lint 和格式化
- **Rationale**: PRD 指定；单一工具完成 lint + format，速度快，配置简单
- **Alternatives considered**: ESLint + Prettier（PRD 明确排除）

### 4. 路径别名 @/*

- **Decision**: 配置 `@/*` 映射项目根目录
- **Rationale**: Next.js 默认约定，所有 shadcn/ui 组件和项目代码使用此别名
- **Alternatives considered**: 相对路径（深层次引入 `../../../` 难以维护）

### 5. Noto Sans SC + Geist 字体

- **Decision**: 中文字体 Noto Sans SC，西文/数字字体 Geist（Google Fonts）
- **Rationale**: 中英文混排场景的最佳实践 —— Geist 为 Vercel 设计、与 Next.js 深度整合，Noto Sans SC 为 Google 开源中文字体、覆盖完整
- **Alternatives considered**: 系统默认字体（各平台渲染不一致）

### 6. 全局类型枚举设计

- **Decision**: 所有类型枚举集中在 `lib/types.ts`，使用 TypeScript enum 或 const object 模式
- **Rationale**: 单一来源原则，前后端共享；枚举值为小写英文，对应数据库存储值
- **Alternatives considered**: 分散在各组件中定义（类型不一致风险）
