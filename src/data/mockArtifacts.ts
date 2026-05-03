import { GENERAL_CASE_KEY } from '../constants'
import type {
  CaseEntity,
  CaseNote,
  CaseTask,
  EvidenceEntry,
} from '../types'

function id(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `a-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function buildInitialEntities(): Record<string, CaseEntity[]> {
  return {
    [GENERAL_CASE_KEY]: [
      {
        id: id(),
        caseKey: GENERAL_CASE_KEY,
        kind: 'person',
        name: 'You (analyst)',
        detail: 'Workspace owner',
      },
    ],
    'case-alpha': [
      {
        id: id(),
        caseKey: 'case-alpha',
        kind: 'company',
        name: 'Alpha Shell Holdings Ltd.',
        detail: 'Subject entity · BVI registry',
      },
      {
        id: id(),
        caseKey: 'case-alpha',
        kind: 'person',
        name: 'M. Okonkwo',
        detail: 'Authorized signatory on wires',
      },
      {
        id: id(),
        caseKey: 'case-alpha',
        kind: 'organization',
        name: 'Caribbean FX Services Ltd.',
        detail: 'Correspondent / intermediary',
      },
      {
        id: id(),
        caseKey: 'case-alpha',
        kind: 'company',
        name: 'Northwind Trustees',
        detail: 'Nominee layer',
      },
    ],
    'case-bravo': [
      {
        id: id(),
        caseKey: 'case-bravo',
        kind: 'company',
        name: 'Bravo Manufacturing Inc.',
        detail: 'Recall cohort parent',
      },
      {
        id: id(),
        caseKey: 'case-bravo',
        kind: 'person',
        name: 'Elena Vasquez',
        detail: 'Vendor compliance contact',
      },
    ],
    'case-charlie': [],
  }
}

export function buildInitialEvidences(): Record<string, EvidenceEntry[]> {
  return {
    [GENERAL_CASE_KEY]: [],
    'case-alpha': [
      {
        id: id(),
        caseKey: 'case-alpha',
        kind: 'link',
        title: 'Wire instructions PDF',
        value: 'https://example.com/docs/wire-pack-alpha.pdf',
        thought: 'Filename matches internal template from Q4 pack — compare hashes.',
        createdAt: '2026-05-01T12:00:00Z',
      },
      {
        id: id(),
        caseKey: 'case-alpha',
        kind: 'image',
        title: 'Beneficiary token screenshot',
        value: '/api/mock/screenshot-beneficiary.png',
        thought: 'Same token string appears on three wires within 90 min.',
        createdAt: '2026-05-01T13:15:00Z',
      },
      {
        id: id(),
        caseKey: 'case-alpha',
        kind: 'text',
        title: 'Pasted chat excerpt',
        value:
          '“Use OPERATING — FX tag on anything under $50k to avoid approval queue.”',
        thought: 'Policy circumvention language — elevate to review.',
        createdAt: '2026-05-01T11:40:00Z',
      },
    ],
    'case-bravo': [
      {
        id: id(),
        caseKey: 'case-bravo',
        kind: 'link',
        title: 'Supplier audit spreadsheet',
        value: 'https://example.com/bravo/suppliers-2025.csv',
        thought: 'Cross-reference lot numbers with recall scope.',
        createdAt: '2026-04-27T10:30:00Z',
      },
    ],
    'case-charlie': [],
  }
}

export function buildInitialNotes(): Record<string, CaseNote[]> {
  return {
    [GENERAL_CASE_KEY]: [
      {
        id: id(),
        caseKey: GENERAL_CASE_KEY,
        title: 'How I use this workspace',
        body: 'Pin tool outputs that become exhibits. Tag entities early — it pays off in review.',
        createdAt: '2026-05-02T09:00:00Z',
        updatedAt: '2026-05-02T09:00:00Z',
      },
    ],
    'case-alpha': [
      {
        id: id(),
        caseKey: 'case-alpha',
        title: 'Hypothesis',
        body: 'Layered nominees + velocity spikes suggest shell corridor rather than one-off error.',
        createdAt: '2026-05-01T14:00:00Z',
        updatedAt: '2026-05-01T14:00:00Z',
      },
    ],
    'case-bravo': [],
    'case-charlie': [],
  }
}

export function buildInitialTasks(): Record<string, CaseTask[]> {
  return {
    [GENERAL_CASE_KEY]: [
      {
        id: id(),
        caseKey: GENERAL_CASE_KEY,
        title: 'Summarize workspace objectives',
        description: 'AI: produce a one-paragraph brief for leadership.',
        status: 'done',
        assignee: 'ai',
        createdAt: '2026-05-01T08:00:00Z',
      },
    ],
    'case-alpha': [
      {
        id: id(),
        caseKey: 'case-alpha',
        title: 'Correlate wires with invoice hashes',
        description: 'AI: match Transaction Analyzer output to document store.',
        status: 'running',
        assignee: 'ai',
        createdAt: '2026-05-01T13:45:00Z',
      },
      {
        id: id(),
        caseKey: 'case-alpha',
        title: 'Interview authorized signatory',
        description: 'User: schedule with counsel present.',
        status: 'queued',
        assignee: 'user',
        createdAt: '2026-05-01T12:00:00Z',
      },
      {
        id: id(),
        caseKey: 'case-alpha',
        title: 'Export exhibit bundle',
        description: 'AI: compile pinned artifacts + timeline.',
        status: 'queued',
        assignee: 'ai',
        createdAt: '2026-05-01T11:00:00Z',
      },
    ],
    'case-bravo': [
      {
        id: id(),
        caseKey: 'case-bravo',
        title: 'Vendor risk profile for cohort',
        description: 'AI: run Risk Profiler on supplier list.',
        status: 'blocked',
        assignee: 'ai',
        createdAt: '2026-04-27T11:00:00Z',
      },
    ],
    'case-charlie': [],
  }
}
