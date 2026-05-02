'use client'
import { useUI } from '@/context/UIContext'
import type { ToolId } from '@/types'

const TOOLS: { id: ToolId; icon: string; name: string; desc: string; tag?: string }[] = [
  { id: 'timer',     icon: '⏱', name: 'Focus Timer',          desc: 'Pomodoro sessions with XP rewards' },
  { id: 'breaker',   icon: '✂', name: 'Assignment Breaker',   desc: 'Break big tasks into steps', tag: 'AI' },
  { id: 'explainer', icon: '💡', name: 'Smart Explainer',      desc: 'Understand any concept clearly', tag: 'AI' },
  { id: 'checker',   icon: '✅', name: 'Work Checker',         desc: 'Analyze and improve your writing', tag: 'AI' },
  { id: 'grade',     icon: '📊', name: 'Grade Calculator',     desc: 'Calculate grades and GPA' },
  { id: 'decision',  icon: '⚖', name: 'Decision Helper',      desc: 'Structured pros and cons matrix' },
  { id: 'goal',      icon: '🎯', name: 'Goal Path Generator',  desc: 'Step-by-step plan for any goal', tag: 'AI' },
  { id: 'focus',     icon: '🔲', name: 'Focus Mode',           desc: 'Fullscreen distraction-free timer' },
]

export function ToolsPage() {
  const { openTool } = useUI()

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#f0f0f0] mb-1">Tools</h1>
        <p className="text-sm text-[#555]">Everything you need to study smarter.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {TOOLS.map(tool => (
          <button
            key={tool.id}
            onClick={() => openTool(tool.id)}
            className="group bg-[#141414] border border-[#2a2a2a] rounded-2xl p-5 text-left hover:border-[#6366f1]/40 hover:bg-[#6366f1]/5 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{tool.icon}</span>
              {tool.tag && (
                <span className="text-xs px-2 py-0.5 bg-[#6366f1]/15 text-[#6366f1] rounded-full">{tool.tag}</span>
              )}
            </div>
            <h3 className="font-medium text-[#f0f0f0] mb-1 group-hover:text-[#6366f1] transition-colors">{tool.name}</h3>
            <p className="text-xs text-[#555] leading-relaxed">{tool.desc}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
