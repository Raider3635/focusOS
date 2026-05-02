'use client'
import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { useUI } from '@/context/UIContext'
import type { Task } from '@/types'

function getContextualTools(task: Task) {
  const kw = (task.title + ' ' + (task.description ?? '')).toLowerCase()
  if (kw.match(/write|essay|paper|draft|paragraph/))
    return [{ id: 'explainer', label: 'Smart Explainer' }, { id: 'checker', label: 'Work Checker' }]
  if (kw.match(/study|learn|read|chapter|textbook/))
    return [{ id: 'explainer', label: 'Smart Explainer' }, { id: 'breaker', label: 'Break it down' }]
  if (kw.match(/plan|project|goal|roadmap/))
    return [{ id: 'breaker', label: 'Break it down' }, { id: 'goal', label: 'Goal Path' }]
  if (kw.match(/decide|choose|pick|should|option/))
    return [{ id: 'decision', label: 'Decision Helper' }, { id: 'goal', label: 'Goal Path' }]
  return [{ id: 'breaker', label: 'Break it down' }, { id: 'grade', label: 'Grade Calc' }]
}

function dueDateLabel(dueDate: string) {
  const days = Math.ceil((new Date(dueDate).getTime() - Date.now()) / 86400000)
  if (days < 0)  return { text: `Overdue by ${Math.abs(days)}d`, color: 'text-[#ef4444]' }
  if (days === 0) return { text: 'Due today',                      color: 'text-[#eab308]' }
  if (days === 1) return { text: 'Due tomorrow',                   color: 'text-[#eab308]' }
  return { text: `Due in ${days} days`,                            color: 'text-[#555]' }
}

