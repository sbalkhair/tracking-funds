import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export const Route = createFileRoute('/dashboard/_group/transactions/$transactionId')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="space-y-6 pt-10">
      <div className="flex flex-col items-center">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/dashboard/transactions">Transactions</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Edit</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <Outlet />
    </div>
  )
}
