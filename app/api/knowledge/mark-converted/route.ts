import { NextResponse } from "next/server";
import { getIdentityFromCookie } from "@/lib/auth";
import { setKnowledgeBaseFlags } from "@/lib/tickets";

export async function PATCH(request: Request) {
  const identity = await getIdentityFromCookie();
  if (identity?.role !== "管理员") {
    return NextResponse.json({ error: "仅管理员可访问" }, { status: 403 });
  }

  const body = (await request.json()) as { ticketIds?: number[] };
  const { ticketIds } = body;

  if (!ticketIds || ticketIds.length === 0) {
    return NextResponse.json(
      { error: "缺少有效的 ticketIds" },
      { status: 400 },
    );
  }

  const count = await setKnowledgeBaseFlags(ticketIds);
  return NextResponse.json({ success: true, count });
}
