import { addDays } from 'date-fns'
import z from 'zod'

export const transactionSchema = z.object({
  id: z.string(),
  amount: z.number(),
  transactionDate: z
    .date()
    .max(addDays(new Date(), 1), "Transaction date can't be in the future"),
  description: z.string(),
  transactionType: z.string(),
  categoryId: z.string(),
  category: z
    .object({
      id: z.string(),
      name: z.string(),
      type: z.string(),
    })
    .optional(),
})
export const transactionFormSchema = z.object({
  transactionType: z.string(),
  categoryId: z.string().min(1, 'Please Select Category'),
  transactionDate: z
    .date()
    .max(addDays(new Date(), 1), "Transaction date can't be in the future"),
  amount: z.number().positive('Amount must be great than zero'),
  description: z
    .string()
    .min(3, 'Description must contain at least 3 characters')
    .max(300, 'Description must contain maximum of 300 characters'),
})

export type TransactionForm = z.infer<typeof transactionFormSchema>
export type Transaction = z.infer<typeof transactionSchema>
