import { useState, type FormEvent } from 'react'
import type {
  BirdEntityCategory,
  BirdPrimaryJurisdiction,
  BirdRegistryProfile,
} from '../../types'
import { useForensicStore } from '../../store/useForensicStore'

const CATEGORY_LABEL: Record<BirdEntityCategory, string> = {
  person: 'Person',
  company: 'Company',
  ngo: 'NGO',
  trust: 'Trust',
  partnership: 'Partnership',
  llp: 'LLP',
  government_body: 'Government body',
  sole_proprietorship: 'Sole proprietorship',
  other: 'Other',
}

function SourceBadge({ source }: { source: 'ai' | 'user' }) {
  return (
    <span
      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
        source === 'ai'
          ? 'bg-violet-500/20 text-violet-200'
          : 'bg-zinc-700/80 text-zinc-300'
      }`}
    >
      {source === 'ai' ? 'AI' : 'User'}
    </span>
  )
}

function VerifyBadge({ needs }: { needs: boolean }) {
  if (!needs) return null
  return (
    <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-medium text-amber-200">
      Verify
    </span>
  )
}

function JurisdictionPill({ j }: { j: BirdPrimaryJurisdiction }) {
  const label =
    j === 'IN'
      ? 'India focus'
      : j === 'foreign'
        ? 'Foreign registry'
        : 'Multi-jurisdiction'
  const cls =
    j === 'IN'
      ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-200'
      : j === 'foreign'
        ? 'border-sky-500/35 bg-sky-500/10 text-sky-200'
        : 'border-violet-500/35 bg-violet-500/10 text-violet-200'
  return (
    <span
      className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${cls}`}
    >
      {label}
    </span>
  )
}

