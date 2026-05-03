import type { ToolId } from '../types'
import { buildRelationshipAnalyserReport } from './relationshipAnalyserReport'

export interface MockToolResultOptions {
  entityIds?: string[]
  deepCorrelate?: boolean
  includeSuppressed?: boolean
}

/** Deterministic mock output for a tool run */
export function mockToolResult(
  toolId: ToolId,
  inputPreview: string,
  opts?: MockToolResultOptions,
): { summary: string; lines: string[] } {
  const tail =
    inputPreview.length > 80
      ? `${inputPreview.slice(0, 80)}…`
      : inputPreview || '(no text)'

  switch (toolId) {
    case 'transaction_analyzer':
      return {
        summary: 'Suspicious patterns detected',
        lines: [
          '2 velocity anomalies vs. 30-day baseline',
          'Counterparty overlap with prior flagged entity',
          `Context digest: ${tail}`,
        ],
      }
    case 'document_analyzer':
      return {
        summary: 'Entities and references extracted',
        lines: [
          '4 orgs, 9 person names, 2 account tokens',
          'Clause cross-ref: “force majeure” ↔ schedule C',
          `Source excerpt: ${tail}`,
        ],
      }
    case 'risk_profiler':
      return {
        summary: 'Risk band: elevated',
        lines: [
          'Composite score 0.78 (case threshold 0.55)',
          'Drivers: concentration, recency, documentation gaps',
          `Input scope: ${tail}`,
        ],
      }
    case 'timeline_builder':
      return {
        summary: 'Chronology draft generated',
        lines: [
          '12 events placed on shared clock',
          '2 conflicts flagged for human review',
          `Anchor text: ${tail}`,
        ],
      }
    case 'relationship_analyser':
      return buildRelationshipAnalyserReport(opts?.entityIds ?? [], inputPreview)
  }
}
