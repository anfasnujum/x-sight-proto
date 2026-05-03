import { useMemo, useState } from 'react'
import type {
  BirdEntityTimelineKind,
  BirdTimelineEvent,
  BirdTimelineSocialPlatform,
} from '../../types'
import { BIRD_TIMELINE_EVENTS } from '../../data/birdTimelineEvents'
import { useForensicStore } from '../../store/useForensicStore'
import { GENERAL_CASE_KEY } from '../../constants'

const KIND_LABEL: Record<BirdEntityTimelineKind, string> = {
  incorporation: 'Incorporation',
  appointment: 'Role / appointment',
  interaction: 'Interaction',
  regulatory: 'Regulatory filing',
  ownership_change: 'Ownership',
  social_post: 'Social post',
  other: 'Other',
}

const KIND_RING: Record<BirdEntityTimelineKind, string> = {
  incorporation: 'border-emerald-500/35 bg-emerald-500/5',
  appointment: 'border-violet-500/35 bg-violet-500/5',
  interaction: 'border-sky-500/35 bg-sky-500/5',
  regulatory: 'border-amber-500/35 bg-amber-500/5',
  ownership_change: 'border-fuchsia-500/35 bg-fuchsia-500/5',
  social_post: 'border-cyan-500/35 bg-cyan-500/5',
  other: 'border-zinc-600 bg-zinc-900/50',
}

const SOURCE_LABEL: Record<
  NonNullable<BirdTimelineEvent['source']>,
  string
> = {
  mca: 'MCA / registry',
  user: 'User',
  open_source: 'Open source',
  ai: 'AI-extracted',
}

const PLATFORM_LABEL: Record<BirdTimelineSocialPlatform, string> = {
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  facebook: 'Facebook',
  twitter: 'X / Twitter',
  youtube: 'YouTube',
  other: 'Social',
}

function eventMs(iso: string): number {
  return new Date(iso).getTime()
}

function inDateRange(
  ev: BirdTimelineEvent,
  dateFrom: string,
  dateTo: string,
): boolean {
  const t = eventMs(ev.occurredAt)
  if (Number.isNaN(t)) return true
  if (dateFrom) {
    const start = new Date(`${dateFrom}T00:00:00`).getTime()
    if (t < start) return false
  }
  if (dateTo) {
    const end = new Date(`${dateTo}T23:59:59.999`).getTime()
    if (t > end) return false
  }
  return true
}

function matchesEntityAnd(
  ev: BirdTimelineEvent,
  selectedIds: string[],
): boolean {
  if (selectedIds.length === 0) return true
  return selectedIds.every((id) => ev.entityIds.includes(id))
}

/** Event matches if it has at least one of the selected location strings */
function matchesLocations(
  ev: BirdTimelineEvent,
  selectedLocs: string[],
): boolean {
  if (selectedLocs.length === 0) return true
  const locs = ev.locations ?? []
  if (locs.length === 0) return false
  return selectedLocs.some((s) => locs.includes(s))
}

