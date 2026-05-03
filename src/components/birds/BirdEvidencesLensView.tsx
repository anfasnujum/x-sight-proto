import { useMemo } from 'react'
import { Link2 } from 'lucide-react'
import { GENERAL_CASE_KEY } from '../../constants'
import { useForensicStore } from '../../store/useForensicStore'

export function BirdEvidencesLensView() {
  const evidences = useForensicStore((s) => s.evidences)
  const cases = useForensicStore((s) => s.cases)

  const rows = useMemo(() => {
    return Object.entries(evidences).flatMap(([ck, list]) =>
      list.map((ev) => ({
        ...ev,
        caseLabel:
          ck === GENERAL_CASE_KEY
            ? 'General mode'
            : (cases.find((c) => c.id === ck)?.name ?? ck),
        caseKey: ck,
      })),
    )
  }, [evidences, cases])

  const sorted = useMemo(
    () =>
      [...rows].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [rows],
  )

  return (
    <div className="mt-8">
      <p className="mb-4 text-sm text-zinc-500">
        All evidence items rolled up from every case workspace — images, text,
        links, and analyst thoughts.
      </p>
      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/50">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900/60 text-[10px] font-semibold uppercase text-zinc-500">
            <tr>
              <th className="px-3 py-2">Case</th>
              <th className="px-3 py-2">Title</th>
              <th className="hidden px-3 py-2 md:table-cell">Kind</th>
              <th className="hidden px-3 py-2 lg:table-cell">Thought</th>
              <th className="px-3 py-2">When</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((ev) => (
              <tr
                key={`${ev.caseKey}-${ev.id}`}
                className="border-b border-zinc-800/80 hover:bg-zinc-900/40"
              >
                <td className="whitespace-nowrap px-3 py-2 text-xs text-zinc-400">
                  {ev.caseLabel}
                </td>
                <td className="max-w-[220px] truncate px-3 py-2 font-medium text-zinc-200">
                  {ev.kind === 'link' ? (
                    <a
                      href={ev.value}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-violet-400 hover:underline"
                    >
                      <Link2 className="h-3 w-3 shrink-0" />
                      {ev.title}
                    </a>
                  ) : (
                    ev.title
                  )}
                </td>
                <td className="hidden px-3 py-2 text-xs capitalize text-zinc-500 md:table-cell">
                  {ev.kind}
                </td>
                <td className="hidden max-w-xs truncate px-3 py-2 text-xs text-zinc-500 lg:table-cell">
                  {ev.thought}
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-[11px] text-zinc-600">
                  {new Date(ev.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sorted.length === 0 && (
          <p className="py-8 text-center text-sm text-zinc-500">
            No evidence logged yet.
          </p>
        )}
      </div>
    </div>
  )
}
