'use client'
import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import type { Note } from '@/types'

function NoteEditor({ note, onClose }: { note: Note | null; onClose: () => void }) {
  const { addNote, updateNote } = useApp()
  const [title, setTitle] = useState(note?.title ?? '')
  const [content, setContent] = useState(note?.content ?? '')

  function handleSave() {
    if (!title.trim()) return
    if (note) {
      updateNote(note.id, { title: title.trim(), content })
    } else {
      addNote(title.trim(), content)
    }
    onClose()
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-8 py-4 border-b border-[#2a2a2a] flex-shrink-0">
        <input
          autoFocus
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Note title..."
          className="flex-1 bg-transparent text-xl font-semibold text-[#f0f0f0] placeholder-[#555] focus:outline-none"
        />
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={handleSave}
            className="px-4 py-1.5 bg-[#6366f1] text-white text-sm rounded-lg hover:bg-[#5558e8] transition-colors font-medium"
          >
            Save
          </button>
          <button onClick={onClose} className="text-[#555] hover:text-[#f0f0f0] transition-colors text-sm px-2 py-1.5">
            Cancel
          </button>
        </div>
      </div>
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Start writing..."
        className="flex-1 bg-transparent px-8 py-6 text-sm text-[#f0f0f0] placeholder-[#555] focus:outline-none resize-none leading-relaxed"
      />
    </div>
  )
}

export function NotesPage() {
  const { notes, deleteNote } = useApp()
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Note | null | 'new'>(null)

  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  )

  if (editing === 'new' || (editing && editing !== null)) {
    return (
      <div className="h-screen flex flex-col bg-[#0f0f0f]">
        <NoteEditor note={editing === 'new' ? null : editing} onClose={() => setEditing(null)} />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#f0f0f0]">Notes</h1>
        <button
          onClick={() => setEditing('new')}
          className="px-4 py-2 bg-[#6366f1] text-white text-sm rounded-lg hover:bg-[#5558e8] transition-colors font-medium"
        >
          + New Note
        </button>
      </div>

      <div className="mb-5">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search notes..."
          className="w-full bg-[#141414] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-[#f0f0f0] placeholder-[#555] focus:outline-none focus:border-[#6366f1] transition-colors"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-[#555] text-sm">{search ? 'No notes match your search.' : 'No notes yet. Create your first one.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map(note => (
            <div
              key={note.id}
              className="group bg-[#141414] border border-[#2a2a2a] rounded-xl p-4 cursor-pointer hover:border-[#6366f1]/40 transition-all"
              onClick={() => setEditing(note)}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium text-[#f0f0f0] text-sm line-clamp-1">{note.title}</h3>
                <button
                  onClick={e => { e.stopPropagation(); deleteNote(note.id) }}
                  className="opacity-0 group-hover:opacity-100 text-[#555] hover:text-[#ef4444] transition-all text-xs flex-shrink-0"
                >
                  ✕
                </button>
              </div>
              {note.content && (
                <p className="text-xs text-[#555] mt-2 line-clamp-3 leading-relaxed">{note.content}</p>
              )}
              <p className="text-xs text-[#444] mt-3">
                {new Date(note.updatedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
