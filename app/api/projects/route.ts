import { NextResponse } from "next/server";
import { getIdentityFromCookie } from "@/lib/auth";
import { getAllProjects } from "@/lib/tickets";

export async function GET() {
  const identity = await getIdentityFromCookie();
  if (identity?.role !== "管理员") {
    return NextResponse.json({ error: "仅管理员可访问" }, { status: 403 });
  }

  const projects = await getAllProjects();
  return NextResponse.json({ projects });
}
