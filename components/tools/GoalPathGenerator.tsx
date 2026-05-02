'use client'
import { useState } from 'react'
import { useApp } from '@/context/AppContext'

interface Milestone {
  week: number
  title: string
  tasks: string[]
}

function generatePath(goal: string, timeframe: string, level: string): Milestone[] {
  const g = goal.toLowerCase()
  const weeks = timeframe === '1month' ? 4 : timeframe === '3months' ? 12 : timeframe === '6months' ? 24 : 8

  const segment = Math.ceil(weeks / 4)

  if (g.includes('code') || g.includes('program') || g.includes('develop') || g.includes('learn') && g.includes('python')) {
    return [
      { week: segment, title: 'Foundations', tasks: ['Set up your development environment', 'Complete beginner tutorials', 'Build your first "Hello World" project', 'Learn core syntax and data types'] },
      { week: segment * 2, title: 'Core Concepts', tasks: ['Learn control flow (loops, conditions)', 'Understand functions and scope', 'Work through 10 practice exercises', 'Read documentation regularly'] },
      { week: segment * 3, title: 'Build Projects', tasks: ['Complete a small guided project', 'Debug your first real errors', 'Learn a key library or framework', 'Push code to GitHub'] },
      { week: weeks, title: 'Ship Something', tasks: ['Complete your personal project', 'Get feedback and iterate', 'Document what you built', 'Plan your next steps'] },
    ]
  }

  if (g.includes('exam') || g.includes('test') || g.includes('study') || g.includes('gpa')) {
    return [
      { week: Math.max(1, Math.ceil(weeks * 0.2)), title: 'Audit & Plan', tasks: ['List every topic on the syllabus', 'Identify your weakest areas', 'Gather all materials', 'Create a study schedule'] },
      { week: Math.ceil(weeks * 0.5), title: 'Deep Study', tasks: ['Complete all readings', 'Make concept maps for key topics', 'Do practice problems daily', 'Form or join a study group'] },
      { week: Math.ceil(weeks * 0.8), title: 'Review & Test', tasks: ['Take 3+ practice exams', 'Review mistakes thoroughly', 'Condense notes to key points', 'Simulate exam conditions'] },
      { week: weeks, title: 'Final Push', tasks: ['Light review of hardest topics', 'Rest and sleep well', 'Prepare materials night before', 'Execute your exam strategy'] },
    ]
  }

  if (g.includes('fit') || g.includes('health') || g.includes('exercise') || g.includes('gym')) {
    return [
      { week: segment, title: 'Build Habit', tasks: ['Schedule workout times in your calendar', 'Start with 3x/week sessions', 'Learn proper form for basics', 'Track workouts in a journal'] },
      { week: segment * 2, title: 'Establish Routine', tasks: ['Increase to 4x/week', 'Add nutrition tracking', 'Measure progress baseline', 'Find an accountability partner'] },
      { week: segment * 3, title: 'Progress', tasks: ['Increase intensity or weight', 'Add cardio sessions', 'Refine nutrition habits', 'Take progress photos'] },
      { week: weeks, title: 'Optimize', tasks: ['Hit your target metric', 'Review what worked', 'Plan next cycle', 'Celebrate the win'] },
    ]
  }

  return [
    { week: segment, title: 'Research & Setup', tasks: [`Clearly define what "${goal}" looks like done`, 'Research the best approach', 'Gather tools and resources', 'Set a measurable first milestone'] },
    { week: segment * 2, title: 'Build Momentum', tasks: ['Complete foundational work', 'Establish a daily habit', 'Get early feedback', 'Adjust based on what you learn'] },
    { week: segment * 3, title: 'Deep Work', tasks: ['Focus on the hardest parts', 'Track progress weekly', 'Remove obstacles blocking you', 'Stay consistent'] },
    { week: weeks, title: 'Cross the Finish Line', tasks: ['Complete remaining work', 'Review and polish', 'Measure your outcome', 'Reflect on what you learned'] },
  ]
}

export function GoalPathGenerator() {
  const { addTask } = useApp()
  const [goal, setGoal] = useState('')
  const [timeframe, setTimeframe] = useState('2months')
  const [level, setLevel] = useState('beginner')
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [added, setAdded] = useState<Set<string>>(new Set())

  function handleGenerate() {
    if (!goal.trim()) return
    setMilestones(generatePath(goal.trim(), timeframe, level))
    setAdded(new Set())
  }

  function handleAddTask(mIdx: number, tIdx: number, text: string) {
    const key = `${mIdx}-${tIdx}`
    addTask({ title: text, description: `Goal: ${goal}`, priority: 'medium' })
    setAdded(prev => new Set(Array.from(prev).concat(key)))
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <input
          value={goal}
          onChange={e => setGoal(e.target.value)}
          placeholder="What's your goal? (e.g. 'Learn Python', 'Pass my finals', 'Get fit')"
          className="w-full bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-[#f0f0f0] placeholder-[#555] focus:outline-none focus:border-[#6366f1] transition-colors"
        />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-[#555] mb-1 block">Timeframe</label>
            <select
              value={timeframe}
              onChange={e => setTimeframe(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-[#f0f0f0] focus:outline-none focus:border-[#6366f1]"
            >
              <option value="1month">1 Month</option>
              <option value="2months">2 Months</option>
              <option value="3months">3 Months</option>
              <option value="6months">6 Months</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-[#555] mb-1 block">Starting Level</label>
            <select
              value={level}
              onChange={e => setLevel(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-[#f0f0f0] focus:outline-none focus:border-[#6366f1]"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={!goal.trim()}
          className="w-full py-2.5 bg-[#6366f1] text-white text-sm rounded-lg hover:bg-[#5558e8] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Generate Path
        </button>
      </div>

      {milestones.length > 0 && (
        <div className="space-y-3">
          {milestones.map((m, mIdx) => (
            <div key={mIdx} className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-6 rounded-full bg-[#6366f1]/15 flex items-center justify-center">
                  <span className="text-xs text-[#6366f1] font-medium">{mIdx + 1}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#f0f0f0]">{m.title}</p>
                  <p className="text-xs text-[#555]">By week {m.week}</p>
                </div>
              </div>
              <div className="space-y-2 pl-9">
                {m.tasks.map((task, tIdx) => {
                  const key = `${mIdx}-${tIdx}`
                  return (
                    <div key={tIdx} className="flex items-start gap-2">
                      <p className="flex-1 text-xs text-[#888] leading-relaxed">{task}</p>
                      <button
                        onClick={() => handleAddTask(mIdx, tIdx, task)}
                        disabled={added.has(key)}
                        className={`text-xs flex-shrink-0 transition-colors ${
                          added.has(key) ? 'text-[#22c55e] cursor-default' : 'text-[#555] hover:text-[#6366f1]'
                        }`}
                      >
                        {added.has(key) ? '✓' : '+'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
