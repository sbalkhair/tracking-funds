import { createFileRoute } from '@tanstack/react-router'
import TransactionForm from '@/components/transaction-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getCategories } from '@/server/category'

export const Route = createFileRoute('/dashboard/_group/transactions/new/')({
  component: RouteComponent,
  loader: () => getCategories(),
})

function RouteComponent() {
  const categories = Route.useLoaderData()
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>New Transaction</CardTitle>
          <CardDescription>
            Fill in all information to create a new transaction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionForm categories={categories} />
        </CardContent>
      </Card>
    </div>
  )
}
