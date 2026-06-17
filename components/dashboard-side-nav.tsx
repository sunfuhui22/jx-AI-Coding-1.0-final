"use client";

import type { LucideIcon } from "lucide-react";
import { BarChart3, BookOpen, ClipboardList, Construction } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number | string;
}

const mainNavItems: NavItem[] = [
  {
    label: "数据大盘",
    href: "/dashboard/overview",
    icon: BarChart3,
  },
  {
    label: "工单中心",
    href: "/dashboard/tickets",
    icon: ClipboardList,
    badge: 12,
  },
  {
    label: "知识运营",
    href: "/dashboard/knowledge",
    icon: BookOpen,
  },
];

export function DashboardSideNav() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[220px] flex-col bg-card border-r border-border shrink-0">
      {/* Brand area */}
      <div className="flex items-center gap-2.5 h-[52px] px-4 border-b border-[var(--border-soft)]">
        <div className="w-7 h-7 rounded-md bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center flex-shrink-0">
          <Construction className="size-4 text-white" />
        </div>
        <span className="text-[15px] font-bold text-foreground tracking-tight whitespace-nowrap">
          质检情报员
        </span>
      </div>

      {/* Section: 管理导航 */}
      <div className="px-3 pt-3">
        <div className="od-section-label">管理导航</div>
        <nav className="flex flex-col gap-0.5">
          {mainNavItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn("od-nav-item", isActive && "active")}
              >
                <item.icon className="size-4 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge !== undefined && (
                  <span className="ml-auto text-[11px] px-1.5 py-px rounded-full font-semibold bg-muted text-muted-foreground">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Footer stats */}
      <div className="p-3 mx-3 mb-3 rounded-lg bg-muted/40 border border-[var(--border-soft)]">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-success" />
          <span className="text-[11px] text-muted-foreground font-medium">
            系统运行中
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="text-lg font-bold text-foreground">24</div>
            <div className="text-[11px] text-muted-foreground">今日新增</div>
          </div>
          <div>
            <div className="text-lg font-bold text-primary">18</div>
            <div className="text-[11px] text-muted-foreground">今日处理</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
