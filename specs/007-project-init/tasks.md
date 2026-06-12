# Tasks: 项目初始化

**Input**: Design documents from `/specs/007-project-init/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: 未请求 — MVP 阶段不写测试（constitution 原则 I）

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project scaffold and dependency installation

- [x] T001 Scaffold Next.js 16 project with TypeScript using `npx create-next-app@latest` with App Router, src/ disabled, Tailwind CSS enabled
- [x] T002 [P] Install UI dependencies: `npm install shadcn lucide-react class-variance-authority clsx tailwind-merge`
- [x] T003 [P] Install dev tooling: `npm install -D @biomejs/biome typescript @types/react @types/react-dom @types/node`
- [x] T004 Configure tsconfig.json with `strict: true` and path alias `@/*` → project root
- [x] T005 Initialize Biome configuration in biome.json with recommended rules

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Create postcss.config.mjs with `@tailwindcss/postcss` plugin
- [x] T007 Create app/globals.css — import Tailwind v4 via `@import "tailwindcss"`, define empty shadcn/ui CSS variable block
- [x] T008 Create lib/utils.ts with `cn()` utility function using `clsx` and `tailwind-merge`
- [x] T009 Initialize shadcn/ui — create components.json with radix-nova style, neutral base color, CSS variables enabled
- [x] T010 Create app/layout.tsx — root layout importing Geist and Noto Sans SC from `next/font/google`, `<html lang="zh-CN">`, render `children` in `<body>`

**Checkpoint**: Foundation ready — user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - 项目骨架与首页入口 (Priority: P1) 🎯 MVP

**Goal**: 用户访问根路径 `/` 时看到首页，包含移动端和 PC 后台两个入口按钮

**Independent Test**: `npm run dev` 后访问 `localhost:3000`，能看到两个大按钮，分别跳转到 `/mobile` 和 `/dashboard`

### Implementation for User Story 1

- [x] T011 [US1] Create app/page.tsx — home page with two large navigation buttons linking to `/mobile` and `/dashboard`, Chinese labels「移动端入口」and「PC 后台入口」

**Checkpoint**: Home page functional — users can see entry points and navigate to both ends

---

## Phase 4: User Story 2 - 路由骨架搭建 (Priority: P1)

**Goal**: 全部核心路由可访问（即使内容为占位），返回 HTTP 200

**Independent Test**: 分别访问 `/login`、`/mobile/assistant`、`/mobile/tickets`、`/mobile/tickets/1`、`/dashboard/overview`、`/dashboard/tickets`、`/dashboard/knowledge`，全部返回 200

### Implementation for User Story 2

- [x] T012 [P] [US2] Create app/login/page.tsx — login page placeholder with title text
- [x] T013 [P] [US2] Create app/mobile/layout.tsx — mobile layout wrapper with simple children render
- [x] T014 [P] [US2] Create app/mobile/assistant/page.tsx — agent assistant page placeholder
- [x] T015 [P] [US2] Create app/mobile/tickets/page.tsx — ticket list page placeholder
- [x] T016 [P] [US2] Create app/mobile/tickets/[id]/page.tsx — ticket detail page placeholder (accept `params` as Promise per Next.js 16)
- [x] T017 [P] [US2] Create app/dashboard/layout.tsx — dashboard layout wrapper with simple children render
- [x] T018 [P] [US2] Create app/dashboard/overview/page.tsx — overview dashboard page placeholder
- [x] T019 [P] [US2] Create app/dashboard/tickets/page.tsx — ticket center page placeholder
- [x] T020 [P] [US2] Create app/dashboard/knowledge/page.tsx — knowledge management page placeholder

**Checkpoint**: All 8 core routes accessible — 200 for every path listed in FR-008

---

## Phase 5: User Story 3 - 全局类型定义 (Priority: P1)

**Goal**: `lib/types.ts` 包含所有核心枚举，TypeScript 智能提示正常工作

**Independent Test**: 从 `@/lib/types` 导入任意枚举，编辑器提供完整类型提示，`tsc --noEmit` 通过

### Implementation for User Story 3

- [x] T021 [US3] Create lib/types.ts — define and export enums: `UserRole` (inspector/constructor/admin), `TicketStatus` (pending/completed/rejected), `Severity` (critical/major/minor), `TradeType` (civil/electrical/plumbing/decoration/other)

**Checkpoint**: Type definitions complete — all modules can import shared types

---

## Phase 6: User Story 4 - 全局样式与设计系统 (Priority: P2)

**Goal**: 系统界面呈现统一的白底浅蓝简约风格，无粗实线边框

**Independent Test**: 访问任意页面，视觉确认白色背景、浅蓝主色调、无渐变/重阴影/粗黑边框

### Implementation for User Story 4

- [x] T022 [US4] Populate app/globals.css with Stitch design system CSS custom properties (`--stitch-*` tokens) per DESIGN.md — white background, light blue primary palette, no-border rules
- [x] T023 [P] [US4] Install shadcn/ui base components via `npx shadcn add button` — at minimum button component for home page navigation

**Checkpoint**: Design system foundation in place — consistent visual language across all pages

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup

- [x] T024 Run `npm run format` to auto-fix formatting across all created files
- [x] T025 Run `npx tsc --noEmit` and `npx biome check` — fix any errors until both pass with zero errors
- [x] T026 Run `npm run build` — verify production build completes without errors
- [x] T027 Validate all items in quickstart.md verification checklist pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US3 (Types) and US4 (Styles) are independent and can run in parallel with US1/US2
  - US1 (Home) is the MVP — prioritize first
  - US2 (Routes) can run in parallel with US1
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational — No dependencies on other stories. **This is the MVP.**
- **User Story 2 (P1)**: Can start after Foundational — Independent from US1 (different files)
- **User Story 3 (P1)**: Can start after Foundational — Independent from US1/US2 (different files)
- **User Story 4 (P2)**: Can start after Foundational — Independent; builds on US1/US2 styling

### Within Each User Story

- No tests (MVP phase)
- Types definition (US3) is a single-file task
- All route page tasks in US2 are independent and parallelizable

### Parallel Opportunities

- **Phase 1**: T002, T003 can run in parallel (different package groups)
- **Phase 2**: T006, T008 can run in parallel (different files)
- **Phase 4 (US2)**: All 9 route tasks (T012-T020) can run in parallel — each creates a different file
- **Phase 3-6**: US1, US2, US3, US4 can all start in parallel after Foundational completes
- **Phase 7**: T024 can run in parallel with T025 and T026

---

## Parallel Example: User Story 2 (Route Skeleton)

```bash
# All route pages are independent files — launch together:
Task: "Create app/login/page.tsx — login page placeholder"
Task: "Create app/mobile/layout.tsx — mobile layout wrapper"
Task: "Create app/mobile/assistant/page.tsx — agent assistant page"
Task: "Create app/mobile/tickets/page.tsx — ticket list page"
Task: "Create app/mobile/tickets/[id]/page.tsx — ticket detail page"
Task: "Create app/dashboard/layout.tsx — dashboard layout wrapper"
Task: "Create app/dashboard/overview/page.tsx — overview page"
Task: "Create app/dashboard/tickets/page.tsx — ticket center page"
Task: "Create app/dashboard/knowledge/page.tsx — knowledge page"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 (Home page)
4. **STOP and VALIDATE**: `npm run dev` → verify home page with two entry buttons
5. Ready for demo of project entry point

### Incremental Delivery

1. Setup + Foundational → Project skeleton ready
2. Add US1 (Home page) → Test → MVP: users can see entry points
3. Add US2 (Routes) → Test → All pages navigable
4. Add US3 (Types) → Test → Shared type definitions available
5. Add US4 (Styles) → Test → Consistent visual design
6. Polish → Validate → Ready for Phase 2 development

### Parallel Team Strategy

With 3 developers after Foundational completes:
- Developer A: User Story 1 (Home page) + User Story 4 (Styles)
- Developer B: User Story 2 (Route skeleton — 9 pages)
- Developer C: User Story 3 (Global types)
All merge independently into Foundational base.

---

## Notes

- [P] tasks = different files, no dependencies — safe to parallelize
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- No test tasks — MVP phase per constitution principle I
- Commit after each phase completion
- Stop at any checkpoint to validate that story independently
- Next.js 16 dynamic route params are Promise — use `await params` in `[id]/page.tsx`
- All user-facing text in Chinese per constitution
