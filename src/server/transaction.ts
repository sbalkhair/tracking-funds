import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { prisma } from '@/db'
import { authMiddleware } from '@/middleware/authMiddleware'
import { transactionFormSchema, transactionSchema } from '@/schema'

export const createTransactionFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator(transactionFormSchema)
  .handler(async ({ data, context }) => {
    await prisma.transaction.create({
      data: {
        userId: context.userId,
        amount: data.amount,
        categoryId: data.categoryId,
        description: data.description,
        transactionDate: data.transactionDate,
        transactionType: data.transactionType,
      },
    })
  })

export const getAllTransactionsFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .inputValidator(
    z.object({
      month: z.number().min(1).max(12),
      year: z.number().min(1900).max(2100),
    }),
  )
  .handler(async ({ data, context }) => {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: context.userId,
        transactionDate: {
          gte: new Date(data.year, data.month - 1, 1),
          lt: new Date(data.year, data.month, 1),
        },
      },
      orderBy: { transactionDate: 'asc' },
      include: { category: true },
    })
    return transactions
  })

export const getRecentTransactionsFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .inputValidator(
    z.object({
      count: z.number().default(5),
    }),
  )
  .handler(async ({ data, context }) => {
    const transactions = await prisma.transaction.findMany({
      where: { userId: context.userId },
      take: data.count,
      include: { category: { select: { name: true, type: true } } },
    })
    return transactions
  })

export const updateTransactionFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator(transactionSchema)
  .handler(async ({ data, context }) => {
    await prisma.transaction.update({
      where: { id: data.id, userId: context.userId },
      data: {
        amount: data.amount,
        categoryId: data.categoryId,
        description: data.description,
        transactionDate: data.transactionDate,
        transactionType: data.transactionType,
      },
    })
  })

export const deleteTransactionFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    await prisma.transaction.delete({ where: { id: data.id } })
  })
export const getTransactionByIdFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .inputValidator(z.object({ transactionId: z.string().min(1) }))
  .handler(async ({ data }) => {
    const transaction = await prisma.transaction.findUnique({
      where: { id: data.transactionId },
      select: {
        amount: true,
        category: true,
        categoryId: true,
        description: true,
        transactionDate: true,
        transactionType: true,
      },
    })

    return transaction
  })
