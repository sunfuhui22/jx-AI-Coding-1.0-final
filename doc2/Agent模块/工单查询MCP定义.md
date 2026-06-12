# 工单查询 MCP 定义

## 概述

工单查询通过 MCP 协议实现，主 Agent 直接调用即可获取工单数据。纯读操作，不需要 Human-In-The-Loop。

使用 LangChain 的 stdio MCP 实现，每次 Agent 启动时启动 MCP 服务器，结束后自动停止。

## 工具定义

```json
{
  "name": "queryTicket",
  "description": "查询当前项目下的工单信息，支持按状态和关键词筛选",
  "parameters": {
    "type": "object",
    "properties": {
      "ticket_id": {
        "type": "integer",
        "description": "工单ID，精确查询指定工单（可选）"
      },
      "status": {
        "type": "string",
        "enum": ["待处理", "已完成", "已拒绝"],
        "description": "按状态筛选（可选）"
      },
      "keyword": {
        "type": "string",
        "description": "关键词搜索，匹配问题描述（可选）"
      },
      "assigned_to_me": {
        "type": "boolean",
        "description": "是否只查我负责的工单（默认false）"
      }
    }
  }
}
```

## 返回格式

```json
{
  "tickets": [
    {
      "id": 1,
      "status": "待处理",
      "severity": "严重",
      "specialty_type": "结构专业",
      "description": "3#楼标准层梁底裂缝",
      "location": "东区一期-3#住宅楼-标准层",
      "assignee": "张工",
      "created_at": "2026-03-15T10:30:00"
    }
  ],
  "total": 1
}
```

## 权限

继承当前用户身份，只能查询当前项目下的工单，不能编辑。

> 工单的写操作（创建、解决、拒绝、指派、重新打开、编辑）统一通过 Next.js 后端 API 完成，不走 MCP 通道。MCP 仅用于只读查询。

## 实现要点

- 本地 stdio MCP server 文件：`mcp/ticket-query-server.mjs`
- Agent 侧客户端：`lib/agent/mcp-client.ts`（`MultiServerMCPClient` 单例管理）
- 用户身份通过 `supabase_access_token` 透传，确保查询范围限定在当前项目

## 相关文档

- [Agent 整体设计](整体设计.md) — 工具调度与意图路由
- [工单创建 HITL Tool 定义](工单创建HITL_tool定义.md) — 写操作走后端 API
