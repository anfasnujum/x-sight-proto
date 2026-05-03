import {
  ImageIcon,
  Link2,
  Paperclip,
  Plus,
  StickyNote,
} from 'lucide-react'
import { useState, type FormEvent } from 'react'
import {
  useForensicStore,
  useActiveCaseKey,
} from '../../store/useForensicStore'
import type { EvidenceKind } from '../../types'

const KIND_LABEL: Record<EvidenceKind, string> = {
  image: 'Image',
  text: 'Text',
  link: 'Link',
  file: 'File',
  other: 'Other',
}

function KindBadge({ kind }: { kind: EvidenceKind }) {
  return (
    <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-400">
      {KIND_LABEL[kind]}
    </span>
  )
}

export function EvidencesSection() {
  const ck = useActiveCaseKey()
  const items = useForensicStore((s) => s.evidences[ck] ?? [])
  const addEvidence = useForensicStore((s) => s.addEvidence)

  const [kind, setKind] = useState<EvidenceKind>('text')
  const [title, setTitle] = useState('')
  const [value, setValue] = useState('')
  const [thought, setThought] = useState('')

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim() || !value.trim()) return
    addEvidence({
      kind,
      title: title.trim(),
      value: value.trim(),
      thought: thought.trim() || '—',
    })
    setTitle('')
    setValue('')
    setThought('')
  }

  return (
    <div className="scrollbar-thin flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
      <form
        onSubmit={submit}
        className="shrink-0 space-y-2 rounded-lg border border-zinc-800 bg-zinc-950/60 p-3"
      >
        <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
          Add evidence
        </p>
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value as EvidenceKind)}
          className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-200"
        >
          {(Object.keys(KIND_LABEL) as EvidenceKind[]).map((k) => (
            <option key={k} value={k}>
              {KIND_LABEL[k]}
            </option>
          ))}
        </select>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-600"
        />
        <textarea
          placeholder="URL, paste text, or reference…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={2}
          className="w-full resize-none rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1.5 font-mono text-xs text-zinc-200 placeholder:text-zinc-600"
        />
        <textarea
          placeholder="Thoughts / interpretation"
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          rows={2}
          className="w-full resize-none rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-300 placeholder:text-zinc-600"
        />
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-1.5 rounded-md bg-zinc-800 py-2 text-xs font-medium text-zinc-100 hover:bg-zinc-700"
        >
          <Plus className="h-3.5 w-3.5" />
          Add entry
        </button>
      </form>

      <div className="min-h-0 flex-1 space-y-3">
        {items.length === 0 ? (
          <p className="text-center text-sm text-zinc-500">
            No evidence items yet. Add photos, links, or pasted text.
          </p>
        ) : (
          items.map((ev) => (
            <article
              key={ev.id}
              className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950/80"
            >
              <div className="flex items-center justify-between border-b border-zinc-800/80 px-3 py-2">
                <span className="truncate text-sm font-medium text-zinc-100">
                  {ev.title}
                </span>
                <KindBadge kind={ev.kind} />
              </div>

              {ev.kind === 'image' && (
                <div className="flex aspect-video items-center justify-center bg-zinc-900/80">
                  <ImageIcon className="h-10 w-10 text-zinc-600" aria-hidden />
                </div>
              )}

              <div className="space-y-2 px-3 py-2">
                {ev.kind === 'link' && (
                  <a
                    href={ev.value}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-violet-400 hover:underline"
                  >
                    <Link2 className="h-3 w-3 shrink-0" />
                    {ev.value}
                  </a>
                )}
                {ev.kind === 'text' && (
                  <p className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-zinc-300">
                    {ev.value}
                  </p>
                )}
                {ev.kind === 'image' && (
                  <p className="font-mono text-[10px] text-zinc-500">{ev.value}</p>
                )}
                {ev.kind === 'file' && (
                  <p className="flex items-center gap-1 font-mono text-xs text-zinc-400">
                    <Paperclip className="h-3.5 w-3.5" />
                    {ev.value}
                  </p>
                )}
                {ev.kind === 'other' && (
                  <p className="font-mono text-xs text-zinc-400">{ev.value}</p>
                )}
                <div className="flex gap-2 rounded-md border border-violet-500/20 bg-violet-950/30 px-2 py-2">
                  <StickyNote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-400/90" />
                  <p className="text-xs leading-snug text-zinc-300">{ev.thought}</p>
                </div>
              </div>
              <p className="border-t border-zinc-800/80 px-3 py-1.5 text-[10px] text-zinc-600">
                {new Date(ev.createdAt).toLocaleString()}
              </p>
            </article>
          ))
        )}
      </div>
    </div>
  )
}
