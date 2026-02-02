import { authClient } from '@/features/auth/auth-client'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  loader: async () => {
    const session = await authClient.getSession()
    return { session }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex-col space-y-3  flex items-center justify-center min-h-screen">
      <div className="w-34">
        <img src="logo.png" />
      </div>
      <div className="text-2xl font-bold">Tracking Funds</div>
      <div className="text-muted-foreground flex">
        <div>Start Tracking Income And Expense</div>
      </div>
    </div>
  )
}
