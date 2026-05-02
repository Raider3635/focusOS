'use client'
import { useState } from 'react'

interface Assignment {
  id: string
  name: string
  score: string
  total: string
  weight: string
}

function gradeToLetter(pct: number): string {
  if (pct >= 93) return 'A'
  if (pct >= 90) return 'A-'
  if (pct >= 87) return 'B+'
  if (pct >= 83) return 'B'
  if (pct >= 80) return 'B-'
  if (pct >= 77) return 'C+'
  if (pct >= 73) return 'C'
  if (pct >= 70) return 'C-'
  if (pct >= 67) return 'D+'
  if (pct >= 60) return 'D'
  return 'F'
}

function letterColor(letter: string): string {
  if (letter.startsWith('A')) return '#22c55e'
  if (letter.startsWith('B')) return '#6366f1'
  if (letter.startsWith('C')) return '#eab308'
  return '#ef4444'
}

function uid() { return Math.random().toString(36).slice(2) }

export function GradeCalculator() {
  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: uid(), name: 'Homework', score: '', total: '100', weight: '20' },
    { id: uid(), name: 'Midterm', score: '', total: '100', weight: '30' },
    { id: uid(), name: 'Final', score: '', total: '100', weight: '50' },
  ])

  function updateAssignment(id: string, field: keyof Assignment, value: string) {
    setAssignments(a => a.map(x => x.id === id ? { ...x, [field]: value } : x))
  }

  function addRow() {
    setAssignments(a => [...a, { id: uid(), name: '', score: '', total: '100', weight: '' }])
  }

  function removeRow(id: string) {
    setAssignments(a => a.filter(x => x.id !== id))
  }

  const filled = assignments.filter(a => a.score !== '' && a.total !== '' && Number(a.total) > 0)
  const useWeights = filled.some(a => a.weight !== '')

  let finalPct = 0
  if (filled.length > 0) {
    if (useWeights) {
      const totalWeight = filled.reduce((s, a) => s + (Number(a.weight) || 0), 0)
      if (totalWeight > 0) {
        finalPct = filled.reduce((s, a) => {
          const pct = (Number(a.score) / Number(a.total)) * 100
          const w = Number(a.weight) || 0
          return s + pct * (w / totalWeight)
        }, 0)
      }
    } else {
      const totalPoints = filled.reduce((s, a) => s + Number(a.total), 0)
      const earnedPoints = filled.reduce((s, a) => s + Number(a.score), 0)
      finalPct = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0
    }
  }

  const letter = filled.length > 0 ? gradeToLetter(finalPct) : null

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-[#555] border-b border-[#2a2a2a]">
              <th className="text-left pb-2 font-medium pr-3">Assignment</th>
              <th className="text-left pb-2 font-medium pr-3 w-20">Score</th>
              <th className="text-left pb-2 font-medium pr-3 w-20">Total</th>
              <th className="text-left pb-2 font-medium pr-3 w-20">Weight %</th>
              <th className="pb-2 w-8"></th>
            </tr>
          </thead>
          <tbody className="space-y-2">
            {assignments.map(a => {
              const rowPct = a.score && a.total && Number(a.total) > 0
                ? (Number(a.score) / Number(a.total)) * 100
                : null
              return (
                <tr key={a.id} className="border-b border-[#1c1c1c]">
                  <td className="py-2 pr-3">
                    <input
                      value={a.name}
                      onChange={e => updateAssignment(a.id, 'name', e.target.value)}
                      placeholder="Name..."
                      className="w-full bg-[#1c1c1c] rounded px-2 py-1.5 text-[#f0f0f0] placeholder-[#555] focus:outline-none focus:ring-1 focus:ring-[#6366f1] text-xs"
                    />
                  </td>
                  <td className="py-2 pr-3">
                    <input
                      type="number"
                      value={a.score}
                      onChange={e => updateAssignment(a.id, 'score', e.target.value)}
                      placeholder="0"
                      className="w-full bg-[#1c1c1c] rounded px-2 py-1.5 text-[#f0f0f0] placeholder-[#555] focus:outline-none focus:ring-1 focus:ring-[#6366f1] text-xs"
                    />
                  </td>
                  <td className="py-2 pr-3">
                    <input
                      type="number"
                      value={a.total}
                      onChange={e => updateAssignment(a.id, 'total', e.target.value)}
                      placeholder="100"
                      className="w-full bg-[#1c1c1c] rounded px-2 py-1.5 text-[#f0f0f0] placeholder-[#555] focus:outline-none focus:ring-1 focus:ring-[#6366f1] text-xs"
                    />
                  </td>
                  <td className="py-2 pr-3">
                    <input
                      type="number"
                      value={a.weight}
                      onChange={e => updateAssignment(a.id, 'weight', e.target.value)}
                      placeholder="–"
                      className="w-full bg-[#1c1c1c] rounded px-2 py-1.5 text-[#f0f0f0] placeholder-[#555] focus:outline-none focus:ring-1 focus:ring-[#6366f1] text-xs"
                    />
                  </td>
                  <td className="py-2 text-right">
                    <div className="flex items-center gap-2">
                      {rowPct !== null && (
                        <span className="text-xs" style={{ color: letterColor(gradeToLetter(rowPct)) }}>
                          {rowPct.toFixed(0)}%
                        </span>
                      )}
                      <button
                        onClick={() => removeRow(a.id)}
                        className="text-[#555] hover:text-[#ef4444] transition-colors text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <button
        onClick={addRow}
        className="text-xs text-[#6366f1] hover:text-[#818cf8] transition-colors"
      >
        + Add row
      </button>

      {letter && (
        <div className="flex items-center gap-6 bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-5">
          <div className="text-center">
            <p className="text-5xl font-bold" style={{ color: letterColor(letter) }}>{letter}</p>
            <p className="text-xs text-[#555] mt-1">Letter Grade</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-[#f0f0f0]">{finalPct.toFixed(1)}%</p>
            <p className="text-xs text-[#555]">{useWeights ? 'Weighted average' : 'Total points'}</p>
            <p className="text-xs text-[#555] mt-1">{filled.length} of {assignments.length} assignments entered</p>
          </div>
        </div>
      )}
    </div>
  )
}
