import { ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useForensicStore } from '../store/useForensicStore'

export function CaseSelector() {
  const cases = useForensicStore((s) => s.cases)
  const activeCaseId = useForensicStore((s) => s.activeCaseId)
  const setActiveCase = useForensicStore((s) => s.setActiveCase)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const active = activeCaseId
    ? cases.find((c) => c.id === activeCaseId)
    : null
  const label = active?.name ?? 'No Case (General Mode)'

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex max-w-[min(100%,280px)] items-center gap-2 rounded-lg border border-zinc-700/80 bg-zinc-900/80 px-3 py-1.5 text-left text-sm text-zinc-100 shadow-soft transition hover:border-zinc-600"
      >
        <span className="truncate font-medium">{label}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-zinc-500 transition ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-50 min-w-[280px] overflow-hidden rounded-xl border border-zinc-700/90 bg-zinc-950 py-1 shadow-panel">
          <button
            type="button"
            className="flex w-full px-3 py-2 text-left text-sm text-zinc-200 hover:bg-zinc-800/80"
            onClick={() => {
              setActiveCase(null)
              setOpen(false)
            }}
          >
            No Case (General Mode)
          </button>
          <div className="my-1 border-t border-zinc-800" />
          {cases.map((c) => (
            <button
              key={c.id}
              type="button"
              className="flex w-full px-3 py-2 text-left text-sm text-zinc-200 hover:bg-zinc-800/80"
              onClick={() => {
                setActiveCase(c.id)
                setOpen(false)
              }}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
