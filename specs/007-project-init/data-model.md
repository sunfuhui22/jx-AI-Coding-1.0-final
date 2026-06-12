# Data Model: 项目初始化

**Feature**: 007-project-init
**Date**: 2026-06-12

## Overview

阶段 1 不涉及数据库实体创建。此文件仅记录在 `lib/types.ts` 中定义的类型枚举和接口，作为后续阶段数据库实体定义的先导。

## Enums

### UserRole

| Value | Label | Description |
|-------|-------|-------------|
| `inspector` | 质检员 | 负责巡查报事，创建工单 |
| `constructor` | 施工方 | 负责处理工单，执行整改 |
| `admin` | 管理员 | 全局监控，知识运营 |

### TicketStatus

| Value | Label | Description |
|-------|-------|-------------|
| `pending` | 待处理 | 工单已创建，等待施工方处理 |
| `completed` | 已完成 | 工单问题已整改完成 |
| `rejected` | 已拒绝 | 施工方拒绝工单（附原因） |

### Severity

| Value | Label | Description |
|-------|-------|-------------|
| `critical` | 严重 | 涉及安全或结构问题 |
| `major` | 一般 | 常见质量问题 |
| `minor` | 轻微 | 外观或小缺陷 |

### TradeType

| Value | Label | Description |
|-------|-------|-------------|
| `civil` | 土建 | 混凝土、砌体、钢筋等 |
| `electrical` | 电气 | 强电、弱电、照明等 |
| `plumbing` | 水暖 | 给排水、暖通等 |
| `decoration` | 装饰 | 涂料、瓷砖、吊顶等 |
| `other` | 其他 | 未分类专业 |

## Interfaces

```typescript
// 后续阶段将根据数据库表结构补充完整 interface
// 阶段 1 仅定义枚举，不定义数据实体 interface
```

## Notes

- 枚举值统一使用小写英文，与 Supabase 数据库字段存储值一致
- 阶段 2 将基于这些枚举创建 `profiles`、`projects`、`user_roles`、`tickets` 表
- `ticket_logs` 表（变更记录）也在阶段 3 创建
