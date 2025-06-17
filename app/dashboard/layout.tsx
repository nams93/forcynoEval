import type React from "react"
import { AuthGuard } from "@/components/auth/auth-guard"
import { DataCollector } from "@/components/dashboard/data-collector"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <DataCollector />
      {children}
    </AuthGuard>
  )
}
