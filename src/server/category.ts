import { createServerFn } from '@tanstack/react-start'
import { prisma } from '@/db'
import { authMiddleware } from '@/middleware/authMiddleware'

export const getCategories = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async () => {
    const categories = await prisma.category.findMany()
    return categories
  })
