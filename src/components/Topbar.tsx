import { Search } from 'lucide-react'
import { CaseSelector } from './CaseSelector'
import { useForensicStore } from '../store/useForensicStore'

function StatusPill({ status }: { status: string }) {
  const tone =
    status === 'open'
      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
      : status === 'review'
        ? 'border-amber-500/40 bg-amber-500/10 text-amber-200'
        : 'border-zinc-600 bg-zinc-800/80 text-zinc-400'
  return (
    <span
      className={`rounded-md border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${tone}`}
    >
      {status}
    </span>
  )
}

function PriorityPill({ p }: { p: string }) {
  const tone =
    p === 'critical' || p === 'high'
      ? 'text-rose-300'
      : p === 'medium'
        ? 'text-amber-200'
        : 'text-zinc-400'
  return (
    <span className={`text-xs font-medium capitalize ${tone}`}>Pr: {p}</span>
  )
}

export function Topbar() {
  const activeCaseId = useForensicStore((s) => s.activeCaseId)
  const cases = useForensicStore((s) => s.cases)
  const searchQuery = useForensicStore((s) => s.searchQuery)
  const setSearchQuery = useForensicStore((s) => s.setSearchQuery)

  const active = activeCaseId
    ? cases.find((c) => c.id === activeCaseId)
    : null

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-zinc-800/90 bg-[#0f1014]/95 px-4 backdrop-blur">
      <CaseSelector />

      <div className="hidden min-w-0 flex-1 items-center gap-3 sm:flex">
        {active ? (
          <>
            <StatusPill status={active.status} />
            <PriorityPill p={active.priority} />
            <span className="truncate text-xs text-zinc-500">
              Updated{' '}
              {new Date(active.updatedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </>
        ) : (
          <p className="text-xs text-zinc-500">
            General Mode — tools use workspace-wide context.
          </p>
        )}
      </div>

      <div className="relative ml-auto w-full max-w-xs">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          type="search"
          placeholder="Search stream…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 py-1.5 pl-8 pr-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none ring-violet-500/40 focus:border-zinc-700 focus:ring-2"
        />
      </div>
    </header>
  )
}
