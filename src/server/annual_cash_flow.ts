import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { prisma } from '@/db'
import { authMiddleware } from '@/middleware/authMiddleware'

export const getCashflowByYearFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .inputValidator(
    z.object({
      year: z.number().min(2000),
    }),
  )
  .handler(async ({ data, context }) => {
    const transactions = await getTransactionInYear(data.year)

    const monthly = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      income: 0,
      expense: 0,
    }))

    let totalIncome = 0
    let totalExpense = 0

    for (const tx of transactions) {
      const monthIndex = tx.transactionDate.getMonth()

      if (tx.transactionType === 'income') {
        monthly[monthIndex].income += tx.amount
        totalIncome += tx.amount
      } else {
        monthly[monthIndex].expense += tx.amount
        totalExpense += tx.amount
      }
    }

    return {
      year: data.year,
      summary: {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
      },
      monthly: monthly.map((m) => ({
        month: m.month,
        income: m.income,
        expense: m.expense,
        net: m.income - m.expense,
      })),
    }

    async function getTransactionInYear(year: number) {
      const startOfYear = new Date(year, 0, 1)
      const endOfYear = new Date(year + 1, 0, 1)

      const transactions = await prisma.transaction.findMany({
        where: {
          userId: context.userId,
          transactionDate: {
            gte: startOfYear,
            lt: endOfYear,
          },
        },
        select: {
          amount: true,
          transactionType: true,
          transactionDate: true,
        },
      })
      return transactions
    }
  })
