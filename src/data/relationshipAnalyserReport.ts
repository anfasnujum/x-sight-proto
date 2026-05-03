import { BIRD_REGISTRY_SEED } from './birdRegistry'
import { BIRD_TIMELINE_EVENTS } from './birdTimelineEvents'
import { PANORAMA_EDGES } from './birdPanoramaGraph'

function legalName(id: string): string {
  return BIRD_REGISTRY_SEED.find((p) => p.id === id)?.legalName ?? id
}

/** Mock cross-entity relationship digest from panorama edges, registry affiliations, and timeline co-occurrence. */
export function buildRelationshipAnalyserReport(
  selectedIds: string[],
  contextPreview: string,
): { summary: string; lines: string[] } {
  const ids = [...new Set(selectedIds)].filter(Boolean)

  if (ids.length < 2) {
    return {
      summary: 'Select at least two entities',
      lines: [
        'Choose two or more dossier entities to analyse pairwise graph links, declared affiliations, and shared timeline activity.',
        contextPreview
          ? `Stream context (optional): ${contextPreview.slice(0, 160)}${contextPreview.length > 160 ? '…' : ''}`
          : 'Open from the tools panel and tick entities from your registry.',
      ],
    }
  }

  const lines: string[] = []
  const pairs: [string, string][] = []
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      pairs.push([ids[i], ids[j]])
    }
  }

  let edgeHits = 0
  for (const [a, b] of pairs) {
    const edge = PANORAMA_EDGES.find(
      (e) =>
        (e.sourceId === a && e.targetId === b) ||
        (e.sourceId === b && e.targetId === a),
    )
    if (!edge) continue
    edgeHits++
    const labels = edge.relationships.map((r) => r.label).join('; ')
    lines.push(`Graph · ${legalName(a)} ↔ ${legalName(b)}: ${labels}`)
    const top = edge.relationships[0]
    if (top?.detail) {
      lines.push(`  └ ${top.detail}`)
    }
  }

  if (edgeHits === 0) {
    lines.push(
      'Panorama graph: no direct edge between these selected pairs (indirect paths may exist elsewhere on the board).',
    )
  }

  const seenAff = new Set<string>()
  for (const id of ids) {
    const p = BIRD_REGISTRY_SEED.find((x) => x.id === id)
    if (!p) continue
    for (const af of p.affiliationsCompanies) {
      if (!ids.includes(af.entityId)) continue
      const key = `c-${id}-${af.entityId}-${af.relationship}`
      if (seenAff.has(key)) continue
      seenAff.add(key)
      lines.push(
        `Affiliation · ${legalName(id)} ↔ ${legalName(af.entityId)}: ${af.relationship}`,
      )
    }
    for (const af of p.affiliationsNgos) {
      if (!ids.includes(af.entityId)) continue
      const key = `n-${id}-${af.entityId}-${af.relationship}`
      if (seenAff.has(key)) continue
      seenAff.add(key)
      lines.push(
        `Affiliation · ${legalName(id)} ↔ ${legalName(af.entityId)}: ${af.relationship}`,
      )
    }
  }

  const sharedEvents = BIRD_TIMELINE_EVENTS.filter((ev) => {
    const overlap = ev.entityIds.filter((eid) => ids.includes(eid))
    return overlap.length >= 2
  })

  if (sharedEvents.length > 0) {
    lines.push('Shared entity timeline (≥2 selected IDs on the same fact):')
    for (const ev of sharedEvents.slice(0, 6)) {
      const names = ev.entityIds
        .filter((eid) => ids.includes(eid))
        .map(legalName)
      const day = ev.occurredAt.slice(0, 10)
      lines.push(`  · ${day} — ${ev.title} (${names.join(', ')})`)
    }
    if (sharedEvents.length > 6) {
      lines.push(`  … +${sharedEvents.length - 6} more co-occurring events in ledger.`)
    }
  } else {
    lines.push(
      'Entity timeline: no event rows list two or more of the selected IDs together (pairwise links above may still apply).',
    )
  }

  lines.push(`Scope: ${ids.map(legalName).join(' · ')}.`)

  const summary = `Relationship report · ${ids.length} entities, ${pairs.length} pair(s), ${edgeHits} graph match(es)`

  const maxLines = 20
  if (lines.length <= maxLines) {
    return { summary, lines }
  }
  return {
    summary,
    lines: [
      ...lines.slice(0, maxLines - 1),
      `… truncated (${lines.length} lines total in mock export).`,
    ],
  }
}
