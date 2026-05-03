import { useMemo } from 'react'
import { useForensicStore } from '../store/useForensicStore'

export function CasesView() {
  const cases = useForensicStore((s) => s.cases)
  const filter = useForensicStore((s) => s.casesSidebarFilter)
  const setActiveCase = useForensicStore((s) => s.setActiveCase)
  const setMainNav = useForensicStore((s) => s.setMainNav)

  const filtered = useMemo(() => {
    if (filter === 'all') return cases
    return cases.filter((c) => c.status === filter)
  }, [cases, filter])

  return (
    <div className="scrollbar-thin flex min-h-0 flex-1 flex-col overflow-y-auto p-8">
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
          Cases
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Select a case to load its stream and metadata in the top bar. Filter
          from the internal sidebar.
        </p>

        <div className="mt-8 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/50 shadow-soft">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-800 bg-zinc-900/60 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Updated</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-zinc-800/80 last:border-0 hover:bg-zinc-900/40"
                >
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCase(c.id)
                        setMainNav('chat')
                      }}
                      className="font-medium text-violet-300 hover:underline"
                    >
                      {c.name}
                    </button>
                  </td>
                  <td className="px-4 py-3 capitalize text-zinc-400">
                    {c.status}
                  </td>
                  <td className="px-4 py-3 capitalize text-zinc-400">
                    {c.priority}
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {new Date(c.updatedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-zinc-500">
              No cases match this filter.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
