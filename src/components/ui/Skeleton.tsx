// src/components/ui/Skeleton.tsx

function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-gray-100 animate-pulse rounded-lg ${className}`} />
  )
}

export function StatCardSkeleton() {
  return (
    <div className="stat-card space-y-2">
      <Skeleton className="w-8 h-8 rounded-lg" />
      <Skeleton className="w-16 h-7" />
      <Skeleton className="w-24 h-3" />
    </div>
  )
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <Skeleton className={`h-4 ${i === 0 ? 'w-32' : i === cols - 1 ? 'w-16' : 'w-24'}`} />
        </td>
      ))}
    </tr>
  )
}

export function CardSkeleton() {
  return (
    <div className="card space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-2 mt-2">
        <Skeleton className="h-8 w-20 rounded-lg" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  )
}

export function FoodCardSkeleton() {
  return (
    <div className="card space-y-3">
      <Skeleton className="h-5 w-20 rounded-full" />
      <Skeleton className="h-5 w-36" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
      <div className="flex items-center justify-between mt-3">
        <div>
          <Skeleton className="h-7 w-12" />
          <Skeleton className="h-3 w-8 mt-1" />
        </div>
        <Skeleton className="h-4 w-24 rounded" />
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="p-8 space-y-6">
      <div className="space-y-1">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    </div>
  )
}

export { Skeleton }
