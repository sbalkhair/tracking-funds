import { CashflowBarChart } from '@/components/cashflow-bar-chart'
import { getCashflowByYearFn } from '@/server/annual_cash_flow'
import { useQuery } from '@tanstack/react-query'
import { ArrowDown, ArrowUp, Scale } from 'lucide-react'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select'

export default function DashboardTransaction() {
  const currentYear = new Date().getFullYear()

  const [selectYear, setSelectYear] = useState(currentYear)

  const { data, error, isPending } = useQuery({
    queryKey: ['dashboardSummary', selectYear],
    queryFn: async () =>
      await getCashflowByYearFn({
        data: { year: selectYear },
      }),
  })

  if (error) {
    return <div>{error.message}</div>
  }

  if (isPending) {
    return <div>Loading...</div>
  }
  const chartData = data.monthly.map((m) => ({
    month: new Date(0, m.month - 1).toLocaleString('en', {
      month: 'short',
    }),
    income: m.income,
    expense: m.expense,
  }))
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Cashflow</CardTitle>
          <div>
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
                  {Array.from({ length: 20 }).map((_, index) => {
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
          </div>
        </CardHeader>
        <CardContent>
          <CashflowBarChart chartData={chartData} />
        </CardContent>
      </Card>
      <div className="md:col-span-1 flex flex-col gap-4">
        <h3 className="text-center font-bold text-2xl">Annual Summary</h3>
        <Card className="bg-green-50">
          <CardContent className="flex flex-col gap-2 text-center p-4">
            <p className="text-sm text-muted-foreground flex gap-2 items-center justify-center">
              <ArrowUp className="size-4 text-green-400" />
              <span className="font-semibold">Total Income</span>
            </p>
            <p className="text-xl font-bold text-green-700">
              {data.summary.totalIncome.toLocaleString('en-US')} $
            </p>
          </CardContent>
        </Card>
        <Card className="bg-orange-50">
          <CardContent className="flex flex-col gap-2 text-center p-4">
            <p className="text-sm text-muted-foreground flex gap-2 items-center justify-center">
              <ArrowDown className="size-4 text-amber-400" />
              <span className="font-semibold">Total Expense</span>
            </p>
            <p className="text-xl font-bold text-amber-400">
              {data.summary.totalExpense.toLocaleString('en-US')} $
            </p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50">
          <CardContent className="flex flex-col gap-2 text-center p-4">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Scale className="size-4 text-blue-400" />
              <span className="font-semibold">Balance</span>
            </p>
            <p className="text-xl font-bold text-blue-400">
              {data.summary.balance.toLocaleString('en-US')} ${' '}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
