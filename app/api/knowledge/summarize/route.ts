import { NextResponse } from "next/server";
import { getIdentityFromCookie } from "@/lib/auth";
import { getTicketById } from "@/lib/tickets";

export async function POST(request: Request) {
  const identity = await getIdentityFromCookie();
  if (identity?.role !== "管理员") {
    return NextResponse.json({ error: "仅管理员可访问" }, { status: 403 });
  }

  const body = (await request.json()) as { ticketId?: number };
  const { ticketId } = body;

  if (!ticketId || Number.isNaN(ticketId)) {
    return NextResponse.json({ error: "缺少有效的 ticketId" }, { status: 400 });
  }

  const ticket = await getTicketById(ticketId);
  if (!ticket) {
    return NextResponse.json({ error: "工单不存在" }, { status: 404 });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "DEEPSEEK_API_KEY 未配置" },
      { status: 500 },
    );
  }

  // Build prompt from ticket fields
  const prompt = `请根据以下工单信息，提取一个问题和回答，形成施工质量FAQ格式。

工单编号：#${ticket.id}
问题描述：${ticket.description}
详细说明：${ticket.detail ?? "无"}
位置：${ticket.location}
根因分析：${ticket.root_cause ?? "无"}
预防措施：${ticket.prevention ?? "无"}

请输出 JSON 格式：
{
  "question": "问题（一句话）",
  "answer": "回答（包含关键信息：原因、处理方式、预防措施）"
}`;

  try {
    const response = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: process.env.AGENT_MODEL_ID ?? "deepseek-chat",
          messages: [
            {
              role: "system",
              content:
                "你是一个工程质量知识提取助手。请从工单中提取一个问题和一个答案，形成FAQ格式。只输出JSON，不要其他内容。",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      },
    );

    if (!response.ok) {
      console.error(
        "[knowledge/summarize] DeepSeek API error:",
        response.status,
        await response.text().catch(() => ""),
      );
      return NextResponse.json({ error: "AI 总结请求失败" }, { status: 502 });
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };

    const content = data.choices?.[0]?.message?.content?.trim() ?? "";
    // Extract JSON from response (may be wrapped in markdown code fences)
    const jsonMatch =
      content.match(/```(?:json)?\s*\n?([\s\S]*?)```/) ??
      content.match(/(\{[\s\S]*\})/);

    if (!jsonMatch) {
      return NextResponse.json(
        { error: "无法解析 AI 返回内容" },
        { status: 500 },
      );
    }

    const qa = JSON.parse(jsonMatch[1]);
    if (!qa.question || !qa.answer) {
      return NextResponse.json(
        { error: "AI 返回缺少 question 或 answer 字段" },
        { status: 500 },
      );
    }

    return NextResponse.json({ qa });
  } catch (err) {
    console.error("[knowledge/summarize] unexpected error:", err);
    return NextResponse.json({ error: "AI 总结服务异常" }, { status: 500 });
  }
}
