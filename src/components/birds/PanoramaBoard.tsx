import {
  Building2,
  Network,
  User,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { BirdBoardEntity, BirdGraphEdge, EntityKind } from '../../types'
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
  onClose,
}: {
  edge: BirdGraphEdge | null
  onClose: () => void
}) {
  if (!edge) return null
  const a = entityById(edge.sourceId)
  const b = entityById(edge.targetId)
  const titleA = a?.name ?? edge.sourceId
  const titleB = b?.name ?? edge.targetId

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
            All relationships along this edge ({edge.relationships.length})
          </p>
          <ul className="space-y-3">
            {edge.relationships.map((r) => (
              <li
                key={r.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3"
              >
                <p className="text-sm font-medium text-zinc-100">{r.label}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                  {r.detail}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export function PanoramaBoard() {
  const [activeEdge, setActiveEdge] = useState<BirdGraphEdge | null>(null)

  const closeModal = useCallback(() => setActiveEdge(null), [])

  useEffect(() => {
    if (!activeEdge) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeEdge, closeModal])

  const lines = useMemo(() => {
    return PANORAMA_EDGES.map((edge) => {
      const from = entityById(edge.sourceId)
      const to = entityById(edge.targetId)
      if (!from || !to) return null
      return { edge, x1: from.cx, y1: from.cy, x2: to.cx, y2: to.cy }
    }).filter(Boolean) as {
      edge: BirdGraphEdge
      x1: number
      y1: number
      x2: number
      y2: number
    }[]
  }, [])

  const openEdge = useCallback((edge: BirdGraphEdge) => {
    setActiveEdge(edge)
  }, [])

  return (
    <>
      <div className="mt-6 rounded-xl border border-zinc-800/90 bg-zinc-950/40 shadow-soft">
        <div className="border-b border-zinc-800/90 px-4 py-3">
          <p className="text-sm font-medium text-zinc-200">Panorama board</p>
          <p className="mt-0.5 text-xs text-zinc-500">
            Scroll to explore. Click an edge to inspect every relationship
            between two entities.
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

            {PANORAMA_ENTITIES.map((node) => (
              <EntityCard key={node.id} node={node} />
            ))}
          </div>
        </div>
      </div>

      <RelationshipsModal edge={activeEdge} onClose={closeModal} />
    </>
  )
}
