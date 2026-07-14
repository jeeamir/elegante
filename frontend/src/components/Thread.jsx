// Le fil rouge — the red thread motif, in three forms:
//  ThreadUnderline  — draws itself beneath a headline
//  StitchLoader     — "the stylist is considering" state
//  ThreadRule       — quiet static divider with a knot
import { useEffect, useRef, useState } from 'react'
import { anime, motionOK, primePath, EASE } from '../lib/motion'

/** A hand-drawn underline that draws in on mount (or via an external timeline). */
export function ThreadUnderline({ className = '', draw = true, delay = 0 }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!draw || !motionOK() || !ref.current) return
    primePath(ref.current)
    const anim = anime({
      targets: ref.current,
      strokeDashoffset: [anime.setDashoffset, 0],
      duration: 900,
      delay,
      easing: EASE.draw,
    })
    return () => anim.pause()
  }, [draw, delay])

  return (
    <svg
      className={`block ${className}`}
      viewBox="0 0 220 12"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        ref={ref}
        d="M2 8 C 40 2, 75 11, 112 6 S 185 4, 218 7"
        stroke="var(--color-lacquer)"
        strokeWidth="2"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

const DEFAULT_NOTES = [
  'Considering silhouette…',
  'Balancing proportions…',
  'Checking the palette against your colors…',
  'Weighing fabric and season…',
  'Matching pieces to your shops…',
  'Pinning the final look…',
]

/** Loading state: a red thread stitches across the canvas while the stylist thinks. */
export function StitchLoader({ notes = DEFAULT_NOTES, label = 'Your stylist is considering' }) {
  const [idx, setIdx] = useState(0)
  const noteRef = useRef(null)

  useEffect(() => {
    const t = setInterval(() => {
      const next = () => setIdx((i) => (i + 1) % notes.length)
      if (motionOK() && noteRef.current) {
        anime({
          targets: noteRef.current,
          opacity: [1, 0],
          translateY: [0, -6],
          duration: 260,
          easing: 'easeInQuad',
          complete: () => {
            next()
            anime({
              targets: noteRef.current,
              opacity: [0, 1],
              translateY: [6, 0],
              duration: 320,
              easing: 'easeOutQuad',
            })
          },
        })
      } else {
        next()
      }
    }, 2100)
    return () => clearInterval(t)
  }, [notes.length])

  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center" role="status" aria-live="polite">
      <svg viewBox="0 0 320 60" className="w-64 max-w-full" fill="none" aria-hidden="true">
        {/* faint guide seam */}
        <path
          d="M6 34 C 60 18, 105 48, 160 30 S 265 16, 314 32"
          stroke="var(--color-seam)"
          strokeWidth="1"
        />
        {/* the running stitch */}
        <path
          className="stitching"
          d="M6 34 C 60 18, 105 48, 160 30 S 265 16, 314 32"
          stroke="var(--color-lacquer)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* needle head */}
        <circle cx="314" cy="32" r="3" fill="var(--color-lacquer)" />
      </svg>
      <p className="spec mt-8 text-faint">{label}</p>
      <p ref={noteRef} className="mt-2 font-display text-lg italic text-mercury">
        {notes[idx]}
      </p>
    </div>
  )
}

/** Quiet horizontal rule with a knot — static, used as a section divider. */
export function ThreadRule({ className = '', label }) {
  return (
    <div className={`flex items-center gap-4 ${className}`} aria-hidden={label ? undefined : true}>
      <span className="h-px flex-1 bg-seam" />
      {label && <span className="spec text-faint">{label}</span>}
      <span className="h-1.5 w-1.5 rotate-45 bg-lacquer" />
      <span className="h-px flex-1 bg-seam" />
    </div>
  )
}

/** Tiny inline "working" indicator for buttons — a moving stitch, never a spinner. */
export function ThreadWorking({ className = '' }) {
  return (
    <svg viewBox="0 0 36 8" className={`h-2 w-9 ${className}`} fill="none" aria-hidden="true">
      <path
        className="thread-pulse"
        d="M1 4 C 8 1, 12 7, 18 4 S 30 1, 35 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}
