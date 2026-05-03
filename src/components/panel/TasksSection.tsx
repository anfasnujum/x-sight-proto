import { Bot, Plus, User } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useForensicStore, useActiveCaseKey } from '../../store/useForensicStore'
import type { CaseTask, TaskStatus } from '../../types'

const STATUS_ORDER: TaskStatus[] = [
  'running',
  'queued',
  'blocked',
  'done',
]

const STATUS_LABEL: Record<TaskStatus, string> = {
  queued: 'Queued',
  running: 'Running',
  done: 'Done',
  blocked: 'Blocked',
}

const STATUS_STYLE: Record<TaskStatus, string> = {
  queued: 'border-zinc-700 text-zinc-400',
  running: 'border-amber-500/40 text-amber-200 bg-amber-500/10',
  done: 'border-emerald-500/40 text-emerald-200 bg-emerald-500/10',
  blocked: 'border-rose-500/40 text-rose-200 bg-rose-500/10',
}

export function TasksSection() {
  const ck = useActiveCaseKey()
  const tasks = useForensicStore((s) => s.tasks[ck] ?? [])
  const addTask = useForensicStore((s) => s.addTask)
  const updateTaskStatus = useForensicStore((s) => s.updateTaskStatus)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assignee, setAssignee] = useState<CaseTask['assignee']>('ai')

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    addTask({
      title: title.trim(),
      description: description.trim() || '—',
      status: 'queued',
      assignee,
    })
    setTitle('')
    setDescription('')
  }

  const sorted = [...tasks].sort((a, b) => {
    const ai = STATUS_ORDER.indexOf(a.status)
    const bi = STATUS_ORDER.indexOf(b.status)
    if (ai !== bi) return ai - bi
    return (
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  })

  return (
    <div className="scrollbar-thin flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
      <form
        onSubmit={submit}
        className="shrink-0 space-y-2 rounded-lg border border-zinc-800 bg-zinc-950/60 p-3"
      >
        <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
          New task
        </p>
        <input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-600"
        />
        <textarea
          placeholder="Instructions (shown to AI or assignee)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full resize-none rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-300 placeholder:text-zinc-600"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setAssignee('ai')}
            className={`flex flex-1 items-center justify-center gap-1 rounded-md border px-2 py-1.5 text-xs font-medium transition ${
              assignee === 'ai'
                ? 'border-violet-500/50 bg-violet-500/15 text-violet-200'
                : 'border-zinc-800 text-zinc-500'
            }`}
          >
            <Bot className="h-3.5 w-3.5" />
            AI
          </button>
          <button
            type="button"
            onClick={() => setAssignee('user')}
            className={`flex flex-1 items-center justify-center gap-1 rounded-md border px-2 py-1.5 text-xs font-medium transition ${
              assignee === 'user'
                ? 'border-violet-500/50 bg-violet-500/15 text-violet-200'
                : 'border-zinc-800 text-zinc-500'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            Human
          </button>
        </div>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-1.5 rounded-md bg-zinc-800 py-2 text-xs font-medium text-zinc-100 hover:bg-zinc-700"
        >
          <Plus className="h-3.5 w-3.5" />
          Add task
        </button>
      </form>

      <div className="min-h-0 flex-1 space-y-2">
        {sorted.length === 0 ? (
          <p className="text-center text-sm text-zinc-500">
            No tasks. Queue work for the AI or your team.
          </p>
        ) : (
          sorted.map((t) => (
            <div
              key={t.id}
              className={`rounded-lg border px-3 py-2.5 ${STATUS_STYLE[t.status]}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {t.assignee === 'ai' ? (
                      <Bot className="h-3.5 w-3.5 shrink-0 text-violet-400" />
                    ) : (
                      <User className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                    )}
                    <span className="truncate text-sm font-medium text-zinc-100">
                      {t.title}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-snug text-zinc-500">
                    {t.description}
                  </p>
                </div>
                <select
                  value={t.status}
                  onChange={(e) =>
                    updateTaskStatus(t.id, e.target.value as TaskStatus)
                  }
                  className="shrink-0 rounded border border-zinc-700 bg-zinc-950 px-1.5 py-1 text-[10px] text-zinc-300"
                  aria-label={`Status for ${t.title}`}
                >
                  {(Object.keys(STATUS_LABEL) as TaskStatus[]).map((st) => (
                    <option key={st} value={st}>
                      {STATUS_LABEL[st]}
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-2 text-[10px] text-zinc-600">
                {new Date(t.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
