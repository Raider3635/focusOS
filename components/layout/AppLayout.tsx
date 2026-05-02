'use client'
import { UIProvider, useUI } from '@/context/UIContext'
import { Sidebar } from './Sidebar'
import { RightPanel } from './RightPanel'
import { Dashboard } from '@/components/dashboard/Dashboard'
import { TasksPage } from '@/components/tasks/TasksPage'
import { NotesPage } from '@/components/notes/NotesPage'
import { Modal } from '@/components/ui/Modal'
import { FocusTimerTool } from '@/components/tools/FocusTimerTool'
import { AssignmentBreaker } from '@/components/tools/AssignmentBreaker'
import { SmartExplainer } from '@/components/tools/SmartExplainer'
import { WorkChecker } from '@/components/tools/WorkChecker'
import { GradeCalculator } from '@/components/tools/GradeCalculator'
import { DecisionHelper } from '@/components/tools/DecisionHelper'
import { GoalPathGenerator } from '@/components/tools/GoalPathGenerator'
import { FocusMode } from '@/components/tools/FocusMode'

const TOOL_META: Record<string, { title: string; wide?: boolean }> = {
  timer:    { title: 'Focus Timer' },
  breaker:  { title: 'Assignment Breaker', wide: true },
  explainer:{ title: 'Smart Explainer', wide: true },
  checker:  { title: 'Work Checker', wide: true },
  grade:    { title: 'Grade Calculator' },
  decision: { title: 'Decision Helper', wide: true },
  goal:     { title: 'Goal Path Generator', wide: true },
}

function ToolModal() {
  const { activeTool, closeTool } = useUI()
  if (!activeTool || activeTool === 'focus') return null

  const meta = TOOL_META[activeTool]
  return (
    <Modal title={meta.title} onClose={closeTool} wide={meta.wide}>
      {activeTool === 'timer'    && <FocusTimerTool />}
      {activeTool === 'breaker'  && <AssignmentBreaker />}
      {activeTool === 'explainer'&& <SmartExplainer />}
      {activeTool === 'checker'  && <WorkChecker />}
      {activeTool === 'grade'    && <GradeCalculator />}
      {activeTool === 'decision' && <DecisionHelper />}
      {activeTool === 'goal'     && <GoalPathGenerator />}
    </Modal>
  )
}

function MainContent() {
  const { activePage, activeTool, closeTool } = useUI()
  return (
    <>
      <div className="flex h-screen bg-[#0f0f0f] text-[#f0f0f0] overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto min-w-0">
          {activePage === 'dashboard' && <Dashboard />}
          {activePage === 'tasks'     && <TasksPage />}
          {activePage === 'notes'     && <NotesPage />}
        </main>
        <RightPanel />
      </div>
      <ToolModal />
      {activeTool === 'focus' && <FocusMode onClose={closeTool} />}
    </>
  )
}

export function AppLayout() {
  return (
    <UIProvider>
      <MainContent />
    </UIProvider>
  )
}