export function BirdTimelineLensView() {
  const cases = useForensicStore((s) => s.cases)
  const profiles = useForensicStore((s) => s.birdRegistryProfiles)

  const [selectedEntities, setSelectedEntities] = useState<string[]>([])
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])

  const nameById = useMemo(() => {
    const m = new Map<string, string>()
    for (const p of profiles) {
      m.set(p.id, p.legalName)
    }
    return m
  }, [profiles])

  const profilesSorted = useMemo(
    () => [...profiles].sort((a, b) => a.legalName.localeCompare(b.legalName)),
    [profiles],
  )

  const allLocations = useMemo(() => {
    const set = new Set<string>()
    for (const ev of BIRD_TIMELINE_EVENTS) {
      for (const loc of ev.locations ?? []) {
        set.add(loc)
      }
    }
    return [...set].sort((a, b) => a.localeCompare(b))
  }, [])

  const filteredSorted = useMemo(() => {
    const list = BIRD_TIMELINE_EVENTS.filter(
      (ev) =>
        matchesEntityAnd(ev, selectedEntities) &&
        inDateRange(ev, dateFrom, dateTo) &&
        matchesLocations(ev, selectedLocations),
    )
    return list.sort(
      (a, b) => eventMs(b.occurredAt) - eventMs(a.occurredAt),
    )
  }, [selectedEntities, dateFrom, dateTo, selectedLocations])

  function caseLabel(ck?: string) {
    if (!ck) return '—'
    if (ck === GENERAL_CASE_KEY) return 'General mode'
    return cases.find((c) => c.id === ck)?.name ?? ck
  }

  function entityLine(ids: string[]) {
    return ids
      .map((id) => nameById.get(id) ?? id)
      .join(' · ')
  }

  function formatWhen(iso: string) {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(iso.trim())
    if (dateOnly) {
      return d.toLocaleDateString(undefined, { dateStyle: 'long' })
    }
    return d.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  }

  function toggleEntity(id: string) {
    setSelectedEntities((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  function toggleLocation(loc: string) {
    setSelectedLocations((prev) =>
      prev.includes(loc) ? prev.filter((x) => x !== loc) : [...prev, loc],
    )
  }

  function clearFilters() {
    setSelectedEntities([])
    setDateFrom('')
    setDateTo('')
    setSelectedLocations([])
  }

  const total = BIRD_TIMELINE_EVENTS.length
  const shown = filteredSorted.length

  return (
    <div className="mt-8 space-y-4">
      <p className="text-sm text-zinc-500">
        Chronology of{' '}
        <span className="text-zinc-400">
          what happened to and between your dossier entities
        </span>
        — incorporation, appointments, meetings, MCA filings,{' '}
        <span className="text-zinc-400">
          social posts (including posts that describe another event)
        </span>
        , and places. Use filters to require{' '}
        <span className="text-zinc-400">every</span> checked entity on the same
        event, narrow dates, and match{' '}
        <span className="text-zinc-400">any</span> checked location.
      </p>

      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Filters
          </h2>
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-500">
            <span>
              Showing <span className="tabular-nums text-zinc-300">{shown}</span>{' '}
              / {total}
            </span>
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-md border border-zinc-700 px-2 py-1 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
            >
              Clear all
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-6 lg:grid-cols-3">
          <div>
            <p className="mb-2 text-[11px] font-medium text-zinc-400">
              Entities —{' '}
              <span className="font-normal text-zinc-600">
                event must include all checked
              </span>
            </p>
            <div className="scrollbar-thin max-h-44 space-y-2 overflow-y-auto rounded-lg border border-zinc-800/90 bg-zinc-950/80 p-2">
              {profilesSorted.map((p) => (
                <label
                  key={p.id}
                  className="flex cursor-pointer items-start gap-2 rounded px-1 py-0.5 hover:bg-zinc-900/80"
                >
                  <input
                    type="checkbox"
                    checked={selectedEntities.includes(p.id)}
                    onChange={() => toggleEntity(p.id)}
                    className="mt-0.5 rounded border-zinc-600"
                  />
                  <span className="text-xs leading-snug text-zinc-300">
                    {p.legalName}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-[11px] font-medium text-zinc-400">
              Date range
            </p>
            <div className="flex flex-col gap-2">
              <label className="flex flex-col gap-1 text-[11px] text-zinc-500">
                From
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-200"
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] text-zinc-500">
                To
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-200"
                />
              </label>
            </div>
          </div>

          <div>
            <p className="mb-2 text-[11px] font-medium text-zinc-400">
              Locations —{' '}
              <span className="font-normal text-zinc-600">
                event matches any checked
              </span>
            </p>
            <div className="scrollbar-thin max-h-44 space-y-2 overflow-y-auto rounded-lg border border-zinc-800/90 bg-zinc-950/80 p-2">
              {allLocations.length === 0 ? (
                <p className="text-xs text-zinc-600">No locations in data.</p>
              ) : (
                allLocations.map((loc) => (
                  <label
                    key={loc}
                    className="flex cursor-pointer items-start gap-2 rounded px-1 py-0.5 hover:bg-zinc-900/80"
                  >
                    <input
                      type="checkbox"
                      checked={selectedLocations.includes(loc)}
                      onChange={() => toggleLocation(loc)}
                      className="mt-0.5 rounded border-zinc-600"
                    />
                    <span className="text-xs leading-snug text-zinc-300">
                      {loc}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <ul className="space-y-3">
        {filteredSorted.map((ev) => (
          <li
            key={ev.id}
            className={`rounded-xl border px-4 py-3 ${KIND_RING[ev.kind]}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <time className="text-xs tabular-nums text-zinc-500">
                {formatWhen(ev.occurredAt)}
              </time>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md border border-zinc-700/80 bg-zinc-900/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-400">
                  {KIND_LABEL[ev.kind]}
                </span>
                {ev.socialPost && (
                  <span className="rounded-md border border-cyan-800/60 bg-cyan-950/40 px-2 py-0.5 text-[10px] font-medium text-cyan-200/90">
                    {PLATFORM_LABEL[ev.socialPost.platform]}
                  </span>
                )}
                {ev.source && (
                  <span className="text-[10px] text-zinc-600">
                    {SOURCE_LABEL[ev.source]}
                  </span>
                )}
                <span className="text-[10px] uppercase text-zinc-600">
                  {caseLabel(ev.caseKey)}
                </span>
              </div>
            </div>
            <p className="mt-2 font-medium text-zinc-100">{ev.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-zinc-400">
              {ev.description}
            </p>
            {ev.socialPost?.excerpt && (
              <p className="mt-2 border-l-2 border-cyan-800/50 pl-3 text-xs italic text-zinc-500">
                “{ev.socialPost.excerpt}”
              </p>
            )}
            {ev.socialPost?.url && (
              <a
                href={ev.socialPost.url}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block text-xs text-cyan-500/90 underline hover:text-cyan-400"
              >
                Open post
              </a>
            )}
            <p className="mt-2 text-[11px] text-zinc-500">
              <span className="text-zinc-600">Involves: </span>
              {entityLine(ev.entityIds)}
            </p>
            {ev.locations && ev.locations.length > 0 && (
              <p className="mt-1 text-[11px] text-zinc-500">
                <span className="text-zinc-600">Places: </span>
                {ev.locations.join(' · ')}
              </p>
            )}
          </li>
        ))}
      </ul>

      {filteredSorted.length === 0 && (
        <p className="rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-6 text-center text-sm text-zinc-500">
          No events match these filters. Try fewer entities, widening the date
          range, or clearing location selections.
        </p>
      )}
    </div>
  )
}
