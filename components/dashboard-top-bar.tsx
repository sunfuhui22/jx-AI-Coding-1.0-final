"use client";

import { Bell, ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { IdentityDialog } from "@/components/identity-dialog";
import { UserAvatarChip } from "@/components/user-avatar-chip";
import type { IdentityOption } from "@/lib/types";

const breadcrumbMap: Record<string, string> = {
  "/dashboard/overview": "数据大盘",
  "/dashboard/tickets": "工单中心",
  "/dashboard/knowledge": "知识运营",
};

interface DashboardTopBarProps {
  userName: string;
  department: string;
  identities: IdentityOption[];
}

export function DashboardTopBar({
  userName,
  department,
  identities,
}: DashboardTopBarProps) {
  const pathname = usePathname();
  const currentPageName = breadcrumbMap[pathname] ?? "数据大盘";
  const [identityDialogOpen, setIdentityDialogOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="flex h-[52px] items-center gap-4 bg-card px-5 border-b border-border shrink-0">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[13px]">
          <Link
            href="/dashboard/overview"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            首页
          </Link>
          <ChevronRight className="size-3.5 text-muted-foreground/60" />
          <span className="font-medium text-foreground">{currentPageName}</span>
        </nav>

        {/* Search */}
        <div className="flex-1 max-w-[340px] relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索工单、项目、知识库…"
            className="w-full h-[34px] pl-8 pr-3 text-[13px] border border-[var(--border-soft)] rounded-md bg-background text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary focus:ring-[var(--focus-ring)]"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            type="button"
            className="relative w-[34px] h-[34px] rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            title="通知"
          >
            <Bell className="size-4" />
            <span className="absolute top-1.5 right-1.5 w-[7px] h-[7px] rounded-full bg-danger border-2 border-card" />
          </button>

          {/* User info */}
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-md hover:bg-muted transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <UserAvatarChip name={userName} department={department} compact />
            </button>

            {menuOpen && (
              <>
                <button
                  type="button"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setMenuOpen(false)}
                  aria-label="关闭菜单"
                />
                <div className="absolute right-0 top-full z-50 mt-1 w-40 rounded-lg border border-border bg-card py-1 shadow-lg">
                  {identities.length > 1 && (
                    <button
                      type="button"
                      className="w-full px-3 py-2 text-left text-[13px] text-foreground hover:bg-muted transition-colors"
                      onClick={() => {
                        setMenuOpen(false);
                        setIdentityDialogOpen(true);
                      }}
                    >
                      切换身份
                    </button>
                  )}
                  <form action="/auth/signout" method="POST">
                    <button
                      type="submit"
                      className="w-full px-3 py-2 text-left text-[13px] text-muted-foreground hover:bg-muted transition-colors"
                    >
                      退出登录
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {identities.length > 1 && (
        <IdentityDialog
          open={identityDialogOpen}
          onOpenChange={setIdentityDialogOpen}
          identities={identities}
          mode="switch"
        />
      )}
    </>
  );
}
