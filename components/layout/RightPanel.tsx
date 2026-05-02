'use client'
import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { useUI } from '@/context/UIContext'

interface Suggestion {
  text: string
  cta: string
  action: () => void
  primary: boolean
}

function useSuggestions(): Suggestion[] {
  const { tasks, currentTaskId, todayFocusMinutes } = useApp()
  const { openTool, navigate } = useUI()

  const pending    = tasks.filter(t => !t.completed)
  const currentTask = tasks.find(t => t.id === currentTaskId && !t.completed)
  const overdue    = pending.filter(t => t.dueDate && new Date(t.dueDate) < new Date())
  const highP      = pending.filter(t => t.priority === 'high' && t.id !== currentTaskId)
  const dueToday   = pending.filter(t => {
    if (!t.dueDate) return false
    const d = new Date(t.dueDate)
    const now = new Date()
    return d.toDateString() === now.toDateString()
  })

  const out: Suggestion[] = []

  if (pending.length === 0) {
    out.push({ text: 'Add something to work on.', cta: 'Add a task', action: () => navigate('tasks'), primary: true })
    return out
  }

  if (!currentTask) {
    const top = [...pending].sort((a, b) => {
      const p = { high: 0, medium: 1, low: 2 }
      return p[a.priority] - p[b.priority]
    })[0]
    out.push({
      text: top ? `Start with "${top.title.length > 25 ? top.title.slice(0, 25) + '…' : top.title}"` : 'Pick a task to get started.',
      cta: 'Set focus',
      action: () => navigate('dashboard'),
      primary: true,
    })
  } else if (todayFocusMinutes === 0) {
    const name = currentTask.title.length > 22 ? currentTask.title.slice(0, 22) + '…' : currentTask.title
    out.push({
      text: `Start a 25-min session on "${name}"`,
      cta: 'Start timer',
      action: () => openTool('timer'),
      primary: true,
    })
  } else {
    out.push({
      text: `${todayFocusMinutes}m in today. Another session?`,
      cta: 'Go again',
      action: () => openTool('timer'),
      primary: false,
    })
  }

  if (overdue.length > 0) {
    out.push({
      text: `${overdue.length} task${overdue.length > 1 ? 's are' : ' is'} overdue.`,
      cta: 'Review now',
      action: () => navigate('tasks'),
      primary: false,
    })
  } else if (dueToday.length > 0) {
    out.push({
      text: `"${dueToday[0].title.length > 22 ? dueToday[0].title.slice(0, 22) + '…' : dueToday[0].title}" is due today.`,
      cta: 'Focus on it',
      action: () => { /* setCurrentTask(dueToday[0].id) is called in useApp */ navigate('dashboard') },
      primary: false,
    })
  } else if (highP.length > 0 && currentTask) {
    out.push({
      text: `Break down "${currentTask.title.length > 20 ? currentTask.title.slice(0, 20) + '…' : currentTask.title}" into steps.`,
      cta: 'Break it down',
      action: () => openTool('breaker'),
      primary: false,
    })
  }

  return out.slice(0, 2)
}

export function RightPanel() {
  const { tasks, currentTaskId, setCurrentTask, addTask, todayFocusMinutes, todayTasksCompleted } = useApp()
  const [newTask, setNewTask] = useState('')
  const suggestions = useSuggestions()

  const pending = tasks.filter(t => !t.completed).slice(0, 4)

  function handleAddTask(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = newTask.trim()
    if (!trimmed) return
    addTask({ title: trimmed, priority: 'medium' })
    setNewTask('')
  }

  return (
    <aside className="w-56 flex-shrink-0 flex flex-col bg-[#0f0f0f] border-l border-[#1c1c1c] h-screen overflow-y-auto">

      <div className="px-5 py-5 border-b border-[#1c1c1c]">
        <p className="text-xs text-[#333] uppercase tracking-wider mb-4">Next actions</p>
        <div className="space-y-3">
          {suggestions.map((s, i) => (
            <div key={i} className={`rounded-xl p-3 animate-slide-in ${s.primary ? 'bg-[#6366f1]/10 border border-[#6366f1]/15' : 'bg-[#141414]'}`}
              style={{ animationDelay: `${i * 80}ms` }}>
              <p className={`text-xs leading-relaxed mb-2 ${s.primary ? 'text-[#888]' : 'text-[#555]'}`}>
                {s.text}
              </p>
              <button
                onClick={s.action}
                className={`text-xs font-semibold transition-colors ${s.primary ? 'text-[#6366f1] hover:text-[#818cf8]' : 'text-[#555] hover:text-[#888]'}`}
              >
                {s.cta} →
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-4 flex-1">
        <p className="text-xs text-[#333] uppercase tracking-wider mb-3">Up next</p>
        {pending.length === 0 ? (
          <p className="text-xs text-[#2a2a2a]">No tasks yet.</p>
        ) : (
          <div className="space-y-0.5">
            {pending.map(task => (
              <button
                key={task.id}
                onClick={() => setCurrentTask(task.id)}
                className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-left text-xs transition-colors group ${
                  task.id === currentTaskId
                    ? 'text-[#6366f1]'
                    : 'text-[#444] hover:text-[#888] hover:bg-[#141414]'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  task.priority === 'high' ? 'bg-[#ef4444]' :
                  task.priority === 'medium' ? 'bg-[#eab308]' : 'bg-[#333]'
                }`} />
                <span className="line-clamp-1 flex-1">{task.title}</span>
                {task.id === currentTaskId && <span className="text-[#6366f1] text-xs">●</span>}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleAddTask} className="mt-4">
          <input
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            placeholder="Quick add..."
            className="w-full bg-[#141414] border border-[#1c1c1c] rounded-lg px-3 py-2 text-xs text-[#f0f0f0] placeholder-[#333] focus:border-[#6366f1] focus:placeholder-[#555] transition-colors"
          />
        </form>
      </div>

      <div className="px-5 py-3 border-t border-[#1c1c1c]">
        <div className="flex justify-between text-xs text-[#2a2a2a]">
          <span>{todayFocusMinutes}m focused</span>
          <span>{todayTasksCompleted} done</span>
        </div>
      </div>
    </aside>
  )
}
