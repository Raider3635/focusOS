'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useApp } from '@/context/AppContext'

type Mode = 'focus' | 'short' | 'long'

const DURATIONS: Record<Mode, number> = {
  focus: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
}

const MODE_LABELS: Record<Mode, string> = {
  focus: 'Focus',
  short: 'Short Break',
  long: 'Long Break',
}

export function FocusTimerTool() {
  const { addSession, currentTaskId, tasks } = useApp()
  const [mode, setMode] = useState<Mode>('focus')
  const [remaining, setRemaining] = useState(DURATIONS.focus)
  const [running, setRunning] = useState(false)
  const [completed, setCompleted] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)
  const elapsedRef = useRef<number>(0)

  const total = DURATIONS[mode]
  const pct = ((total - remaining) / total) * 100
  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60

  const currentTask = tasks.find(t => t.id === currentTaskId && !t.completed)

  const handleComplete = useCallback(() => {
    setRunning(false)
    if (mode === 'focus') {
      const minutes = DURATIONS.focus / 60
      addSession(minutes, currentTaskId ?? undefined)
      setCompleted(c => c + 1)
    }
    setRemaining(DURATIONS[mode])
  }, [mode, addSession, currentTaskId])

  useEffect(() => {
    if (running) {
      startTimeRef.current = Date.now() - elapsedRef.current * 1000
      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
        elapsedRef.current = elapsed
        const r = Math.max(0, total - elapsed)
        setRemaining(r)
        if (r === 0) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          handleComplete()
        }
      }, 250)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running, total, handleComplete])

  function handleMode(m: Mode) {
    setMode(m)
    setRunning(false)
    setRemaining(DURATIONS[m])
    elapsedRef.current = 0
  }

  function handleReset() {
    setRunning(false)
    setRemaining(DURATIONS[mode])
    elapsedRef.current = 0
  }

  const circumference = 2 * Math.PI * 88
  const strokeOffset = circumference - (pct / 100) * circumference

  return (
    <div className="flex flex-col items-center py-4">
      <div className="flex gap-1 mb-8 bg-[#1c1c1c] rounded-lg p-1">
        {(Object.keys(DURATIONS) as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => handleMode(m)}
            className={`px-4 py-1.5 text-xs rounded-md transition-colors ${
              mode === m ? 'bg-[#252525] text-[#f0f0f0]' : 'text-[#555] hover:text-[#888]'
            }`}
          >
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>

      <div className="relative mb-8">
        <svg width="200" height="200" className="-rotate-90">
          <circle cx="100" cy="100" r="88" fill="none" stroke="#2a2a2a" strokeWidth="8" />
          <circle
            cx="100" cy="100" r="88"
            fill="none"
            stroke={mode === 'focus' ? '#6366f1' : '#22c55e'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeOffset}
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-semibold text-[#f0f0f0] tabular-nums">
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </span>
          <span className="text-xs text-[#555] mt-1">{MODE_LABELS[mode]}</span>
        </div>
      </div>

      {currentTask && (
        <div className="mb-6 px-4 py-2 bg-[#6366f1]/10 border border-[#6366f1]/20 rounded-lg text-center max-w-xs">
          <p className="text-xs text-[#888]">Working on</p>
          <p className="text-sm text-[#f0f0f0] font-medium mt-0.5 line-clamp-1">{currentTask.title}</p>
        </div>
      )}

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setRunning(r => !r)}
          className={`px-8 py-3 rounded-xl text-sm font-medium transition-colors ${
            running
              ? 'bg-[#2a2a2a] text-[#f0f0f0] hover:bg-[#333]'
              : 'bg-[#6366f1] text-white hover:bg-[#5558e8]'
          }`}
        >
          {running ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-3 rounded-xl text-sm text-[#555] hover:text-[#f0f0f0] transition-colors"
        >
          Reset
        </button>
      </div>

      {completed > 0 && (
        <div className="flex items-center gap-2 text-xs text-[#555]">
          <span className="text-[#eab308]">{'●'.repeat(Math.min(completed, 4))}</span>
          <span>{completed} session{completed > 1 ? 's' : ''} today · +{completed * 50} XP</span>
        </div>
      )}
    </div>
  )
}
