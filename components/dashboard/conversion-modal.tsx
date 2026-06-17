"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { TicketDetail } from "@/components/ticket-detail";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import type { TicketWithRelations } from "@/lib/tickets";
import type { Role } from "@/lib/types";

interface QAEntry {
  question: string;
  answer: string;
}

interface ConversionModalProps {
  open: boolean;
  onClose: () => void;
  ticket: TicketWithRelations | null;
  initialQa: QAEntry | null;
  onSave: (ticketId: number, qa: QAEntry) => void;
  userIdentity: { userId: string; role: Role } | null;
}

export function ConversionModal({
  open,
  onClose,
  ticket,
  initialQa,
  onSave,
  userIdentity,
}: ConversionModalProps) {
  const [summarizing, setSummarizing] = useState(false);
  const [question, setQuestion] = useState(initialQa?.question ?? "");
  const [answer, setAnswer] = useState(initialQa?.answer ?? "");

  const handleAISummarize = async () => {
    if (!ticket) return;
    setSummarizing(true);
    try {
      const res = await fetch("/api/knowledge/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId: ticket.id }),
      });
      if (res.ok) {
        const data = (await res.json()) as { qa: QAEntry };
        setQuestion(data.qa.question);
        setAnswer(data.qa.answer);
      } else {
        const err = (await res.json()) as { error?: string };
        alert(err.error ?? "AI 总结失败");
      }
    } catch {
      alert("AI 总结请求失败，请检查网络");
    } finally {
      setSummarizing(false);
    }
  };

  const handleSave = () => {
    if (!ticket) return;
    if (!question.trim() || !answer.trim()) {
      alert("问题和回答不能为空");
      return;
    }
    onSave(ticket.id, { question: question.trim(), answer: answer.trim() });
    setQuestion("");
    setAnswer("");
  };

  // Reset form when modal opens with new ticket
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
      return;
    }
    if (initialQa) {
      setQuestion(initialQa.question);
      setAnswer(initialQa.answer);
    } else {
      setQuestion("");
      setAnswer("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[960px] max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>
            {initialQa ? "编辑 QA 对" : `转化工单 #${ticket?.id}`}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-[2fr_auto_2fr] gap-4 mt-2">
          {/* Left: TicketDetail (readonly) */}
          <div className="max-h-[60vh] overflow-auto rounded-lg bg-muted/30 p-3">
            {ticket && (
              <TicketDetail
                ticket={ticket}
                userIdentity={userIdentity}
                hideActions
              />
            )}
          </div>

          {/* Center: AI Summary trigger */}
          <div className="flex items-center justify-center px-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAISummarize}
              disabled={summarizing}
              className="flex flex-col items-center gap-1 h-auto py-3"
            >
              {summarizing ? (
                <>
                  <Spinner className="size-4" />
                  <span className="text-xs">AI 总结中…</span>
                </>
              ) : (
                <>
                  <ArrowRight className="size-4" />
                  <span className="text-xs">AI 总结</span>
                </>
              )}
            </Button>
          </div>

          {/* Right: QA form */}
          <div className="flex flex-col gap-3">
            <div>
              <Label className="text-xs">问题</Label>
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="从此工单提炼的问题"
                className="mt-1 h-8 text-sm"
              />
            </div>
            <div className="flex-1 flex flex-col">
              <Label className="text-xs">回答</Label>
              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="问题对应的回答"
                className="mt-1 flex-1 min-h-[160px] text-sm"
              />
            </div>
            <Button
              onClick={handleSave}
              disabled={summarizing}
              size="sm"
              className="self-end"
            >
              保存
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
