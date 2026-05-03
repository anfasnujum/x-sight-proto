import { Fragment, useCallback, useMemo, useRef, useState } from 'react'
import {
  Building2,
  Calendar,
  CheckCircle2,
  FileText,
  Link2,
  Loader2,
  Mail,
  MessageSquare,
  Sparkles,
  Upload,
} from 'lucide-react'
import type {
  BirdRegistryProfile,
  DataDumpExtractedEntity,
  DataDumpExtractedEvent,
  DataDumpItem,
  DataDumpMappedFact,
  DataDumpSourceKind,
} from '../../types'
import { useForensicStore } from '../../store/useForensicStore'

function newLocalId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `dd-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function truncateDesc(text: string | undefined, max = 140): string {
  if (!text?.trim()) return '—'
  const t = text.trim()
  if (t.length <= max) return t
  return `${t.slice(0, max - 1)}…`
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function kindIcon(kind: DataDumpSourceKind) {
  if (kind === 'mail') return Mail
  if (kind === 'post') return MessageSquare
  return FileText
}

function matchProfileByFilename(
  fileName: string,
  profiles: BirdRegistryProfile[],
): BirdRegistryProfile | undefined {
  const lower = fileName.toLowerCase()
  for (const p of profiles) {
    const tokens = [p.legalName, ...(p.aliases ?? [])]
    for (const t of tokens) {
      const words = t
        .toLowerCase()
        .split(/[\s,.\-()]+/)
        .filter((w) => w.length >= 4)
      for (const w of words) {
        if (lower.includes(w)) return p
      }
    }
  }
  return undefined
}

function buildMockExtraction(
  file: File,
  profiles: BirdRegistryProfile[],
): Pick<
  DataDumpItem,
  'aiSummary' | 'entities' | 'events' | 'mappedFacts' | 'detailLine'
> {
  const byName = matchProfileByFilename(file.name, profiles)
  const finDoc =
    /income|p&l|p\s*l|profit|loss|statement|quarter|annual|balance|10-?k|bsheet/i.test(
      file.name,
    )
  const radiant = profiles.find((p) => p.id === 'e-radiant-india')
  const primary = finDoc && radiant ? radiant : byName

  const entities: DataDumpExtractedEntity[] = []
  const events: DataDumpExtractedEvent[] = []
  const mappedFacts: DataDumpMappedFact[] = []

  if (primary) {
    entities.push({
      id: newLocalId(),
      surfaceForm: primary.legalName,
      inferredCategory: primary.category,
      confidencePct: finDoc ? 97 : 88,
      registryMatch: {
        registryId: primary.id,
        displayName: primary.legalName,
        matchStrength: finDoc ? 'high' : 'high',
        reason: finDoc
          ? 'CIN / company name in document header (simulated match)'
          : 'Name token overlap with filename or body (simulated)',
      },
    })
  } else {
    entities.push(
      {
        id: newLocalId(),
        surfaceForm: 'Unlisted counterparty “Rivermint LLP”',
        inferredCategory: 'llp',
        confidencePct: 62,
      },
      {
        id: newLocalId(),
        surfaceForm: 'Mumbai branch operations',
        inferredCategory: 'unknown',
        confidencePct: 41,
      },
    )
  }

  if (finDoc && primary) {
    mappedFacts.push(
      {
        id: newLocalId(),
        targetRegistryId: primary.id,
        targetEntityLabel: primary.legalName,
        fieldLabel: 'Reporting period',
        fieldValue: 'FY 2024–25 (simulated)',
      },
      {
        id: newLocalId(),
        targetRegistryId: primary.id,
        targetEntityLabel: primary.legalName,
        fieldLabel: 'Total revenue',
        fieldValue: '₹ 42.6 Cr (extracted)',
      },
      {
        id: newLocalId(),
        targetRegistryId: primary.id,
        targetEntityLabel: primary.legalName,
        fieldLabel: 'PAT margin',
        fieldValue: '8.2% (extracted)',
      },
    )
    events.push({
      id: newLocalId(),
      title: 'Filing / disclosure window',
      date: '2025-05-15',
      detail: 'Mock event: statutory filing referenced in the income statement pack.',
    })
  } else {
    mappedFacts.push({
      id: newLocalId(),
      targetRegistryId: primary?.id,
      targetEntityLabel: primary?.legalName ?? '—',
      fieldLabel: 'Routing metadata',
      fieldValue: 'Parsed subject line + attachment hash (frontend demo)',
    })
  }

  const summary = finDoc
    ? `Structured financial statements detected in “${file.name}”. Amounts and periods are placeholder extractions for UI review — wire to your document AI for production.`
    : `Heuristic pass over “${file.name}”: surfaced ${entities.length} entity candidates and ${events.length} timeline hooks. Registry overlap shown when names align with your dossiers.`

  return {
    detailLine: `${formatFileSize(file.size)} · ${file.type || 'unknown type'}`,
    aiSummary: summary,
    entities,
    events,
    mappedFacts,
  }
}

const SEED_ITEMS: DataDumpItem[] = [
  {
    id: 'dd-seed-mail-1',
    kind: 'mail',
    label: 'Fwd: Wire instructions — Alpha Shell / Radiant',
    detailLine: 'ops-lead@client.org → investigation mailbox',
    capturedAt: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString(),
    analysisStatus: 'complete',
    aiSummary:
      'Payment corridor email. Mentions Indian operating entity and offshore holding; beneficial ownership language flagged for entity linking.',
    entities: [
      {
        id: 'se-1',
        surfaceForm: 'Alpha Shell Holdings Ltd.',
        inferredCategory: 'company',
        confidencePct: 93,
        registryMatch: {
          registryId: 'e-alpha-shell',
          displayName: 'Alpha Shell Holdings Ltd.',
          matchStrength: 'high',
          reason: 'Exact legal name in message body (simulated)',
        },
      },
      {
        id: 'se-2',
        surfaceForm: 'Radiant Components Private Limited',
        inferredCategory: 'company',
        confidencePct: 89,
        registryMatch: {
          registryId: 'e-radiant-india',
          displayName: 'Radiant Components Private Limited',
          matchStrength: 'high',
          reason: 'Signatory + Indian ops context (simulated)',
        },
      },
      {
        id: 'se-3',
        surfaceForm: 'HSBC Mauritius routing',
        inferredCategory: 'company',
        confidencePct: 54,
      },
    ],
    events: [
      {
        id: 'ev-1',
        title: 'Instructed value date',
        date: '2025-04-28',
        detail: 'Email references T+2 settlement against invoice INV-RAD-8841 (mock).',
      },
    ],
    mappedFacts: [
      {
        id: 'mf-1',
        targetRegistryId: 'e-alpha-shell',
        targetEntityLabel: 'Alpha Shell Holdings Ltd.',
        fieldLabel: 'Correspondent bank (parsed)',
        fieldValue: 'HSBC — Mauritius (simulated)',
      },
      {
        id: 'mf-2',
        targetRegistryId: 'e-radiant-india',
        targetEntityLabel: 'Radiant Components Private Limited',
        fieldLabel: 'Role in thread',
        fieldValue: 'Indian operating counterparty / invoice issuer',
      },
    ],
  },
  {
    id: 'dd-seed-post-1',
    kind: 'post',
    label: 'LinkedIn — Radiant hiring push (public)',
    detailLine: 'social · scraped snippet',
    capturedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    analysisStatus: 'complete',
    aiSummary:
      'Short-form post; organisation tag resolves to an existing company dossier. Useful as soft corroboration of headcount / location signals.',
    entities: [
      {
        id: 'se-p1',
        surfaceForm: 'Radiant Components Pvt. Ltd.',
        inferredCategory: 'company',
        confidencePct: 81,
        registryMatch: {
          registryId: 'e-radiant-india',
          displayName: 'Radiant Components Private Limited',
          matchStrength: 'medium',
          reason: 'Org page slug + name variant (simulated)',
        },
      },
    ],
    events: [
      {
        id: 'ev-p1',
        title: 'Post published',
        date: '2025-05-01',
        detail: 'Advertises Bengaluru engineering roles — aligns with registered address jurisdiction.',
      },
    ],
    mappedFacts: [
      {
        id: 'mf-p1',
        targetRegistryId: 'e-radiant-india',
        targetEntityLabel: 'Radiant Components Private Limited',
        fieldLabel: 'Signal',
        fieldValue: 'Active hiring — corroborates operational footprint',
      },
    ],
  },
  {
    id: 'dd-seed-doc-1',
    kind: 'document',
    label: 'MCA Form AOC-4 — Radiant (mock PDF)',
    detailLine: 'application/pdf · 1.2 MB',
    capturedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    analysisStatus: 'complete',
    aiSummary:
      'Annual filing pack. CIN and PAN extracted and aligned with registry; narrative sections left for analyst review.',
    entities: [
      {
        id: 'se-d1',
        surfaceForm: 'Radiant Components Private Limited',
        inferredCategory: 'company',
        confidencePct: 99,
        registryMatch: {
          registryId: 'e-radiant-india',
          displayName: 'Radiant Components Private Limited',
          matchStrength: 'high',
          reason: 'CIN U72200KA2019PTC123456 matches MCA dossier',
        },
      },
    ],
    events: [
      {
        id: 'ev-d1',
        title: 'AGM date noted',
        date: '2024-09-22',
        detail: 'Extracted from director report section (mock).',
      },
    ],
    mappedFacts: [
      {
        id: 'mf-d1',
        targetRegistryId: 'e-radiant-india',
        targetEntityLabel: 'Radiant Components Private Limited',
        fieldLabel: 'CIN',
        fieldValue: 'U72200KA2019PTC123456',
      },
      {
        id: 'mf-d2',
        targetRegistryId: 'e-radiant-india',
        targetEntityLabel: 'Radiant Components Private Limited',
        fieldLabel: 'PAN',
        fieldValue: 'AABCR8899C',
      },
    ],
  },
]

function syntheticViewerHtml(item: DataDumpItem): string {
  if (item.id === 'dd-seed-mail-1') {
    return `
