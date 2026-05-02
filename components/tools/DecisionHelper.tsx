'use client'
import { useState } from 'react'

interface Item { id: string; text: string; weight: number }

function uid() { return Math.random().toString(36).slice(2) }
function blank(): Item { return { id: uid(), text: '', weight: 1 } }

export function DecisionHelper() {
  const [question, setQuestion] = useState('')
  const [pros, setPros] = useState<Item[]>([blank(), blank()])
  const [cons, setCons] = useState<Item[]>([blank(), blank()])

  function updateItem(list: Item[], setList: (v: Item[]) => void, id: string, field: keyof Item, value: string | number) {
    setList(list.map(x => x.id === id ? { ...x, [field]: value } : x))
  }

  function addItem(list: Item[], setList: (v: Item[]) => void) {
    setList([...list, blank()])
  }

  function removeItem(list: Item[], setList: (v: Item[]) => void, id: string) {
    if (list.length <= 1) return
    setList(list.filter(x => x.id !== id))
  }

  const proScore = pros.filter(p => p.text.trim()).reduce((s, p) => s + p.weight, 0)
  const conScore = cons.filter(c => c.text.trim()).reduce((s, c) => s + c.weight, 0)
  const total = proScore + conScore
  const proPct = total > 0 ? Math.round((proScore / total) * 100) : 50

  const verdict = proScore > conScore
    ? { text: 'Lean Yes', color: '#22c55e' }
    : proScore < conScore
    ? { text: 'Lean No', color: '#ef4444' }
    : { text: 'It\'s a tie', color: '#eab308' }

  function ItemList({ items, setItems, label, color }: { items: Item[]; setItems: (v: Item[]) => void; label: string; color: string }) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full" style={{ background: color }} />
          <p className="text-sm font-medium text-[#f0f0f0]">{label}</p>
          <span className="text-xs text-[#555] ml-auto">Score: {items.filter(i => i.text.trim()).reduce((s, i) => s + i.weight, 0)}</span>
        </div>
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-2">
              <input
                value={item.text}
                onChange={e => updateItem(items, setItems, item.id, 'text', e.target.value)}
                placeholder={`Add ${label.toLowerCase()} point...`}
                className="flex-1 bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-[#f0f0f0] placeholder-[#555] focus:outline-none focus:border-[#6366f1] transition-colors"
              />
              <select
                value={item.weight}
                onChange={e => updateItem(items, setItems, item.id, 'weight', Number(e.target.value))}
                className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg px-2 py-2 text-sm text-[#888] focus:outline-none w-16"
              >
                {[1, 2, 3].map(w => <option key={w} value={w}>{w}×</option>)}
              </select>
              <button
                onClick={() => removeItem(items, setItems, item.id)}
                className="text-[#555] hover:text-[#ef4444] transition-colors text-xs w-5"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => addItem(items, setItems)}
          className="mt-2 text-xs text-[#555] hover:text-[#888] transition-colors"
        >
          + Add point
        </button>
      </div>
    )
  }

  const filledPros = pros.filter(p => p.text.trim()).length
  const filledCons = cons.filter(c => c.text.trim()).length

  return (
    <div className="space-y-5">
      <input
        value={question}
        onChange={e => setQuestion(e.target.value)}
        placeholder="What are you deciding? (e.g. 'Should I take this course?')"
        className="w-full bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-[#f0f0f0] placeholder-[#555] focus:outline-none focus:border-[#6366f1] transition-colors"
      />

      <div className="grid grid-cols-2 gap-5">
        <ItemList items={pros} setItems={setPros} label="Pros" color="#22c55e" />
        <ItemList items={cons} setItems={setCons} label="Cons" color="#ef4444" />
      </div>

      {(filledPros > 0 || filledCons > 0) && (
        <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[#22c55e]">Pros {proScore}</span>
            <span className="text-sm font-semibold" style={{ color: verdict.color }}>{verdict.text}</span>
            <span className="text-xs text-[#ef4444]">{conScore} Cons</span>
          </div>
          <div className="h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 bg-[#22c55e]"
              style={{ width: `${proPct}%` }}
            />
          </div>
          <p className="text-xs text-[#555] text-center mt-2">{proPct}% weighted in favor</p>
        </div>
      )}
    </div>
  )
}
