// src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

function onlyDigits(value: string) {
  return value.replace(/\D/g, '')
}

function isValidCPF(value: string) {
  const cpf = onlyDigits(value)
  if (cpf.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cpf)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) sum += Number(cpf[i]) * (10 - i)
  let digit = (sum * 10) % 11
  if (digit === 10) digit = 0
  if (digit !== Number(cpf[9])) return false

  sum = 0
  for (let i = 0; i < 10; i++) sum += Number(cpf[i]) * (11 - i)
  digit = (sum * 10) % 11
  if (digit === 10) digit = 0
  return digit === Number(cpf[10])
}

const createUserSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
  role: z.enum(['PRODUTOR', 'BENEFICIARIO']),
  phone: z
    .string()
    .optional()
    .transform((v) => {
      const digits = onlyDigits(v || '')
      return digits || undefined
    })
    .refine((v) => !v || (v.length >= 10 && v.length <= 11), 'Telefone inválido'),
  cpf: z
    .string()
    .optional()
    .transform((v) => {
      const digits = onlyDigits(v || '')
      return digits || undefined
    })
    .refine((v) => !v || isValidCPF(v), 'CPF inválido'),
  farmName: z.string().optional(),
  farmAddress: z.string().optional(),
  institution: z.string().optional(),
  registration: z.string().optional(),
}).superRefine((data, ctx) => {
  if (!data.phone) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Telefone é obrigatório', path: ['phone'] })
  }
  if (!data.cpf) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'CPF é obrigatório', path: ['cpf'] })
  }

  if (data.role === 'PRODUTOR') {
    if (!data.farmName?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Nome da propriedade é obrigatório', path: ['farmName'] })
    }
    if (!data.farmAddress?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Endereço da propriedade é obrigatório', path: ['farmAddress'] })
    }
  }

  if (data.role === 'BENEFICIARIO') {
    if (!data.institution?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Instituição de ensino é obrigatória', path: ['institution'] })
    }
    if (!data.registration?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Matrícula / SIAPE é obrigatória', path: ['registration'] })
    }
  }
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = createUserSchema.parse(body)

    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) {
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(data.password, 10)

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashed,
        role: data.role,
        phone: data.phone ?? null,
        cpf: data.cpf ?? null,
        farmName: data.farmName?.trim() || null,
        farmAddress: data.farmAddress?.trim() || null,
        institution: data.institution?.trim() || null,
        registration: data.registration?.trim() || null,
      },
      select: { id: true, name: true, email: true, role: true },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      const target = Array.isArray(err.meta?.target) ? err.meta?.target.join(', ') : String(err.meta?.target || '')
      if (target.includes('cpf')) {
        return NextResponse.json({ error: 'CPF já cadastrado' }, { status: 409 })
      }
      if (target.includes('email')) {
        return NextResponse.json({ error: 'Email já cadastrado' }, { status: 409 })
      }
      return NextResponse.json({ error: 'Dados já cadastrados' }, { status: 409 })
    }

    if (err instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json(
        { error: 'Não foi possível conectar ao banco de dados. Verifique se o MySQL está em execução.' },
        { status: 503 }
      )
    }

    console.error(err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const role = searchParams.get('role')

    const users = await prisma.user.findMany({
      where: role ? { role: role as any } : undefined,
      select: {
        id: true, name: true, email: true, role: true,
        phone: true, cpf: true, institution: true,
        farmName: true, active: true, createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(users)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
