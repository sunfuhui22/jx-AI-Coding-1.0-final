import { TicketsContent } from "@/components/dashboard/tickets-content";
import { getAllProjects, getAllTickets } from "@/lib/tickets";

export default async function DashboardTicketsPage() {
  const [projects, tickets] = await Promise.all([
    getAllProjects(),
    getAllTickets(),
  ]);

  return <TicketsContent projects={projects} initialTickets={tickets} />;
}
