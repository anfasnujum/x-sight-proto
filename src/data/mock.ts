import type { ForensicCase, Message } from '../types'

export const MOCK_CASES: ForensicCase[] = [
  {
    id: 'case-alpha',
    name: 'Alpha Shell Holdings',
    status: 'open',
    priority: 'high',
    updatedAt: '2026-05-01T14:22:00Z',
  },
  {
    id: 'case-bravo',
    name: 'Bravo Wire Recall',
    status: 'review',
    priority: 'medium',
    updatedAt: '2026-04-28T09:10:00Z',
  },
  {
    id: 'case-charlie',
    name: 'Charlie Ledger Sweep',
    status: 'closed',
    priority: 'low',
    updatedAt: '2026-03-12T16:00:00Z',
  },
]

const genId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `m-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

function msg(
  caseKey: string,
  partial: Omit<Message, 'id' | 'caseKey' | 'createdAt'> & {
    createdAt?: string
  },
): Message {
  return {
    id: genId(),
    caseKey,
    createdAt: partial.createdAt ?? new Date().toISOString(),
    ...partial,
  }
}

/** Seed messages per case key including general */
export function buildInitialMessages(): Record<string, Message[]> {
  const general: Message[] = [
    msg('__general__', {
      type: 'assistant',
      content:
        'Welcome to Forensic AI. Open a case or stay in General Mode and run tools from the right panel. Tool results appear in this stream as evidence artifacts.',
    }),
  ]

  const alpha: Message[] = [
    msg('case-alpha', {
      type: 'user',
      content:
        'We received a batch of wire instructions labeled “OPERATING — FX”. Need to know if anything conflicts with prior filings.',
      createdAt: '2026-05-01T13:00:00Z',
    }),
    msg('case-alpha', {
      type: 'assistant',
      content:
        'I can compare instructions against the filing set once you attach the PDFs or run Document Analyzer on the message containing the table.',
      createdAt: '2026-05-01T13:01:00Z',
    }),
    msg('case-alpha', {
      type: 'tool_output',
      content: '',
      toolId: 'transaction_analyzer',
      toolName: 'Transaction Analyzer',
      toolSummary: 'Velocity spike on subsidiary corridor',
      lines: [
        '3 wires share the same beneficiary token within 90 minutes',
        'Round-dollar clustering suggests template reuse',
        'Recommend correlating with invoice hashes from doc store',
      ],
      createdAt: '2026-05-01T13:30:00Z',
      evidence: true,
    }),
  ]

  const bravo: Message[] = [
    msg('case-bravo', {
      type: 'user',
      content: 'Start profiling vendor risk for the recall cohort.',
      createdAt: '2026-04-27T10:00:00Z',
    }),
  ]

  return {
    __general__: general,
    'case-alpha': alpha,
    'case-bravo': bravo,
    'case-charlie': [],
  }
}
