'use client'
import { useEffect, type ReactNode } from 'react'

interface ModalProps {
  title: string
  onClose: () => void
  children: ReactNode
  wide?: boolean
}

export function Modal({ title, onClose, children, wide }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative z-10 w-full ${wide ? 'max-w-3xl' : 'max-w-xl'} max-h-[88vh] flex flex-col bg-[#141414] border border-[#2a2a2a] rounded-2xl shadow-2xl animate-slide-up`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a] flex-shrink-0">
          <h2 className="font-semibold text-[#f0f0f0]">{title}</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#888] hover:text-[#f0f0f0] hover:bg-[#252525] transition-colors text-sm"
          >
            ✕
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}
