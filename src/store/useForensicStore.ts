import { create } from 'zustand'
import type {
  BirdFinancialDocRow,
  BirdGatheredFactRow,
  BirdGovernmentIdRow,
  BirdMcaFiling,
  BirdRegistryProfile,
  BirdSocialRow,
  BirdsEyeLens,
  CaseEntity,
  CaseNote,
  CaseTask,
  CasesSidebarFilter,
  DashboardSection,
  EvidenceEntry,
  ForensicCase,
  MainNav,
  Message,
  RightPanelTab,
  TaskStatus,
  ToolId,
  ToolInputContext,
} from '../types'
import { GENERAL_CASE_KEY } from '../constants'
import { BIRD_REGISTRY_SEED } from '../data/birdRegistry'
import { MOCK_CASES, buildInitialMessages } from '../data/mock'
import {
  buildInitialEntities,
  buildInitialEvidences,
  buildInitialNotes,
  buildInitialTasks,
} from '../data/mockArtifacts'
import { getToolById } from '../data/tools'
import { mockToolResult, type MockToolResultOptions } from '../data/toolOutputs'

function caseKeyFromActiveId(activeCaseId: string | null): string {
  return activeCaseId ?? GENERAL_CASE_KEY
}

function newId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

export interface ToolStateSlice {
  activeTool: ToolId | null
  toolInputContext: ToolInputContext | null
  /** Last completed run (shown in runner + optional toast) */
  toolOutput: {
    toolId: ToolId
    summary: string
    lines: string[]
  } | null
  /** Inspector expanded (Figma-like) */
  panelOpen: boolean
}

interface ForensicStore {
  cases: ForensicCase[]
  activeCaseId: string | null
  messages: Record<string, Message[]>
  mainNav: MainNav
  searchQuery: string
  toolState: ToolStateSlice
  /** Right inspector tab */
  rightPanelTab: RightPanelTab
  entities: Record<string, CaseEntity[]>
  evidences: Record<string, EvidenceEntry[]>
  notes: Record<string, CaseNote[]>
  tasks: Record<string, CaseTask[]>

  dashboardSection: DashboardSection
  casesSidebarFilter: CasesSidebarFilter
  birdsEyeLens: BirdsEyeLens
  /** Cross-case entity dossiers (bird’s view) */
  birdRegistryProfiles: BirdRegistryProfile[]

  setActiveCase: (id: string | null) => void
  setMainNav: (nav: MainNav) => void
  setDashboardSection: (s: DashboardSection) => void
  setCasesSidebarFilter: (f: CasesSidebarFilter) => void
  setBirdsEyeLens: (lens: BirdsEyeLens) => void
  setSearchQuery: (q: string) => void
  setRightPanelTab: (tab: RightPanelTab) => void
  addCase: (c: ForensicCase) => void
  appendMessage: (
    m: Omit<Message, 'id' | 'createdAt' | 'caseKey'> & {
      caseKey?: string
    },
  ) => void
  openTool: (toolId: ToolId, ctx: ToolInputContext | null) => void
  closeTool: () => void
  setPanelOpen: (open: boolean) => void
  runTool: (toolId: ToolId, config?: Record<string, unknown>) => void
  toggleMessagePin: (messageId: string) => void
  toggleMessageEvidence: (messageId: string) => void
  chainFromMessage: (messageId: string) => void

  addNote: (
    note: Omit<CaseNote, 'id' | 'createdAt' | 'updatedAt' | 'caseKey'> & {
      caseKey?: string
    },
  ) => void
  addEvidence: (
    ev: Omit<EvidenceEntry, 'id' | 'createdAt' | 'caseKey'> & {
      caseKey?: string
    },
  ) => void
  addTask: (
    task: Omit<CaseTask, 'id' | 'createdAt' | 'caseKey'> & {
      caseKey?: string
    },
  ) => void
  updateTaskStatus: (taskId: string, status: TaskStatus) => void

  addBirdGatheredFact: (
    entityId: string,
    fact: Omit<BirdGatheredFactRow, 'id'>,
  ) => void
  addBirdFinancialDocument: (
    entityId: string,
    doc: Omit<BirdFinancialDocRow, 'id'>,
  ) => void
  addBirdGovernmentId: (
    entityId: string,
    row: Omit<BirdGovernmentIdRow, 'id'>,
  ) => void
  addBirdSocialLink: (
    entityId: string,
    row: Omit<BirdSocialRow, 'id'>,
  ) => void
  addBirdMcaFiling: (
    entityId: string,
    row: Omit<BirdMcaFiling, 'id'>,
  ) => void
}

function initialToolState(): ToolStateSlice {
  return {
    activeTool: null,
    toolInputContext: null,
    toolOutput: null,
    panelOpen: true,
  }
}

