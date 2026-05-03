import type { ToolDefinition, ToolId } from '../types'

export const TOOLS: ToolDefinition[] = [
  {
    id: 'transaction_analyzer',
    name: 'Transaction Analyzer',
    shortDescription:
      'Pattern detection across transfers, velocity, and counterparties.',
  },
  {
    id: 'document_analyzer',
    name: 'Document Analyzer',
    shortDescription:
      'Extract entities, clauses, and references from case documents.',
  },
  {
    id: 'risk_profiler',
    name: 'Risk Profiler',
    shortDescription:
      'Score exposure and flag anomalies against case baselines.',
  },
  {
    id: 'timeline_builder',
    name: 'Timeline Builder',
    shortDescription:
      'Synthesize events into an auditable chronological narrative.',
  },
  {
    id: 'relationship_analyser',
    name: 'Relationship Analyser',
    shortDescription:
      'Compare selected entities — graph links, affiliations, and shared timeline facts.',
  },
]

export function getToolById(id: ToolId): ToolDefinition {
  const t = TOOLS.find((x) => x.id === id)
  if (!t) throw new Error(`Unknown tool: ${id}`)
  return t
}
