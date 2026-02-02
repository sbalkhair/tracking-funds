import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

type ChartItem = {
  month: string
  income: number
  expense: number
}

export function CashflowBarChart({ chartData }: { chartData: Array<ChartItem> }) {
  return (
    <ChartContainer
      config={{
        income: {
          label: 'Income',
          color: 'green',
        },
        expense: {
          label: 'Expense',
          color: 'orange',
        },
      }}
      className="h-80 w-full"
    >
      <BarChart
        data={chartData}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        barCategoryGap="20%"
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" />

        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) =>
                new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(Number(value))
              }
            />
          }
        />

        <Bar
          dataKey="income"
          fill="green"
          radius={[4, 4, 0, 0]}
          barSize={28}
        />
        <Bar
          dataKey="expense"
          fill="orange"
          radius={[4, 4, 0, 0]}
          barSize={28}
        />
      </BarChart>
    </ChartContainer>
  )
}
