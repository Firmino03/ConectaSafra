// src/types/index.ts
import { Role, DonationStatus, FoodCategory } from '@prisma/client'

export type { Role, DonationStatus, FoodCategory }

export interface UserSession {
  id: string
  name: string
  email: string
  role: Role
}

export interface FoodWithProducer {
  id: string
  name: string
  description: string | null
  category: FoodCategory
  unit: string
  quantity: number
  expiresAt: Date | null
  imageUrl: string | null
  active: boolean
  producerId: string
  producer: {
    id: string
    name: string
    farmName: string | null
  }
  createdAt: Date
}

export interface DonationWithDetails {
  id: string
  code: string
  status: DonationStatus
  notes: string | null
  scheduledDate: Date | null
  deliveredAt: Date | null
  createdAt: Date
  donor: {
    id: string
    name: string
    farmName: string | null
    phone: string | null
  }
  recipient: {
    id: string
    name: string
    institution: string | null
    phone: string | null
  }
  items: {
    id: string
    quantity: number
    unit: string
    food: {
      id: string
      name: string
      category: FoodCategory
    }
  }[]
  receipt: {
    id: string
    code: string
    issuedAt: Date
  } | null
}

export interface DashboardStats {
  totalDonations: number
  pendingDonations: number
  confirmedDonations: number
  deliveredDonations: number
  totalFoods: number
  totalUsers: number
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
  }
}
