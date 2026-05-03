import {
  Binoculars,
  FolderOpen,
  LayoutDashboard,
  MessageSquare,
} from 'lucide-react'
import type { MainNav } from '../types'
import { useForensicStore } from '../store/useForensicStore'

const ITEMS: {
  id: MainNav
  label: string
  Icon: typeof LayoutDashboard
}[] = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'cases', label: 'Cases', Icon: FolderOpen },
  { id: 'chat', label: 'Chat', Icon: MessageSquare },
  { id: 'birds_view', label: "Bird's view", Icon: Binoculars },
]

function RailButton({
  active,
  label,
  Icon,
  onClick,
}: {
  active: boolean
  label: string
  Icon: typeof LayoutDashboard
  onClick: () => void
}) {
  return (
    <div className="group relative flex w-full justify-center py-0.5">
      <button
        type="button"
        onClick={onClick}
        aria-current={active ? 'page' : undefined}
        aria-label={label}
        title={label}
        className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
          active
            ? 'border-violet-500/50 bg-violet-600/20 text-violet-200 shadow-[0_0_20px_rgba(139,92,246,0.15)]'
            : 'border-transparent text-zinc-500 hover:border-zinc-700 hover:bg-zinc-900 hover:text-zinc-200'
        }`}
      >
        <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
      </button>
      <span
        className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 z-[100] -translate-y-1/2 whitespace-nowrap rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 text-[11px] font-medium text-zinc-100 opacity-0 shadow-panel transition duration-150 group-hover:opacity-100"
        role="tooltip"
      >
        {label}
      </span>
    </div>
  )
}

export function PrimaryRail() {
  const mainNav = useForensicStore((s) => s.mainNav)
  const setMainNav = useForensicStore((s) => s.setMainNav)

  return (
    <nav
      className="flex h-full min-h-0 w-[52px] shrink-0 flex-col items-center gap-1 border-r border-zinc-800/90 bg-[#07080b] py-3"
      aria-label="Primary navigation"
    >
      {ITEMS.map(({ id, label, Icon }) => (
        <RailButton
          key={id}
          active={mainNav === id}
          label={label}
          Icon={Icon}
          onClick={() => setMainNav(id)}
        />
      ))}
    </nav>
  )
}
