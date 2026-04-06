// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { DonationStatus, FoodCategory } from '@prisma/client'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatDate(date: Date | string) {
  return format(new Date(date), "dd/MM/yyyy", { locale: ptBR })
}

export function formatDateTime(date: Date | string) {
  return format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
}

export function formatRelative(date: Date | string) {
  return formatDistanceToNow(new Date(date), { locale: ptBR, addSuffix: true })
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('pt-BR').format(value)
}

export const donationStatusLabel: Record<DonationStatus, string> = {
  PENDENTE: 'Pendente',
  CONFIRMADA: 'Confirmada',
  ENTREGUE: 'Entregue',
  CANCELADA: 'Cancelada',
}

export const donationStatusColor: Record<DonationStatus, string> = {
  PENDENTE: 'bg-amber-50 text-amber-800 border-amber-100',
  CONFIRMADA: 'bg-blue-50 text-blue-800 border-blue-100',
  ENTREGUE: 'bg-green-50 text-green-800 border-green-100',
  CANCELADA: 'bg-red-50 text-red-800 border-red-100',
}

export const foodCategoryLabel: Record<FoodCategory, string> = {
  FRUTAS: 'Frutas',
  LEGUMES: 'Legumes',
  VERDURAS: 'Verduras',
  GRAOS: 'Grãos',
  LATICINIOS: 'Laticínios',
  OUTROS: 'Outros',
}

export const foodCategoryColor: Record<FoodCategory, string> = {
  FRUTAS: 'bg-amber-50 text-amber-800',
  LEGUMES: 'bg-green-50 text-green-800',
  VERDURAS: 'bg-teal-50 text-teal-800',
  GRAOS: 'bg-orange-50 text-orange-800',
  LATICINIOS: 'bg-blue-50 text-blue-800',
  OUTROS: 'bg-gray-100 text-gray-700',
}

export function generateReceiptCode() {
  const date = format(new Date(), 'yyyyMMdd')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `REC-${date}-${random}`
}

export function getRoleDashboard(role: string) {
  switch (role) {
    case 'ADMIN': return '/dashboard/admin'
    case 'PRODUTOR': return '/dashboard/produtor'
    case 'BENEFICIARIO': return '/dashboard/beneficiario'
    default: return '/dashboard'
  }
}

export function getRoleLabel(role: string) {
  switch (role) {
    case 'ADMIN': return 'Administrador'
    case 'PRODUTOR': return 'Produtor Agrícola'
    case 'BENEFICIARIO': return 'Beneficiário'
    default: return role
  }
}
