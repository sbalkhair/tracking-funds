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
import { getTransactionByIdFn } from '@/server/transaction'

export const Route = createFileRoute(
  '/dashboard/_group/transactions/$transactionId/',
)({
  component: RouteComponent,
  loader: async ({ params }) => {
    const [categories, transaction] = await Promise.all([
      getCategories(),
      getTransactionByIdFn({ data: { transactionId: params.transactionId } }),
    ])
    return { categories, transaction }
  },
})

function RouteComponent() {
  const { categories, transaction } = Route.useLoaderData()
  const { transactionId } = Route.useParams()
  if (!transaction) {
    return (
      <div className="bg-red-100 text-red-400 p-2 text-center rounded-lg border border-red-200">
        No Transaction Found
      </div>
    )
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Transaction</CardTitle>
        <CardDescription>
          Fill in all information to Edit a transaction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TransactionForm
          transactionId={transactionId}
          defaultValues={{
            amount: transaction.amount,
            description: transaction.description,
            categoryId: transaction.categoryId,
            transactionDate: new Date(transaction.transactionDate),
            transactionType:
              categories.find(
                (category) => category.id === transaction.categoryId,
              )?.type ?? 'income',
          }}
          categories={categories}
        />
      </CardContent>
    </Card>
  )
}
