import { KnowledgeContent } from "@/components/dashboard/knowledge-content";
import { getKnowledgeCandidates } from "@/lib/tickets";

export default async function KnowledgePage() {
  const candidates = await getKnowledgeCandidates();
  return <KnowledgeContent initialCandidates={candidates} />;
}
