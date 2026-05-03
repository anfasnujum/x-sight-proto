import { InternalSidebar } from './InternalSidebar'
import { PrimaryRail } from './PrimaryRail'
import { Topbar } from './Topbar'
import { ChatStream } from './ChatStream'
import { ToolPanel } from './ToolPanel'
import { Dashboard } from './Dashboard'
import { CasesView } from './CasesView'
import { BirdsEyeView } from './BirdsEyeView'
import { useForensicStore } from '../store/useForensicStore'

export function AppLayout() {
  const mainNav = useForensicStore((s) => s.mainNav)

  return (
    <div className="flex h-full min-h-0 bg-[#0c0d10]">
      <PrimaryRail />
      <InternalSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />

        <div className="flex min-h-0 flex-1">
          {mainNav === 'chat' && <ChatStream />}
          {mainNav === 'dashboard' && <Dashboard />}
          {mainNav === 'cases' && <CasesView />}
          {mainNav === 'birds_view' && <BirdsEyeView />}
        </div>
      </div>

      <ToolPanel />
    </div>
  )
}
