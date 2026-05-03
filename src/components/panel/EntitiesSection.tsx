import { Building2, Network, User, type LucideIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useForensicStore, useActiveCaseKey } from '../../store/useForensicStore'
import type { EntityKind } from '../../types'

const KIND_LABEL: Record<EntityKind, string> = {
  person: 'People',
  company: 'Companies',
  organization: 'Organizations',
}

const KIND_ICON: Record<EntityKind, LucideIcon> = {
  person: User,
  company: Building2,
  organization: Network,
}

export function EntitiesSection() {
  const ck = useActiveCaseKey()
  const entities = useForensicStore((s) => s.entities[ck] ?? [])
  const [filter, setFilter] = useState<EntityKind | 'all'>('all')

  const filtered = useMemo(() => {
    if (filter === 'all') return entities
    return entities.filter((e) => e.kind === filter)
  }, [entities, filter])

  const grouped = useMemo(() => {
    const g: Record<EntityKind, typeof entities> = {
      person: [],
      company: [],
      organization: [],
    }
    for (const e of filtered) {
      g[e.kind].push(e)
    }
    return g
  }, [filtered])

  return (
    <div className="scrollbar-thin flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
      <div className="flex flex-wrap gap-1">
        {(['all', 'person', 'company', 'organization'] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setFilter(k)}
            className={`rounded-md px-2 py-1 text-[11px] font-medium transition ${
              filter === k
                ? 'bg-violet-600/40 text-violet-100'
                : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {k === 'all' ? 'All' : KIND_LABEL[k]}
          </button>
        ))}
      </div>

      {entities.length === 0 ? (
        <p className="text-center text-sm text-zinc-500">
          No entities for this context yet.
        </p>
      ) : filter !== 'all' && filtered.length === 0 ? (
        <p className="text-center text-sm text-zinc-500">
          No {KIND_LABEL[filter].toLowerCase()} in this project.
        </p>
      ) : filter === 'all' ? (
        (['person', 'company', 'organization'] as EntityKind[]).map((kind) => {
          const list = grouped[kind]
          if (list.length === 0) return null
          const Icon = KIND_ICON[kind]
          return (
            <div key={kind}>
              <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                <Icon className="h-3.5 w-3.5" />
                {KIND_LABEL[kind]}
              </div>
              <ul className="space-y-2">
                {list.map((e) => (
                  <li
                    key={e.id}
                    className="rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2"
                  >
                    <p className="text-sm font-medium text-zinc-100">{e.name}</p>
                    {e.detail && (
                      <p className="mt-0.5 text-xs text-zinc-500">{e.detail}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )
        })
      ) : (
        <ul className="space-y-2">
          {filtered.map((e) => (
            <li
              key={e.id}
              className="rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2"
            >
              <p className="text-sm font-medium text-zinc-100">{e.name}</p>
              {e.detail && (
                <p className="mt-0.5 text-xs text-zinc-500">{e.detail}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