<h2>Message</h2>
<p style="color:#a1a1aa;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">Synthetic mail preview</p>
<p><strong>From:</strong> ops-lead@client.org<br/>
<strong>To:</strong> investigation@firm.local<br/>
<strong>Subject:</strong> Fwd: Wire instructions — Alpha Shell / Radiant</p>
<pre>Team — please align treasury with attached beneficiary tags.
Invoices INV-RAD-8841 referenced for T+2 against Mauritius corridor.

— Ops</pre>`
  }
  if (item.id === 'dd-seed-post-1') {
    return `
<h2>Social snapshot</h2>
<p style="color:#a1a1aa;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">LinkedIn · public excerpt</p>
<p><strong>Radiant Components Pvt. Ltd.</strong> is hiring Senior Firmware Engineers in Bengaluru. Hybrid · Full-time.</p>
<p style="color:#71717a;font-size:12px;">128 reactions · 14 comments — IDs omitted (prototype)</p>`
  }
  if (item.id === 'dd-seed-doc-1') {
    return `
<h2>MCA filing (mock)</h2>
<p style="color:#a1a1aa;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">Form AOC-4 · excerpt</p>
<table>
<tr><th>Field</th><th>Value</th></tr>
<tr><td>CIN</td><td>U72200KA2019PTC123456</td></tr>
<tr><td>Company</td><td>Radiant Components Private Limited</td></tr>
<tr><td>PAN</td><td>AABCR8899C</td></tr>
<tr><td>ROC</td><td>Bangalore</td></tr>
</table>
<pre>Director report (abridged) — AGM held 2024-09-22. Financial statements adopted.</pre>`
  }
  return `
