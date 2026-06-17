"use client";

import { useCallback, useState } from "react";
import { useDashboardIdentity } from "@/components/dashboard/dashboard-identity-context";
import { ProjectChip } from "@/components/project-chip";
import { type Column, SimpleDataTable } from "@/components/simple-data-table";
import { TicketDetail } from "@/components/ticket-detail";
import {
  type FilterValues,
  TicketFilterBar,
} from "@/components/ticket-filter-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UserAvatarChip } from "@/components/user-avatar-chip";
import type { TicketWithRelations } from "@/lib/tickets";
import type { Project, TicketStatus } from "@/lib/types";

const statusVariantMap: Record<
  TicketStatus,
  "default" | "secondary" | "destructive"
> = {
  待处理: "secondary",
  已完成: "default",
  已拒绝: "destructive",
};

function truncate(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max)}...` : text;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface TicketsContentProps {
  projects: Project[];
  initialTickets: TicketWithRelations[];
}

export function TicketsContent({
  projects,
  initialTickets,
}: TicketsContentProps) {
  const identity = useDashboardIdentity();
  const [tickets, setTickets] = useState<TicketWithRelations[]>(initialTickets);
  const [loading, setLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] =
    useState<TicketWithRelations | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleFilterChange = useCallback(async (filters: FilterValues) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.projectId) params.set("projectId", String(filters.projectId));
      if (filters.statuses.length > 0)
        params.set("statuses", filters.statuses.join(","));
      if (filters.severities.length > 0)
        params.set("severities", filters.severities.join(","));
      if (filters.specialtyType)
        params.set("specialty_type", filters.specialtyType);
      if (filters.keyword) params.set("keyword", filters.keyword);

      const res = await fetch(`/api/tickets?${params.toString()}`);
      if (res.ok) {
        const data = (await res.json()) as { tickets: TicketWithRelations[] };
        setTickets(data.tickets);
      }
    } catch {
      // keep current tickets on error
    } finally {
      setLoading(false);
    }
  }, []);

  const openDetail = (ticket: TicketWithRelations) => {
    setSelectedTicket(ticket);
    setSheetOpen(true);
  };

  const columns: Column<TicketWithRelations>[] = [
    {
      key: "id",
      header: "编号",
      render: (t) => (
        <button
          type="button"
          className="text-primary text-[13px] font-semibold hover:underline tabular-nums"
          onClick={() => openDetail(t)}
        >
          #{t.id}
        </button>
      ),
      width: "72px",
    },
    {
      key: "status",
      header: "状态",
      render: (t) => (
        <Badge variant={statusVariantMap[t.status]} className="text-[11px]">
          {t.status}
        </Badge>
      ),
      width: "72px",
    },
    {
      key: "severity",
      header: "严重程度",
      render: (t) => (
        <span
          className={`text-[13px] ${
            t.severity === "紧急"
              ? "font-semibold text-destructive"
              : t.severity === "严重"
                ? "font-semibold text-foreground"
                : "text-muted-foreground"
          }`}
        >
          {t.severity}
        </span>
      ),
      width: "72px",
    },
    {
      key: "project",
      header: "项目",
      render: (t) => (
        <ProjectChip name={t.project.name} clientName={t.project.client_name} />
      ),
      width: "140px",
    },
    {
      key: "specialty_type",
      header: "专业类型",
      render: (t) => (
        <span className="text-[13px] text-muted-foreground">
          {t.specialty_type}
        </span>
      ),
      width: "120px",
    },
    {
      key: "description",
      header: "问题描述",
      render: (t) => (
        <span className="text-[13px]" title={t.description}>
          {truncate(t.description, 28)}
        </span>
      ),
    },
    {
      key: "created_at",
      header: "创建时间",
      render: (t) => (
        <span className="text-[13px] text-muted-foreground tabular-nums">
          {formatTime(t.created_at)}
        </span>
      ),
      width: "140px",
    },
    {
      key: "assignee",
      header: "责任人",
      render: (t) => (
        <UserAvatarChip
          name={t.assignee.name}
          department={t.assignee.department}
          compact
        />
      ),
      width: "100px",
    },
    {
      key: "creator",
      header: "发起人",
      render: (t) => (
        <UserAvatarChip
          name={t.creator.name}
          department={t.creator.department}
          compact
        />
      ),
      width: "100px",
    },
    {
      key: "actions",
      header: "",
      render: (t) => (
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-[11px]"
          onClick={() => openDetail(t)}
        >
          详情
        </Button>
      ),
      width: "60px",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            工单中心
          </h2>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            共 {tickets.length} 条工单
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <div className="od-stat-pill">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            运行中
          </div>
        </div>
      </div>

      <TicketFilterBar
        projects={projects}
        onFilterChange={handleFilterChange}
      />

      {loading && (
        <div className="flex items-center gap-2 text-[13px] text-muted-foreground px-1">
          <span className="size-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" />
          加载中…
        </div>
      )}

      <SimpleDataTable
        columns={columns}
        rows={tickets}
        getRowKey={(t) => t.id}
        rowClassName={(t) =>
          t.severity === "紧急" ? "bg-destructive/[0.03]" : ""
        }
        emptyText="暂无符合条件的工单"
      />

      {/* Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="right"
          className="w-[480px] max-w-[90vw] overflow-auto p-0"
        >
          <SheetHeader className="px-5 py-4 border-b border-[var(--border-soft)]">
            <SheetTitle className="text-base font-semibold">
              工单 #{selectedTicket?.id}
            </SheetTitle>
          </SheetHeader>
          <div className="px-5 py-4">
            {selectedTicket && (
              <TicketDetail
                ticket={selectedTicket}
                userIdentity={
                  identity
                    ? { userId: identity.userId, role: identity.role }
                    : null
                }
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