export const useForensicStore = create<ForensicStore>((set, get) => ({
  cases: MOCK_CASES,
  activeCaseId: null,
  messages: buildInitialMessages(),
  mainNav: 'chat',
  dashboardSection: 'overview',
  casesSidebarFilter: 'all',
  birdsEyeLens: 'panorama',
  birdRegistryProfiles: structuredClone(
    BIRD_REGISTRY_SEED,
  ) as BirdRegistryProfile[],
  searchQuery: '',
  toolState: initialToolState(),
  rightPanelTab: 'tools',
  entities: buildInitialEntities(),
  evidences: buildInitialEvidences(),
  notes: buildInitialNotes(),
  tasks: buildInitialTasks(),

  setActiveCase: (id) =>
    set({
      activeCaseId: id,
      mainNav: 'chat',
    }),

  setMainNav: (nav) => set({ mainNav: nav }),

  setDashboardSection: (dashboardSection) => set({ dashboardSection }),

  setCasesSidebarFilter: (casesSidebarFilter) =>
    set({ casesSidebarFilter }),

  setBirdsEyeLens: (birdsEyeLens) => set({ birdsEyeLens }),

  setSearchQuery: (q) => set({ searchQuery: q }),

  setRightPanelTab: (tab) => set({ rightPanelTab: tab }),

  addCase: (c) =>
    set((s) => ({
      cases: [c, ...s.cases],
      messages: { ...s.messages, [c.id]: [] },
      entities: { ...s.entities, [c.id]: [] },
      evidences: { ...s.evidences, [c.id]: [] },
      notes: { ...s.notes, [c.id]: [] },
      tasks: { ...s.tasks, [c.id]: [] },
      activeCaseId: c.id,
      mainNav: 'chat',
    })),

  appendMessage: (m) =>
    set((s) => {
      const ck = m.caseKey ?? caseKeyFromActiveId(s.activeCaseId)
      const row: Message = {
        ...m,
        id: newId(),
        createdAt: new Date().toISOString(),
        caseKey: ck,
      }
      const list = s.messages[ck] ?? []
      return {
        messages: { ...s.messages, [ck]: [...list, row] },
      }
    }),

  openTool: (toolId, ctx) =>
    set({
      rightPanelTab: 'tools',
      toolState: {
        ...get().toolState,
        activeTool: toolId,
        toolInputContext: ctx,
        toolOutput: null,
        panelOpen: true,
      },
    }),

  closeTool: () =>
    set({
      toolState: {
        ...get().toolState,
        activeTool: null,
        toolInputContext: null,
      },
    }),

  setPanelOpen: (open) =>
    set({
      toolState: { ...get().toolState, panelOpen: open },
    }),

  runTool: (toolId, config) => {
    const s = get()
    const ck = caseKeyFromActiveId(s.activeCaseId)
    const toolMeta = getToolById(toolId)
    const ctx = s.toolState.toolInputContext
    const preview =
      ctx?.preview ||
      (s.activeCaseId
        ? s.cases.find((c) => c.id === s.activeCaseId)?.name ??
          'Case context'
        : 'General Mode — workspace context')

    const c = config ?? {}
    const entityIds = c.entityIds
    const mockOpts: MockToolResultOptions = {
      entityIds: Array.isArray(entityIds) ? (entityIds as string[]) : undefined,
      deepCorrelate: c.deepCorrelate === true,
      includeSuppressed: c.includeSuppressed === true,
    }
    const { summary, lines } = mockToolResult(toolId, preview, mockOpts)

    const boolFlags = Object.entries(c).filter(
      ([k, v]) => k !== 'entityIds' && typeof v === 'boolean' && v,
    )
    const extra =
      boolFlags.length > 0
        ? ` Options: ${boolFlags.map(([k]) => k).join(', ')}.`
        : ''

    const msg: Message = {
      id: newId(),
      caseKey: ck,
      type: 'tool_output',
      content: '',
      createdAt: new Date().toISOString(),
      toolId,
      toolName: toolMeta.name,
      toolSummary: summary + extra,
      lines,
      pinned: false,
      evidence: true,
    }

    const list = s.messages[ck] ?? []
    const taskLog: CaseTask = {
      id: newId(),
      caseKey: ck,
      title: `${toolMeta.name} — artifact logged`,
      description: summary,
      status: 'done',
      assignee: 'ai',
      createdAt: new Date().toISOString(),
    }
    const taskList = s.tasks[ck] ?? []
    set({
      messages: { ...s.messages, [ck]: [...list, msg] },
      tasks: { ...s.tasks, [ck]: [taskLog, ...taskList] },
      rightPanelTab: 'tools',
      toolState: {
        ...s.toolState,
        toolOutput: { toolId, summary, lines },
        activeTool: null,
        toolInputContext: null,
      },
    })
  },

  addNote: (note) =>
    set((s) => {
      const ck = note.caseKey ?? caseKeyFromActiveId(s.activeCaseId)
      const now = new Date().toISOString()
      const row: CaseNote = {
        ...note,
        id: newId(),
        caseKey: ck,
        createdAt: now,
        updatedAt: now,
      }
      const list = s.notes[ck] ?? []
      return { notes: { ...s.notes, [ck]: [row, ...list] } }
    }),

  addEvidence: (ev) =>
    set((s) => {
      const ck = ev.caseKey ?? caseKeyFromActiveId(s.activeCaseId)
      const row: EvidenceEntry = {
        ...ev,
        id: newId(),
        caseKey: ck,
        createdAt: new Date().toISOString(),
      }
      const list = s.evidences[ck] ?? []
      return { evidences: { ...s.evidences, [ck]: [row, ...list] } }
    }),

  addTask: (task) =>
    set((s) => {
      const ck = task.caseKey ?? caseKeyFromActiveId(s.activeCaseId)
      const row: CaseTask = {
        ...task,
        id: newId(),
        caseKey: ck,
        createdAt: new Date().toISOString(),
      }
      const list = s.tasks[ck] ?? []
      return { tasks: { ...s.tasks, [ck]: [row, ...list] } }
    }),

  updateTaskStatus: (taskId, status) =>
    set((s) => {
      for (const ck of Object.keys(s.tasks)) {
        const list = s.tasks[ck] ?? []
        if (!list.some((t) => t.id === taskId)) continue
        return {
          tasks: {
            ...s.tasks,
            [ck]: list.map((t) =>
              t.id === taskId ? { ...t, status } : t,
            ),
          },
        }
      }
      return {}
    }),

  addBirdGatheredFact: (entityId, fact) =>
    set((s) => ({
      birdRegistryProfiles: s.birdRegistryProfiles.map((p) =>
        p.id !== entityId
          ? p
          : {
              ...p,
              gatheredFacts: [
                ...p.gatheredFacts,
                { ...fact, id: newId() },
              ],
            },
      ),
    })),

  addBirdFinancialDocument: (entityId, doc) =>
    set((s) => ({
      birdRegistryProfiles: s.birdRegistryProfiles.map((p) =>
        p.id !== entityId
          ? p
          : {
              ...p,
              financialDocuments: [
                ...p.financialDocuments,
                { ...doc, id: newId() },
              ],
            },
      ),
    })),

  addBirdGovernmentId: (entityId, row) =>
    set((s) => ({
      birdRegistryProfiles: s.birdRegistryProfiles.map((p) =>
        p.id !== entityId
          ? p
          : {
              ...p,
              governmentIds: [...p.governmentIds, { ...row, id: newId() }],
            },
      ),
    })),

  addBirdSocialLink: (entityId, row) =>
    set((s) => ({
      birdRegistryProfiles: s.birdRegistryProfiles.map((p) =>
        p.id !== entityId
          ? p
          : {
              ...p,
              socialMedia: [...p.socialMedia, { ...row, id: newId() }],
            },
      ),
    })),

  addBirdMcaFiling: (entityId, row) =>
    set((s) => ({
      birdRegistryProfiles: s.birdRegistryProfiles.map((p) =>
        p.id !== entityId
          ? p
          : {
              ...p,
              mcaFilings: [...(p.mcaFilings ?? []), { ...row, id: newId() }],
            },
      ),
    })),

  toggleMessagePin: (messageId) =>
    set((s) => {
      const ck = caseKeyFromActiveId(s.activeCaseId)
      const list = (s.messages[ck] ?? []).map((m) =>
        m.id === messageId ? { ...m, pinned: !m.pinned } : m,
      )
      return { messages: { ...s.messages, [ck]: list } }
    }),

  toggleMessageEvidence: (messageId) =>
    set((s) => {
      const ck = caseKeyFromActiveId(s.activeCaseId)
      const list = (s.messages[ck] ?? []).map((m) =>
        m.id === messageId ? { ...m, evidence: !m.evidence } : m,
      )
      return { messages: { ...s.messages, [ck]: list } }
    }),

  chainFromMessage: (messageId) =>
    set((s) => {
      const ck = caseKeyFromActiveId(s.activeCaseId)
      const m = (s.messages[ck] ?? []).find((x) => x.id === messageId)
      if (!m || m.type !== 'tool_output') return {}
      const preview = m.toolSummary || m.lines?.join(' · ') || m.content
      return {
        rightPanelTab: 'tools',
        toolState: {
          ...s.toolState,
          activeTool: 'transaction_analyzer',
          toolInputContext: {
            source: 'chain',
            chainFromMessageId: messageId,
            preview: `[Chain] ${preview}`,
          },
          toolOutput: null,
          panelOpen: true,
        },
      }
    }),
}))

export function useActiveCaseKey(): string {
  const activeCaseId = useForensicStore((s) => s.activeCaseId)
  return caseKeyFromActiveId(activeCaseId)
}

export function useMessagesForActiveCase(): Message[] {
  const activeCaseId = useForensicStore((s) => s.activeCaseId)
  const messages = useForensicStore((s) => s.messages)
  const key = caseKeyFromActiveId(activeCaseId)
  return messages[key] ?? []
}

export function useFilteredMessages(): Message[] {
  const q = useForensicStore((s) => s.searchQuery.trim().toLowerCase())
  const list = useMessagesForActiveCase()
  if (!q) return list
  return list.filter((m) => {
    const blob = [
      m.content,
      m.toolName,
      m.toolSummary,
      ...(m.lines ?? []),
    ]
      .join(' ')
      .toLowerCase()
    return blob.includes(q)
  })
}
