import { randomUUID } from 'node:crypto'
import { prisma } from '@/db'

function getRandomDateInMonth(year: number, month: number) {
  const day = Math.floor(Math.random() * 28) + 1 // 1-28 لتجنب مشاكل الأشهر
  const hour = Math.floor(Math.random() * 24)
  const minute = Math.floor(Math.random() * 60)
  return new Date(year, month, day, hour, minute)
}

function getRandomAmount(type: 'income' | 'expense') {
  if (type === 'income')
    return parseFloat((Math.random() * 5000 + 500).toFixed(2))
  else return parseFloat((Math.random() * 1000 + 20).toFixed(2))
}

async function main() {
  // حذف البيانات القديمة
  await prisma.transaction.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  // إنشاء المستخدمين
  const usersData = [
    {
      id: randomUUID(),
      name: 'Saeed',
      email: 'saeed@example.com',
      emailVerified: true,
    },
    {
      id: randomUUID(),
      name: 'Mona',
      email: 'mona@example.com',
      emailVerified: true,
    },
    {
      id: randomUUID(),
      name: 'Ali',
      email: 'ali@example.com',
      emailVerified: true,
    },
  ]
  await prisma.user.createMany({ data: usersData })
  const users = await prisma.user.findMany()

  // إنشاء التصنيفات
  const categoriesData = [
    { name: 'Salary', type: 'income' },
    { name: 'Freelance', type: 'income' },
    { name: 'Investment', type: 'income' },
    { name: 'Food', type: 'expense' },
    { name: 'Transport', type: 'expense' },
    { name: 'Shopping', type: 'expense' },
    { name: 'Bills', type: 'expense' },
  ]

  const categories = await Promise.all(
    categoriesData.map((cat) =>
      prisma.category.create({ data: { id: randomUUID(), ...cat } }),
    ),
  )

  const years = [2024, 2025, 2026]
  const transactionsPerYear = Math.floor(100 / years.length)

  for (const year of years) {
    for (let i = 0; i < transactionsPerYear; i++) {
      const user = users[Math.floor(Math.random() * users.length)]
      const transactionType = Math.random() < 0.5 ? 'income' : 'expense'
      const categoryOptions = categories.filter(
        (c) => c.type === transactionType,
      )
      const category =
        categoryOptions[Math.floor(Math.random() * categoryOptions.length)]

      // اختيار شهر عشوائي
      const month = Math.floor(Math.random() * 12)

      await prisma.transaction.create({
        data: {
          id: randomUUID(),
          amount: getRandomAmount(transactionType),
          transactionType,
          transactionDate: getRandomDateInMonth(year, month),
          description: `${transactionType} transaction in ${month + 1}/${year}`,
          userId: user.id,
          categoryId: category.id,
        },
      })
    }
  }

  console.log('✅ Seeding 100 transactions across 2024-2026 done!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
