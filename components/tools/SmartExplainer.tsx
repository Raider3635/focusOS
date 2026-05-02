'use client'
import { useState } from 'react'

type Level = 'simple' | 'detailed' | 'expert'

const LEVEL_LABELS: Record<Level, string> = {
  simple: 'Simple (ELI5)',
  detailed: 'Detailed',
  expert: 'Expert',
}

const LEVEL_PROMPTS: Record<Level, string> = {
  simple: 'Explain this like I\'m 12. Use analogies and simple words.',
  detailed: 'Explain this clearly with key concepts, examples, and why it matters.',
  expert: 'Give a technical, in-depth explanation with nuances and edge cases.',
}

function generateExplanation(topic: string, level: Level): string {
  const t = topic.trim()
  if (level === 'simple') {
    return `**${t} — Simple Explanation**\n\nImagine you're trying to explain ${t.toLowerCase()} to a friend who's never heard of it. At its core, it's basically about [the fundamental idea in very plain terms].\n\nThink of it like this: [a familiar analogy would go here].\n\nThe key thing to remember is that it helps us [the main benefit or use case]. Without it, we'd have a harder time [what problem it solves].\n\n*Tip: To go deeper, try looking up the main building blocks of ${t}.*`
  } else if (level === 'detailed') {
    return `**${t} — Detailed Explanation**\n\n**What it is:**\n${t} refers to [a clear definition with context]. It plays an important role in [field or application].\n\n**Key concepts:**\n• [First important concept] — explains how [mechanism or principle]\n• [Second important concept] — describes [related idea]\n• [Third concept] — connects to [broader context]\n\n**Why it matters:**\nUnderstanding ${t} is crucial because [practical importance]. In practice, you'll see it applied in [real-world examples].\n\n**Common misconception:**\nMany people confuse ${t} with [similar concept], but the key difference is [distinction].\n\n*To learn more: look for [recommended resource type] on ${t}.*`
  } else {
    return `**${t} — Expert Overview**\n\n**Technical definition:**\n${t} is formally defined as [precise technical definition]. It is characterized by [key properties] and operates under the constraint that [important invariant or assumption].\n\n**Mechanistic breakdown:**\n1. [Step or layer 1] — at this level, [technical detail]\n2. [Step or layer 2] — which produces [output or effect]\n3. [Step or layer 3] — ultimately resulting in [outcome]\n\n**Edge cases and nuances:**\nThe behavior diverges from the naive model when [edge condition]. Specifically, [what happens] because [technical reason].\n\n**Open questions / current research:**\nThe field is still exploring [unsolved problem] and debating [contested area]. Recent work suggests [direction].\n\n*Key references: [type of primary literature] on ${t}.*`
  }
}

export function SmartExplainer() {
  const [topic, setTopic] = useState('')
  const [level, setLevel] = useState<Level>('detailed')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  function handleExplain() {
    if (!topic.trim()) return
    setLoading(true)
    setOutput('')
    setTimeout(() => {
      setOutput(generateExplanation(topic, level))
      setLoading(false)
    }, 600)
  }

  const lines = output.split('\n')

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <input
          value={topic}
          onChange={e => setTopic(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleExplain()}
          placeholder="Enter a topic or concept (e.g. 'quantum entanglement', 'the French Revolution')"
          className="w-full bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-[#f0f0f0] placeholder-[#555] focus:outline-none focus:border-[#6366f1] transition-colors"
        />
        <div className="flex gap-1 bg-[#1c1c1c] rounded-lg p-1">
          {(Object.keys(LEVEL_LABELS) as Level[]).map(l => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`flex-1 py-1.5 text-xs rounded-md transition-colors ${
                level === l ? 'bg-[#252525] text-[#f0f0f0]' : 'text-[#555] hover:text-[#888]'
              }`}
            >
              {LEVEL_LABELS[l]}
            </button>
          ))}
        </div>
        <button
          onClick={handleExplain}
          disabled={loading || !topic.trim()}
          className="w-full py-2.5 bg-[#6366f1] text-white text-sm rounded-lg hover:bg-[#5558e8] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Thinking...' : 'Explain'}
        </button>
      </div>

      {output && (
        <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-4 space-y-2">
          {lines.map((line, i) => {
            if (line.startsWith('**') && line.endsWith('**')) {
              return <h3 key={i} className="text-sm font-semibold text-[#f0f0f0] mt-3 first:mt-0">{line.replace(/\*\*/g, '')}</h3>
            }
            if (line.startsWith('• ') || line.match(/^\d+\./)) {
              return <p key={i} className="text-sm text-[#888] pl-3">{line}</p>
            }
            if (line.startsWith('*') && line.endsWith('*')) {
              return <p key={i} className="text-xs text-[#555] italic mt-2">{line.replace(/\*/g, '')}</p>
            }
            if (!line) return <div key={i} className="h-1" />
            return <p key={i} className="text-sm text-[#888] leading-relaxed">{line}</p>
          })}
        </div>
      )}

      <p className="text-xs text-[#444] text-center">
        Connect this tool to an AI API for real explanations
      </p>
    </div>
  )
}
