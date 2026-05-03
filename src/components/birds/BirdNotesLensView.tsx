import { useMemo } from 'react'
import { GENERAL_CASE_KEY } from '../../constants'
import { useForensicStore } from '../../store/useForensicStore'

export function BirdNotesLensView() {
  const notesMap = useForensicStore((s) => s.notes)
  const cases = useForensicStore((s) => s.cases)

  const rows = useMemo(() => {
    return Object.entries(notesMap).flatMap(([ck, list]) =>
      list.map((n) => ({
        ...n,
        caseLabel:
          ck === GENERAL_CASE_KEY
            ? 'General mode'
            : (cases.find((c) => c.id === ck)?.name ?? ck),
      })),
    )
  }, [notesMap, cases])

  const sorted = useMemo(
    () =>
      [...rows].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      ),
    [rows],
  )

  return (
    <div className="mt-8">
      <p className="mb-4 text-sm text-zinc-500">
        Investigator notes aggregated across cases — same data as the inspector
        drawer, bird&apos;s-eye ordering.
      </p>
      <ul className="space-y-3">
        {sorted.map((n) => (
          <li
            key={n.id}
            className="rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] uppercase text-zinc-500">
                {n.caseLabel}
              </span>
              <time className="text-[11px] text-zinc-600">
                {new Date(n.updatedAt).toLocaleString()}
              </time>
            </div>
            <p className="mt-2 font-medium text-zinc-100">{n.title}</p>
            <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-zinc-400">
              {n.body}
            </p>
          </li>
        ))}
      </ul>
      {sorted.length === 0 && (
        <p className="py-12 text-center text-sm text-zinc-500">No notes yet.</p>
      )}
    </div>
  )
}
