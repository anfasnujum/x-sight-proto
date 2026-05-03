import { Link2, Pin, Tag } from 'lucide-react'
import type { Message } from '../types'
import { ToolIcon } from './toolIcons'

export function ToolOutputCard({
  message,
  onChain,
  onTogglePin,
  onToggleEvidence,
}: {
  message: Message
  onChain: () => void
  onTogglePin: () => void
  onToggleEvidence: () => void
}) {
  if (message.type !== 'tool_output' || !message.toolId || !message.toolName) {
    return null
  }

  return (
    <div
      className={`relative overflow-hidden rounded-xl border bg-gradient-to-br from-violet-950/40 to-zinc-950/80 ${
        message.pinned
          ? 'border-amber-500/45 shadow-[0_0_0_1px_rgba(245,158,11,0.2)]'
          : 'border-violet-500/25'
      }`}
    >
      <div className="flex items-start justify-between gap-2 border-b border-violet-500/15 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300">
            <ToolIcon toolId={message.toolId} className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-violet-300/90">
              {message.toolName} · Result
            </p>
            <p className="truncate text-sm font-medium text-zinc-100">
              {message.toolSummary ?? 'Completed'}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={onTogglePin}
            className={`rounded-md p-1.5 transition hover:bg-zinc-800 ${
              message.pinned ? 'text-amber-300' : 'text-zinc-500'
            }`}
            title={message.pinned ? 'Unpin' : 'Pin finding'}
          >
            <Pin className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onToggleEvidence}
            className={`rounded-md p-1.5 transition hover:bg-zinc-800 ${
              message.evidence ? 'text-emerald-300' : 'text-zinc-500'
            }`}
            title="Mark evidence"
          >
            <Tag className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onChain}
            className="rounded-md p-1.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-100"
            title="Chain to next tool"
          >
            <Link2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <ul className="space-y-2 px-4 py-3 text-sm text-zinc-300">
        {(message.lines ?? []).map((line, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-violet-400/80" />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
