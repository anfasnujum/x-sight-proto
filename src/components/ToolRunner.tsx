import { X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { getToolById } from '../data/tools'
import type { ToolId } from '../types'
import { ToolIcon } from './toolIcons'
import { useForensicStore } from '../store/useForensicStore'

export function ToolRunner({ toolId }: { toolId: ToolId }) {
  const tool = getToolById(toolId)
  const ctx = useForensicStore((s) => s.toolState.toolInputContext)
  const closeTool = useForensicStore((s) => s.closeTool)
  const runTool = useForensicStore((s) => s.runTool)
  const profiles = useForensicStore((s) => s.birdRegistryProfiles)

  const [deepCorrelate, setDeepCorrelate] = useState(true)
  const [includeSuppressed, setIncludeSuppressed] = useState(false)
  const [selectedEntityIds, setSelectedEntityIds] = useState<string[]>([])

  const sortedProfiles = useMemo(
    () => [...profiles].sort((a, b) => a.legalName.localeCompare(b.legalName)),
    [profiles],
  )

  const sourceLabel =
    ctx?.source === 'message'
      ? 'Message excerpt'
      : ctx?.source === 'chain'
        ? 'Chained output'
        : ctx?.source === 'manual'
          ? 'Case context'
          : 'Context'

  function toggleEntity(id: string) {
    setSelectedEntityIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const header = (
    <div className="flex items-start justify-between gap-2">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300">
          <ToolIcon toolId={toolId} className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
            Inspector
          </p>
          <h2 className="text-sm font-semibold text-zinc-100">{tool.name}</h2>
        </div>
      </div>
      <button
        type="button"
        onClick={closeTool}
        className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
        title="Close tool"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )

  const contextBlock = (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/80 p-3">
      <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
        {sourceLabel}
      </p>
      <p className="mt-2 max-h-28 overflow-y-auto font-mono text-xs leading-relaxed text-zinc-300 scrollbar-thin">
        {ctx?.preview ?? '—'}
      </p>
    </div>
  )

  if (toolId === 'relationship_analyser') {
    return (
      <div className="animate-panel-in flex flex-col gap-4">
        {header}
        {contextBlock}
        {ctx?.source === 'chain' && ctx.chainFromMessageId && (
          <p className="text-xs text-amber-200/90">
            Optional stream context above; entity selection drives the report.
          </p>
        )}

        <div className="space-y-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
              Entities to analyse
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Pick <span className="text-zinc-400">two or more</span> dossier
              entities. The report covers pairwise panorama links, registry
              affiliations among them, and timeline facts where several selected
              IDs co-occur.
            </p>
          </div>
          <div className="scrollbar-thin max-h-52 space-y-2 overflow-y-auto rounded-lg border border-zinc-800/90 bg-zinc-950/80 p-2">
            {sortedProfiles.map((p) => (
              <label
                key={p.id}
                className="flex cursor-pointer items-start gap-2 rounded px-1 py-0.5 hover:bg-zinc-900/80"
              >
                <input
                  type="checkbox"
                  checked={selectedEntityIds.includes(p.id)}
                  onChange={() => toggleEntity(p.id)}
                  className="mt-0.5 rounded border-zinc-600"
                />
                <span className="text-xs leading-snug text-zinc-300">
                  {p.legalName}
                </span>
              </label>
            ))}
          </div>
          <p className="text-[11px] text-zinc-600">
            Selected: {selectedEntityIds.length}
          </p>
        </div>

        <button
          type="button"
          disabled={selectedEntityIds.length < 2}
          onClick={() =>
            runTool(toolId, {
              entityIds: selectedEntityIds,
            })
          }
          className="w-full rounded-lg bg-violet-600 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
        >
          Run Relationship Analyser
        </button>
      </div>
    )
  }

  return (
    <div className="animate-panel-in flex flex-col gap-4">
      {header}
      {contextBlock}
      {ctx?.source === 'chain' && ctx.chainFromMessageId && (
        <p className="text-xs text-amber-200/90">
          Feeding from prior tool artifact. Switch tools above by closing and
          picking another if needed.
        </p>
      )}

      <div className="space-y-2 rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
          Options
        </p>
        <label className="flex cursor-pointer items-center gap-2 text-xs text-zinc-300">
          <input
            type="checkbox"
            checked={deepCorrelate}
            onChange={(e) => setDeepCorrelate(e.target.checked)}
            className="rounded border-zinc-600 bg-zinc-900"
          />
          Deep correlate (cross-artifact)
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-xs text-zinc-300">
          <input
            type="checkbox"
            checked={includeSuppressed}
            onChange={(e) => setIncludeSuppressed(e.target.checked)}
            className="rounded border-zinc-600 bg-zinc-900"
          />
          Include suppressed signals (audit trail)
        </label>
      </div>

      <button
        type="button"
        onClick={() =>
          runTool(toolId, {
            deepCorrelate,
            includeSuppressed,
          })
        }
        className="w-full rounded-lg bg-violet-600 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-violet-500"
      >
        Run Tool
      </button>
    </div>
  )
}
