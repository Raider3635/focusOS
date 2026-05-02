'use client'
import { useUI } from '@/context/UIContext'
import { useApp } from '@/context/AppContext'
import { XPBar } from '@/components/ui/XPBar'
import type { NavPage } from '@/types'

const NAV_ITEMS: { id: NavPage; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '⌂' },
  { id: 'tasks',     label: 'Tasks',     icon: '✓' },
  { id: 'notes',     label: 'Notes',     icon: '✎' },
]

export function Sidebar() {
  const { activePage, navigate } = useUI()
  const { level, levelProgress, xpForNext, xp } = useApp()

  return (
    <aside className="w-52 flex-shrink-0 flex flex-col bg-[#0f0f0f] border-r border-[#1c1c1c] h-screen">
      <div className="px-5 py-5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#6366f1] flex items-center justify-center text-white text-xs font-bold">F</div>
          <span className="font-semibold text-[#f0f0f0] tracking-tight text-sm">FocusOS</span>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => navigate(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
              activePage === item.id
                ? 'bg-[#6366f1]/12 text-[#6366f1] font-medium'
                : 'text-[#555] hover:text-[#888] hover:bg-[#141414]'
            }`}
          >
            <span className="text-sm w-4 text-center opacity-70">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="px-4 py-5 border-t border-[#1c1c1c]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#555]">Level {level}</span>
          <span className="text-xs text-[#333]">{xp} XP</span>
        </div>
        <XPBar progress={levelProgress} total={xpForNext} height={3} />
      </div>
    </aside>
  )
}
