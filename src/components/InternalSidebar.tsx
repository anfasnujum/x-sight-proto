import {
  Activity,
  Archive,
  Binoculars,
  CircleDot,
  FileStack,
  FolderOpen,
  History,
  Layers,
  LayoutDashboard,
  ListTodo,
  Plus,
  Radar,
  Shield,
  Sparkles,
  StickyNote,
  Table2,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { useForensicStore } from '../store/useForensicStore'
import type { ForensicCase } from '../types'

function SidebarSectionTitle({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
      {children}
    </p>
  )
}

function NavRow({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
        active
          ? 'bg-zinc-800/90 text-white'
          : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
      }`}
    >
      {children}
    </button>
  )
}

export function InternalSidebar() {
  const mainNav = useForensicStore((s) => s.mainNav)
  const cases = useForensicStore((s) => s.cases)
  const activeCaseId = useForensicStore((s) => s.activeCaseId)
  const setActiveCase = useForensicStore((s) => s.setActiveCase)
  const addCase = useForensicStore((s) => s.addCase)
  const dashboardSection = useForensicStore((s) => s.dashboardSection)
  const setDashboardSection = useForensicStore((s) => s.setDashboardSection)
  const casesSidebarFilter = useForensicStore((s) => s.casesSidebarFilter)
  const setCasesSidebarFilter = useForensicStore((s) => s.setCasesSidebarFilter)
  const birdsEyeLens = useForensicStore((s) => s.birdsEyeLens)
  const setBirdsEyeLens = useForensicStore((s) => s.setBirdsEyeLens)

  function handleNewCase() {
    const name = window.prompt('Case name', 'New investigation')
    if (!name?.trim()) return
    const id = `case-${Date.now()}`
    const c: ForensicCase = {
      id,
      name: name.trim(),
      status: 'open',
      priority: 'medium',
      updatedAt: new Date().toISOString(),
    }
    addCase(c)
  }

  const recent = [...cases]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 8)

  const statusFilters: { id: typeof casesSidebarFilter; label: string }[] = [
    { id: 'all', label: 'All cases' },
    { id: 'open', label: 'Open' },
    { id: 'review', label: 'In review' },
    { id: 'closed', label: 'Closed' },
  ]

  return (
    <aside className="flex h-full min-h-0 w-[232px] shrink-0 flex-col border-r border-zinc-800/90 bg-[#0a0b0e]">
      {mainNav === 'dashboard' && (
        <>
          <div className="flex h-14 items-center border-b border-zinc-800/90 px-4">
            <LayoutDashboard className="mr-2 h-4 w-4 text-zinc-500" />
            <span className="font-semibold tracking-tight text-zinc-100">
              Dashboard
            </span>
          </div>
          <nav className="flex flex-col gap-0.5 p-2">
            <NavRow
              active={dashboardSection === 'overview'}
              onClick={() => setDashboardSection('overview')}
            >
              <CircleDot className="h-4 w-4 shrink-0" />
              Overview
            </NavRow>
            <NavRow
              active={dashboardSection === 'signals'}
              onClick={() => setDashboardSection('signals')}
            >
              <Radar className="h-4 w-4 shrink-0" />
              Signals
            </NavRow>
            <NavRow
              active={dashboardSection === 'reports'}
              onClick={() => setDashboardSection('reports')}
            >
              <Activity className="h-4 w-4 shrink-0" />
              Reports
            </NavRow>
          </nav>
          <div className="mt-auto border-t border-zinc-800/90 p-3">
            <p className="text-[11px] leading-relaxed text-zinc-600">
              Switch lenses in the bird&apos;s view for cross-case panorama.
            </p>
          </div>
        </>
      )}

      {mainNav === 'cases' && (
        <>
          <div className="flex h-14 items-center border-b border-zinc-800/90 px-4">
            <FolderOpen className="mr-2 h-4 w-4 text-zinc-500" />
            <span className="font-semibold tracking-tight text-zinc-100">
              Cases
            </span>
          </div>
          <div className="px-2 pt-2">
            <button
              type="button"
              onClick={handleNewCase}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-violet-500/35 bg-violet-500/10 px-3 py-2 text-sm font-medium text-violet-200 transition hover:bg-violet-500/20"
            >
              <Plus className="h-4 w-4" />
              New case
            </button>
          </div>
          <nav className="mt-3 flex flex-col gap-0.5 px-2">
            <SidebarSectionTitle>Filter</SidebarSectionTitle>
            {statusFilters.map(({ id, label }) => (
              <NavRow
                key={id}
                active={casesSidebarFilter === id}
                onClick={() => setCasesSidebarFilter(id)}
              >
                <Shield className="h-4 w-4 shrink-0 opacity-60" />
                {label}
              </NavRow>
            ))}
          </nav>
        </>
      )}

      {mainNav === 'chat' && (
        <>
          <div className="flex h-14 items-center gap-2 border-b border-zinc-800/90 px-4">
            <Sparkles className="h-5 w-5 text-violet-400" aria-hidden />
            <div className="min-w-0">
              <span className="block truncate font-semibold tracking-tight text-zinc-100">
                Forensic AI
              </span>
              <span className="text-[10px] text-zinc-500">Investigation</span>
            </div>
          </div>
          <div className="px-2 pt-3">
            <button
              type="button"
              onClick={handleNewCase}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-700/80 bg-zinc-900/50 px-3 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800"
            >
              <Plus className="h-4 w-4" />
              New case
            </button>
          </div>
          <div className="mt-4 flex min-h-0 flex-1 flex-col px-3 pb-4">
            <SidebarSectionTitle>Recent cases</SidebarSectionTitle>
            <ul className="scrollbar-thin flex flex-col gap-1 overflow-y-auto">
              {recent.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setActiveCase(c.id)}
                    className={`flex w-full flex-col rounded-lg border px-2.5 py-2 text-left transition ${
                      activeCaseId === c.id
                        ? 'border-violet-500/40 bg-violet-500/5'
                        : 'border-transparent hover:border-zinc-800 hover:bg-zinc-900/80'
                    }`}
                  >
                    <span className="truncate text-sm text-zinc-200">
                      {c.name}
                    </span>
                    <span className="text-[11px] capitalize text-zinc-500">
                      {c.status} · {c.priority}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {mainNav === 'birds_view' && (
        <>
          <div className="flex h-14 items-center border-b border-zinc-800/90 px-4">
            <Binoculars className="mr-2 h-4 w-4 text-zinc-500" />
            <span className="font-semibold tracking-tight text-zinc-100">
              Bird&apos;s view
            </span>
          </div>
          <nav className="flex flex-col gap-0.5 p-2">
            <NavRow
              active={birdsEyeLens === 'panorama'}
              onClick={() => setBirdsEyeLens('panorama')}
            >
              <Layers className="h-4 w-4 shrink-0" />
              Panorama
            </NavRow>
            <NavRow
              active={birdsEyeLens === 'entities'}
              onClick={() => setBirdsEyeLens('entities')}
            >
              <Table2 className="h-4 w-4 shrink-0" />
              Entities
            </NavRow>
            <NavRow
              active={birdsEyeLens === 'timeline'}
              onClick={() => setBirdsEyeLens('timeline')}
            >
              <History className="h-4 w-4 shrink-0" />
              Timeline lens
            </NavRow>
            <NavRow
              active={birdsEyeLens === 'evidences'}
              onClick={() => setBirdsEyeLens('evidences')}
            >
              <FileStack className="h-4 w-4 shrink-0" />
              Evidences
            </NavRow>
            <NavRow
              active={birdsEyeLens === 'notes'}
              onClick={() => setBirdsEyeLens('notes')}
            >
              <StickyNote className="h-4 w-4 shrink-0" />
              Notes
            </NavRow>
            <NavRow
              active={birdsEyeLens === 'data_dump'}
              onClick={() => setBirdsEyeLens('data_dump')}
            >
              <Archive className="h-4 w-4 shrink-0" />
              Data dump
            </NavRow>
            <NavRow
              active={birdsEyeLens === 'tasks'}
              onClick={() => setBirdsEyeLens('tasks')}
            >
              <ListTodo className="h-4 w-4 shrink-0" />
              Tasks
            </NavRow>
          </nav>
          <div className="mt-auto border-t border-zinc-800/90 p-3">
            <p className="text-[11px] leading-relaxed text-zinc-600">
              Cross-case readouts. Does not replace chat evidence — augments
              it.
            </p>
          </div>
        </>
      )}
    </aside>
  )
}
