import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { deleteTransactionFn, getAllTransactionsFn } from '@/server/transaction'
import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { format } from 'date-fns'
import { ArrowDown, ArrowUp, Edit2, Plus, Search, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import z from 'zod'
import { useIsMobile } from '../../../../hooks/use-mobile'

const today = new Date()
const currentYear = today.getFullYear()
const searchSchema = z.object({
  month: z
    .number()
    .min(1)
    .max(12)
    .default(today.getMonth() + 1),
  year: z.number().default(today.getFullYear()),
})
export const Route = createFileRoute('/dashboard/_group/transactions/')({
  component: RouteComponent,
  validateSearch: searchSchema,
})

function RouteComponent() {
  const { month, year } = Route.useSearch()
  const [selectMonth, setSelectMonth] = useState(month - 1)
  const [selectYear, setSelectYear] = useState(year)
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const dateTitle = `${new Date(0, month).toLocaleDateString('en', {
    month: 'long',
  })} ${year} Transactions`

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['transactions', month, year],
    queryFn: () => getAllTransactionsFn({ data: { month, year } }),
  })
  if (error) {
    return <div className="text-center">{error.message}</div>
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <div className="flex items-center gap-2">
            <Spinner />
            Loading
          </div>
        </CardContent>
      </Card>
    )
  }
  if (!data) {
    return (
      <div className="text-center py-10">No Transactions For this month</div>
    )
  }

  return (
    <div className="mt-2">
      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <CardTitle>{dateTitle}</CardTitle>
          <div className="flex items-center gap-2">
            <Select
              value={selectMonth.toString()}
              onValueChange={(val) => setSelectMonth(Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Month</SelectLabel>
                  {Array.from({ length: 12 }).map((_, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {new Date(0, index).toLocaleDateString('en', {
                        month: 'long',
                      })}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select
              value={selectYear.toString()}
              onValueChange={(val) => setSelectYear(Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Year</SelectLabel>
                  {Array.from({ length: 100 }).map((_, index) => {
                    const year = currentYear - index

                    return (
                      <SelectItem key={index} value={year.toString()}>
                        {year}
                      </SelectItem>
                    )
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button
              onClick={() => {
                navigate({
                  from: Route.fullPath,
                  search: { month: selectMonth + 1, year: selectYear },
                })
              }}
            >
              <Search />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Link to="/dashboard/transactions/new" className={buttonVariants()}>
            <Plus />
            New Transaction
          </Link>
          {data.length === 0 ? (
            <div className="text-center py-10">No Transaction</div>
          ) : isMobile ? (
            <div className="grid grid-cols-1 gap-4 mt-4">
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
                  <div className="flex items-center justify-end gap-2 mt-4">
                    <Link
                      className={buttonVariants({
                        variant: 'outline',
                      })}
                      from={'/dashboard/transactions/'}
                      to={`/dashboard/transactions/${transaction.id}`}
                    >
                      <Edit2 />
                    </Link>

                    <Button
                      variant={'destructive'}
                      onClick={async () => {
                        await deleteTransactionFn({
                          data: { id: transaction.id },
                        })
                        toast.success('Success Delete Transaction')
                        refetch()
                      }}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {format(transaction.transactionDate, 'PPP')}
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
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
                      <TableCell>{transaction.category.name}</TableCell>
                      <TableCell>${transaction.amount}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Link
                          className={buttonVariants({
                            variant: 'outline',
                          })}
                          from={'/dashboard/transactions/'}
                          to={`/dashboard/transactions/${transaction.id}`}
                        >
                          <Edit2 />
                        </Link>

                        <Button
                          variant={'destructive'}
                          onClick={async () => {
                            await deleteTransactionFn({
                              data: { id: transaction.id },
                            })
                            toast.success('Success Delete Transaction')
                            refetch()
                          }}
                        >
                          <Trash2 />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
