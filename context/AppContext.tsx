'use client'
import React, { createContext, useContext, useCallback } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import type { Task, Note, FocusSession } from '@/types'
import { xpToLevel } from '@/types'

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

interface AppContextType {
  // data
  tasks: Task[]
  notes: Note[]
  sessions: FocusSession[]
  xp: number
  currentTaskId: string | null
  // computed
  todayFocusMinutes: number
  todayTasksCompleted: number
  level: number
  levelProgress: number
  xpForNext: number
  // task actions
  addTask: (t: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void
  completeTask: (id: string) => void
  deleteTask: (id: string) => void
  updateTask: (id: string, changes: Partial<Task>) => void
  setCurrentTask: (id: string | null) => void
  // note actions
  addNote: (title: string, content: string) => void
  updateNote: (id: string, changes: Partial<Note>) => void
  deleteNote: (id: string) => void
  // session actions
  addSession: (durationMinutes: number, taskId?: string) => void
  addXP: (amount: number) => void
}

const Ctx = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks]           = useLocalStorage<Task[]>('fos_tasks', [])
  const [notes, setNotes]           = useLocalStorage<Note[]>('fos_notes', [])
  const [sessions, setSessions]     = useLocalStorage<FocusSession[]>('fos_sessions', [])
  const [xp, setXP]                 = useLocalStorage<number>('fos_xp', 0)
  const [currentTaskId, setCurrent] = useLocalStorage<string | null>('fos_current', null)

  const today = new Date().toISOString().slice(0, 10)

  const todayFocusMinutes = sessions
    .filter(s => s.completedAt.startsWith(today))
    .reduce((sum, s) => sum + s.durationMinutes, 0)

  const todayTasksCompleted = tasks
    .filter(t => t.completed && t.createdAt.startsWith(today))
    .length

  const { level, progress: levelProgress, xpForNext } = xpToLevel(xp)

  const addXP = useCallback((amount: number) => setXP(p => p + amount), [setXP])

  const addTask = useCallback((t: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    setTasks(p => [{ ...t, id: uid(), completed: false, createdAt: new Date().toISOString() }, ...p])
  }, [setTasks])

  const completeTask = useCallback((id: string) => {
    let wasIncomplete = false
    setTasks(p => p.map(t => {
      if (t.id !== id) return t
      wasIncomplete = !t.completed
      return { ...t, completed: !t.completed }
    }))
    if (wasIncomplete) addXP(25)
  }, [setTasks, addXP])

  const deleteTask = useCallback((id: string) => {
    setTasks(p => p.filter(t => t.id !== id))
    setCurrent(p => (p === id ? null : p))
  }, [setTasks, setCurrent])

  const updateTask = useCallback((id: string, changes: Partial<Task>) => {
    setTasks(p => p.map(t => t.id === id ? { ...t, ...changes } : t))
  }, [setTasks])

  const setCurrentTask = useCallback((id: string | null) => setCurrent(id), [setCurrent])

  const addNote = useCallback((title: string, content: string) => {
    const now = new Date().toISOString()
    setNotes(p => [{ id: uid(), title: title || 'Untitled', content, createdAt: now, updatedAt: now }, ...p])
    addXP(5)
  }, [setNotes, addXP])

  const updateNote = useCallback((id: string, changes: Partial<Note>) => {
    setNotes(p => p.map(n => n.id === id ? { ...n, ...changes, updatedAt: new Date().toISOString() } : n))
  }, [setNotes])

  const deleteNote = useCallback((id: string) => setNotes(p => p.filter(n => n.id !== id)), [setNotes])

  const addSession = useCallback((durationMinutes: number, taskId?: string) => {
    setSessions(p => [{ id: uid(), durationMinutes, taskId, completedAt: new Date().toISOString() }, ...p])
    addXP(Math.floor(durationMinutes * 2))
  }, [setSessions, addXP])

  return (
    <Ctx.Provider value={{
      tasks, notes, sessions, xp, currentTaskId,
      todayFocusMinutes, todayTasksCompleted, level, levelProgress, xpForNext,
      addTask, completeTask, deleteTask, updateTask, setCurrentTask,
      addNote, updateNote, deleteNote,
      addSession, addXP,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export function useApp() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}