function McaSourceBadge({
  source,
}: {
  source: 'mca_portal' | 'user_upload'
}) {
  return (
    <span
      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
        source === 'mca_portal'
          ? 'bg-emerald-500/15 text-emerald-200'
          : 'bg-zinc-700/80 text-zinc-300'
      }`}
    >
      {source === 'mca_portal' ? 'MCA portal' : 'Upload'}
    </span>
  )
}

export function BirdEntityProfilePanel({
  profile,
}: {
  profile: BirdRegistryProfile
}) {
  const addFact = useForensicStore((s) => s.addBirdGatheredFact)
  const addDoc = useForensicStore((s) => s.addBirdFinancialDocument)
  const addGov = useForensicStore((s) => s.addBirdGovernmentId)
  const addSocial = useForensicStore((s) => s.addBirdSocialLink)
  const addMca = useForensicStore((s) => s.addBirdMcaFiling)

  const [factLabel, setFactLabel] = useState('')
  const [factValue, setFactValue] = useState('')
  const [factNeedsVerify, setFactNeedsVerify] = useState(true)

  const [docTitle, setDocTitle] = useState('')
  const [docType, setDocType] = useState('')
  const [docRef, setDocRef] = useState('')

  const [govType, setGovType] = useState('')
  const [govValue, setGovValue] = useState('')

  const [socPlatform, setSocPlatform] = useState('')
  const [socUrl, setSocUrl] = useState('')

  const [mcaTitle, setMcaTitle] = useState('')
  const [mcaFormType, setMcaFormType] = useState('')
  const [mcaDate, setMcaDate] = useState('')
  const [mcaSrn, setMcaSrn] = useState('')
  const [mcaUrl, setMcaUrl] = useState('')

  function submitFact(e: FormEvent) {
    e.preventDefault()
    if (!factLabel.trim() || !factValue.trim()) return
    addFact(profile.id, {
      label: factLabel.trim(),
      value: factValue.trim(),
      source: 'user',
      needsVerification: factNeedsVerify,
    })
    setFactLabel('')
    setFactValue('')
  }

  function submitDoc(e: FormEvent) {
    e.preventDefault()
    if (!docTitle.trim()) return
    addDoc(profile.id, {
      title: docTitle.trim(),
      docType: docType.trim() || 'Document',
      reference: docRef.trim() || undefined,
      source: 'user',
    })
    setDocTitle('')
    setDocType('')
    setDocRef('')
  }

  function submitGov(e: FormEvent) {
    e.preventDefault()
    if (!govType.trim() || !govValue.trim()) return
    addGov(profile.id, {
      idType: govType.trim(),
      value: govValue.trim(),
      source: 'user',
      needsVerification: true,
    })
    setGovType('')
    setGovValue('')
  }

  function submitSocial(e: FormEvent) {
    e.preventDefault()
    if (!socPlatform.trim() || !socUrl.trim()) return
    addSocial(profile.id, {
      platform: socPlatform.trim(),
      url: socUrl.trim(),
      source: 'user',
      needsVerification: true,
    })
    setSocPlatform('')
    setSocUrl('')
  }

  function submitMca(e: FormEvent) {
    e.preventDefault()
    if (!mcaTitle.trim() || !mcaFormType.trim()) return
    addMca(profile.id, {
      title: mcaTitle.trim(),
      formType: mcaFormType.trim(),
      filingDate: mcaDate.trim() || undefined,
      srn: mcaSrn.trim() || undefined,
      portalUrl: mcaUrl.trim() || undefined,
      description: undefined,
      source: 'user_upload',
    })
    setMcaTitle('')
    setMcaFormType('')
    setMcaDate('')
    setMcaSrn('')
    setMcaUrl('')
  }

  const jurisdiction = profile.primaryJurisdiction ?? 'multi'
  const mcaRows = profile.mcaFilings ?? []
  const showMcaBlock =
    mcaRows.length > 0 ||
    (jurisdiction === 'IN' && profile.category === 'company')

  return (
    <div className="scrollbar-thin flex max-h-[calc(100vh-220px)] flex-col gap-6 overflow-y-auto pr-1">
      <header className="border-b border-zinc-800 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-zinc-800 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-300">
            {CATEGORY_LABEL[profile.category]}
          </span>
          <JurisdictionPill j={jurisdiction} />
          {profile.headline && (
            <span className="text-sm text-zinc-500">{profile.headline}</span>
          )}
        </div>
        <h2 className="mt-2 text-xl font-semibold text-zinc-100">
          {profile.legalName}
        </h2>
        {profile.aliases.length > 0 && (
          <p className="mt-1 text-xs text-zinc-500">
            Also known as: {profile.aliases.join(', ')}
          </p>
        )}
        <p className="mt-3 text-xs leading-relaxed text-zinc-500">
          Indian subjects: prioritise PAN, Aadhaar, DIN (directors), CIN / GSTIN
          (companies). For Indian companies, MCA filings (AOC-4, MGT-7, CHG-1,
          master data, charges) are central — connectors can mirror{' '}
          <a
            href="https://www.mca.gov.in"
            target="_blank"
            rel="noreferrer"
            className="text-emerald-400/90 underline"
          >
            mca.gov.in
          </a>
          ; verify before reliance. Foreign entities use home-country registers
          plus any Indian tax IDs (e.g. PAN) where relevant.
        </p>
      </header>

      {profile.person && (
        <section>
          <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
            Person
          </h3>
          <dl className="grid gap-2 text-sm">
            {profile.person.dateOfBirth && (
              <>
                <dt className="text-zinc-500">Date of birth</dt>
                <dd className="text-zinc-200">{profile.person.dateOfBirth}</dd>
              </>
            )}
            {profile.person.nationality && (
              <>
                <dt className="text-zinc-500">Nationality</dt>
                <dd className="text-zinc-200">{profile.person.nationality}</dd>
              </>
            )}
            {profile.person.gender && (
              <>
                <dt className="text-zinc-500">Gender</dt>
                <dd className="text-zinc-200">{profile.person.gender}</dd>
              </>
            )}
            {profile.person.residentialAddress && (
              <>
                <dt className="text-zinc-500">Address</dt>
                <dd className="text-zinc-200">
                  {profile.person.residentialAddress}
                </dd>
              </>
            )}
            {profile.person.din && (
              <>
                <dt className="text-zinc-500">DIN (India)</dt>
                <dd className="font-mono text-xs text-zinc-200">
                  {profile.person.din}
                </dd>
              </>
            )}
          </dl>
        </section>
      )}

      {profile.corporate && (
        <section>
          <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
            {profile.category === 'ngo' || profile.category === 'trust'
              ? 'Registration & governance'
              : 'Corporate / statutory'}
          </h3>
          <dl className="grid gap-2 text-sm">
            {profile.corporate.cin && (
              <>
                <dt className="text-zinc-500">CIN (India)</dt>
                <dd className="font-mono text-xs text-zinc-200">
                  {profile.corporate.cin}
                </dd>
              </>
            )}
            {profile.corporate.roc && (
              <>
                <dt className="text-zinc-500">ROC</dt>
                <dd className="text-zinc-200">{profile.corporate.roc}</dd>
              </>
            )}
            {profile.corporate.incorporationDate && (
              <>
                <dt className="text-zinc-500">Incorporation / registration</dt>
                <dd className="text-zinc-200">
                  {profile.corporate.incorporationDate}
                </dd>
              </>
            )}
            {profile.corporate.registeredAddress && (
              <>
                <dt className="text-zinc-500">Registered address</dt>
                <dd className="text-zinc-200">
                  {profile.corporate.registeredAddress}
                </dd>
              </>
            )}
            {profile.corporate.gstin && (
              <>
                <dt className="text-zinc-500">GSTIN</dt>
                <dd className="font-mono text-xs text-zinc-200">
                  {profile.corporate.gstin}
                </dd>
              </>
            )}
            {profile.corporate.pan && (
              <>
                <dt className="text-zinc-500">PAN</dt>
                <dd className="font-mono text-xs text-zinc-200">
                  {profile.corporate.pan}
                </dd>
              </>
            )}
            {profile.corporate.registrationNumber && (
              <>
                <dt className="text-zinc-500">Registration number</dt>
                <dd className="font-mono text-xs text-zinc-200">
                  {profile.corporate.registrationNumber}
                </dd>
              </>
            )}
            {profile.corporate.regulatoryStatus && (
              <>
                <dt className="text-zinc-500">Status</dt>
                <dd className="text-zinc-200">
                  {profile.corporate.regulatoryStatus}
                </dd>
              </>
            )}
            {profile.corporate.mcaCompanyStatus && (
              <>
                <dt className="text-zinc-500">MCA · company status</dt>
                <dd className="text-zinc-200">
                  {profile.corporate.mcaCompanyStatus}
                </dd>
              </>
            )}
            {profile.corporate.boardMembers &&
              profile.corporate.boardMembers.length > 0 && (
                <>
                  <dt className="text-zinc-500">Board / key persons</dt>
                  <dd className="text-zinc-200">
                    {profile.corporate.boardMembers.join(', ')}
                  </dd>
                </>
              )}
          </dl>
        </section>
      )}

      {showMcaBlock && (
        <section>
          <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
            MCA (India) — filings & extracts
          </h3>
          {jurisdiction !== 'IN' && (
            <p className="mb-2 text-xs text-zinc-600">
              Primary registry is non-Indian; MCA applies only to Indian
              incorporated companies. Rows below may reference cross-border
              Indian counterparties.
            </p>
          )}
          {jurisdiction === 'IN' &&
            profile.category === 'company' &&
            mcaRows.length === 0 && (
              <p className="mb-2 rounded-lg border border-amber-500/25 bg-amber-500/5 px-3 py-2 text-xs text-amber-100/90">
                No MCA rows yet — pull master data, annual filings (AOC-4 / MGT-7),
                charge intimation (CHG-1), and PDFs from{' '}
                <a
                  href="https://www.mca.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  mca.gov.in
                </a>{' '}
                or add uploads manually.
              </p>
            )}
          <div className="overflow-x-auto rounded-lg border border-emerald-500/20 bg-emerald-950/10">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-800 bg-zinc-900/60 text-[10px] uppercase text-zinc-500">
                <tr>
                  <th className="px-2 py-2">Form / extract</th>
                  <th className="px-2 py-2">Title</th>
                  <th className="px-2 py-2">Date / SRN</th>
                  <th className="px-2 py-2">Source</th>
                </tr>
              </thead>
              <tbody>
                {mcaRows.map((m) => (
                  <tr key={m.id} className="border-b border-zinc-800/80">
                    <td className="px-2 py-2 font-medium text-zinc-200">
                      {m.formType}
                    </td>
                    <td className="px-2 py-2 text-zinc-300">
                      <span className="block">{m.title}</span>
                      {m.description && (
                        <span className="mt-0.5 block text-[10px] text-zinc-500">
                          {m.description}
                        </span>
                      )}
                      {m.portalUrl && (
                        <a
                          href={m.portalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-block text-[10px] text-emerald-400 hover:underline"
                        >
                          Open on MCA / portal
                        </a>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-zinc-500">
                      {m.filingDate && (
                        <span className="block">{m.filingDate}</span>
                      )}
                      {m.srn && (
                        <span className="font-mono text-[10px] text-zinc-600">
                          SRN {m.srn}
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-2">
                      <McaSourceBadge source={m.source} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {mcaRows.length === 0 && (
              <p className="px-3 py-4 text-center text-xs text-zinc-600">
                No MCA-linked rows.
              </p>
            )}
          </div>
          {jurisdiction === 'IN' && profile.category === 'company' && (
            <form
              onSubmit={submitMca}
              className="mt-2 space-y-2 rounded-lg border border-zinc-800/80 bg-zinc-950/50 p-2"
            >
              <p className="text-[10px] font-medium uppercase text-zinc-500">
                Add filing reference (SRN / manual upload)
              </p>
              <div className="flex flex-wrap gap-2">
                <input
                  placeholder="Form e.g. AOC-4"
                  value={mcaFormType}
                  onChange={(e) => setMcaFormType(e.target.value)}
                  className="min-w-[80px] flex-1 rounded border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-xs"
                />
                <input
                  placeholder="Title"
                  value={mcaTitle}
                  onChange={(e) => setMcaTitle(e.target.value)}
                  className="min-w-[120px] flex-[2] rounded border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-xs"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <input
                  placeholder="Filing date (YYYY-MM-DD)"
                  value={mcaDate}
                  onChange={(e) => setMcaDate(e.target.value)}
                  className="flex-1 rounded border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-xs"
                />
                <input
                  placeholder="SRN"
                  value={mcaSrn}
                  onChange={(e) => setMcaSrn(e.target.value)}
                  className="flex-1 rounded border border-zinc-800 bg-zinc-900 px-2 py-1.5 font-mono text-xs"
                />
              </div>
              <input
                placeholder="Portal or PDF URL (optional)"
                value={mcaUrl}
                onChange={(e) => setMcaUrl(e.target.value)}
                className="w-full rounded border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-xs"
              />
              <button
                type="submit"
                className="rounded bg-emerald-700/80 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-600"
              >
                Add MCA reference
              </button>
            </form>
          )}
        </section>
      )}

      <section>
        <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
          Identification — India & global
        </h3>
        <div className="overflow-x-auto rounded-lg border border-zinc-800">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-800 bg-zinc-900/60 text-[10px] uppercase text-zinc-500">
              <tr>
                <th className="px-2 py-2">Type</th>
                <th className="px-2 py-2">Value</th>
                <th className="px-2 py-2">Source</th>
              </tr>
            </thead>
            <tbody>
              {profile.governmentIds.map((g) => (
                <tr key={g.id} className="border-b border-zinc-800/80">
                  <td className="px-2 py-2 text-zinc-300">{g.idType}</td>
                  <td className="px-2 py-2 font-mono text-zinc-200">
                    {g.value}
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex flex-wrap gap-1">
                      <SourceBadge source={g.source} />
                      <VerifyBadge needs={g.needsVerification} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <form
          onSubmit={submitGov}
          className="mt-2 flex flex-wrap items-end gap-2 rounded-lg border border-zinc-800/80 bg-zinc-950/50 p-2"
        >
          <input
            placeholder="Type (PAN, Aadhaar, GSTIN, passport…)"
            value={govType}
            onChange={(e) => setGovType(e.target.value)}
            className="min-w-[100px] flex-1 rounded border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-200"
          />
          <input
            placeholder="Value"
            value={govValue}
            onChange={(e) => setGovValue(e.target.value)}
            className="min-w-[120px] flex-1 rounded border border-zinc-800 bg-zinc-900 px-2 py-1.5 font-mono text-xs text-zinc-200"
          />
          <button
            type="submit"
            className="rounded bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-100 hover:bg-zinc-700"
          >
            Add ID
          </button>
        </form>
      </section>

      <section>
        <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
          Companies & organizations
        </h3>
        <p className="mb-1 text-[10px] text-zinc-600">Affiliated companies</p>
        <ul className="mb-3 space-y-1">
          {profile.affiliationsCompanies.map((a) => (
            <li
              key={a.id}
              className="rounded-md border border-zinc-800 bg-zinc-900/40 px-2 py-1.5 text-xs text-zinc-300"
            >
              <span className="font-medium text-zinc-100">{a.name}</span>
              <span className="text-zinc-500"> — {a.relationship}</span>{' '}
              <SourceBadge source={a.source} />
            </li>
          ))}
          {profile.affiliationsCompanies.length === 0 && (
            <li className="text-xs text-zinc-600">None recorded.</li>
          )}
        </ul>
        <p className="mb-1 text-[10px] text-zinc-600">NGOs & non-profits</p>
        <ul className="space-y-1">
          {profile.affiliationsNgos.map((a) => (
            <li
              key={a.id}
              className="rounded-md border border-zinc-800 bg-zinc-900/40 px-2 py-1.5 text-xs text-zinc-300"
            >
              <span className="font-medium text-zinc-100">{a.name}</span>
              <span className="text-zinc-500"> — {a.relationship}</span>{' '}
              <SourceBadge source={a.source} />
            </li>
          ))}
          {profile.affiliationsNgos.length === 0 && (
            <li className="text-xs text-zinc-600">None recorded.</li>
          )}
        </ul>
      </section>

      <section>
        <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
          Social & web
        </h3>
        <ul className="mb-2 space-y-2">
          {profile.socialMedia.map((s) => (
            <li key={s.id} className="text-xs">
              <span className="text-zinc-400">{s.platform}: </span>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="break-all text-violet-400 hover:underline"
              >
                {s.url}
              </a>{' '}
              <SourceBadge source={s.source} />
              <VerifyBadge needs={s.needsVerification} />
            </li>
          ))}
        </ul>
        <form
          onSubmit={submitSocial}
          className="flex flex-wrap items-end gap-2 rounded-lg border border-zinc-800/80 bg-zinc-950/50 p-2"
        >
          <input
            placeholder="Platform"
            value={socPlatform}
            onChange={(e) => setSocPlatform(e.target.value)}
            className="min-w-[90px] flex-1 rounded border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-xs"
          />
          <input
            placeholder="URL"
            value={socUrl}
            onChange={(e) => setSocUrl(e.target.value)}
            className="min-w-[140px] flex-[2] rounded border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-xs"
          />
          <button
            type="submit"
            className="rounded bg-zinc-800 px-3 py-1.5 text-xs font-medium hover:bg-zinc-700"
          >
            Add link
          </button>
        </form>
      </section>

      <section>
        <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
          Financial & related documents
        </h3>
        <ul className="mb-2 space-y-2">
          {profile.financialDocuments.map((d) => (
            <li
              key={d.id}
              className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-xs"
            >
              <p className="font-medium text-zinc-100">{d.title}</p>
              <p className="text-zinc-500">
                {d.docType}
                {d.date ? ` · ${d.date}` : ''}
                {d.reference ? ` · ${d.reference}` : ''}
              </p>
              {d.relatedCaseKeys && d.relatedCaseKeys.length > 0 && (
                <p className="mt-1 text-[10px] text-zinc-600">
                  Cases: {d.relatedCaseKeys.join(', ')}
                </p>
              )}
              <SourceBadge source={d.source} />
            </li>
          ))}
        </ul>
        <form
          onSubmit={submitDoc}
          className="space-y-2 rounded-lg border border-zinc-800/80 bg-zinc-950/50 p-2"
        >
          <input
            placeholder="Title"
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
            className="w-full rounded border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-xs"
          />
          <div className="flex flex-wrap gap-2">
            <input
              placeholder="Doc type"
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="flex-1 rounded border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-xs"
            />
            <input
              placeholder="Reference"
              value={docRef}
              onChange={(e) => setDocRef(e.target.value)}
              className="flex-1 rounded border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-xs"
            />
          </div>
          <button
            type="submit"
            className="rounded bg-zinc-800 px-3 py-1.5 text-xs font-medium hover:bg-zinc-700"
          >
            Add document
          </button>
        </form>
      </section>

      <section>
        <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
          Gathered facts (AI & analyst)
        </h3>
        <ul className="mb-2 space-y-2">
          {profile.gatheredFacts.map((f) => (
            <li
              key={f.id}
              className="rounded-lg border border-zinc-800 bg-zinc-900/40 px-3 py-2 text-xs"
            >
              <p className="font-medium text-zinc-200">{f.label}</p>
              <p className="mt-0.5 text-zinc-400">{f.value}</p>
              <div className="mt-1 flex flex-wrap gap-1">
                <SourceBadge source={f.source} />
                <VerifyBadge needs={f.needsVerification} />
              </div>
            </li>
          ))}
        </ul>
        <form
          onSubmit={submitFact}
          className="space-y-2 rounded-lg border border-zinc-800/80 bg-zinc-950/50 p-2"
        >
          <input
            placeholder="Label"
            value={factLabel}
            onChange={(e) => setFactLabel(e.target.value)}
            className="w-full rounded border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-xs"
          />
          <textarea
            placeholder="Value / notes"
            value={factValue}
            onChange={(e) => setFactValue(e.target.value)}
            rows={2}
            className="w-full resize-none rounded border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-xs"
          />
          <label className="flex items-center gap-2 text-[11px] text-zinc-400">
            <input
              type="checkbox"
              checked={factNeedsVerify}
              onChange={(e) => setFactNeedsVerify(e.target.checked)}
              className="rounded border-zinc-600"
            />
            Mark as needing verification
          </label>
          <button
            type="submit"
            className="rounded bg-violet-600/80 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-600"
          >
            Add fact
          </button>
        </form>
      </section>
    </div>
  )
}
