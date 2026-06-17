import { NextResponse } from "next/server";
import { getIdentityFromCookie } from "@/lib/auth";
import { getTicketStats } from "@/lib/tickets";

export async function GET() {
  const identity = await getIdentityFromCookie();
  if (identity?.role !== "管理员") {
    return NextResponse.json({ error: "仅管理员可访问" }, { status: 403 });
  }

  const stats = await getTicketStats();
  return NextResponse.json({ stats });
}
