import { redirect } from "next/navigation";
import { DashboardIdentityProvider } from "@/components/dashboard/dashboard-identity-context";
import { DashboardSideNav } from "@/components/dashboard-side-nav";
import { DashboardTopBar } from "@/components/dashboard-top-bar";
import { getIdentitiesForUser, getIdentityFromCookie } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { IdentityOption } from "@/lib/types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const identity = await getIdentityFromCookie();

  if (!identity || identity.role !== "管理员") {
    redirect("/mobile/assistant");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userName = "";
  let department = "";
  let identities: IdentityOption[] = [];

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("name, department")
      .eq("id", user.id)
      .single();

    if (profile) {
      userName = profile.name;
      department = profile.department;
    }

    identities = await getIdentitiesForUser(user.id);
  }

  return (
    <DashboardIdentityProvider
      value={identity && user ? { userId: user.id, role: identity.role } : null}
    >
      {/* Open Design Grid Shell */}
      <div className="flex h-screen w-full overflow-hidden">
        <DashboardSideNav />

        {/* Main column */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardTopBar
            userName={userName}
            department={department}
            identities={identities}
          />
          <main className="flex-1 overflow-y-auto bg-background p-5">
            {children}
          </main>
        </div>
      </div>
    </DashboardIdentityProvider>
  );
}
