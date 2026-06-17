"use client";

import {
  AlertTriangle,
  ArrowUpRight,
  Building2,
  CheckCircle,
  ClipboardList,
  Clock,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { SimpleBarChart } from "@/components/simple-bar-chart";
import { StatCard } from "@/components/stat-card";
import type { TicketStats } from "@/lib/tickets";

const SEVERITY_ORDER = ["轻微", "一般", "严重", "紧急"];
const SEVERITY_COLORS: Record<string, string> = {
  轻微: "#dbeafe",
  一般: "#6b7280",
  严重: "#111827",
  紧急: "#dc2626",
};

const SEVERITY_LABEL_COLORS: Record<string, string> = {
  轻微: "text-blue-700 bg-blue-50",
  一般: "text-gray-700 bg-gray-100",
  严重: "text-gray-900 bg-gray-200",
  紧急: "text-red-700 bg-red-50",
};

export function OverviewContent({ stats }: { stats: TicketStats }) {
  const barData = SEVERITY_ORDER.map((sev) => {
    const entry = stats.severityDistribution.find((d) => d.severity === sev);
    return {
      label: sev,
      value: entry?.count ?? 0,
      color: SEVERITY_COLORS[sev] ?? "#1e5fdb",
    };
  });

  const totalSeverity = stats.severityDistribution.reduce(
    (sum, d) => sum + d.count,
    0,
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            数据大盘
          </h2>
          <p className="mt-1 text-[13px] text-muted-foreground">
            全局施工质量工单概览与趋势分析
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span>实时数据</span>
        </div>
      </div>

      {/* Stat cards row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard
          icon={Building2}
          label="项目总数"
          value={stats.projectCount}
          trend={{ value: 5, label: "较上月" }}
        />
        <StatCard
          icon={ClipboardList}
          label="工单总数"
          value={stats.totalTickets}
          trend={{ value: 12, label: "较上月", positive: true }}
        />
        <StatCard
          icon={Clock}
          label="待处理"
          value={stats.pendingCount}
          trend={{ value: -8, label: "较上月", positive: true }}
        />
        <StatCard
          icon={CheckCircle}
          label="已完成"
          value={stats.completedCount}
          trend={{ value: 15, label: "较上月", positive: true }}
        />
        <StatCard
          icon={XCircle}
          label="已拒绝"
          value={stats.rejectedCount}
          trend={{ value: -3, label: "较上月", positive: true }}
        />
        <StatCard
          icon={AlertTriangle}
          label="紧急工单"
          value={stats.urgentCount}
          accent="text-destructive"
          trend={{ value: -20, label: "较上月", positive: true }}
        />
      </div>

      {/* Charts + Activity row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Severity distribution — takes 2 cols */}
        <div className="lg:col-span-2 od-panel">
          <div className="od-panel-header">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="size-4 text-primary" />
              严重程度分布
            </h3>
            <div className="ml-auto flex items-center gap-3">
              {SEVERITY_ORDER.map((sev) => {
                const entry = stats.severityDistribution.find(
                  (d) => d.severity === sev,
                );
                return (
                  <div key={sev} className="flex items-center gap-1.5">
                    <div
                      className="w-2.5 h-2.5 rounded-sm"
                      style={{
                        backgroundColor: SEVERITY_COLORS[sev] ?? "#1e5fdb",
                      }}
                    />
                    <span className="text-[11px] text-muted-foreground">
                      {sev} {entry?.count ?? 0}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="p-5">
            <SimpleBarChart data={barData} />
          </div>
        </div>

        {/* Recent activity — takes 1 col */}
        <div className="od-panel flex flex-col">
          <div className="od-panel-header">
            <h3 className="text-sm font-semibold text-foreground">近期活动</h3>
            <button
              type="button"
              className="ml-auto text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              查看全部
              <ArrowUpRight className="size-3" />
            </button>
          </div>
          <div className="flex-1 p-4 space-y-1 overflow-y-auto">
            {[
              {
                id: 1024,
                action: "已创建",
                severity: "紧急",
                time: "2 分钟前",
                sevClass: "text-red-700 bg-red-50",
              },
              {
                id: 1023,
                action: "已完成",
                severity: "一般",
                time: "15 分钟前",
                sevClass: "text-gray-700 bg-gray-100",
              },
              {
                id: 1022,
                action: "已创建",
                severity: "严重",
                time: "1 小时前",
                sevClass: "text-gray-900 bg-gray-200",
              },
              {
                id: 1021,
                action: "已拒绝",
                severity: "轻微",
                time: "3 小时前",
                sevClass: "text-blue-700 bg-blue-50",
              },
              {
                id: 1020,
                action: "已完成",
                severity: "一般",
                time: "5 小时前",
                sevClass: "text-gray-700 bg-gray-100",
              },
            ].map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-md bg-[var(--accent-subtle)] flex items-center justify-center flex-shrink-0">
                  <ClipboardList className="size-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-foreground">
                    工单 #{item.id} {item.action}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {item.time}
                  </div>
                </div>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${item.sevClass}`}
                >
                  {item.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Severity breakdown cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {SEVERITY_ORDER.map((sev) => {
          const entry = stats.severityDistribution.find(
            (d) => d.severity === sev,
          );
          const count = entry?.count ?? 0;
          const pct =
            totalSeverity > 0 ? Math.round((count / totalSeverity) * 100) : 0;
          return (
            <div key={sev} className="od-panel p-4 flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: SEVERITY_COLORS[sev] ?? "#1e5fdb",
                }}
              >
                <span className="text-white text-sm font-bold">{count}</span>
              </div>
              <div className="min-w-0">
                <div
                  className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full inline-block ${
                    SEVERITY_LABEL_COLORS[sev] ?? ""
                  }`}
                >
                  {sev}
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">
                  占比 {pct}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          type="button"
          className="flex items-center gap-4 p-4 od-panel hover:border-primary/40 hover:bg-[var(--accent-subtle)]/30 transition-all group text-left"
        >
          <div className="w-10 h-10 rounded-lg bg-[var(--accent-subtle)] flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
            <ClipboardList className="size-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-foreground">
              创建新工单
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              快速上报质量问题
            </div>
          </div>
          <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
        </button>

        <button
          type="button"
          className="flex items-center gap-4 p-4 od-panel hover:border-primary/40 hover:bg-[var(--accent-subtle)]/30 transition-all group text-left"
        >
          <div className="w-10 h-10 rounded-lg bg-[var(--accent-subtle)] flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
            <Building2 className="size-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-foreground">
              项目管理
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              管理项目与团队成员
            </div>
          </div>
          <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
        </button>

        <button
          type="button"
          className="flex items-center gap-4 p-4 od-panel hover:border-primary/40 hover:bg-[var(--accent-subtle)]/30 transition-all group text-left"
        >
          <div className="w-10 h-10 rounded-lg bg-[var(--accent-subtle)] flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
            <CheckCircle className="size-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-foreground">
              审批中心
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              待审批事项与流程
            </div>
          </div>
          <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
        </button>
      </div>
    </div>
  );
}
