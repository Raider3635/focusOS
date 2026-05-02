'use client'
import { useState } from 'react'
import { useApp } from '@/context/AppContext'

interface Step {
  text: string
  minutes: number
}

function breakAssignment(title: string, dueDate: string, details: string): Step[] {
  const lower = (title + ' ' + details).toLowerCase()
  const steps: Step[] = []

  if (lower.includes('essay') || lower.includes('paper') || lower.includes('write')) {
    steps.push(
      { text: 'Understand the prompt and define your thesis', minutes: 20 },
      { text: 'Research and gather sources', minutes: 45 },
      { text: 'Create an outline with main points', minutes: 20 },
      { text: 'Write the introduction', minutes: 20 },
      { text: 'Write body paragraphs', minutes: 60 },
      { text: 'Write the conclusion', minutes: 20 },
      { text: 'Revise and proofread', minutes: 30 },
    )
  } else if (lower.includes('math') || lower.includes('problem') || lower.includes('calc')) {
    steps.push(
      { text: 'Read all problems and identify types', minutes: 10 },
      { text: 'Review relevant formulas and concepts', minutes: 20 },
      { text: 'Solve easier problems first', minutes: 30 },
      { text: 'Tackle harder problems with scratch work', minutes: 40 },
      { text: 'Check all work and verify answers', minutes: 15 },
    )
  } else if (lower.includes('project') || lower.includes('presentation')) {
    steps.push(
      { text: 'Define scope and objectives', minutes: 15 },
      { text: 'Research and gather materials', minutes: 45 },
      { text: 'Plan structure and outline', minutes: 20 },
      { text: 'Build/write the main content', minutes: 90 },
      { text: 'Create visuals or slides', minutes: 30 },
      { text: 'Review and rehearse', minutes: 20 },
    )
  } else if (lower.includes('read') || lower.includes('chapter') || lower.includes('textbook')) {
    steps.push(
      { text: 'Skim headings and summary first', minutes: 10 },
      { text: 'Read section 1 actively with notes', minutes: 25 },
      { text: 'Read section 2 actively with notes', minutes: 25 },
      { text: 'Review notes and key concepts', minutes: 15 },
      { text: 'Answer any review questions', minutes: 15 },
    )
  } else if (lower.includes('code') || lower.includes('program') || lower.includes('implement')) {
    steps.push(
      { text: 'Understand requirements fully', minutes: 15 },
      { text: 'Plan data structures and architecture', minutes: 20 },
      { text: 'Implement core functionality', minutes: 60 },
      { text: 'Test edge cases and debug', minutes: 30 },
      { text: 'Refactor and clean up code', minutes: 20 },
      { text: 'Write documentation or comments', minutes: 15 },
    )
  } else {
    steps.push(
      { text: `Understand what "${title}" requires`, minutes: 15 },
      { text: 'Gather necessary materials or info', minutes: 20 },
      { text: 'Complete the main work', minutes: 60 },
      { text: 'Review and polish', minutes: 20 },
    )
  }

  return steps
}

export function AssignmentBreaker() {
  const { addTask } = useApp()
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [details, setDetails] = useState('')
  const [steps, setSteps] = useState<Step[]>([])
  const [added, setAdded] = useState<Set<number>>(new Set())

  function handleBreak() {
    if (!title.trim()) return
    setSteps(breakAssignment(title.trim(), dueDate, details))
    setAdded(new Set())
  }

  function handleAddStep(i: number, step: Step) {
    addTask({ title: step.text, description: `Part of: ${title}`, priority: 'medium', dueDate: dueDate || undefined })
    setAdded(prev => new Set(Array.from(prev).concat(i)))
  }

  function handleAddAll() {
    steps.forEach((step, i) => {
      if (!added.has(i)) handleAddStep(i, step)
    })
  }

  const totalMinutes = steps.reduce((s, step) => s + step.minutes, 0)

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Assignment title (e.g. 'Write an essay on climate change')"
          className="w-full bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-[#f0f0f0] placeholder-[#555] focus:outline-none focus:border-[#6366f1] transition-colors"
        />
        <div className="flex gap-3">
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-[#f0f0f0] focus:outline-none focus:border-[#6366f1] transition-colors"
          />
          <input
            value={details}
            onChange={e => setDetails(e.target.value)}
            placeholder="Extra details (optional)"
            className="flex-1 bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-[#f0f0f0] placeholder-[#555] focus:outline-none focus:border-[#6366f1] transition-colors"
          />
        </div>
        <button
          onClick={handleBreak}
          className="w-full py-2.5 bg-[#6366f1] text-white text-sm rounded-lg hover:bg-[#5558e8] transition-colors font-medium"
        >
          Break It Down
        </button>
      </div>

      {steps.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-[#f0f0f0]">{steps.length} steps · ~{totalMinutes} minutes</p>
              <p className="text-xs text-[#555]">Add steps to your task list</p>
            </div>
            <button
              onClick={handleAddAll}
              className="text-xs px-3 py-1.5 bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg text-[#888] hover:text-[#f0f0f0] transition-colors"
            >
              Add All
            </button>
          </div>
          <div className="space-y-2">
            {steps.map((step, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                added.has(i) ? 'border-[#22c55e]/20 bg-[#22c55e]/5' : 'border-[#2a2a2a] bg-[#1c1c1c]'
              }`}>
                <span className="text-xs text-[#555] w-5 text-center flex-shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#f0f0f0]">{step.text}</p>
                  <p className="text-xs text-[#555] mt-0.5">~{step.minutes} min</p>
                </div>
                <button
                  onClick={() => handleAddStep(i, step)}
                  disabled={added.has(i)}
                  className={`text-xs px-3 py-1 rounded-md transition-colors flex-shrink-0 ${
                    added.has(i)
                      ? 'text-[#22c55e] cursor-default'
                      : 'text-[#6366f1] hover:bg-[#6366f1]/10'
                  }`}
                >
                  {added.has(i) ? '✓ Added' : '+ Add'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
