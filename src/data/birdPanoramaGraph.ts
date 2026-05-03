import type { BirdBoardEntity, BirdGraphEdge } from '../types'

/** Fixed-layout panorama graph for Bird’s view (cross-case mock). */
/** Includes Radiant India node alongside panorama edges (registry superset). */
export const PANORAMA_BOARD_WIDTH = 1120
export const PANORAMA_BOARD_HEIGHT = 640

export const PANORAMA_ENTITIES: BirdBoardEntity[] = [
  {
    id: 'e-alpha-shell',
    name: 'Alpha Shell Holdings Ltd.',
    kind: 'company',
    cx: 180,
    cy: 160,
  },
  {
    id: 'e-radiant-india',
    name: 'Radiant Components Pvt Ltd',
    kind: 'company',
    cx: 320,
    cy: 300,
  },
  {
    id: 'e-m-okonkwo',
    name: 'Rajesh Krishnan',
    kind: 'person',
    cx: 460,
    cy: 120,
  },
  {
    id: 'e-cfx',
    name: 'Caribbean FX Services Ltd.',
    kind: 'organization',
    cx: 780,
    cy: 200,
  },
  {
    id: 'e-northwind',
    name: 'Northwind Trustees',
    kind: 'company',
    cx: 520,
    cy: 380,
  },
  {
    id: 'e-bravo',
    name: 'Bravo Manufacturing Inc.',
    kind: 'company',
    cx: 200,
    cy: 460,
  },
  {
    id: 'e-elena',
    name: 'Elena Vasquez',
    kind: 'person',
    cx: 460,
    cy: 520,
  },
  {
    id: 'e-docs-token',
    name: 'Doc hash cluster Ω',
    kind: 'organization',
    cx: 840,
    cy: 440,
  },
]

export const PANORAMA_EDGES: BirdGraphEdge[] = [
  {
    id: 'edge-ra-1',
    sourceId: 'e-m-okonkwo',
    targetId: 'e-radiant-india',
    relationships: [
      {
        id: 'r-din',
        label: 'DIN / directorship',
        detail:
          'MCA master data: managing director; matches wire KYC signatory where filed.',
      },
    ],
  },
  {
    id: 'edge-ra-2',
    sourceId: 'e-radiant-india',
    targetId: 'e-alpha-shell',
    relationships: [
      {
        id: 'r-hold',
        label: 'Offshore counterparty',
        detail:
          'Investigation link: Indian sub wires vs BVI holding — benificial ownership review.',
      },
    ],
  },
  {
    id: 'edge-1',
    sourceId: 'e-alpha-shell',
    targetId: 'e-m-okonkwo',
    relationships: [
      {
        id: 'r1',
        label: 'Authorized signatory',
        detail:
          'Wire approvals filed Mar–Apr 2026; matches filing signature card.',
      },
      {
        id: 'r2',
        label: 'Beneficiary overlap',
        detail:
          'Shared token with Caribbean FX corridor per Transaction Analyzer.',
      },
    ],
  },
  {
    id: 'edge-2',
    sourceId: 'e-m-okonkwo',
    targetId: 'e-cfx',
    relationships: [
      {
        id: 'r3',
        label: 'Correspondent routing',
        detail: 'Three wires within 90 minutes through same beneficiary rail.',
      },
    ],
  },
  {
    id: 'edge-3',
    sourceId: 'e-alpha-shell',
    targetId: 'e-northwind',
    relationships: [
      {
        id: 'r4',
        label: 'Nominee layer',
        detail: 'Register shows Northwind as director shell for Alpha Shell.',
      },
      {
        id: 'r5',
        label: 'Document cross-ref',
        detail: 'Schedule C in trust deed references same account token.',
      },
    ],
  },
  {
    id: 'edge-4',
    sourceId: 'e-northwind',
    targetId: 'e-docs-token',
    relationships: [
      {
        id: 'r6',
        label: 'Hash linkage',
        detail: 'PDF metadata cluster ties nominee deeds to doc hash Ω.',
      },
    ],
  },
  {
    id: 'edge-5',
    sourceId: 'e-bravo',
    targetId: 'e-elena',
    relationships: [
      {
        id: 'r7',
        label: 'Vendor compliance',
        detail: 'Primary contact on recall cohort supplier audits.',
      },
    ],
  },
  {
    id: 'edge-6',
    sourceId: 'e-cfx',
    targetId: 'e-docs-token',
    relationships: [
      {
        id: 'r8',
        label: 'Shared artifact',
        detail: 'Invoice hashes appear in both FX pack and hash cluster Ω.',
      },
      {
        id: 'r9',
        label: 'Temporal proximity',
        detail: 'Overlapping windows on the entity chronology (transfers vs filings).',
      },
    ],
  },
]
