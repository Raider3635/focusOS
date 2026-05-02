'use client'

interface XPBarProps {
  progress: number
  total: number
  height?: number
}

export function XPBar({ progress, total, height = 4 }: XPBarProps) {
  const pct = total > 0 ? Math.min(100, (progress / total) * 100) : 0

  return (
    <div
      className="w-full rounded-full overflow-hidden"
      style={{ height, background: '#2a2a2a' }}
    >
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, background: '#6366f1' }}
      />
    </div>
  )
}
