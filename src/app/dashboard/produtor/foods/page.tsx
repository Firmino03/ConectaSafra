// src/app/dashboard/produtor/foods/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { FoodsGrid } from '@/components/foods/FoodsGrid'

export const metadata = { title: 'Meus Alimentos' }

export default async function ProdutorFoodsPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'PRODUTOR') redirect('/login')

  const foods = await prisma.food.findMany({
    where: { producerId: session.user.id },
    include: { producer: { select: { id: true, name: true, farmName: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold text-gray-900">Meus Alimentos</h1>
          <p className="text-gray-500 mt-1 text-sm">{foods.filter(f => f.active).length} itens ativos disponíveis para doação</p>
        </div>
        <Link href="/dashboard/produtor/foods/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Cadastrar alimento
        </Link>
      </div>
      <FoodsGrid foods={foods as any} canEdit />
    </div>
  )
}