<h2>Document body</h2>
<p>${escapeHtml(item.label)}</p>
<p>${escapeHtml(item.aiSummary ?? item.detailLine ?? '(No summary)')}</p>`
}

function MatchBadge({ strength }: { strength: 'high' | 'medium' | 'low' }) {
  const cls =
    strength === 'high'
      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
      : strength === 'medium'
        ? 'border-amber-500/40 bg-amber-500/10 text-amber-200'
        : 'border-zinc-600 bg-zinc-900/80 text-zinc-400'
  const label =
    strength === 'high' ? 'Strong match' : strength === 'medium' ? 'Possible match' : 'Weak'
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium ${cls}`}
    >
      <Link2 className="mr-1 h-3 w-3" aria-hidden />
      {label}
    </span>
  )
}

function DataDumpExpandedDetail({
  item,
  embedded,
}: {
  item: DataDumpItem
  embedded?: boolean
}) {
  const setBirdsEyeLens = useForensicStore((s) => s.setBirdsEyeLens)

  return (
    <div
      className={
        embedded
          ? 'bg-[#0a0b0e]/95 px-4 py-4'
          : 'rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-4'
      }
    >
      <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
        Extraction detail
      </p>
      {item.analysisStatus === 'analyzing' ? (
        <div className="mt-3 flex items-center gap-2 text-sm text-violet-300">
          <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
          <span>Extracting entities, events, and registry links…</span>
        </div>
      ) : (
        <>
          {item.aiSummary && (
            <div className="mt-3 flex gap-2 rounded-lg border border-zinc-800/90 bg-zinc-900/40 p-3">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
              <p className="text-sm leading-relaxed text-zinc-400">{item.aiSummary}</p>
            </div>
          )}

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <section>
              <h3 className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                <Building2 className="h-3.5 w-3.5" />
                Extracted entities
              </h3>
              <ul className="space-y-2">
                {item.entities.map((en: DataDumpExtractedEntity) => (
                  <li
                    key={en.id}
                    className="rounded-lg border border-zinc-800/80 bg-zinc-950/50 px-3 py-2"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-zinc-200">{en.surfaceForm}</span>
                      <span className="text-[10px] uppercase text-zinc-600">
                        {en.inferredCategory}
                      </span>
                      <span className="text-[11px] text-zinc-500">{en.confidencePct}% conf.</span>
                    </div>
                    {en.registryMatch ? (
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <MatchBadge strength={en.registryMatch.matchStrength} />
                        <button
                          type="button"
                          onClick={() => setBirdsEyeLens('entities')}
                          className="text-[11px] text-violet-400 hover:underline"
                        >
                          {en.registryMatch.displayName}
                        </button>
                        <span className="text-[11px] text-zinc-600">— {en.registryMatch.reason}</span>
                      </div>
                    ) : (
                      <p className="mt-1 text-[11px] text-zinc-600">
                        No automatic registry match (review manually).
                      </p>
                    )}
                  </li>
                ))}
                {item.entities.length === 0 && (
                  <li className="text-xs text-zinc-600">None surfaced.</li>
                )}
              </ul>
            </section>

            <section>
              <h3 className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                <Calendar className="h-3.5 w-3.5" />
                Events
              </h3>
              <ul className="space-y-2">
                {item.events.map((ev: DataDumpExtractedEvent) => (
                  <li
                    key={ev.id}
                    className="rounded-lg border border-zinc-800/80 bg-zinc-950/50 px-3 py-2"
                  >
                    <p className="text-sm font-medium text-zinc-200">{ev.title}</p>
                    {ev.date && <p className="text-[11px] text-zinc-500">{ev.date}</p>}
                    <p className="mt-1 text-xs text-zinc-500">{ev.detail}</p>
                  </li>
                ))}
                {item.events.length === 0 && (
                  <li className="text-xs text-zinc-600">No dated events.</li>
                )}
              </ul>
            </section>
          </div>

          <section className="mt-4">
            <h3 className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Mapped to registry
            </h3>
            <div className="overflow-hidden rounded-lg border border-zinc-800">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-zinc-800 bg-zinc-900/50 text-[10px] font-semibold uppercase text-zinc-500">
                  <tr>
                    <th className="px-3 py-2">Entity</th>
                    <th className="px-3 py-2">Field</th>
                    <th className="px-3 py-2">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {item.mappedFacts.map((mf: DataDumpMappedFact) => (
                    <tr key={mf.id} className="border-b border-zinc-800/80 last:border-0">
                      <td className="px-3 py-2">
                        {mf.targetRegistryId ? (
                          <button
                            type="button"
                            onClick={() => setBirdsEyeLens('entities')}
                            className="text-left text-violet-400 hover:underline"
                          >
                            {mf.targetEntityLabel}
                          </button>
                        ) : (
                          <span className="text-zinc-400">{mf.targetEntityLabel}</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-zinc-500">{mf.fieldLabel}</td>
                      <td className="max-w-[280px] px-3 py-2 text-zinc-300">{mf.fieldValue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {item.mappedFacts.length === 0 && (
                <p className="py-4 text-center text-xs text-zinc-600">
                  No structured fields mapped yet.
                </p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  )
}

export function BirdDataDumpLensView() {
  const profiles = useForensicStore((s) => s.birdRegistryProfiles)
  const openDocumentViewer = useForensicStore((s) => s.openDocumentViewer)

  const [items, setItems] = useState<DataDumpItem[]>(() => [...SEED_ITEMS])
  const [dragOver, setDragOver] = useState(false)
  const [selectedDetailId, setSelectedDetailId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const uploadFilesRef = useRef<Map<string, File>>(new Map())

  const sorted = useMemo(
    () =>
      [...items].sort(
        (a, b) =>
          new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime(),
      ),
    [items],
  )

  const finishAnalysis = useCallback(
    (itemId: string, file: File) => {
      const extracted = buildMockExtraction(file, profiles)
      setItems((prev) =>
        prev.map((row) =>
          row.id === itemId
            ? {
                ...row,
                analysisStatus: 'complete' as const,
                ...extracted,
              }
            : row,
        ),
      )
    },
    [profiles],
  )

  const ingestFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList?.length) return
      const files = Array.from(fileList)
      for (const file of files) {
        const id = newLocalId()
        uploadFilesRef.current.set(id, file)
        const row: DataDumpItem = {
          id,
          kind: 'document',
          label: file.name,
          detailLine: `${formatFileSize(file.size)} · ${file.type || 'unknown type'}`,
          capturedAt: new Date().toISOString(),
          fileName: file.name,
          fileSizeLabel: formatFileSize(file.size),
          mimeType: file.type || undefined,
          analysisStatus: 'analyzing',
          entities: [],
          events: [],
          mappedFacts: [],
        }
        setItems((prev) => [row, ...prev])
        window.setTimeout(() => finishAnalysis(id, file), 1400 + Math.random() * 600)
      }
    },
    [finishAnalysis],
  )

  const handleOpenDocument = useCallback(
    (item: DataDumpItem) => {
      const file = uploadFilesRef.current.get(item.id)
      if (file) {
        openDocumentViewer({
          dataDumpItemId: item.id,
          title: file.name,
          mimeType: file.type || undefined,
          objectUrl: URL.createObjectURL(file),
        })
        return
      }
      openDocumentViewer({
        dataDumpItemId: item.id,
        title: item.label,
        mimeType: item.detailLine?.toLowerCase().includes('pdf')
          ? 'application/pdf'
          : undefined,
        syntheticHtml: syntheticViewerHtml(item),
      })
    },
    [openDocumentViewer],
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      ingestFiles(e.dataTransfer.files)
    },
    [ingestFiles],
  )

  const tableDescription = (item: DataDumpItem) => {
    if (item.analysisStatus === 'analyzing') {
      return 'Analysis running — entities and registry mapping will appear when complete.'
    }
    return truncateDesc(item.aiSummary ?? item.detailLine)
  }

  return (
    <div className="mt-8 space-y-6">
      <p className="max-w-3xl text-sm text-zinc-500">
        Cross-case intake surface for unstructured sources: mail, social posts, and
        documents. Uploads run through a simulated extraction pass on this prototype —
        entities are matched against your Bird&apos;s view registry when names align.
      </p>

      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDragEnter={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragOver={(e) => {
          e.preventDefault()
          e.dataTransfer.dropEffect = 'copy'
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          if (e.currentTarget === e.target) setDragOver(false)
        }}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${
          dragOver
            ? 'border-violet-500/60 bg-violet-500/5'
            : 'border-zinc-700 bg-zinc-950/40 hover:border-zinc-600 hover:bg-zinc-900/40'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple
          accept=".pdf,.txt,.md,.doc,.docx,.eml,.msg,.png,.jpg,.jpeg,.webp"
          onChange={(e) => {
            ingestFiles(e.target.files)
            e.target.value = ''
          }}
        />
        <Upload className="mx-auto h-10 w-10 text-zinc-500" aria-hidden />
        <p className="mt-3 text-sm font-medium text-zinc-200">
          Drop files here or click to upload
        </p>
        <p className="mt-1 text-xs text-zinc-600">
          PDF, Office, mail exports, images — demo runs mock AI enrichment client-side.
        </p>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-sm font-medium text-zinc-300">Data points</h2>
          <span className="text-[11px] text-zinc-600">{sorted.length} items</span>
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/50">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-800 bg-zinc-900/60 text-[10px] font-semibold uppercase text-zinc-500">
              <tr>
                <th className="w-12 px-3 py-2">Kind</th>
                <th className="min-w-[140px] px-3 py-2">Title</th>
                <th className="hidden px-3 py-2 md:table-cell">Description</th>
                <th className="whitespace-nowrap px-3 py-2">Status</th>
                <th className="hidden whitespace-nowrap px-3 py-2 lg:table-cell">
                  Captured
                </th>
                <th className="w-[100px] px-3 py-2 text-right">Open</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((item) => {
                const Icon = kindIcon(item.kind)
                const expanded = selectedDetailId === item.id
                return (
                  <Fragment key={item.id}>
                    <tr
                      className={`cursor-pointer border-b border-zinc-800/80 transition hover:bg-zinc-900/40 ${
                        expanded ? 'bg-violet-500/10' : ''
                      }`}
                      onClick={() =>
                        setSelectedDetailId((prev) => (prev === item.id ? null : item.id))
                      }
                    >
                      <td className="px-3 py-2 align-top">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-zinc-400">
                          <Icon className="h-4 w-4" aria-hidden />
                        </span>
                      </td>
                      <td className="max-w-[200px] px-3 py-2 align-top">
                        <span className="font-medium text-zinc-200">{item.label}</span>
                        {item.detailLine && (
                          <p className="mt-0.5 truncate text-[11px] text-zinc-600">
                            {item.detailLine}
                          </p>
                        )}
                      </td>
                      <td className="hidden max-w-md px-3 py-2 align-top text-zinc-500 md:table-cell">
                        {tableDescription(item)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 align-top">
                        {item.analysisStatus === 'analyzing' ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-violet-300">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                            Analyzing
                          </span>
                        ) : (
                          <span className="text-xs text-emerald-400/90">Complete</span>
                        )}
                      </td>
                      <td className="hidden whitespace-nowrap px-3 py-2 align-top text-[11px] text-zinc-600 lg:table-cell">
                        {new Date(item.capturedAt).toLocaleString()}
                      </td>
                      <td className="px-3 py-2 text-right align-top">
                        <button
                          type="button"
                          className="rounded-md border border-zinc-700 bg-zinc-900/80 px-2 py-1 text-[11px] font-medium text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleOpenDocument(item)
                          }}
                        >
                          Open file
                        </button>
                      </td>
                    </tr>
                    {expanded && (
                      <tr className="border-b border-zinc-800/80 bg-zinc-950/70">
                        <td colSpan={6} className="p-0 align-top">
                          <div className="border-t border-zinc-800/90">
                            <DataDumpExpandedDetail item={item} embedded />
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
          {sorted.length === 0 && (
            <p className="py-10 text-center text-sm text-zinc-500">No data points yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
