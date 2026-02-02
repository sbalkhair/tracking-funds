import { createFileRoute } from '@tanstack/react-router'
import DashboardTransaction from '@/components/dashboard-transaction'
import ResentTransaction from '@/components/resent-transaction'

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="space-y-6 my-10">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <DashboardTransaction />

      {/* Recent Transaction */}

      <ResentTransaction />
    </div>
  )
}
