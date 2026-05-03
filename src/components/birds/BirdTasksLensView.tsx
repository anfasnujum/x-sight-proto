import { Bot, User } from 'lucide-react'
import { useMemo } from 'react'
import { GENERAL_CASE_KEY } from '../../constants'
import { useForensicStore } from '../../store/useForensicStore'
import type { TaskStatus } from '../../types'

const STATUS_LABEL: Record<TaskStatus, string> = {
  queued: 'Queued',
  running: 'Running',
  done: 'Done',
  blocked: 'Blocked',
}

export function BirdTasksLensView() {
  const tasksMap = useForensicStore((s) => s.tasks)
  const cases = useForensicStore((s) => s.cases)
  const updateTaskStatus = useForensicStore((s) => s.updateTaskStatus)

  const rows = useMemo(() => {
    return Object.entries(tasksMap).flatMap(([ck, list]) =>
      list.map((t) => ({
        ...t,
        caseLabel:
          ck === GENERAL_CASE_KEY
            ? 'General mode'
            : (cases.find((c) => c.id === ck)?.name ?? ck),
        caseKey: ck,
      })),
    )
  }, [tasksMap, cases])

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
        Tasks from every case — AI runs and human follow-ups. Updating status
        here finds the task by id across all case buckets.
      </p>
      <div className="space-y-2">
        {sorted.map((t) => (
          <div
            key={`${t.caseKey}-${t.id}`}
            className="flex flex-wrap items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                {t.assignee === 'ai' ? (
                  <Bot className="h-4 w-4 text-violet-400" />
                ) : (
                  <User className="h-4 w-4 text-zinc-500" />
                )}
                <span className="text-[10px] uppercase text-zinc-500">
                  {t.caseLabel}
                </span>
              </div>
              <p className="mt-1 font-medium text-zinc-100">{t.title}</p>
              <p className="mt-0.5 text-xs text-zinc-500">{t.description}</p>
            </div>
            <select
              value={t.status}
              onChange={(e) =>
                updateTaskStatus(t.id, e.target.value as TaskStatus)
              }
              className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-300"
              aria-label={`Status for ${t.title}`}
            >
              {(Object.keys(STATUS_LABEL) as TaskStatus[]).map((st) => (
                <option key={st} value={st}>
                  {STATUS_LABEL[st]}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      {sorted.length === 0 && (
        <p className="py-12 text-center text-sm text-zinc-500">No tasks.</p>
      )}
    </div>
  )
}
