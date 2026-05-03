import {
  Building2,
  Network,
  Search,
  User,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  type BirdBoardEntity,
  type BirdGraphEdge,
  type BirdRelationshipDetail,
  type EntityKind,
  type PanoramaRelationKind,
  PANORAMA_RELATION_KIND_LABELS,
  PANORAMA_RELATION_KIND_ORDER,
} from '../../types'
import {
  PANORAMA_BOARD_HEIGHT,
  PANORAMA_BOARD_WIDTH,
  PANORAMA_EDGES,
  PANORAMA_ENTITIES,
} from '../../data/birdPanoramaGraph'

const KIND_META: Record<
  EntityKind,
  { Icon: LucideIcon; ring: string; label: string }
> = {
  person: {
    Icon: User,
    ring: 'ring-sky-500/35',
    label: 'Person',
  },
  company: {
    Icon: Building2,
    ring: 'ring-emerald-500/35',
    label: 'Company',
  },
  organization: {
    Icon: Network,
    ring: 'ring-amber-500/35',
    label: 'Organization',
  },
}

function entityById(id: string): BirdBoardEntity | undefined {
  return PANORAMA_ENTITIES.find((e) => e.id === id)
}

function filterRelationshipDetails(
  relationships: BirdRelationshipDetail[],
  relationsAll: boolean,
  relationKinds: Set<PanoramaRelationKind>,
): BirdRelationshipDetail[] {
  if (relationsAll) return relationships
  return relationships.filter((r) => relationKinds.has(r.kind))
}

function EntityCard({ node }: { node: BirdBoardEntity }) {
  const meta = KIND_META[node.kind]
  const Icon = meta.Icon
  return (
    <div
      className={`pointer-events-none absolute z-10 w-[168px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-zinc-700/90 bg-zinc-900/95 p-3 shadow-panel ring-1 ${meta.ring}`}
      style={{ left: node.cx, top: node.cy }}
    >
      <div className="flex items-start gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800/90 text-zinc-300">
          <Icon className="h-4 w-4" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
            {meta.label}
          </p>
          <p className="text-xs font-medium leading-snug text-zinc-100">
            {node.name}
          </p>
        </div>
      </div>
    </div>
  )
}

