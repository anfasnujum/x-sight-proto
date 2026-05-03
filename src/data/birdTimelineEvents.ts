import type { BirdTimelineEvent } from '../types'

/**
 * Entity-centric chronology: incorporation, roles, joint appearances,
 * statutory filings, social posts (often describing other events), geography.
 */
export const BIRD_TIMELINE_EVENTS: BirdTimelineEvent[] = [
  {
    id: 'tl-radiant-inc',
    occurredAt: '2015-03-18',
    title: 'Radiant Components incorporated',
    description:
      'Private company registered with ROC Bangalore — CIN allocated; objects clause covers electronics distribution.',
    entityIds: ['e-radiant-india'],
    kind: 'incorporation',
    caseKey: 'case-alpha',
    source: 'mca',
    locations: ['Bengaluru, Karnataka, India'],
  },
  {
    id: 'tl-coastal-trust',
    occurredAt: '2017-09-05',
    title: 'Coastal Education Initiative trust deed registered',
    description:
      'Charitable trust registered locally; education focus in coastal districts.',
    entityIds: ['e-coastal-ed'],
    kind: 'incorporation',
    caseKey: 'case-alpha',
    source: 'user',
    locations: ['Kozhikode, Kerala, India'],
  },
  {
    id: 'tl-rajesh-md',
    occurredAt: '2018-06-14',
    title: 'Rajesh Krishnan appointed Managing Director',
    description:
      'MCA DIR-12 reflects appointment as MD of Radiant Components; DIN linked on filing.',
    entityIds: ['e-m-okonkwo', 'e-radiant-india'],
    kind: 'appointment',
    caseKey: 'case-alpha',
    source: 'mca',
    locations: ['Bengaluru, Karnataka, India'],
  },
  {
    id: 'tl-alpha-bvi',
    occurredAt: '2019-11-02',
    title: 'Alpha Shell Holdings formed (offshore)',
    description:
      'BVI company incorporated as holding vehicle for India operating contracts.',
    entityIds: ['e-alpha-shell'],
    kind: 'incorporation',
    caseKey: 'case-alpha',
    source: 'open_source',
    locations: ['Road Town, Tortola, British Virgin Islands'],
  },
  {
    id: 'tl-rajesh-alpha-sig',
    occurredAt: '2020-02-03',
    title: 'Rajesh Krishnan — authorised signatory for Alpha Shell',
    description:
      'Board resolution and bank mandate packets list Krishnan for offshore wire instructions.',
    entityIds: ['e-m-okonkwo', 'e-alpha-shell'],
    kind: 'appointment',
    caseKey: 'case-alpha',
    source: 'user',
    locations: ['Road Town, Tortola, British Virgin Islands'],
  },
  {
    id: 'tl-northwind-alpha',
    occurredAt: '2021-04-22',
    title: 'Northwind Trustees engagement on Alpha stack',
    description:
      'Corporate services letter appointing Northwind for nominee director / compliance correspondence.',
    entityIds: ['e-northwind', 'e-alpha-shell'],
    kind: 'appointment',
    caseKey: 'case-alpha',
    source: 'ai',
    locations: ['Saint Helier, Jersey, Channel Islands'],
  },
  {
    id: 'tl-sg-fintech',
    occurredAt: '2024-03-06T09:00:00Z',
    title: 'Singapore FinTech Festival — overlapping attendance',
    description:
      'Rajesh Krishnan (Radiant / Alpha corridor) and Elena Vasquez (Bravo recall programme) both registered delegates; same sponsor cocktail session.',
    entityIds: ['e-m-okonkwo', 'e-elena', 'e-bravo'],
    kind: 'interaction',
    caseKey: 'case-bravo',
    source: 'open_source',
    locations: ['Singapore'],
  },
  {
    id: 'tl-li-sff-recap',
    occurredAt: '2024-03-08T14:30:00Z',
    title: 'LinkedIn: “Three days at SFF — supply-chain resilience”',
    description:
      'Post summarises panels attended and names vendor peers; embeds photo geotagged Marina Bay — narrative ties back to the live conference dates.',
    entityIds: ['e-m-okonkwo', 'e-radiant-india'],
    kind: 'social_post',
    caseKey: 'case-bravo',
    source: 'open_source',
    locations: ['Singapore', 'Marina Bay, Singapore'],
    socialPost: {
      platform: 'linkedin',
      url: 'https://linkedin.com/posts/mock-rajesh-krishnan-sff2024',
      excerpt:
        'Great conversations on resilient sourcing — shout-out to partners who joined us after hours in Marina Bay.',
    },
  },
  {
    id: 'tl-bravo-plant',
    occurredAt: '2025-01-20',
    title: 'Bravo plant expansion — vendor walk-through',
    description:
      'Elena Vasquez led supplier compliance site visit; Bravo expansion timeline referenced in audit trail.',
    entityIds: ['e-bravo', 'e-elena'],
    kind: 'interaction',
    caseKey: 'case-bravo',
    source: 'user',
    locations: ['Wilmington, Delaware, USA'],
  },
  {
    id: 'tl-ig-bravo-tour',
    occurredAt: '2025-01-21T16:00:00Z',
    title: 'Instagram story — factory floor during Bravo walk-through',
    description:
      'Ephemeral story showing line signage and Elena ID badge; corroborates same site visit window as compliance notes.',
    entityIds: ['e-bravo', 'e-elena'],
    kind: 'social_post',
    caseKey: 'case-bravo',
    source: 'user',
    locations: ['Wilmington, Delaware, USA'],
    socialPost: {
      platform: 'instagram',
      excerpt: 'Day with Bravo ops — recall programme checkpoints ✓',
    },
  },
  {
    id: 'tl-fb-coastal',
    occurredAt: '2023-11-12T11:00:00Z',
    title: 'Facebook post — Coastal Education beach cleanup drive',
    description:
      'Public post announcing volunteer weekend; includes tagged location and donation link — independent corroboration of trust activity.',
    entityIds: ['e-coastal-ed'],
    kind: 'social_post',
    caseKey: 'case-alpha',
    source: 'open_source',
    locations: ['Kozhikode, Kerala, India'],
    socialPost: {
      platform: 'facebook',
      url: 'https://facebook.com/events/mock-coastal-cleanup-2023',
      excerpt: 'Join us this Saturday at Kappad beach — Coastal Education Initiative volunteers welcome.',
    },
  },
  {
    id: 'tl-radiant-aoc',
    occurredAt: '2025-09-30',
    title: 'Radiant filed annual financial statements (AOC-4)',
    description:
      'Statutory filing for FY ending March 2025; filed with MCA — ties to master data snapshot.',
    entityIds: ['e-radiant-india'],
    kind: 'regulatory',
    caseKey: 'case-alpha',
    source: 'mca',
    locations: ['Bengaluru, Karnataka, India'],
  },
  {
    id: 'tl-cfx-resolution',
    occurredAt: '2026-04-12',
    title: 'CFX Digital board resolution — new operating account',
    description:
      'Board minute authorising HK operating bank relationship referenced in case transfers.',
    entityIds: ['e-cfx'],
    kind: 'regulatory',
    caseKey: 'case-alpha',
    source: 'user',
    locations: ['Hong Kong SAR'],
  },
]
