import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import type {
  Profile,
  Project,
  Severity,
  SpecialtyType,
  Ticket,
  TicketStatus,
} from "@/lib/types";

// Joined ticket type for API responses
export interface TicketWithRelations extends Ticket {
  creator: Pick<Profile, "id" | "name" | "department" | "avatar_url">;
  assignee: Pick<Profile, "id" | "name" | "department" | "avatar_url">;
  project: Pick<Project, "id" | "name" | "client_name">;
}

const RELATION_FIELDS = `
  id,
  status,
  severity,
  created_at,
  creator_id,
  project_id,
  assignee_id,
  specialty_type,
  description,
  location,
  images,
  detail,
  root_cause,
  prevention,
  knowledge_base,
  creator:profiles!creator_id (id, name, department, avatar_url),
  assignee:profiles!assignee_id (id, name, department, avatar_url),
  project:projects!project_id (id, name, client_name)
`;

export async function getTicketById(
  id: number,
): Promise<TicketWithRelations | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tickets")
    .select(RELATION_FIELDS)
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return flattenRelations(data);
}

export async function getTicketsByProject(
  projectId: number,
): Promise<TicketWithRelations[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tickets")
    .select(RELATION_FIELDS)
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map(flattenRelations);
}

// —— Dashboard / Admin queries (service-role for cross-project access) ——

export interface TicketStats {
  projectCount: number;
  totalTickets: number;
  pendingCount: number;
  completedCount: number;
  rejectedCount: number;
  urgentCount: number;
  severityDistribution: { severity: string; count: number }[];
}

export async function getTicketStats(): Promise<TicketStats> {
  const supabase = createServiceRoleClient();

  const [{ count: projectCount }, { data: tickets, error: ticketErr }] =
    await Promise.all([
      supabase.from("projects").select("*", { count: "exact", head: true }),
      supabase.from("tickets").select("status, severity"),
    ]);

  const stats: TicketStats = {
    projectCount: projectCount ?? 0,
    totalTickets: 0,
    pendingCount: 0,
    completedCount: 0,
    rejectedCount: 0,
    urgentCount: 0,
    severityDistribution: [],
  };

  if (ticketErr || !tickets) return stats;

  const severityMap = new Map<string, number>();
  for (const t of tickets) {
    stats.totalTickets++;
    if (t.status === "待处理") stats.pendingCount++;
    else if (t.status === "已完成") stats.completedCount++;
    else if (t.status === "已拒绝") stats.rejectedCount++;
    if (t.severity === "紧急") stats.urgentCount++;
    severityMap.set(t.severity, (severityMap.get(t.severity) ?? 0) + 1);
  }

  stats.severityDistribution = Array.from(severityMap.entries()).map(
    ([severity, count]) => ({ severity, count }),
  );

  return stats;
}

export async function getAllProjects(): Promise<Project[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("projects")
    .select("id, name, city, client_name, type")
    .order("name");

  if (error || !data) return [];
  return data;
}

export interface TicketFilters {
  projectId?: number;
  statuses?: string[];
  severities?: string[];
  specialtyType?: string;
  keyword?: string;
}

export async function getAllTickets(
  filters: TicketFilters = {},
): Promise<TicketWithRelations[]> {
  const supabase = createServiceRoleClient();
  let query = supabase.from("tickets").select(RELATION_FIELDS);

  if (filters.projectId !== undefined) {
    query = query.eq("project_id", filters.projectId);
  }
  if (filters.statuses && filters.statuses.length > 0) {
    query = query.in("status", filters.statuses);
  }
  if (filters.severities && filters.severities.length > 0) {
    query = query.in("severity", filters.severities);
  }
  if (filters.specialtyType) {
    query = query.eq("specialty_type", filters.specialtyType);
  }
  if (filters.keyword) {
    const kw = filters.keyword;
    // Match description (ILIKE) or exact ticket id
    const ticketId = Number(kw);
    if (!Number.isNaN(ticketId)) {
      query = query.or(`description.ilike.*${kw}*,id.eq.${ticketId}`);
    } else {
      query = query.ilike("description", `%${kw}%`);
    }
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map(flattenRelations);
}

export async function getKnowledgeCandidates(): Promise<TicketWithRelations[]> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("tickets")
    .select(RELATION_FIELDS)
    .eq("status", "已完成")
    .not("prevention", "is", null)
    .neq("prevention", "")
    .eq("knowledge_base", false)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map(flattenRelations);
}

export async function setKnowledgeBaseFlags(
  ticketIds: number[],
): Promise<number> {
  if (ticketIds.length === 0) return 0;
  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from("tickets")
    .update({ knowledge_base: true })
    .in("id", ticketIds);

  if (error) {
    console.error("[setKnowledgeBaseFlags] update failed:", error);
    return 0;
  }
  return ticketIds.length;
}

interface CreateTicketInput {
  severity: Severity;
  project_id: number;
  assignee_id: string;
  specialty_type: SpecialtyType;
  description: string;
  location: string;
  detail?: string;
  images?: string[];
}

export async function createTicket(
  creatorId: string,
  input: CreateTicketInput,
): Promise<TicketWithRelations | null> {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("tickets")
    .insert({
      creator_id: creatorId,
      status: "待处理",
      ...input,
      detail: input.detail ?? "",
      images: input.images ?? [],
    })
    .select(RELATION_FIELDS)
    .single();

  if (error || !data) {
    if (error) console.error("[createTicket] insert failed:", error);
    return null;
  }
  return flattenRelations(data);
}

interface UpdateTicketInput {
  severity?: Severity;
  specialty_type?: SpecialtyType;
  description?: string;
  location?: string;
  detail?: string;
  images?: string[];
}

export async function updateTicket(
  id: number,
  input: UpdateTicketInput,
): Promise<TicketWithRelations | null> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("tickets")
    .update(input)
    .eq("id", id)
    .select(RELATION_FIELDS)
    .single();

  if (error || !data) return null;
  return flattenRelations(data);
}

export async function updateTicketStatus(
  id: number,
  status: TicketStatus,
): Promise<TicketWithRelations | null> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("tickets")
    .update({ status })
    .eq("id", id)
    .select(RELATION_FIELDS)
    .single();

  if (error || !data) return null;
  return flattenRelations(data);
}

type TicketRelations = {
  creator:
    | Pick<Profile, "id" | "name" | "department" | "avatar_url">
    | Array<Pick<Profile, "id" | "name" | "department" | "avatar_url">>;
  assignee:
    | Pick<Profile, "id" | "name" | "department" | "avatar_url">
    | Array<Pick<Profile, "id" | "name" | "department" | "avatar_url">>;
  project:
    | Pick<Project, "id" | "name" | "client_name">
    | Array<Pick<Project, "id" | "name" | "client_name">>;
};

// Supabase returns nested objects for joins, flatten to our interface.
function flattenRelations(data: Ticket & TicketRelations): TicketWithRelations {
  const { creator, assignee, project, ...ticket } = data;
  return {
    ...ticket,
    creator: Array.isArray(creator) ? creator[0] : creator,
    assignee: Array.isArray(assignee) ? assignee[0] : assignee,
    project: Array.isArray(project) ? project[0] : project,
  };
}
