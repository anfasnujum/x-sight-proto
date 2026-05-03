import { Activity, Shield, Sparkles } from 'lucide-react'
import { useForensicStore } from '../store/useForensicStore'

export function Dashboard() {
  const cases = useForensicStore((s) => s.cases)
  const setMainNav = useForensicStore((s) => s.setMainNav)
  const section = useForensicStore((s) => s.dashboardSection)

  const open = cases.filter((c) => c.status === 'open').length

  return (
    <div className="scrollbar-thin flex min-h-0 flex-1 flex-col overflow-y-auto p-8">
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
          Dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-500">
          {section === 'overview' &&
            'High-level signal across investigations. Use the internal sidebar to switch lenses.'}
          {section === 'signals' &&
            'Cross-case spikes and anomalies (mock signals).'}
          {section === 'reports' &&
            'Scheduled and exported summaries (mock reports).'}
        </p>

        {section === 'overview' && (
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 shadow-soft">
              <div className="flex items-center gap-2 text-zinc-400">
                <Activity className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Active cases
                </span>
              </div>
              <p className="mt-3 text-3xl font-semibold text-zinc-100">{open}</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 shadow-soft">
              <div className="flex items-center gap-2 text-zinc-400">
                <Shield className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Total cases
                </span>
              </div>
              <p className="mt-3 text-3xl font-semibold text-zinc-100">
                {cases.length}
              </p>
            </div>
            <div className="rounded-xl border border-violet-500/25 bg-violet-950/20 p-5 shadow-soft">
              <div className="flex items-center gap-2 text-violet-300">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Next step
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMainNav('chat')}
                className="mt-4 w-full rounded-lg bg-violet-600 py-2 text-sm font-medium text-white hover:bg-violet-500"
              >
                Open chat stream
              </button>
            </div>
          </div>
        )}

        {section === 'signals' && (
          <ul className="mt-8 space-y-3 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
            {[
              'Velocity anomaly cluster · 2 cases',
              'Shared beneficiary token · Alpha & Bravo',
              'Document hash overlap · recall cohort',
            ].map((line) => (
              <li
                key={line}
                className="flex items-center justify-between border-b border-zinc-800/80 py-2 text-sm text-zinc-300 last:border-0"
              >
                {line}
                <span className="text-[10px] uppercase text-amber-400/90">
                  Review
                </span>
              </li>
            ))}
          </ul>
        )}

        {section === 'reports' && (
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {['Weekly exec digest', 'Audit trail export', 'Custodian pack'].map(
              (name) => (
                <div
                  key={name}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 text-sm text-zinc-300"
                >
                  <p className="font-medium text-zinc-100">{name}</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Mock · PDF / CSV placeholders
                  </p>
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  )
}
