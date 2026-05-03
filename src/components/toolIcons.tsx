import type { ToolId } from '../types'
import {
  ArrowLeftRight,
  FileText,
  ShieldAlert,
  GanttChartSquare,
  GitBranch,
  type LucideIcon,
} from 'lucide-react'

const TOOL_ICONS: Record<ToolId, LucideIcon> = {
  transaction_analyzer: ArrowLeftRight,
  document_analyzer: FileText,
  risk_profiler: ShieldAlert,
  timeline_builder: GanttChartSquare,
  relationship_analyser: GitBranch,
}

export function ToolIcon({
  toolId,
  className,
}: {
  toolId: ToolId
  className?: string
}) {
  const I = TOOL_ICONS[toolId]
  return <I className={className} aria-hidden />
}
