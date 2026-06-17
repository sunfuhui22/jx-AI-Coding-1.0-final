"use client";

import { ArrowLeft, Construction, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileTopBarProps {
  title: string;
  onMenuClick: () => void;
  showBack?: boolean;
  onBack?: () => void;
}

export function MobileTopBar({
  title,
  onMenuClick,
  showBack = false,
  onBack,
}: MobileTopBarProps) {
  return (
    <header className="flex h-12 items-center bg-card px-4 border-b border-[var(--border-soft)] shrink-0">
      {showBack ? (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onBack}
          aria-label="返回"
        >
          <ArrowLeft />
        </Button>
      ) : (
        <>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onMenuClick}
            aria-label="打开菜单"
          >
            <Menu />
          </Button>
          <div className="ml-2 flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center">
              <Construction className="size-3.5 text-white" />
            </div>
            <h1 className="text-sm font-bold text-foreground tracking-tight">
              {title}
            </h1>
          </div>
        </>
      )}
      {showBack && (
        <h1 className="ml-2 text-sm font-bold text-foreground">{title}</h1>
      )}
    </header>
  );
}
