"use client";

import { useState } from "react";
import { ConversionModal } from "@/components/dashboard/conversion-modal";
import { useDashboardIdentity } from "@/components/dashboard/dashboard-identity-context";
import { ProjectChip } from "@/components/project-chip";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { TicketWithRelations } from "@/lib/tickets";

interface QAEntry {
  question: string;
  answer: string;
}

interface QAPair {
  ticketId: number;
  question: string;
  answer: string;
}

function truncate(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max)}...` : text;
}

export function KnowledgeContent({
  initialCandidates,
}: {
  initialCandidates: TicketWithRelations[];
}) {
  const identity = useDashboardIdentity();
  const [candidates, setCandidates] =
    useState<TicketWithRelations[]>(initialCandidates);
  const [qaPairs, setQaPairs] = useState<QAPair[]>([]);
  const [converting, setConverting] = useState<TicketWithRelations | null>(
    null,
  );
  const [editingQa, setEditingQa] = useState<QAPair | null>(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const openConversion = (ticket: TicketWithRelations) => {
    setConverting(ticket);
    setEditingQa(null);
  };

  const openEdit = (qa: QAPair) => {
    const ticket = candidates.find((t) => t.id === qa.ticketId);
    setConverting(ticket ?? null);
    setEditingQa(qa);
  };

  const handleSaveQa = (ticketId: number, qa: QAEntry) => {
    if (editingQa) {
      setQaPairs((prev) =>
        prev.map((p) =>
          p.ticketId === ticketId
            ? { ...p, question: qa.question, answer: qa.answer }
            : p,
        ),
      );
    } else {
      setQaPairs((prev) => [...prev, { ticketId, ...qa }]);
      setCandidates((prev) => prev.filter((t) => t.id !== ticketId));
    }
    setConverting(null);
    setEditingQa(null);
  };

  const handleDeleteQa = (ticketId: number) => {
    setQaPairs((prev) => prev.filter((p) => p.ticketId !== ticketId));
  };

  const handleExportCSV = () => {
    if (qaPairs.length === 0) return;

    const header = "question,answer";
    const rows = qaPairs.map(
      (q) =>
        `"${q.question.replace(/"/g, '""')}","${q.answer.replace(/"/g, '""')}"`,
    );
    const csv = [header, ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "knowledge-qa.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExportDialogOpen(true);
  };

  const handleConfirmExport = async () => {
    setExporting(true);
    try {
      const ticketIds = qaPairs.map((q) => q.ticketId);
      const res = await fetch("/api/knowledge/mark-converted", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketIds }),
      });
      if (res.ok) {
        setQaPairs([]);
        setExportDialogOpen(false);
      }
    } catch {
      // keep dialog open on error
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            知识运营
          </h2>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            将已完成工单转化为知识库 QA 对
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span>
            候选 {candidates.length} · QA {qaPairs.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Left: Candidate Pool */}
        <div className="od-panel">
          <div className="od-panel-header">
            <h3 className="text-[13px] font-semibold text-foreground">
              候选池
            </h3>
            <span className="ml-auto text-[11px] text-muted-foreground">
              {candidates.length} 条
            </span>
          </div>
          <div className="p-3">
            {candidates.length === 0 ? (
              <div className="py-16 text-center text-[13px] text-muted-foreground">
                <div className="text-2xl mb-2 opacity-40">📋</div>
                暂无待转化工单
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {candidates.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-[var(--border-soft)] hover:border-primary/30 transition-colors"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <span className="text-[13px] font-semibold text-primary tabular-nums shrink-0">
                        #{ticket.id}
                      </span>
                      <span
                        className={`text-[11px] font-medium shrink-0 ${
                          ticket.severity === "紧急"
                            ? "text-destructive"
                            : "text-muted-foreground"
                        }`}
                      >
                        {ticket.severity}
                      </span>
                      <ProjectChip
                        name={ticket.project.name}
                        clientName={ticket.project.client_name}
                      />
                      <span className="text-[13px] text-muted-foreground truncate hidden sm:inline">
                        {truncate(ticket.description, 24)}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-[11px] shrink-0 ml-2"
                      onClick={() => openConversion(ticket)}
                    >
                      转化
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: QA Pair List */}
        <div className="od-panel">
          <div className="od-panel-header">
            <h3 className="text-[13px] font-semibold text-foreground">
              QA 对列表
            </h3>
            <span className="ml-auto text-[11px] text-muted-foreground">
              {qaPairs.length} 条
            </span>
          </div>
          <div className="p-3">
            {qaPairs.length === 0 ? (
              <div className="py-16 text-center text-[13px] text-muted-foreground">
                <div className="text-2xl mb-2 opacity-40">📝</div>
                从左侧候选池转化工单
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {qaPairs.map((qa) => (
                  <div
                    key={qa.ticketId}
                    className="p-3 rounded-lg border border-[var(--border-soft)]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-semibold text-foreground truncate">
                          Q: {qa.question}
                        </p>
                        <p className="mt-1 text-[13px] text-muted-foreground truncate">
                          A: {qa.answer}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-[11px] text-muted-foreground hover:text-foreground"
                          onClick={() => openEdit(qa)}
                        >
                          编辑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-[11px] text-destructive"
                          onClick={() => handleDeleteQa(qa.ticketId)}
                        >
                          删除
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  variant="default"
                  size="sm"
                  className="mt-2 h-8 text-[13px]"
                  onClick={handleExportCSV}
                >
                  导出 CSV
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conversion Modal */}
      <ConversionModal
        open={converting !== null}
        onClose={() => {
          setConverting(null);
          setEditingQa(null);
        }}
        ticket={converting}
        initialQa={editingQa}
        onSave={handleSaveQa}
        userIdentity={
          identity ? { userId: identity.userId, role: identity.role } : null
        }
      />

      {/* Export Confirmation Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>请上传至扣子知识库</DialogTitle>
            <DialogDescription>
              CSV
              文件已下载。请将其上传至扣子（Coze）知识库平台，完成后点击下方按钮确认。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setExportDialogOpen(false)}
            >
              取消
            </Button>
            <Button onClick={handleConfirmExport} disabled={exporting}>
              {exporting ? "确认中..." : "已完成上传"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
