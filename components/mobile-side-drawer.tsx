"use client";

import type { LucideIcon } from "lucide-react";
import { ClipboardList, MessageSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { IdentityDialog } from "@/components/identity-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { IdentityOption } from "@/lib/types";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface MobileSideDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  userName: string;
  department: string;
  projectName: string;
  role: string;
  identities: IdentityOption[];
}

const menuItems: NavItem[] = [
  { label: "智能助手", href: "/mobile/assistant", icon: MessageSquare },
  { label: "工单列表", href: "/mobile/tickets", icon: ClipboardList },
];

export function MobileSideDrawer({
  open,
  onOpenChange,
  title,
  userName,
  department,
  projectName,
  role,
  identities,
}: MobileSideDrawerProps) {
  const pathname = usePathname();
  const [identityDialogOpen, setIdentityDialogOpen] = useState(false);

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="left"
          className="w-64 p-0 bg-card border-r border-border"
          showCloseButton={false}
        >
          {/* Header */}
          <SheetHeader className="border-b border-[var(--border-soft)] px-5 py-4">
            <SheetTitle className="text-[15px] font-bold text-foreground">
              {title}
            </SheetTitle>
            <SheetDescription className="text-[11px] text-muted-foreground">
              建筑施工质检情报员
            </SheetDescription>
          </SheetHeader>

          {/* Navigation */}
          <nav className="flex flex-col gap-0.5 px-3 py-3">
            {menuItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => onOpenChange(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-2.5 py-2 text-[13px] transition-all",
                    isActive
                      ? "bg-[var(--accent-subtle)] text-primary font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <item.icon className="size-4 flex-shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User info at bottom */}
          <div className="mt-auto border-t border-[var(--border-soft)] px-5 py-4">
            {/* Avatar + info */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                {userName.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-foreground truncate">
                  {userName}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {department} · {projectName}
                </p>
                <p className="text-[11px] text-muted-foreground">{role}</p>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              {identities.length > 1 && (
                <button
                  type="button"
                  className="text-[13px] text-primary hover:underline text-left"
                  onClick={() => setIdentityDialogOpen(true)}
                >
                  切换身份
                </button>
              )}
              <form action="/auth/signout" method="POST">
                <button
                  type="submit"
                  className="text-[13px] text-muted-foreground hover:underline"
                >
                  退出登录
                </button>
              </form>
            </div>
          </div>
        </SheetContent>
      </Sheet>

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
