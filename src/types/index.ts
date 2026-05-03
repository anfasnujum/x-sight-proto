export type MessageRole = 'user' | 'assistant' | 'tool_output'

export type ToolId =
  | 'transaction_analyzer'
  | 'document_analyzer'
  | 'risk_profiler'
  | 'timeline_builder'
  | 'relationship_analyser'

export type CaseStatus = 'open' | 'review' | 'closed'
export type Priority = 'low' | 'medium' | 'high' | 'critical'

export interface ForensicCase {
  id: string
  name: string
  status: CaseStatus
  priority: Priority
  updatedAt: string
}

export type ToolInputSource = 'message' | 'case' | 'manual' | 'chain'

export interface ToolInputContext {
  source: ToolInputSource
  messageId?: string
  /** Short preview of input text shown in the inspector */
  preview: string
  chainFromMessageId?: string
}

export interface Message {
  id: string
  caseKey: string
  type: MessageRole
  content: string
  createdAt: string
  toolId?: ToolId
  toolName?: string
  /** One-line headline for tool_output cards */
  toolSummary?: string
  /** Bullet lines for tool_output */
  lines?: string[]
  pinned?: boolean
  evidence?: boolean
}

/** Primary app module (left icon rail) */
export type MainNav = 'dashboard' | 'cases' | 'chat' | 'birds_view'

export type DashboardSection = 'overview' | 'signals' | 'reports'

/** Cases module: internal sidebar filter */
export type CasesSidebarFilter = 'all' | CaseStatus

/** Bird's view module: lens */
export type BirdsEyeLens =
  | 'panorama'
  | 'entities'
  | 'timeline'
  | 'evidences'
  | 'notes'
  | 'data_dump'
  | 'tasks'

/** Data dump — ingested items (mail / post / document) and AI extraction preview */
export type DataDumpSourceKind = 'mail' | 'post' | 'document'

export interface DataDumpRegistryMatch {
  registryId: string
  displayName: string
  matchStrength: 'high' | 'medium' | 'low'
  reason: string
}

export interface DataDumpExtractedEntity {
  id: string
  surfaceForm: string
  inferredCategory: BirdEntityCategory | 'unknown'
  confidencePct: number
  registryMatch?: DataDumpRegistryMatch
}

export interface DataDumpExtractedEvent {
  id: string
  title: string
  date?: string
  detail: string
}

export interface DataDumpMappedFact {
  id: string
  targetRegistryId?: string
  targetEntityLabel: string
  fieldLabel: string
  fieldValue: string
}

export interface DataDumpItem {
  id: string
  kind: DataDumpSourceKind
  label: string
  detailLine?: string
  capturedAt: string
  fileName?: string
  fileSizeLabel?: string
  mimeType?: string
  analysisStatus: 'analyzing' | 'complete'
  aiSummary?: string
  entities: DataDumpExtractedEntity[]
  events: DataDumpExtractedEvent[]
  mappedFacts: DataDumpMappedFact[]
}

/** Registry row category (bird’s view entities workspace) */
export type BirdEntityCategory =
  | 'person'
  | 'company'
  | 'ngo'
  | 'trust'
  | 'partnership'
  | 'llp'
  | 'government_body'
  | 'sole_proprietorship'
  | 'other'

export interface BirdGovernmentIdRow {
  id: string
  /** Aadhaar, PAN, CIN, GSTIN, etc. */
  idType: string
  value: string
  source: 'ai' | 'user'
  needsVerification: boolean
}

export interface BirdAffiliationRow {
  id: string
  entityId: string
  name: string
  relationship: string
  source: 'ai' | 'user'
}

export interface BirdSocialRow {
  id: string
  platform: string
  url: string
  source: 'ai' | 'user'
  needsVerification: boolean
}

export interface BirdFinancialDocRow {
  id: string
  title: string
  docType: string
  reference?: string
  /** ISO date */
  date?: string
  relatedCaseKeys?: string[]
  source: 'ai' | 'user'
}

export interface BirdGatheredFactRow {
  id: string
  label: string
  value: string
  source: 'ai' | 'user'
  needsVerification: boolean
}

/** MCA (India) — filings pulled from mca.gov.in / V3 portal (mock URLs in prototype) */
export interface BirdMcaFiling {
  id: string
  title: string
  /** e.g. AOC-4, MGT-7, PAS-3, CHG-1, INC-22A, Company Master Data */
  formType: string
  filingDate?: string
  /** MCA Service Request Number when known */
  srn?: string
  description?: string
  source: 'mca_portal' | 'user_upload'
  /** Link to MCA view / PDF when available */
  portalUrl?: string
}

/** Primary regulatory lens — Indian cos focus on MCA; foreign entities use home-country IDs */
export type BirdPrimaryJurisdiction = 'IN' | 'foreign' | 'multi'

