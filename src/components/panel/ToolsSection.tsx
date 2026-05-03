import { TOOLS } from '../../data/tools'
import { ToolCard } from '../ToolCard'
import { ToolRunner } from '../ToolRunner'
import { useForensicStore } from '../../store/useForensicStore'

export function ToolsSection() {
  const activeTool = useForensicStore((s) => s.toolState.activeTool)

  return (
    <div className="scrollbar-thin flex min-h-0 flex-1 flex-col overflow-y-auto p-4">
      {activeTool ? (
        <ToolRunner key={activeTool} toolId={activeTool} />
      ) : (
        <div className="animate-panel-in grid gap-3">
          {TOOLS.map((t) => (
            <ToolCard key={t.id} toolId={t.id} />
          ))}
        </div>
      )}
    </div>
  )
}
