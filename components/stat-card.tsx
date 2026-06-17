import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  accent?: string;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
}

export function StatCard({
  icon: Icon,
  label,
  value,
  accent,
  trend,
}: StatCardProps) {
  const isPositiveTrend =
    trend && (trend.positive !== false ? trend.value >= 0 : trend.value < 0);

  return (
    <div className="od-panel p-4 hover:border-primary/30 transition-colors cursor-default">
      <div className="flex items-center gap-2">
        <div
          className={`w-8 h-8 rounded-md flex items-center justify-center ${
            accent ? "bg-destructive/10" : "bg-[var(--accent-subtle)]"
          }`}
        >
          <Icon className={`size-4 ${accent ?? "text-primary"}`} />
        </div>
        <span className="text-[13px] text-muted-foreground font-medium">
          {label}
        </span>
      </div>
      <div className="mt-3 flex items-end justify-between">
        <p
          className={`text-[28px] font-bold leading-none tracking-tight ${
            accent ?? "text-foreground"
          }`}
        >
          {typeof value === "number" ? value.toLocaleString("zh-CN") : value}
        </p>
        {trend && (
          <div
            className={`flex items-center gap-1 text-[11px] font-semibold ${
              isPositiveTrend ? "text-success" : "text-destructive"
            }`}
          >
            {trend.value >= 0 ? (
              <TrendingUp className="size-3" />
            ) : (
              <TrendingDown className="size-3" />
            )}
            <span>
              {trend.value >= 0 ? "+" : ""}
              {trend.value}% {trend.label}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
