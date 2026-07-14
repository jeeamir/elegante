// The Look — the signature moment of Elegante.
// Not four cards: a single editorial lookbook sheet. Pieces 01→04 run down
// the page and a red thread draws itself down the margin, tying the outfit
// together as each piece reveals.
import { useEffect, useRef } from 'react'
import { anime, motionOK, primePath, EASE } from '../lib/motion'

const PART_ORDER = [
  ['top', 'Top'],
  ['bottom', 'Bottom'],
  ['shoes', 'Shoes'],
  ['accessory', 'Accessory'],
]

function Piece({ index, label, item, isLast }) {
  return (
    <article className="look-piece grid grid-cols-[2.75rem_1fr] gap-x-4 sm:grid-cols-[3.25rem_1fr] sm:gap-x-6">
      {/* rail: numbered node + thread segment down to the next piece */}
      <div className="flex flex-col items-center">
        <span className="look-node flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-seam-strong bg-graphite font-mono text-[11px] text-porcelain">
          {String(index + 1).padStart(2, '0')}
        </span>
        {!isLast && (
          <svg
            className="w-6 flex-1"
            viewBox="0 0 24 120"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
          >
            <path
              className="look-seg"
              d="M12 2 C 20 30, 4 55, 12 80 S 16 105, 12 118"
              stroke="var(--color-lacquer)"
              strokeWidth="1.75"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        )}
      </div>

      {/* the piece itself, presented the way a stylist would */}
      <div className={`look-body min-w-0 ${isLast ? 'pb-2' : 'pb-10 sm:pb-12'}`}>
        <p className="spec text-lacquer">{label}</p>
        <h3 className="mt-1.5 font-display text-h3 font-light text-porcelain">
          {item.item}
        </h3>
        <p className="mt-2 font-mono text-xs text-mercury">
          {[item.color, item.material, item.size && `size ${item.size}`]
            .filter(Boolean)
            .join('  ·  ')}
        </p>
        {item.reason && (
          <p className="mt-3 max-w-xl border-l border-seam pl-4 font-display text-[15px] italic leading-relaxed text-mercury">
            {item.reason}
          </p>
        )}
        {item.shops?.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="spec text-faint">Find it</span>
            {item.shops.map((s) => (
              <span
                key={s}
                className="rounded-md border border-seam bg-raise px-2.5 py-1 text-xs text-mercury"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

export default function LookSheet({ result, occasion, mood }) {
  const rootRef = useRef(null)
  const pieces = PART_ORDER.filter(([key]) => result?.[key])

  useEffect(() => {
    const root = rootRef.current
    if (!root || !motionOK()) return

    const header = root.querySelector('.look-header')
    const nodes = root.querySelectorAll('.look-node')
    const bodies = root.querySelectorAll('.look-body')
    const segs = root.querySelectorAll('.look-seg')

    // Hide everything, prime the thread, then run one choreographed reveal.
    anime.set(header, { opacity: 0, translateY: 16 })
    anime.set(nodes, { opacity: 0, scale: 0.4 })
    anime.set(bodies, { opacity: 0, translateX: -14 })
    segs.forEach((p) => primePath(p))

    const tl = anime.timeline({ easing: EASE.out })
    tl.add({ targets: header, opacity: [0, 1], translateY: [16, 0], duration: 550 })

    pieces.forEach((_, i) => {
      tl.add(
        {
          targets: nodes[i],
          opacity: [0, 1],
          scale: [0.4, 1],
          duration: 380,
          easing: 'spring(1, 90, 12, 0)',
        },
        i === 0 ? '-=150' : '-=220'
      )
      tl.add(
        { targets: bodies[i], opacity: [0, 1], translateX: [-14, 0], duration: 480 },
        '-=280'
      )
      if (segs[i]) {
        // the thread draws down toward the next piece
        tl.add(
          {
            targets: segs[i],
            strokeDashoffset: [anime.setDashoffset, 0],
            duration: 420,
            easing: EASE.draw,
          },
          '-=180'
        )
      }
    })

    return () => tl.pause()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result])

  if (!pieces.length) return null

  const dateStr = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div ref={rootRef}>
      <header className="look-header mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-seam pb-6">
        <div>
          <p className="spec text-lacquer">The look</p>
          <h2 className="mt-2 font-display text-title font-light capitalize text-porcelain">
            {occasion}
            {mood && <em className="text-mercury"> · {mood.toLowerCase()}</em>}
          </h2>
        </div>
        <p className="font-mono text-xs text-faint">{dateStr}</p>
      </header>

      <div>
        {pieces.map(([key, label], i) => (
          <Piece
            key={key}
            index={i}
            label={label}
            item={result[key]}
            isLast={i === pieces.length - 1}
          />
        ))}
      </div>
    </div>
  )
}
