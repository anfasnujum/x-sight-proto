import { getToolById } from '../data/tools'
import type { ToolId } from '../types'
import { ToolIcon } from './toolIcons'
import { useForensicStore } from '../store/useForensicStore'

export function ToolCard({ toolId }: { toolId: ToolId }) {
  const tool = getToolById(toolId)
  const openTool = useForensicStore((s) => s.openTool)
  const activeCaseId = useForensicStore((s) => s.activeCaseId)
  const cases = useForensicStore((s) => s.cases)

  function useManual() {
    const caseName = activeCaseId
      ? cases.find((c) => c.id === activeCaseId)?.name ?? 'Active case'
      : 'General Mode — workspace'
    openTool(toolId, {
      source: 'manual',
      preview: caseName,
    })
  }

  return (
    <div className="flex flex-col rounded-xl border border-zinc-800/90 bg-zinc-950/60 p-4 shadow-soft transition hover:border-zinc-700 hover:bg-zinc-900/40">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300">
          <ToolIcon toolId={toolId} className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-zinc-100">{tool.name}</h3>
          <p className="mt-1 text-xs leading-snug text-zinc-500">
            {tool.shortDescription}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={useManual}
        className="mt-4 w-full rounded-lg bg-zinc-800/90 py-2 text-sm font-medium text-zinc-100 transition hover:bg-zinc-700"
      >
        Use Tool
      </button>
    </div>
  )
}
