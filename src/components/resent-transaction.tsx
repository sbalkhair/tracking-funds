import { format } from 'date-fns'
import { ArrowDown, ArrowUp, Plus, View } from 'lucide-react'

import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

import { useIsMobile } from '../hooks/use-mobile'

import { buttonVariants } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'

import { cn } from '@/lib/utils'
import { getRecentTransactionsFn } from '@/server/transaction'

const ResentTransaction = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => getRecentTransactionsFn({ data: { count: 5 } }),
  })

  const isMobile = useIsMobile()

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Recent Transitions</CardTitle>
        <div className="flex gap-2">
          <Link to="/dashboard/transactions" className={buttonVariants()}>
            <View />
            View All
          </Link>
          <Link
            to="/dashboard/transactions/new"
            className={buttonVariants({ variant: 'outline' })}
          >
            <Plus />
            Create New
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {error && <div>{error.message}</div>}
        {!data || data.length === 0 ? (
          <div className="text-center py-10">No Transactions Available</div>
        ) : isLoading ? (
          <div>loading</div>
        ) : isMobile ? (
          <div className="grid grid-cols-1 gap-4">
            {data.map((transaction) => (
              <Card key={transaction.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="font-bold">
                    {format(transaction.transactionDate, 'PPP')}
                  </div>

                  {transaction.transactionType === 'income' ? (
                    <div className="bg-green-700  px-5 text-center rounded-lg text-white flex items-center gap-2">
                      <ArrowUp className="w-4" />
                      <span>
                        {transaction.transactionType.charAt(0).toUpperCase() +
                          transaction.transactionType.slice(1)}
                      </span>
                    </div>
                  ) : (
                    <div className="bg-amber-400  px-5 text-center rounded-lg text-white flex items-center gap-2">
                      <ArrowDown className="w-4" />
                      <span>
                        {transaction.transactionType.charAt(0).toUpperCase() +
                          transaction.transactionType.slice(1)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-lg font-semibold my-2">
                  {transaction.description}
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Category: {transaction.category.name}</span>
                  <span className="font-bold text-base">
                    ${transaction.amount}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {format(transaction.transactionDate, 'PPP')}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div
                        className={cn(
                          transaction.transactionType === 'income'
                            ? 'bg-green-700'
                            : 'bg-amber-400',
                          ' text-white w-25 text-center py-1 rounded-lg flex gap-1 items-center justify-center',
                        )}
                      >
                        {transaction.transactionType === 'income' ? (
                          <ArrowUp className="size-4" />
                        ) : (
                          <ArrowDown className="size-4" />
                        )}
                        {transaction.transactionType.charAt(0).toUpperCase() +
                          transaction.transactionType.slice(1)}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {transaction.category.name}
                    </TableCell>
                    <TableCell>${transaction.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ResentTransaction