function RelationshipsModal({
  edge,
  relationsAll,
  onClose,
}: {
  edge: BirdGraphEdge | null
  relationsAll: boolean
  onClose: () => void
}) {
  if (!edge) return null
  const a = entityById(edge.sourceId)
  const b = entityById(edge.targetId)
  const titleA = a?.name ?? edge.sourceId
  const titleB = b?.name ?? edge.targetId
  const visible = edge.relationships

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/65 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="panorama-edge-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-700/90 bg-zinc-950 shadow-panel"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-zinc-800 px-5 py-4">
          <div>
            <p
              id="panorama-edge-title"
              className="text-lg font-semibold leading-snug text-zinc-100"
            >
              Relationships
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              <span className="text-violet-300">{titleA}</span>
              <span className="mx-2 text-zinc-600">↔</span>
              <span className="text-violet-300">{titleB}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-200"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="scrollbar-thin max-h-[min(60vh,520px)] overflow-y-auto px-5 py-4">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
            {relationsAll
              ? `All relationships along this edge (${visible.length})`
              : `Relationships matching filters (${visible.length})`}
          </p>
          {visible.length === 0 ? (
            <p className="text-sm text-zinc-500">
              No relationships on this edge for the current filters.
            </p>
          ) : (
            <ul className="space-y-3">
              {visible.map((r) => (
                <li
                  key={r.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                    {PANORAMA_RELATION_KIND_LABELS[r.kind]}
                  </p>
                  <p className="mt-1 text-sm font-medium text-zinc-100">
                    {r.label}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                    {r.detail}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

const ALL_ENTITY_IDS = new Set(PANORAMA_ENTITIES.map((e) => e.id))
const ALL_ENTITY_IDS_LIST = PANORAMA_ENTITIES.map((e) => e.id)

export function PanoramaBoard() {
  const [activeEdgeId, setActiveEdgeId] = useState<string | null>(null)

  const [entitiesAll, setEntitiesAll] = useState(true)
  const [selectedEntityIds, setSelectedEntityIds] = useState<string[]>([])
  const [entityQuery, setEntityQuery] = useState('')
  const [entityPickerOpen, setEntityPickerOpen] = useState(false)
  const entityPickerRef = useRef<HTMLDivElement>(null)

  const [relationsAll, setRelationsAll] = useState(true)
  const [selectedRelationKinds, setSelectedRelationKinds] = useState<
    PanoramaRelationKind[]
  >([])
  const [relationQuery, setRelationQuery] = useState('')
  const [relationPickerOpen, setRelationPickerOpen] = useState(false)
  const relationPickerRef = useRef<HTMLDivElement>(null)

  const closeModal = useCallback(() => setActiveEdgeId(null), [])

  const entityQueryNorm = entityQuery.trim().toLowerCase()
  const relationQueryNorm = relationQuery.trim().toLowerCase()

  const entitiesSorted = useMemo(
    () =>
      [...PANORAMA_ENTITIES].sort((a, b) => a.name.localeCompare(b.name)),
    [],
  )

  const entityPickerOptions = useMemo(() => {
    const sel = new Set(selectedEntityIds)
    const available = entitiesSorted.filter((e) => !sel.has(e.id))
    if (!entityQueryNorm) return available
    return available.filter((e) =>
      e.name.toLowerCase().includes(entityQueryNorm),
    )
  }, [entitiesSorted, selectedEntityIds, entityQueryNorm])

  const relationKindSet = useMemo(
    () => new Set(selectedRelationKinds),
    [selectedRelationKinds],
  )

  const relationPickerOptions = useMemo(() => {
    const available = PANORAMA_RELATION_KIND_ORDER.filter(
      (k) => !relationKindSet.has(k),
    )
    if (!relationQueryNorm) return available
    return available.filter((k) =>
      PANORAMA_RELATION_KIND_LABELS[k]
        .toLowerCase()
        .includes(relationQueryNorm),
    )
  }, [relationKindSet, relationQueryNorm])

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      const a = entityPickerRef.current
      const b = relationPickerRef.current
      const t = e.target
      if (!(t instanceof Node)) return
      if (a?.contains(t) || b?.contains(t)) return
      setEntityPickerOpen(false)
      setRelationPickerOpen(false)
    }
    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [])

  const visibleEntityIds = useMemo(() => {
    if (entitiesAll) return ALL_ENTITY_IDS
    return new Set(selectedEntityIds)
  }, [entitiesAll, selectedEntityIds])

  const visibleEntities = useMemo(
    () => PANORAMA_ENTITIES.filter((e) => visibleEntityIds.has(e.id)),
    [visibleEntityIds],
  )

  const filteredEdges = useMemo(() => {
    const out: BirdGraphEdge[] = []
    for (const edge of PANORAMA_EDGES) {
      if (
        !visibleEntityIds.has(edge.sourceId) ||
        !visibleEntityIds.has(edge.targetId)
      ) {
        continue
      }
      const rels = filterRelationshipDetails(
        edge.relationships,
        relationsAll,
        relationKindSet,
      )
      if (rels.length === 0) continue
      out.push({ ...edge, relationships: rels })
    }
    return out
  }, [visibleEntityIds, relationsAll, relationKindSet])

  const activeEdge = useMemo(() => {
    if (!activeEdgeId) return null
    return filteredEdges.find((e) => e.id === activeEdgeId) ?? null
  }, [activeEdgeId, filteredEdges])

  const lines = useMemo(() => {
    return filteredEdges
      .map((edge) => {
        const from = entityById(edge.sourceId)
        const to = entityById(edge.targetId)
        if (!from || !to) return null
        return { edge, x1: from.cx, y1: from.cy, x2: to.cx, y2: to.cy }
      })
      .filter(Boolean) as {
      edge: BirdGraphEdge
      x1: number
      y1: number
      x2: number
      y2: number
    }[]
  }, [filteredEdges])

  useEffect(() => {
    if (!activeEdgeId) return
    if (!filteredEdges.some((e) => e.id === activeEdgeId)) {
      setActiveEdgeId(null)
    }
  }, [filteredEdges, activeEdgeId])

  useEffect(() => {
    if (!activeEdgeId) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeEdgeId, closeModal])

  const openEdge = useCallback((edge: BirdGraphEdge) => {
    setActiveEdgeId(edge.id)
  }, [])

  const addEntity = useCallback((id: string) => {
    setSelectedEntityIds((prev) =>
      prev.includes(id) ? prev : [...prev, id],
    )
  }, [])

  const removeEntity = useCallback((id: string) => {
    setSelectedEntityIds((prev) => prev.filter((x) => x !== id))
  }, [])

  const addRelationKind = useCallback((k: PanoramaRelationKind) => {
    setSelectedRelationKinds((prev) =>
      prev.includes(k) ? prev : [...prev, k],
    )
  }, [])

  const removeRelationKind = useCallback((k: PanoramaRelationKind) => {
    setSelectedRelationKinds((prev) => prev.filter((x) => x !== k))
  }, [])

  return (
    <>
      <div className="mt-6 rounded-xl border border-zinc-800/90 bg-zinc-950/40 shadow-soft">
        <div className="border-b border-zinc-800/90 px-4 py-3">
          <p className="text-sm font-medium text-zinc-200">Configure</p>
          <p className="mt-0.5 text-xs text-zinc-500">
            Limit which entities and relationship types appear on the board and
            in the edge inspector.
          </p>
        </div>
        <div className="grid gap-6 px-4 py-4 md:grid-cols-2">
          <div className="min-w-0">
            <p className="mb-2 text-[11px] font-medium text-zinc-400">
              Entities
            </p>
            <label className="mb-2 block text-[11px] text-zinc-600">
              <span className="sr-only">Entity scope</span>
              <select
                value={entitiesAll ? 'all' : 'specific'}
                onChange={(e) => {
                  const v = e.target.value as 'all' | 'specific'
                  if (v === 'all') {
                    setEntitiesAll(true)
                  } else {
                    setEntitiesAll(false)
                    setSelectedEntityIds((p) =>
                      p.length > 0 ? p : [...ALL_ENTITY_IDS_LIST],
                    )
                  }
                }}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/90 py-2 pl-2 pr-8 text-xs text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
              >
                <option value="all">All</option>
                <option value="specific">Specific entities…</option>
              </select>
            </label>
            {!entitiesAll && (
              <>
                {selectedEntityIds.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {selectedEntityIds.map((id) => {
                      const name = entityById(id)?.name ?? id
                      return (
                        <span
                          key={id}
                          className="inline-flex max-w-full items-center gap-1 rounded-full border border-zinc-700/90 bg-zinc-900/90 py-0.5 pl-2.5 pr-1 text-[11px] text-zinc-200"
                        >
                          <span className="truncate">{name}</span>
                          <button
                            type="button"
                            onClick={() => removeEntity(id)}
                            className="shrink-0 rounded-full p-0.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
                            aria-label={`Remove ${name}`}
                          >
                            <X className="h-3 w-3" strokeWidth={2.5} />
                          </button>
                        </span>
                      )
                    })}
                  </div>
                )}
                <div ref={entityPickerRef} className="relative min-w-0">
                  <Search
                    className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500"
                    aria-hidden
                  />
                  <input
                    type="search"
                    value={entityQuery}
                    onChange={(e) => {
                      setEntityQuery(e.target.value)
                      setEntityPickerOpen(true)
                    }}
                    onFocus={() => setEntityPickerOpen(true)}
                    placeholder="Search entities to add…"
                    autoComplete="off"
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900/90 py-2 pl-8 pr-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                  />
                  {entityPickerOpen && (
                    <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 shadow-lg shadow-black/40">
                      {entityPickerOptions.length === 0 ? (
                        <p className="px-3 py-2.5 text-xs text-zinc-500">
                          {selectedEntityIds.length >=
                          PANORAMA_ENTITIES.length
                            ? 'All entities are already selected.'
                            : entityQueryNorm
                              ? 'No matches — try a different search.'
                              : 'No remaining entities to add.'}
                        </p>
                      ) : (
                        <ul className="scrollbar-thin max-h-44 overflow-y-auto py-1">
                          {entityPickerOptions.map((e) => (
                            <li key={e.id}>
                              <button
                                type="button"
                                onMouseDown={(ev) => ev.preventDefault()}
                                onClick={() => {
                                  addEntity(e.id)
                                  setEntityQuery('')
                                  setEntityPickerOpen(false)
                                }}
                                className="flex w-full px-3 py-2 text-left text-xs text-zinc-200 hover:bg-zinc-800/90"
                              >
                                {e.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="min-w-0">
            <p className="mb-2 text-[11px] font-medium text-zinc-400">
              Relations
            </p>
            <label className="mb-2 block text-[11px] text-zinc-600">
              <span className="sr-only">Relation types</span>
              <select
                value={relationsAll ? 'all' : 'specific'}
                onChange={(e) => {
                  const v = e.target.value as 'all' | 'specific'
                  if (v === 'all') {
                    setRelationsAll(true)
                  } else {
                    setRelationsAll(false)
                    setSelectedRelationKinds((p) =>
                      p.length > 0 ? p : [...PANORAMA_RELATION_KIND_ORDER],
                    )
                  }
                }}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/90 py-2 pl-2 pr-8 text-xs text-zinc-200 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
              >
                <option value="all">All</option>
                <option value="specific">Specific relation types…</option>
              </select>
            </label>
            {!relationsAll && (
              <>
                {selectedRelationKinds.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {selectedRelationKinds.map((k) => (
                      <span
                        key={k}
                        className="inline-flex max-w-full items-center gap-1 rounded-full border border-zinc-700/90 bg-zinc-900/90 py-0.5 pl-2.5 pr-1 text-[11px] text-zinc-200"
                      >
                        <span className="truncate">
                          {PANORAMA_RELATION_KIND_LABELS[k]}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeRelationKind(k)}
                          className="shrink-0 rounded-full p-0.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
                          aria-label={`Remove ${PANORAMA_RELATION_KIND_LABELS[k]}`}
                        >
                          <X className="h-3 w-3" strokeWidth={2.5} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div ref={relationPickerRef} className="relative min-w-0">
                  <Search
                    className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500"
                    aria-hidden
                  />
                  <input
                    type="search"
                    value={relationQuery}
                    onChange={(e) => {
                      setRelationQuery(e.target.value)
                      setRelationPickerOpen(true)
                    }}
                    onFocus={() => setRelationPickerOpen(true)}
                    placeholder="Search relation types to add…"
                    autoComplete="off"
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900/90 py-2 pl-8 pr-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                  />
                  {relationPickerOpen && (
                    <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 shadow-lg shadow-black/40">
                      {relationPickerOptions.length === 0 ? (
                        <p className="px-3 py-2.5 text-xs text-zinc-500">
                          {selectedRelationKinds.length >=
                          PANORAMA_RELATION_KIND_ORDER.length
                            ? 'All relation types are already selected.'
                            : relationQueryNorm
                              ? 'No matches — try a different search.'
                              : 'No remaining types to add.'}
                        </p>
                      ) : (
                        <ul className="scrollbar-thin max-h-44 overflow-y-auto py-1">
                          {relationPickerOptions.map((k) => (
                            <li key={k}>
                              <button
                                type="button"
                                onMouseDown={(ev) => ev.preventDefault()}
                                onClick={() => {
                                  addRelationKind(k)
                                  setRelationQuery('')
                                  setRelationPickerOpen(false)
                                }}
                                className="flex w-full px-3 py-2 text-left text-xs text-zinc-200 hover:bg-zinc-800/90"
                              >
                                {PANORAMA_RELATION_KIND_LABELS[k]}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-zinc-800/90 bg-zinc-950/40 shadow-soft">
        <div className="border-b border-zinc-800/90 px-4 py-3">
          <p className="text-sm font-medium text-zinc-200">Panorama board</p>
          <p className="mt-0.5 text-xs text-zinc-500">
            Scroll to explore. Click an edge to inspect relationships between
            two entities (respects your relation filters).
          </p>
        </div>
        <div className="scrollbar-thin max-h-[min(72vh,680px)] overflow-auto">
          <div
            className="relative touch-pan-x touch-pan-y"
            style={{
              width: PANORAMA_BOARD_WIDTH,
              minHeight: PANORAMA_BOARD_HEIGHT,
              backgroundColor: '#0a0b0e',
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)
              `,
              backgroundSize: '24px 24px',
            }}
          >
            <svg
              width={PANORAMA_BOARD_WIDTH}
              height={PANORAMA_BOARD_HEIGHT}
              className="absolute left-0 top-0 block"
              aria-hidden
            >
              {lines.map(({ edge, x1, y1, x2, y2 }) => {
                const mx = (x1 + x2) / 2
                const my = (y1 + y2) / 2
                const dx = x2 - x1
                const dy = y2 - y1
                const len = Math.hypot(dx, dy) || 1
                const off = 50
                const cx = mx + (-dy / len) * off * 0.35
                const cy = my + (dx / len) * off * 0.35
                const d = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`

                return (
                  <g key={edge.id}>
                    <path
                      d={d}
                      fill="none"
                      stroke="rgba(139, 92, 246, 0.45)"
                      strokeWidth={2}
                      strokeLinecap="round"
                      pointerEvents="none"
                    />
                    <path
                      d={d}
                      fill="none"
                      stroke="transparent"
                      strokeWidth={28}
                      className="cursor-pointer"
                      onClick={() => openEdge(edge)}
                    />
                    <circle
                      cx={(x1 + x2) / 2 + (-dy / len) * off * 0.12}
                      cy={(y1 + y2) / 2 + (dx / len) * off * 0.12}
                      r={3}
                      fill="rgba(167, 139, 250, 0.9)"
                      pointerEvents="none"
                    />
                  </g>
                )
              })}
            </svg>

            {visibleEntities.map((node) => (
              <EntityCard key={node.id} node={node} />
            ))}
          </div>
        </div>
      </div>

      <RelationshipsModal
        edge={activeEdge}
        relationsAll={relationsAll}
        onClose={closeModal}
      />
    </>
  )
}
