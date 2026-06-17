"use client";

import { Search, X } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Project, Severity, TicketStatus } from "@/lib/types";

export interface FilterValues {
  projectId?: number;
  statuses: string[];
  severities: string[];
  specialtyType?: string;
  keyword: string;
}

interface TicketFilterBarProps {
  projects: Project[];
  onFilterChange: (filters: FilterValues) => void;
}

const STATUS_OPTIONS: { label: string; value: TicketStatus }[] = [
  { label: "待处理", value: "待处理" },
  { label: "已完成", value: "已完成" },
  { label: "已拒绝", value: "已拒绝" },
];

const SEVERITY_OPTIONS: { label: string; value: Severity }[] = [
  { label: "轻微", value: "轻微" },
  { label: "一般", value: "一般" },
  { label: "严重", value: "严重" },
  { label: "紧急", value: "紧急" },
];

const SPECIALTY_OPTIONS = [
  { label: "全部专业", value: "_all" },
  { label: "建筑设计专业", value: "建筑设计专业" },
  { label: "结构专业", value: "结构专业" },
  { label: "给排水专业", value: "给排水专业" },
];

function ChipGroup({
  options,
  selected,
  onToggle,
}: {
  options: { label: string; value: string }[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const active = selected.includes(opt.value);
        return (
          <button
            type="button"
            key={opt.value}
            onClick={() => onToggle(opt.value)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-full border transition-all ${
              active
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-transparent text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function TicketFilterBar({
  projects,
  onFilterChange,
}: TicketFilterBarProps) {
  const [projectId, setProjectId] = useState<string>("_all");
  const [statuses, setStatuses] = useState<string[]>([]);
  const [severities, setSeverities] = useState<string[]>([]);
  const [specialtyType, setSpecialtyType] = useState<string>("_all");
  const [keyword, setKeyword] = useState("");

  const emit = useCallback(
    (overrides: Partial<FilterValues>) => {
      const current = {
        projectId: projectId !== "_all" ? Number(projectId) : undefined,
        statuses,
        severities,
        specialtyType: specialtyType !== "_all" ? specialtyType : undefined,
        keyword,
        ...overrides,
      };
      onFilterChange(current);
    },
    [projectId, statuses, severities, specialtyType, keyword, onFilterChange],
  );

  const toggleStatus = (v: string) => {
    const next = statuses.includes(v)
      ? statuses.filter((s) => s !== v)
      : [...statuses, v];
    setStatuses(next);
    emit({ statuses: next });
  };

  const toggleSeverity = (v: string) => {
    const next = severities.includes(v)
      ? severities.filter((s) => s !== v)
      : [...severities, v];
    setSeverities(next);
    emit({ severities: next });
  };

  const clearAll = () => {
    setProjectId("_all");
    setStatuses([]);
    setSeverities([]);
    setSpecialtyType("_all");
    setKeyword("");
    onFilterChange({
      projectId: undefined,
      statuses: [],
      severities: [],
      specialtyType: undefined,
      keyword: "",
    });
  };

  const hasFilters =
    projectId !== "_all" ||
    statuses.length > 0 ||
    severities.length > 0 ||
    specialtyType !== "_all" ||
    keyword !== "";

  return (
    <div className="od-panel p-4">
      {/* Top row: dropdowns + search */}
      <div className="flex flex-wrap items-center gap-2.5">
        <Select
          value={projectId}
          onValueChange={(v) => {
            setProjectId(v);
            emit({ projectId: v !== "_all" ? Number(v) : undefined });
          }}
        >
          <SelectTrigger className="w-[150px] h-8 text-[13px]">
            <SelectValue placeholder="全部项目" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">全部项目</SelectItem>
            {projects.map((p) => (
              <SelectItem key={p.id} value={String(p.id)}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={specialtyType}
          onValueChange={(v) => {
            setSpecialtyType(v);
            emit({ specialtyType: v !== "_all" ? v : undefined });
          }}
        >
          <SelectTrigger className="w-[150px] h-8 text-[13px]">
            <SelectValue placeholder="全部专业" />
          </SelectTrigger>
          <SelectContent>
            {SPECIALTY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative flex-1 min-w-[200px] max-w-[300px]">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索工单编号或描述…"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              emit({ keyword: e.target.value });
            }}
            className="h-8 pl-8 pr-8 text-[13px]"
          />
          {keyword && (
            <button
              type="button"
              onClick={() => {
                setKeyword("");
                emit({ keyword: "" });
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3" />
            </button>
          )}
        </div>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-8 text-[11px] text-muted-foreground hover:text-foreground"
          >
            清除
          </Button>
        )}
      </div>

      {/* Bottom row: chips */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3 pt-3 border-t border-[var(--border-soft)]">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-muted-foreground shrink-0">
            状态
          </span>
          <ChipGroup
            options={STATUS_OPTIONS}
            selected={statuses}
            onToggle={toggleStatus}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-muted-foreground shrink-0">
            严重程度
          </span>
          <ChipGroup
            options={SEVERITY_OPTIONS}
            selected={severities}
            onToggle={toggleSeverity}
          />
        </div>
      </div>
    </div>
  );
}
