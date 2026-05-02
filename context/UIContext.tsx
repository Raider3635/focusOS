'use client'
import { createContext, useContext, useState, type ReactNode } from 'react'
import type { NavPage, ToolId } from '@/types'

interface UIState {
  activePage: NavPage
  activeTool: ToolId | null
  focusMode: boolean
  navigate: (p: NavPage) => void
  openTool: (t: ToolId) => void
  closeTool: () => void
  setFocusMode: (v: boolean) => void
}

const UICtx = createContext<UIState | null>(null)

export function UIProvider({ children }: { children: ReactNode }) {
  const [activePage, setActivePage] = useState<NavPage>('dashboard')
  const [activeTool, setActiveTool] = useState<ToolId | null>(null)
  const [focusMode, setFocusMode] = useState(false)

  return (
    <UICtx.Provider value={{
      activePage, activeTool, focusMode,
      navigate: setActivePage,
      openTool: setActiveTool,
      closeTool: () => setActiveTool(null),
      setFocusMode,
    }}>
      {children}
    </UICtx.Provider>
  )
}

export function useUI() {
  const ctx = useContext(UICtx)
  if (!ctx) throw new Error('useUI must be inside UIProvider')
  return ctx
}