/** Cross-case entity dossier (AI-enriched, user-verifiable) */
export interface BirdRegistryProfile {
  id: string
  category: BirdEntityCategory
  legalName: string
  aliases: string[]
  /** Summary line for table */
  headline?: string
  /** Drives MCA emphasis and ID labeling */
  primaryJurisdiction?: BirdPrimaryJurisdiction
  person?: {
    dateOfBirth?: string
    nationality?: string
    gender?: string
    residentialAddress?: string
    /** Director Identification Number (India) when person is/was director */
    din?: string
  }
  corporate?: {
    cin?: string
    incorporationDate?: string
    registeredAddress?: string
    gstin?: string
    pan?: string
    regulatoryStatus?: string
    /** For NGOs / trusts */
    registrationNumber?: string
    boardMembers?: string[]
    /** ROC jurisdiction e.g. ROC Bangalore, ROC Mumbai */
    roc?: string
    /** Company status from MCA master data */
    mcaCompanyStatus?: string
  }
  governmentIds: BirdGovernmentIdRow[]
  affiliationsCompanies: BirdAffiliationRow[]
  affiliationsNgos: BirdAffiliationRow[]
  socialMedia: BirdSocialRow[]
  financialDocuments: BirdFinancialDocRow[]
  /** India: statutory filings from MCA — critical for Indian companies */
  mcaFilings?: BirdMcaFiling[]
  gatheredFacts: BirdGatheredFactRow[]
}

/** Real-world facts about dossier entities — not tool/system alerts */
export type BirdEntityTimelineKind =
  | 'incorporation'
  | 'appointment'
  | 'interaction'
  | 'regulatory'
  | 'ownership_change'
  | /** Posts on LinkedIn, Instagram, Facebook, etc. — including posts that describe another real-world event */
  'social_post'
  | 'other'

/** Platform when `kind === 'social_post'` */
export type BirdTimelineSocialPlatform =
  | 'linkedin'
  | 'instagram'
  | 'facebook'
  | 'twitter'
  | 'youtube'
  | 'other'

export interface BirdTimelineEvent {
  id: string
  occurredAt: string
  title: string
  description: string
  /** People, companies, trusts, etc. involved in this fact */
  entityIds: string[]
  kind: BirdEntityTimelineKind
  caseKey?: string
  /** Origin of the date or narrative */
  source?: 'mca' | 'user' | 'open_source' | 'ai'
  /** Geographic places tied to this fact (city/region/country as free text) */
  locations?: string[]
  /** When this row documents a social post (may recap another event, e.g. conference) */
  socialPost?: {
    platform: BirdTimelineSocialPlatform
    url?: string
    excerpt?: string
  }
}

/** Right inspector drawer primary section */
export type RightPanelTab =
  | 'tools'
  | 'document_viewer'
  | 'entities'
  | 'evidences'
  | 'notes'
  | 'tasks'

/** Open file preview in the right inspector (uploaded blob or synthetic seed body) */
export interface DocumentViewerState {
  dataDumpItemId: string
  title: string
  mimeType?: string
  /** User-uploaded file — revoke via URL.revokeObjectURL when replaced or closed */
  objectUrl?: string
  /** Non-file sources (mail/post seeds) — trusted prototype HTML only */
  syntheticHtml?: string
}

export type EntityKind = 'person' | 'company' | 'organization'

export interface CaseEntity {
  id: string
  caseKey: string
  name: string
  kind: EntityKind
  detail?: string
}

export type EvidenceKind = 'image' | 'text' | 'link' | 'file' | 'other'

export interface EvidenceEntry {
  id: string
  caseKey: string
  kind: EvidenceKind
  title: string
  /** Image URL, link URL, or text excerpt */
  value: string
  /** Analyst notes / interpretation */
  thought: string
  createdAt: string
}

export interface CaseNote {
  id: string
  caseKey: string
  title: string
  body: string
  createdAt: string
  updatedAt: string
}

export type TaskStatus = 'queued' | 'running' | 'done' | 'blocked'

export interface CaseTask {
  id: string
  caseKey: string
  title: string
  description: string
  status: TaskStatus
  assignee: 'ai' | 'user'
  createdAt: string
}

/** Panorama board (bird’s view) */
export interface BirdBoardEntity {
  id: string
  name: string
  kind: EntityKind
  /** Canvas center point (px) */
  cx: number
  cy: number
}

export interface BirdRelationshipDetail {
  id: string
  /** Relationship category shown in modal */
  label: string
  detail: string
}

export interface BirdGraphEdge {
  id: string
  sourceId: string
  targetId: string
  relationships: BirdRelationshipDetail[]
}

export interface ToolDefinition {
  id: ToolId
  name: string
  shortDescription: string
}
