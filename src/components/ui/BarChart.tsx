'use client'
// src/components/ui/BarChart.tsx
import { cn } from '@/lib/utils'

interface BarData {
  label: string
  value: number
  color?: string
}

interface Props {
  data: BarData[]
  title?: string
  unit?: string
  height?: number
}

export function BarChart({ data, title, unit = '', height = 120 }: Props) {
  const max = Math.max(...data.map(d => d.value), 1)

  return (
    <div>
      {title && <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">{title}</p>}
      <div className="flex items-end gap-2" style={{ height }}>
        {data.map((item, i) => {
          const pct = (item.value / max) * 100
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="relative w-full flex flex-col items-center justify-end" style={{ height: height - 28 }}>
                {/* Tooltip */}
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100
                  transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap z-10">
                  {item.value}{unit}
                </div>
                <div
                  className={cn(
                    'w-full rounded-t-md transition-all duration-500',
                    item.color || 'bg-green-600'
                  )}
                  style={{ height: `${Math.max(pct, 2)}%` }}
                />
              </div>
              <span className="text-[10px] text-gray-500 text-center leading-tight truncate w-full text-center px-0.5">
                {item.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface DonutProps {
  segments: { label: string; value: number; color: string }[]
  total?: number
  centerLabel?: string
}

export function DonutChart({ segments, total, centerLabel }: DonutProps) {
  const sum = segments.reduce((a, b) => a + b.value, 0)
  const displayTotal = total ?? sum

  let cumulative = 0
  const paths = segments.map((seg) => {
    const ratio = sum > 0 ? seg.value / sum : 0
    const startAngle = cumulative * 2 * Math.PI - Math.PI / 2
    cumulative += ratio
    const endAngle = cumulative * 2 * Math.PI - Math.PI / 2

    const r = 40
    const cx = 50
    const cy = 50

    const x1 = cx + r * Math.cos(startAngle)
    const y1 = cy + r * Math.sin(startAngle)
    const x2 = cx + r * Math.cos(endAngle)
    const y2 = cy + r * Math.sin(endAngle)
    const largeArc = ratio > 0.5 ? 1 : 0

    return {
      ...seg,
      d: ratio === 0
        ? ''
        : ratio >= 0.9999
          ? `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.001} ${cy - r} Z`
          : `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`,
    }
  })

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-28 h-28 flex-shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {sum === 0 ? (
            <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="1" />
          ) : (
            paths.map((p, i) => p.d ? (
              <path key={i} d={p.d} fill={p.color} className="transition-all hover:opacity-80" />
            ) : null)
          )}
          <circle cx="50" cy="50" r="26" fill="white" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-semibold text-gray-900">{displayTotal}</span>
          {centerLabel && <span className="text-[10px] text-gray-400">{centerLabel}</span>}
        </div>
      </div>
      <div className="space-y-2 flex-1">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: seg.color }} />
            <span className="text-xs text-gray-600 flex-1">{seg.label}</span>
            <span className="text-xs font-medium text-gray-900">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
