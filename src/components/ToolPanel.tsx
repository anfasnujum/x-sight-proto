import { FileText, PanelRightClose, PanelRightOpen } from 'lucide-react'
import { getToolById } from '../data/tools'
import type { RightPanelTab } from '../types'
import { useForensicStore } from '../store/useForensicStore'
import { EntitiesSection } from './panel/EntitiesSection'
import { EvidencesSection } from './panel/EvidencesSection'
import { NotesSection } from './panel/NotesSection'
import { TasksSection } from './panel/TasksSection'
import { ToolsSection } from './panel/ToolsSection'
import { DocumentViewerSection } from './panel/DocumentViewerSection'

const TABS: { id: RightPanelTab; label: string }[] = [
  { id: 'tools', label: 'Tools' },
  { id: 'document_viewer', label: 'Viewer' },
  { id: 'entities', label: 'Entities' },
  { id: 'evidences', label: 'Evidences' },
  { id: 'notes', label: 'Notes' },
  { id: 'tasks', label: 'Tasks' },
]

export function ToolPanel() {
  const activeTool = useForensicStore((s) => s.toolState.activeTool)
  const panelOpen = useForensicStore((s) => s.toolState.panelOpen)
  const setPanelOpen = useForensicStore((s) => s.setPanelOpen)
  const tab = useForensicStore((s) => s.rightPanelTab)
  const setTab = useForensicStore((s) => s.setRightPanelTab)
  const documentViewer = useForensicStore((s) => s.documentViewer)

  let kicker = 'Inspector'
  let title = ''
  switch (tab) {
    case 'tools':
      kicker = 'Tools'
      title = activeTool
        ? `Running · ${getToolById(activeTool).name}`
        : 'Available tools & inspectors'
      break
    case 'document_viewer':
      kicker = 'Viewer'
      title = documentViewer?.title ?? 'Open a file from Data dump'
      break
    case 'entities':
      kicker = 'Entities'
      title = 'People, companies & organizations'
      break
    case 'evidences':
      kicker = 'Evidence'
      title = 'Artifacts, links, and analyst thoughts'
      break
    case 'notes':
      kicker = 'Notes'
      title = 'Case scratchpad'
      break
    case 'tasks':
      kicker = 'Tasks'
      title = 'AI queue & human follow-ups'
      break
  }

  return (
    <aside
      className={`relative flex shrink-0 flex-col border-l border-zinc-800/90 bg-[#090a0c] transition-[width] duration-300 ease-out ${
        panelOpen ? 'w-[420px]' : 'w-12'
      }`}
    >
      <button
        type="button"
        onClick={() => setPanelOpen(!panelOpen)}
        className="absolute left-0 top-14 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-zinc-400 shadow-soft hover:text-zinc-100"
        title={panelOpen ? 'Collapse panel' : 'Expand panel'}
      >
        {panelOpen ? (
          <PanelRightClose className="h-4 w-4" />
        ) : (
          <PanelRightOpen className="h-4 w-4" />
        )}
      </button>

      <div
        className={`flex min-h-0 flex-1 flex-col overflow-hidden ${panelOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      >
        <div className="border-b border-zinc-800/90 px-3 pb-3 pt-3">
          <div className="flex flex-wrap gap-1">
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[11px] font-semibold transition ${
                  tab === id
                    ? 'bg-violet-600/35 text-violet-100 ring-1 ring-violet-500/40'
                    : 'bg-zinc-900/80 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'
                }`}
              >
                {id === 'document_viewer' && (
                  <FileText className="h-3 w-3 shrink-0 opacity-80" aria-hidden />
                )}
                {label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            {kicker}
          </p>
          <p className="mt-0.5 text-sm font-medium leading-snug text-zinc-200">
            {title}
          </p>
        </div>

        {tab === 'tools' && <ToolsSection />}
        {tab === 'document_viewer' && <DocumentViewerSection />}
        {tab === 'entities' && <EntitiesSection />}
        {tab === 'evidences' && <EvidencesSection />}
        {tab === 'notes' && <NotesSection />}
        {tab === 'tasks' && <TasksSection />}
      </div>
    </aside>
  )
}
