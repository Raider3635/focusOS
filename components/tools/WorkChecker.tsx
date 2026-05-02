'use client'
import { useState } from 'react'

interface Metric {
  label: string
  value: string | number
  note: string
  color: string
}

function analyzeText(text: string): Metric[] {
  const words = text.trim().split(/\s+/).filter(Boolean)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0)
  const chars = text.length
  const avgWordLen = words.length > 0 ? (words.reduce((s, w) => s + w.length, 0) / words.length).toFixed(1) : '0'
  const avgSentenceLen = sentences.length > 0 ? Math.round(words.length / sentences.length) : 0

  const complexWords = words.filter(w => w.length > 8).length
  const complexRatio = words.length > 0 ? (complexWords / words.length) : 0

  const readingMinutes = Math.ceil(words.length / 200)

  const metrics: Metric[] = [
    {
      label: 'Words', value: words.length,
      note: words.length < 100 ? 'Short piece' : words.length < 500 ? 'Medium length' : 'Long piece',
      color: '#6366f1',
    },
    {
      label: 'Sentences', value: sentences.length,
      note: `~${avgSentenceLen} words/sentence`,
      color: '#22c55e',
    },
    {
      label: 'Paragraphs', value: paragraphs.length,
      note: paragraphs.length > 0 ? `~${Math.round(sentences.length / paragraphs.length)} sentences each` : '–',
      color: '#eab308',
    },
    {
      label: 'Reading Time', value: `${readingMinutes}m`,
      note: 'at 200 wpm',
      color: '#888',
    },
  ]

  return metrics
}

function getIssues(text: string): string[] {
  const issues: string[] = []
  const words = text.trim().split(/\s+/).filter(Boolean)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)

  const avgSentLen = sentences.length > 0 ? words.length / sentences.length : 0
  if (avgSentLen > 25) issues.push('Sentences are quite long on average — consider breaking some up.')
  if (avgSentLen < 8 && sentences.length > 3) issues.push('Sentences may be too short — try varying length for better flow.')

  const filler = ['very', 'really', 'quite', 'basically', 'literally', 'actually', 'just']
  const fillerCount = words.filter(w => filler.includes(w.toLowerCase())).length
  if (fillerCount > 2) issues.push(`Found ${fillerCount} filler words (very/really/just/etc.) — cut these for cleaner prose.`)

  const passive = (text.match(/\b(was|were|is|are|been|be)\s+\w+ed\b/gi) || []).length
  if (passive > 2) issues.push(`${passive} possible passive constructions — active voice is usually stronger.`)

  if (!/[.!?]$/.test(text.trim())) issues.push('Text may not end with punctuation.')

  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim())
  if (paragraphs.length === 1 && words.length > 150) issues.push('No paragraph breaks detected — consider splitting into multiple paragraphs.')

  return issues
}

export function WorkChecker() {
  const [text, setText] = useState('')
  const [checked, setChecked] = useState(false)

  const metrics = checked && text.trim() ? analyzeText(text) : []
  const issues = checked && text.trim() ? getIssues(text) : []

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={e => { setText(e.target.value); setChecked(false) }}
        placeholder="Paste your writing here to analyze it..."
        rows={8}
        className="w-full bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-[#f0f0f0] placeholder-[#555] focus:outline-none focus:border-[#6366f1] transition-colors resize-none leading-relaxed"
      />

      <button
        onClick={() => setChecked(true)}
        disabled={!text.trim()}
        className="w-full py-2.5 bg-[#6366f1] text-white text-sm rounded-lg hover:bg-[#5558e8] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Analyze Writing
      </button>

      {checked && text.trim() && (
        <>
          <div className="grid grid-cols-4 gap-3">
            {metrics.map(m => (
              <div key={m.label} className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-3 text-center">
                <p className="text-xl font-semibold" style={{ color: m.color }}>{m.value}</p>
                <p className="text-xs text-[#888] mt-0.5">{m.label}</p>
                <p className="text-xs text-[#555] mt-0.5">{m.note}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-4">
            <p className="text-sm font-medium text-[#f0f0f0] mb-3">
              {issues.length === 0 ? '✓ No major issues found' : `${issues.length} suggestion${issues.length > 1 ? 's' : ''}`}
            </p>
            {issues.length === 0 ? (
              <p className="text-xs text-[#555]">Your writing looks clean. Good sentence variety and structure.</p>
            ) : (
              <div className="space-y-2">
                {issues.map((issue, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-[#eab308] text-xs mt-0.5 flex-shrink-0">!</span>
                    <p className="text-xs text-[#888] leading-relaxed">{issue}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
