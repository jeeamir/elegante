// The Lookbook — every consultation, kept as a ledger.
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { outfitsAPI } from '../api'
import { Panel, ErrorNote, PageHeader } from '../components/ui'
import { ChevronDownIcon } from '../components/Icons'
import { anime, motionOK, EASE } from '../lib/motion'

function timeAgo(dateStr) {
  const d = new Date(dateStr)
  const diff = (Date.now() - d.getTime()) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

const PARTS = [
  ['top', 'Top'],
  ['bottom', 'Bottom'],
  ['shoes', 'Shoes'],
  ['accessory', 'Accessory'],
]

function LedgerRow({ outfit, index, expanded, toggle }) {
  const r = outfit.result
  return (
    <Panel className="ledger-row overflow-hidden transition-shadow hover:shadow-lift">
      <button
        onClick={toggle}
        aria-expanded={expanded}
        className="flex w-full items-center gap-4 p-5 text-left"
      >
        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-seam-strong font-mono text-[10px] text-mercury">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-display text-lg font-light capitalize text-porcelain">
              {outfit.occasion}
            </span>
            {outfit.mood && <span className="spec text-faint">{outfit.mood}</span>}
          </div>
          <span className="font-mono text-xs text-faint">{timeAgo(outfit.created_at)}</span>
        </div>
        <ChevronDownIcon
          className={`h-4 w-4 flex-shrink-0 text-faint transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {expanded && r && (
        <div className="border-t border-seam px-5 pb-5 pt-4">
          <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {PARTS.map(([key, label]) => {
              const item = r[key]
              if (!item) return null
              return (
                <div key={key} className="border-l-2 border-lacquer-dim pl-4">
                  <span className="spec text-faint">{label}</span>
                  <p className="mt-1 font-display text-[15px] font-light text-porcelain">{item.item}</p>
                  <p className="mt-0.5 font-mono text-xs text-mercury">
                    {[item.color, item.material].filter(Boolean).join(' · ')}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </Panel>
  )
}

export default function HistoryPage() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState(null)
  const listRef = useRef(null)

  useEffect(() => {
    outfitsAPI.history()
      .then((r) => setHistory(r.data.reverse()))
      .catch((err) => setError(err.response?.data?.detail || 'Failed to load your lookbook'))
      .finally(() => setLoading(false))
  }, [])

  // Quiet stagger once the ledger arrives.
  useEffect(() => {
    if (loading || !history.length || !motionOK() || !listRef.current) return
    const rows = listRef.current.querySelectorAll('.ledger-row')
    anime.set(rows, { opacity: 0, translateY: 12 })
    const anim = anime({
      targets: rows,
      opacity: [0, 1],
      translateY: [12, 0],
      duration: 480,
      delay: anime.stagger(60),
      easing: EASE.out,
    })
    return () => anim.pause()
  }, [loading, history.length])

  return (
    <div className="mx-auto max-w-3xl p-5 sm:p-8 md:p-12">
      <PageHeader
        kicker="The lookbook"
        title="Every look, on record"
        subtitle="Each consultation is kept here — reopen any entry to see the full breakdown."
      />

      {loading && (
        <div className="flex items-center justify-center py-20">
          <svg viewBox="0 0 120 12" className="h-3 w-28" fill="none" aria-hidden="true">
            <path
              className="thread-pulse"
              d="M2 6 C 20 1, 35 11, 60 6 S 100 1, 118 6"
              stroke="var(--color-lacquer)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}

      <ErrorNote>{error}</ErrorNote>

      {!loading && !error && history.length === 0 && (
        <div className="py-20 text-center">
          <span className="font-display text-6xl font-light text-seam-strong">E<span className="text-lacquer-dim">.</span></span>
          <p className="spec mt-6 text-faint">The lookbook is empty</p>
          <p className="mt-2 text-sm text-mercury">
            Start a{' '}
            <Link to="/app" className="text-lacquer-bright underline underline-offset-2 hover:text-lacquer">
              consultation
            </Link>{' '}
            and your first look will be recorded here.
          </p>
        </div>
      )}

      <div ref={listRef} className="space-y-3">
        {history.map((outfit, i) => (
          <LedgerRow
            key={outfit.id}
            outfit={outfit}
            index={history.length - 1 - i}
            expanded={expanded === outfit.id}
            toggle={() => setExpanded((prev) => (prev === outfit.id ? null : outfit.id))}
          />
        ))}
      </div>
    </div>
  )
}
