import { useState, useRef, useEffect } from 'react'
import { MoreHorizontal } from 'lucide-react'
import type { Message, ToolId } from '../types'
import { ToolOutputCard } from './ToolOutputCard'
import { useForensicStore } from '../store/useForensicStore'

function MessageActions({
  message,
  onAction,
}: {
  message: Message
  onAction: (toolId: ToolId, preview: string) => void
}) {
  const [moreOpen, setMoreOpen] = useState(false)
  const moreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!moreRef.current?.contains(e.target as Node)) setMoreOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  if (message.type === 'tool_output') return null

  const preview =
    message.content.slice(0, 400) + (message.content.length > 400 ? '…' : '')

  return (
    <div className="mt-2 flex flex-wrap items-center justify-end gap-1 border-t border-white/5 pt-2 opacity-0 transition group-hover:opacity-100">
      <span className="mr-auto text-[10px] uppercase tracking-wide text-zinc-600">
        Tools
      </span>
      <div className="flex rounded-lg border border-zinc-700/90 bg-zinc-950/90 p-0.5 shadow-soft">
        <button
          type="button"
          className="rounded-md px-2 py-1 text-[11px] font-medium text-zinc-200 hover:bg-zinc-800"
          onClick={() => onAction('transaction_analyzer', preview)}
        >
          Analyze
        </button>
        <button
          type="button"
          className="rounded-md px-2 py-1 text-[11px] font-medium text-zinc-200 hover:bg-zinc-800"
          onClick={() => onAction('document_analyzer', preview)}
        >
          Extract
        </button>
        <button
          type="button"
          className="rounded-md px-2 py-1 text-[11px] font-medium text-zinc-200 hover:bg-zinc-800"
          onClick={() => onAction('risk_profiler', preview)}
        >
          Profile
        </button>
        <div className="relative" ref={moreRef}>
          <button
            type="button"
            className="rounded-md px-1.5 py-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            onClick={() => setMoreOpen((v) => !v)}
            aria-expanded={moreOpen}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          {moreOpen && (
            <div className="absolute bottom-[calc(100%+6px)] right-0 z-20 min-w-[220px] rounded-lg border border-zinc-700 bg-zinc-950 py-1 shadow-panel">
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-xs text-zinc-200 hover:bg-zinc-800"
                onClick={() => {
                  onAction('timeline_builder', preview)
                  setMoreOpen(false)
                }}
              >
                Timeline Builder
              </button>
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-xs text-zinc-200 hover:bg-zinc-800"
                onClick={() => {
                  onAction('relationship_analyser', preview)
                  setMoreOpen(false)
                }}
              >
                Relationship Analyser
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function MessageBubble({ message }: { message: Message }) {
  const openTool = useForensicStore((s) => s.openTool)
  const toggleMessagePin = useForensicStore((s) => s.toggleMessagePin)
  const toggleMessageEvidence = useForensicStore((s) => s.toggleMessageEvidence)
  const chainFromMessage = useForensicStore((s) => s.chainFromMessage)

  function handleToolFromAction(toolId: ToolId, preview: string) {
    openTool(toolId, {
      source: 'message',
      messageId: message.id,
      preview,
    })
  }

  if (message.type === 'tool_output') {
    return (
      <div className="group relative px-4 py-2">
        <ToolOutputCard
          message={message}
          onChain={() => chainFromMessage(message.id)}
          onTogglePin={() => toggleMessagePin(message.id)}
          onToggleEvidence={() => toggleMessageEvidence(message.id)}
        />
      </div>
    )
  }

  const isUser = message.type === 'user'

  return (
    <div
      className={`group relative px-4 py-2 ${isUser ? 'flex justify-end' : 'flex justify-start'}`}
    >
      <div
        className={`max-w-[min(100%,720px)] rounded-2xl border px-4 py-3 text-sm leading-relaxed shadow-soft ${
          isUser
            ? 'border-violet-500/25 bg-violet-950/35 text-zinc-100'
            : 'border-zinc-800 bg-zinc-900/60 text-zinc-200'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        <MessageActions message={message} onAction={handleToolFromAction} />
      </div>
    </div>
  )
}
