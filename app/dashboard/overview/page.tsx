import { OverviewContent } from "@/components/dashboard/overview-content";
import { getTicketStats } from "@/lib/tickets";

export default async function OverviewPage() {
  const stats = await getTicketStats();
  return <OverviewContent stats={stats} />;
}
