import { Send } from 'lucide-react'
import { useState } from 'react'
import { MessageBubble } from './MessageBubble'
import {
  useForensicStore,
  useFilteredMessages,
  useMessagesForActiveCase,
} from '../store/useForensicStore'

export function ChatStream() {
  const [draft, setDraft] = useState('')
  const appendMessage = useForensicStore((s) => s.appendMessage)
  const activeCaseId = useForensicStore((s) => s.activeCaseId)
  const searchQuery = useForensicStore((s) => s.searchQuery)
  const rawMessages = useMessagesForActiveCase()
  const messages = useFilteredMessages()

  function send() {
    const t = draft.trim()
    if (!t) return
    appendMessage({ type: 'user', content: t })
    setDraft('')
    window.setTimeout(() => {
      appendMessage({
        type: 'assistant',
        content:
          'Logged. Use tools on this message or from the right panel — each run leaves an artifact in the stream.',
      })
    }, 400)
  }

  const emptyThread = rawMessages.length === 0
  const noSearchMatches =
    rawMessages.length > 0 && messages.length === 0 && searchQuery.trim()
  const generalMode = !activeCaseId

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#0c0d10]">
      <div className="scrollbar-thin flex min-h-0 flex-1 flex-col overflow-y-auto">
        {noSearchMatches ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center">
            <p className="text-sm text-zinc-400">No matches in this stream.</p>
            <p className="mt-2 text-xs text-zinc-600">
              Try another keyword or clear search.
            </p>
          </div>
        ) : emptyThread ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center">
            <p className="max-w-md text-lg font-medium text-zinc-200">
              {generalMode
                ? 'You’re in General Mode. Use tools or ask questions.'
                : 'Start this investigation stream'}
            </p>
            <p className="mt-3 max-w-lg text-sm text-zinc-500">
              Try uploading a document (mock), run risk profiling from the tool
              panel, or ask an initial question below.
            </p>
            <ul className="mt-8 flex flex-wrap justify-center gap-2 text-xs text-zinc-400">
              <li className="rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1">
                Upload a document
              </li>
              <li className="rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1">
                Run risk profiling
              </li>
              <li className="rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1">
                Ask a clarifying question
              </li>
            </ul>
          </div>
        ) : (
          messages.map((m) => <MessageBubble key={m.id} message={m} />)
        )}
      </div>

      <div className="border-t border-zinc-800/90 bg-[#0f1014]/90 p-4 backdrop-blur">
        <div className="mx-auto flex max-w-3xl gap-2">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
            placeholder={
              activeCaseId
                ? 'Message this case…'
                : 'General Mode — message or invoke tools →'
            }
            className="min-h-[44px] flex-1 rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none ring-violet-500/30 focus:border-zinc-700 focus:ring-2"
          />
          <button
            type="button"
            onClick={send}
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-violet-600 px-4 text-sm font-medium text-white shadow-soft transition hover:bg-violet-500"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
