// src/app/dashboard/admin/foods/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { FoodsGrid } from '@/components/foods/FoodsGrid'

export const metadata = { title: 'Alimentos' }

export default async function AdminFoodsPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') redirect('/login')

  const foods = await prisma.food.findMany({
    include: { producer: { select: { id: true, name: true, farmName: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-gray-900">Alimentos</h1>
        <p className="text-gray-500 mt-1 text-sm">
          {foods.filter(f => f.active).length} itens ativos · {foods.filter(f => !f.active).length} inativos
        </p>
      </div>
      <FoodsGrid foods={foods as any} canEdit={false} />
    </div>
  )
}
