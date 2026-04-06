// prisma/seed.ts
import { PrismaClient, Role, FoodCategory } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Limpar dados existentes
  await prisma.receipt.deleteMany()
  await prisma.donationItem.deleteMany()
  await prisma.donation.deleteMany()
  await prisma.food.deleteMany()
  await prisma.user.deleteMany()

  const hashedPassword = await bcrypt.hash('123456', 10)

  // Criar usuário admin
  const admin = await prisma.user.create({
    data: {
      name: 'Administrador Sistema',
      email: 'admin@conectasafra.com.br',
      password: hashedPassword,
      role: Role.ADMIN,
      phone: '(81) 99999-0000',
      cpf: '000.000.000-00',
    },
  })

  // Criar produtor
  const produtor = await prisma.user.create({
    data: {
      name: 'João da Silva',
      email: 'joao@fazendabonsventos.com.br',
      password: hashedPassword,
      role: Role.PRODUTOR,
      phone: '(81) 98765-4321',
      cpf: '111.222.333-44',
      farmName: 'Fazenda Bons Ventos',
      farmAddress: 'Estrada Rural km 12, Caruaru - PE',
    },
  })

  const produtora2 = await prisma.user.create({
    data: {
      name: 'Maria Oliveira',
      email: 'maria@sitesaofrancisco.com.br',
      password: hashedPassword,
      role: Role.PRODUTOR,
      phone: '(81) 91234-5678',
      cpf: '555.666.777-88',
      farmName: 'Sítio São Francisco',
      farmAddress: 'Zona Rural, Bezerros - PE',
    },
  })

  // Criar beneficiários
  const estudante = await prisma.user.create({
    data: {
      name: 'Ana Carolina Ferreira',
      email: 'ana.ferreira@ufpe.br',
      password: hashedPassword,
      role: Role.BENEFICIARIO,
      phone: '(81) 93333-2222',
      cpf: '999.888.777-66',
      institution: 'Universidade Federal de Pernambuco',
      registration: '20240123',
    },
  })

  const servidor = await prisma.user.create({
    data: {
      name: 'Carlos Mendes',
      email: 'carlos.mendes@ifpe.edu.br',
      password: hashedPassword,
      role: Role.BENEFICIARIO,
      phone: '(81) 94444-3333',
      cpf: '333.444.555-66',
      institution: 'Instituto Federal de Pernambuco',
      registration: '1234567',
    },
  })

  // Criar alimentos
  const foods = await Promise.all([
    prisma.food.create({
      data: {
        name: 'Tomate Cereja',
        description: 'Tomates cereja frescos, colhidos na semana',
        category: FoodCategory.LEGUMES,
        unit: 'kg',
        quantity: 50,
        producerId: produtor.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.food.create({
      data: {
        name: 'Alface Crespa',
        description: 'Alface orgânica sem agrotóxicos',
        category: FoodCategory.VERDURAS,
        unit: 'unidade',
        quantity: 100,
        producerId: produtor.id,
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.food.create({
      data: {
        name: 'Manga Tommy',
        description: 'Manga madura e doce, colhida no pé',
        category: FoodCategory.FRUTAS,
        unit: 'kg',
        quantity: 80,
        producerId: produtora2.id,
        expiresAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.food.create({
      data: {
        name: 'Feijão Carioca',
        description: 'Feijão carioca da safra atual',
        category: FoodCategory.GRAOS,
        unit: 'kg',
        quantity: 200,
        producerId: produtora2.id,
        expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.food.create({
      data: {
        name: 'Cenoura',
        description: 'Cenouras frescas e orgânicas',
        category: FoodCategory.LEGUMES,
        unit: 'kg',
        quantity: 60,
        producerId: produtor.id,
        expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      },
    }),
  ])

  // Criar doação confirmada com comprovante
  const donationConfirmada = await prisma.donation.create({
    data: {
      status: 'CONFIRMADA',
      donorId: produtor.id,
      recipientId: estudante.id,
      scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      notes: 'Retirada no portão principal da fazenda',
      items: {
        create: [
          { foodId: foods[0].id, quantity: 5, unit: 'kg' },
          { foodId: foods[1].id, quantity: 10, unit: 'unidade' },
        ],
      },
    },
  })

  await prisma.receipt.create({
    data: {
      code: `REC-${Date.now()}`,
      donationId: donationConfirmada.id,
      issuedById: admin.id,
      notes: 'Comprovante emitido após confirmação da doação',
    },
  })

  // Criar doação pendente
  await prisma.donation.create({
    data: {
      status: 'PENDENTE',
      donorId: produtora2.id,
      recipientId: servidor.id,
      scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      items: {
        create: [
          { foodId: foods[2].id, quantity: 10, unit: 'kg' },
          { foodId: foods[3].id, quantity: 20, unit: 'kg' },
        ],
      },
    },
  })

  // Criar doação entregue
  const donationEntregue = await prisma.donation.create({
    data: {
      status: 'ENTREGUE',
      donorId: produtor.id,
      recipientId: servidor.id,
      deliveredAt: new Date(),
      items: {
        create: [
          { foodId: foods[4].id, quantity: 8, unit: 'kg' },
        ],
      },
    },
  })

  await prisma.receipt.create({
    data: {
      code: `REC-${Date.now() + 1}`,
      donationId: donationEntregue.id,
      issuedById: admin.id,
      notes: 'Entrega realizada com sucesso',
    },
  })

  console.log('✅ Seed concluído com sucesso!')
  console.log('\n📋 Usuários criados:')
  console.log('  Admin:       admin@conectasafra.com.br | senha: 123456')
  console.log('  Produtor:    joao@fazendabonsventos.com.br | senha: 123456')
  console.log('  Produtora:   maria@sitesaofrancisco.com.br | senha: 123456')
  console.log('  Estudante:   ana.ferreira@ufpe.br | senha: 123456')
  console.log('  Servidor:    carlos.mendes@ifpe.edu.br | senha: 123456')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
