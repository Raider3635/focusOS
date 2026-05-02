export type NavPage = 'dashboard' | 'tasks' | 'notes' | 'tools'

export type ToolId =
  | 'timer'
  | 'breaker'
  | 'explainer'
  | 'checker'
  | 'grade'
  | 'decision'
  | 'goal'
  | 'focus'

export type Priority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: Priority
  dueDate?: string
  createdAt: string
}

export interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface FocusSession {
  id: string
  durationMinutes: number
  taskId?: string
  completedAt: string
}

export interface AppState {
  tasks: Task[]
  notes: Note[]
  sessions: FocusSession[]
  xp: number
  currentTaskId: string | null
}

export function xpToLevel(xp: number): { level: number; progress: number; xpForNext: number } {
  const base = 100
  let level = 1
  let needed = base
  let remaining = xp
  while (remaining >= needed) {
    remaining -= needed
    level++
    needed = Math.floor(base * Math.pow(1.4, level - 1))
  }
  return { level, progress: remaining, xpForNext: needed }
}
