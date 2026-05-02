'use client'
import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import type { Task } from '@/types'

type Filter = 'all' | 'pending' | 'completed' | 'high'

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 }

function TaskForm({ onSubmit, onCancel, initial }: {
  onSubmit: (data: Partial<Task>) => void
  onCancel: () => void
  initial?: Partial<Task>
}) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [desc, setDesc] = useState(initial?.description ?? '')
  const [priority, setPriority] = useState<Task['priority']>(initial?.priority ?? 'medium')
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({ title: title.trim(), description: desc.trim() || undefined, priority, dueDate: dueDate || undefined })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-4 space-y-3">
      <input
        autoFocus
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Task title..."
        className="w-full bg-[#252525] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-[#f0f0f0] placeholder-[#555] focus:outline-none focus:border-[#6366f1] transition-colors"
      />
      <input
        value={desc}
        onChange={e => setDesc(e.target.value)}
        placeholder="Description (optional)..."
        className="w-full bg-[#252525] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-[#f0f0f0] placeholder-[#555] focus:outline-none focus:border-[#6366f1] transition-colors"
      />
      <div className="flex gap-3">
        <select
          value={priority}
          onChange={e => setPriority(e.target.value as Task['priority'])}
          className="bg-[#252525] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-[#f0f0f0] focus:outline-none focus:border-[#6366f1] transition-colors"
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          className="bg-[#252525] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-[#f0f0f0] focus:outline-none focus:border-[#6366f1] transition-colors flex-1"
        />
      </div>
      <div className="flex gap-2 pt-1">
        <button type="submit" className="px-4 py-1.5 bg-[#6366f1] text-white text-sm rounded-lg hover:bg-[#5558e8] transition-colors font-medium">
          {initial ? 'Save' : 'Add Task'}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-1.5 text-sm text-[#888] hover:text-[#f0f0f0] transition-colors">
          Cancel
        </button>
      </div>
    </form>
  )
}

function TaskItem({ task }: { task: Task }) {
  const { completeTask, deleteTask, updateTask, setCurrentTask, currentTaskId } = useApp()
  const [editing, setEditing] = useState(false)

  const isOverdue = !task.completed && task.dueDate && new Date(task.dueDate) < new Date()

  if (editing) {
    return (
      <TaskForm
        initial={task}
        onSubmit={data => { updateTask(task.id, data); setEditing(false) }}
        onCancel={() => setEditing(false)}
      />
    )
  }

  return (
    <div className={`group flex items-start gap-3 px-4 py-3 rounded-xl border transition-all ${
      task.completed ? 'border-[#1c1c1c] bg-[#0f0f0f] opacity-50' :
      task.id === currentTaskId ? 'border-[#6366f1]/30 bg-[#6366f1]/5' :
      'border-[#2a2a2a] bg-[#141414] hover:border-[#2a2a2a]'
    }`}>
      <button
        onClick={() => completeTask(task.id)}
        className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors ${
          task.completed ? 'bg-[#22c55e] border-[#22c55e]' : 'border-[#555] hover:border-[#6366f1]'
        }`}
      />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${task.completed ? 'line-through text-[#555]' : 'text-[#f0f0f0]'}`}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-[#555] mt-0.5 line-clamp-1">{task.description}</p>
        )}
        <div className="flex items-center gap-2 mt-1.5">
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
            task.priority === 'high' ? 'bg-[#ef4444]/15 text-[#ef4444]' :
            task.priority === 'medium' ? 'bg-[#eab308]/15 text-[#eab308]' :
            'bg-[#2a2a2a] text-[#555]'
          }`}>{task.priority}</span>
          {task.dueDate && (
            <span className={`text-xs ${isOverdue ? 'text-[#ef4444]' : 'text-[#555]'}`}>
              {isOverdue ? 'Overdue · ' : ''}{new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!task.completed && (
          <button
            onClick={() => setCurrentTask(task.id)}
            className={`text-xs px-2 py-1 rounded-md transition-colors ${
              task.id === currentTaskId ? 'text-[#6366f1]' : 'text-[#555] hover:text-[#6366f1]'
            }`}
            title="Set as current"
          >
            {task.id === currentTaskId ? '★' : '☆'}
          </button>
        )}
        <button
          onClick={() => setEditing(true)}
          className="text-xs px-2 py-1 rounded-md text-[#555] hover:text-[#f0f0f0] transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => deleteTask(task.id)}
          className="text-xs px-2 py-1 rounded-md text-[#555] hover:text-[#ef4444] transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export function TasksPage() {
  const { tasks } = useApp()
  const [filter, setFilter] = useState<Filter>('pending')
  const [adding, setAdding] = useState(false)
  const { addTask } = useApp()

  const filtered = tasks
    .filter(t => {
      if (filter === 'pending')   return !t.completed
      if (filter === 'completed') return t.completed
      if (filter === 'high')      return !t.completed && t.priority === 'high'
      return true
    })
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1
      return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    })

  const FILTERS: { id: Filter; label: string }[] = [
    { id: 'pending', label: `Pending (${tasks.filter(t => !t.completed).length})` },
    { id: 'completed', label: `Done (${tasks.filter(t => t.completed).length})` },
    { id: 'high', label: `High Priority` },
    { id: 'all', label: 'All' },
  ]

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#f0f0f0]">Tasks</h1>
        <button
          onClick={() => setAdding(true)}
          className="px-4 py-2 bg-[#6366f1] text-white text-sm rounded-lg hover:bg-[#5558e8] transition-colors font-medium"
        >
          + Add Task
        </button>
      </div>

      <div className="flex gap-1 mb-5 bg-[#141414] border border-[#2a2a2a] rounded-lg p-1">
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex-1 py-1.5 text-xs rounded-md transition-colors ${
              filter === f.id ? 'bg-[#252525] text-[#f0f0f0]' : 'text-[#555] hover:text-[#888]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {adding && (
        <div className="mb-4">
          <TaskForm
            onSubmit={data => { addTask(data as any); setAdding(false) }}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}

      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="text-sm text-[#555] py-8 text-center">No tasks here.</p>
        )}
        {filtered.map(task => <TaskItem key={task.id} task={task} />)}
      </div>
    </div>
  )
}