// ─── EXECUTION STATE ──────────────────────────────────────────────────────────
function ExecutionCard({ task }: { task: Task }) {
  const { openTool } = useUI()
  const { setCurrentTask } = useApp()
  const tools = getContextualTools(task)
  const due = task.dueDate ? dueDateLabel(task.dueDate) : null

  return (
    <div className="animate-lock-in glow-pulse rounded-2xl bg-[#141414] border border-[#6366f1]/40 px-10 py-10 text-center">
      <p className="text-xs text-[#444] uppercase tracking-[0.2em] mb-6">Current Focus</p>

      <h2 className="text-3xl font-bold text-[#f0f0f0] leading-tight mb-3">{task.title}</h2>

      {task.description && (
        <p className="text-[#555] text-sm mb-3 max-w-sm mx-auto leading-relaxed">{task.description}</p>
      )}

      <div className="flex items-center justify-center gap-3 mb-8">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          task.priority === 'high'   ? 'bg-[#ef4444]/12 text-[#ef4444]' :
          task.priority === 'medium' ? 'bg-[#eab308]/12 text-[#eab308]' :
                                       'bg-[#1c1c1c] text-[#555]'
        }`}>{task.priority}</span>
        {due && <span className={`text-xs ${due.color}`}>{due.text}</span>}
      </div>

      <button
        onClick={() => openTool('timer')}
        className="w-full py-4 bg-[#6366f1] text-white font-semibold text-base rounded-xl hover:bg-[#5558e8] mb-4"
      >
        Start Focus Session →
      </button>

      <div className="flex items-center justify-center gap-6 text-xs">
        {tools.map(t => (
          <button
            key={t.id}
            onClick={() => openTool(t.id as any)}
            className="text-[#444] hover:text-[#888] transition-colors"
          >
            {t.label}
          </button>
        ))}
        <span className="text-[#2a2a2a]">·</span>
        <button
          onClick={() => setCurrentTask(null)}
          className="text-[#444] hover:text-[#888] transition-colors"
        >
          Change task
        </button>
      </div>
    </div>
  )
}

// ─── BROWSING STATE ───────────────────────────────────────────────────────────
function BrowsingCard() {
  const { tasks, setCurrentTask, addTask } = useApp()
  const { navigate } = useUI()
  const [newTitle, setNewTitle] = useState('')
  const [showAll, setShowAll] = useState(false)

  const pending = tasks.filter(t => !t.completed)
  const sorted = [...pending].sort((a, b) => {
    const p = { high: 0, medium: 1, low: 2 }
    if (a.dueDate && !b.dueDate) return -1
    if (!a.dueDate && b.dueDate) return 1
    return p[a.priority] - p[b.priority]
  })
  const visible = showAll ? sorted.slice(0, 8) : sorted.slice(0, 3)

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const t = newTitle.trim()
    if (!t) return
    addTask({ title: t, priority: 'medium' })
    setNewTitle('')
  }

  return (
    <div className="animate-slide-up rounded-2xl bg-[#141414] px-8 py-8">
      <p className="text-center text-[#888] text-sm font-medium mb-1">What should you work on?</p>
      <p className="text-center text-[#444] text-xs mb-7">Select a task to lock in your focus.</p>

      {visible.length > 0 ? (
        <div className="space-y-2 mb-4">
          {visible.map(task => {
            const due = task.dueDate ? dueDateLabel(task.dueDate) : null
            return (
              <button
                key={task.id}
                onClick={() => setCurrentTask(task.id)}
                className="card-hover w-full flex items-center gap-4 px-4 py-3.5 bg-[#1c1c1c] hover:bg-[#252525] rounded-xl text-left group transition-colors"
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  task.priority === 'high'   ? 'bg-[#ef4444]' :
                  task.priority === 'medium' ? 'bg-[#eab308]' : 'bg-[#444]'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#888] group-hover:text-[#f0f0f0] transition-colors line-clamp-1">
                    {task.title}
                  </p>
                  {due && (
                    <p className={`text-xs mt-0.5 ${due.color}`}>{due.text}</p>
                  )}
                </div>
                <span className="text-xs text-[#6366f1] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  Focus on this →
                </span>
              </button>
            )
          })}
        </div>
      ) : null}

      {!showAll && pending.length > 3 && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full text-center text-xs text-[#444] hover:text-[#666] transition-colors mb-4 py-1"
        >
          Show {pending.length - 3} more tasks
        </button>
      )}

      {pending.length === 0 && (
        <p className="text-center text-xs text-[#444] mb-5">No tasks yet — add your first one below.</p>
      )}

      <form onSubmit={handleAdd} className="flex gap-2 mt-2">
        <input
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          placeholder="Add a task..."
          className="flex-1 bg-[#1c1c1c] border border-[#252525] rounded-xl px-4 py-2.5 text-sm text-[#f0f0f0] placeholder-[#444] focus:border-[#6366f1] transition-colors"
        />
        <button
          type="submit"
          className="px-4 py-2.5 bg-[#6366f1] text-white text-sm rounded-xl font-medium hover:bg-[#5558e8]"
        >
          Add
        </button>
      </form>

      {pending.length > 0 && (
        <button
          onClick={() => navigate('tasks')}
          className="mt-3 w-full text-center text-xs text-[#333] hover:text-[#555] transition-colors"
        >
          Manage all tasks →
        </button>
      )}
    </div>
  )
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
export function Dashboard() {
  const { tasks, currentTaskId, todayFocusMinutes, todayTasksCompleted, level } = useApp()
  const currentTask = tasks.find(t => t.id === currentTaskId && !t.completed)

  return (
    <div className="p-10 max-w-xl animate-fade-in">
      <div className="flex items-center justify-between mb-10">
        <p className="text-xs text-[#444]">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <div className="flex items-center gap-4 text-xs text-[#333]">
          <span>{todayFocusMinutes}m focused</span>
          <span>{todayTasksCompleted} done</span>
          <span>Lv.{level}</span>
        </div>
      </div>

      {currentTask ? <ExecutionCard task={currentTask} /> : <BrowsingCard />}
    </div>
  )
}
