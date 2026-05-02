'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useApp } from '@/context/AppContext'

export function FocusMode({ onClose }: { onClose: () => void }) {
  const { currentTaskId, tasks, addSession } = useApp()
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [sessionDone, setSessionDone] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startRef = useRef<number>(0)
  const baseRef = useRef<number>(0)

  const currentTask = tasks.find(t => t.id === currentTaskId && !t.completed)
  const mins = Math.floor(elapsed / 60)
  const secs = elapsed % 60

  const handleDone = useCallback(() => {
    setRunning(false)
    setSessionDone(true)
    if (elapsed >= 60) {
      addSession(Math.floor(elapsed / 60), currentTaskId ?? undefined)
    }
  }, [elapsed, addSession, currentTaskId])

  useEffect(() => {
    if (running) {
      startRef.current = Date.now() - baseRef.current * 1000
      intervalRef.current = setInterval(() => {
        const e = Math.floor((Date.now() - startRef.current) / 1000)
        baseRef.current = e
        setElapsed(e)
      }, 500)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (sessionDone) {
    const earnedXP = Math.floor(elapsed / 60) * 2
    return (
      <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex items-center justify-center animate-fade-in">
        <div className="text-center space-y-5">
          <p className="text-4xl">✓</p>
          <div>
            <h2 className="text-2xl font-semibold text-[#f0f0f0]">Session complete</h2>
            <p className="text-[#555] mt-1">{Math.floor(elapsed / 60)} minutes</p>
          </div>
          {earnedXP > 0 && (
            <p className="text-[#6366f1] text-sm font-medium">+{earnedXP} XP</p>
          )}
          <button
            onClick={onClose}
            className="px-8 py-3 bg-[#6366f1] text-white rounded-xl hover:bg-[#5558e8] font-medium"
          >
            Done
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col items-center justify-center select-none animate-fade-in">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-[#2a2a2a] hover:text-[#555] transition-colors text-xs tracking-wider uppercase"
      >
        esc to exit
      </button>

      <div className="text-center">
        {currentTask ? (
          <p className="text-[#333] text-sm mb-16 max-w-xs mx-auto leading-relaxed">{currentTask.title}</p>
        ) : (
          <div className="mb-16" />
        )}

        <div className="mb-12">
          <span className="text-8xl font-thin text-[#f0f0f0] tabular-nums tracking-tight">
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </span>
          <p className="text-xs text-[#2a2a2a] mt-4 uppercase tracking-widest">
            {running ? 'focusing' : elapsed === 0 ? 'ready' : 'paused'}
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setRunning(r => !r)}
            className={`px-10 py-3 rounded-2xl text-sm font-medium transition-colors ${
              running
                ? 'bg-[#1c1c1c] text-[#555] hover:bg-[#252525]'
                : 'bg-[#6366f1] text-white hover:bg-[#5558e8]'
            }`}
          >
            {running ? 'Pause' : elapsed === 0 ? 'Start' : 'Resume'}
          </button>
          {elapsed > 0 && (
            <button
              onClick={handleDone}
              className="px-6 py-3 rounded-2xl text-sm text-[#333] hover:text-[#555] transition-colors"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
