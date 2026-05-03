import { Plus } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useForensicStore, useActiveCaseKey } from '../../store/useForensicStore'

export function NotesSection() {
  const ck = useActiveCaseKey()
  const notes = useForensicStore((s) => s.notes[ck] ?? [])
  const addNote = useForensicStore((s) => s.addNote)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim() && !body.trim()) return
    addNote({
      title: title.trim() || 'Untitled note',
      body: body.trim(),
    })
    setTitle('')
    setBody('')
  }

  return (
    <div className="scrollbar-thin flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
      <form
        onSubmit={submit}
        className="shrink-0 space-y-2 rounded-lg border border-zinc-800 bg-zinc-950/60 p-3"
      >
        <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
          New note
        </p>
        <input
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-600"
        />
        <textarea
          placeholder="Write a note…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          className="w-full resize-none rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-600"
        />
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-1.5 rounded-md bg-zinc-800 py-2 text-xs font-medium text-zinc-100 hover:bg-zinc-700"
        >
          <Plus className="h-3.5 w-3.5" />
          Add note
        </button>
      </form>

      <div className="min-h-0 flex-1 space-y-2">
        {notes.length === 0 ? (
          <p className="text-center text-sm text-zinc-500">
            No notes yet. Capture hypotheses or interview prompts here.
          </p>
        ) : (
          notes.map((n) => (
            <article
              key={n.id}
              className="rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 py-2.5"
            >
              <p className="font-medium text-zinc-100">{n.title}</p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-zinc-400">
                {n.body}
              </p>
              <p className="mt-2 text-[10px] text-zinc-600">
                {new Date(n.updatedAt).toLocaleString()}
              </p>
            </article>
          ))
        )}
      </div>
    </div>
  )
}
