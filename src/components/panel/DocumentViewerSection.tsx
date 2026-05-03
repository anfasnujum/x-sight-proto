import { useEffect, useState } from 'react'
import { FileWarning, X } from 'lucide-react'
import { useForensicStore } from '../../store/useForensicStore'

function BlobTextPreview({ url }: { url: string }) {
  const [text, setText] = useState<string | null>(null)
  const [err, setErr] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch(url)
      .then((r) => r.text())
      .then((t) => {
        if (!cancelled) setText(t)
      })
      .catch(() => {
        if (!cancelled) setErr(true)
      })
    return () => {
      cancelled = true
    }
  }, [url])

  if (err) {
    return (
      <p className="text-sm text-zinc-500">
        Could not read this file as text. Try downloading or use another format.
      </p>
    )
  }
  if (text === null) {
    return <p className="text-sm text-zinc-500">Loading text…</p>
  }
  return (
    <pre className="scrollbar-thin max-h-[calc(100vh-220px)] overflow-auto whitespace-pre-wrap break-words font-mono text-[12px] leading-relaxed text-zinc-300">
      {text}
    </pre>
  )
}

function isProbablyPdf(mime?: string) {
  return mime === 'application/pdf' || (mime?.includes('pdf') ?? false)
}

function isImage(mime?: string) {
  return (mime?.startsWith('image/') ?? false) || false
}

function isText(mime?: string) {
  if (!mime) return false
  return (
    mime.startsWith('text/') ||
    mime === 'application/json' ||
    mime.includes('markdown')
  )
}

export function DocumentViewerSection() {
  const doc = useForensicStore((s) => s.documentViewer)
  const closeDocumentViewer = useForensicStore((s) => s.closeDocumentViewer)

  if (!doc) {
    return (
      <div className="scrollbar-thin flex min-h-0 flex-1 flex-col overflow-y-auto px-3 pb-4 pt-1">
        <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-800 bg-zinc-950/40 px-4 py-10 text-center">
          <FileWarning className="h-8 w-8 text-zinc-600" aria-hidden />
          <p className="text-sm text-zinc-500">
            No file open. Go to Bird&apos;s view → Data dump and choose{' '}
            <span className="text-zinc-400">Open file</span> on a row.
          </p>
        </div>
      </div>
    )
  }

  const hasBlob = Boolean(doc.objectUrl)
  const hasSynth = Boolean(doc.syntheticHtml)

  return (
    <div className="scrollbar-thin flex min-h-0 flex-1 flex-col overflow-hidden px-3 pb-4 pt-1">
      <div className="mb-2 flex shrink-0 items-start justify-between gap-2 border-b border-zinc-800/90 pb-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-zinc-100">{doc.title}</p>
          <p className="mt-0.5 text-[11px] text-zinc-600">
            {doc.mimeType ?? 'unknown type'}
            {hasSynth ? ' · synthetic preview' : null}
          </p>
        </div>
        <button
          type="button"
          onClick={() => closeDocumentViewer()}
          className="shrink-0 rounded-md p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
          title="Close preview"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950/80">
        {hasBlob && doc.objectUrl ? (
          isProbablyPdf(doc.mimeType) ? (
            <iframe
              title={doc.title}
              src={doc.objectUrl}
              className="h-[min(520px,calc(100vh-200px))] w-full border-0 bg-zinc-900"
            />
          ) : isImage(doc.mimeType) ? (
            <div className="scrollbar-thin flex max-h-[calc(100vh-200px)] justify-center overflow-auto p-2">
              <img
                src={doc.objectUrl}
                alt={doc.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ) : isText(doc.mimeType) ? (
            <div className="p-3">
              <BlobTextPreview url={doc.objectUrl} />
            </div>
          ) : (
            <div className="p-3">
              <a
                href={doc.objectUrl}
                download={doc.title}
                className="mb-3 inline-block text-xs text-violet-400 hover:underline"
              >
                Download file
              </a>
              <p className="mb-2 text-[11px] text-zinc-500">
                Browser preview may be limited for this type — trying embedded viewer.
              </p>
              <iframe
                title={doc.title}
                src={doc.objectUrl}
                className="h-[min(480px,calc(100vh-220px))] w-full border-0 bg-zinc-900"
              />
            </div>
          )
        ) : null}

        {hasSynth && doc.syntheticHtml ? (
          <div
            className="scrollbar-thin max-h-[calc(100vh-200px)] overflow-y-auto p-4 text-sm leading-relaxed text-zinc-300 [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-xs [&_h2]:font-semibold [&_h2]:uppercase [&_h2]:tracking-wide [&_h2]:text-zinc-500 [&_p]:mb-3 [&_pre]:mb-3 [&_pre]:rounded-md [&_pre]:border [&_pre]:border-zinc-800 [&_pre]:bg-zinc-950 [&_pre]:p-3 [&_pre]:font-mono [&_pre]:text-[11px] [&_table]:w-full [&_table]:text-left [&_th]:border [&_th]:border-zinc-800 [&_th]:bg-zinc-900/80 [&_th]:px-2 [&_th]:py-1.5 [&_th]:text-[10px] [&_th]:font-semibold [&_th]:uppercase [&_th]:text-zinc-500 [&_td]:border [&_td]:border-zinc-800 [&_td]:px-2 [&_td]:py-1.5"
            dangerouslySetInnerHTML={{ __html: doc.syntheticHtml }}
          />
        ) : null}

        {!hasBlob && !hasSynth && (
          <p className="p-4 text-sm text-zinc-500">Nothing to render.</p>
        )}
      </div>
    </div>
  )
}
