"use client";

import { createContext, useContext } from "react";
import type { Role } from "@/lib/types";

export interface DashboardIdentity {
  userId: string;
  role: Role;
}

const DashboardIdentityContext = createContext<DashboardIdentity | null>(null);

export function DashboardIdentityProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: DashboardIdentity | null;
}) {
  return (
    <DashboardIdentityContext.Provider value={value}>
      {children}
    </DashboardIdentityContext.Provider>
  );
}

export function useDashboardIdentity() {
  return useContext(DashboardIdentityContext);
}
