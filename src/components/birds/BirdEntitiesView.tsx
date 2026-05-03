import { useMemo, useState } from 'react'
import type {
  BirdEntityCategory,
  BirdPrimaryJurisdiction,
} from '../../types'
import { useForensicStore } from '../../store/useForensicStore'
import { BirdEntityProfilePanel } from './BirdEntityProfilePanel'

const FILTER_OPTIONS: { id: BirdEntityCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'person', label: 'People' },
  { id: 'company', label: 'Companies' },
  { id: 'ngo', label: 'NGOs' },
  { id: 'trust', label: 'Trusts' },
  { id: 'partnership', label: 'Partnerships' },
  { id: 'llp', label: 'LLPs' },
  { id: 'government_body', label: 'Gov bodies' },
  { id: 'sole_proprietorship', label: 'Sole prop.' },
  { id: 'other', label: 'Other' },
]

function jurisdictionShort(p: {
  primaryJurisdiction?: BirdPrimaryJurisdiction
}) {
  const j = p.primaryJurisdiction ?? 'multi'
  if (j === 'IN') return 'India'
  if (j === 'foreign') return 'Foreign'
  return 'Multi'
}

function categoryLabel(c: BirdEntityCategory): string {
  const map: Record<BirdEntityCategory, string> = {
    person: 'Person',
    company: 'Company',
    ngo: 'NGO',
    trust: 'Trust',
    partnership: 'Partnership',
    llp: 'LLP',
    government_body: 'Gov',
    sole_proprietorship: 'Sole prop.',
    other: 'Other',
  }
  return map[c]
}

export function BirdEntitiesView() {
  const profiles = useForensicStore((s) => s.birdRegistryProfiles)
  const [filter, setFilter] = useState<BirdEntityCategory | 'all'>('all')
  const [selectedId, setSelectedId] = useState<string | null>(() =>
    profiles[0]?.id ?? null,
  )

  const filtered = useMemo(() => {
    if (filter === 'all') return profiles
    return profiles.filter((p) => p.category === filter)
  }, [profiles, filter])

  const selected = useMemo(() => {
    if (selectedId) {
      const p = profiles.find((x) => x.id === selectedId)
      if (p && filtered.some((x) => x.id === p.id)) return p
    }
    return filtered[0] ?? null
  }, [profiles, filtered, selectedId])

  return (
    <div className="mt-8 flex min-h-0 flex-col gap-4 lg:flex-row lg:gap-6">
      <div className="flex min-w-0 flex-1 flex-col rounded-xl border border-zinc-800 bg-zinc-950/40">
        <div className="border-b border-zinc-800 px-4 py-3">
          <p className="text-sm font-medium text-zinc-200">Entity registry</p>
          <p className="mt-0.5 text-xs text-zinc-500">
            Indian-first identifiers (PAN, Aadhaar, CIN, GSTIN, MCA) alongside
            foreign registers — filter by type, then open a row.
          </p>
          <div className="mt-3 flex flex-wrap gap-1">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setFilter(opt.id)
                  const list =
                    opt.id === 'all'
                      ? profiles
                      : profiles.filter((p) => p.category === opt.id)
                  setSelectedId(list[0]?.id ?? null)
                }}
                className={`rounded-md px-2 py-1 text-[11px] font-semibold transition ${
                  filter === opt.id
                    ? 'bg-violet-600/35 text-violet-100 ring-1 ring-violet-500/40'
                    : 'bg-zinc-900 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="scrollbar-thin max-h-[min(65vh,560px)] overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 z-[1] border-b border-zinc-800 bg-zinc-950/95 text-[10px] font-semibold uppercase text-zinc-500 backdrop-blur">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Type</th>
                <th className="hidden px-3 py-2 md:table-cell">Region</th>
                <th className="hidden px-3 py-2 sm:table-cell">Key identifier</th>
                <th className="px-3 py-2">Docs</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const panLike = p.governmentIds.find((g) =>
                  /PAN|GSTIN/i.test(g.idType),
                )
                const keyId =
                  p.corporate?.cin ??
                  panLike?.value ??
                  p.governmentIds[0]?.value ??
                  p.corporate?.pan ??
                  p.corporate?.registrationNumber ??
                  '—'
                const docTotal =
                  p.financialDocuments.length + (p.mcaFilings?.length ?? 0)
                const active = selected?.id === p.id
                return (
                  <tr
                    key={p.id}
                    className={`cursor-pointer border-b border-zinc-800/80 hover:bg-zinc-900/50 ${
                      active ? 'bg-violet-500/10' : ''
                    }`}
                    onClick={() => setSelectedId(p.id)}
                  >
                    <td className="max-w-[200px] truncate px-3 py-2.5 font-medium text-zinc-200">
                      {p.legalName}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-xs text-zinc-400">
                      {categoryLabel(p.category)}
                    </td>
                    <td className="hidden whitespace-nowrap px-3 py-2.5 text-[11px] text-zinc-500 md:table-cell">
                      {jurisdictionShort(p)}
                    </td>
                    <td className="hidden max-w-[180px] truncate px-3 py-2.5 font-mono text-[11px] text-zinc-500 sm:table-cell">
                      {keyId}
                    </td>
                    <td className="px-3 py-2.5 text-xs text-zinc-500">
                      {docTotal}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-zinc-500">
              No entities for this filter.
            </p>
          )}
        </div>
      </div>

      <div className="w-full shrink-0 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 lg:w-[min(100%,440px)] xl:w-[480px]">
        {selected ? (
          <BirdEntityProfilePanel profile={selected} />
        ) : (
          <p className="text-sm text-zinc-500">Select an entity from the table.</p>
        )}
      </div>
    </div>
  )
}
