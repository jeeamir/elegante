// Motion helpers — one place for anime.js + reduced-motion policy.
// Rule: JS timelines only run when the user allows motion. When motion is
// reduced, content is simply visible — no hidden states, no drawing.
import anime from 'animejs/lib/anime.es.js'

export { anime }

export const motionOK = () =>
  typeof window !== 'undefined' &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Prepare an SVG path for a draw-on animation. Returns the path length. */
export const primePath = (el) => {
  if (!el) return 0
  const len = el.getTotalLength()
  el.style.strokeDasharray = len
  el.style.strokeDashoffset = len
  return len
}

/** Shared easing vocabulary — keep motion consistent across the app. */
export const EASE = {
  out: 'cubicBezier(0.22, 1, 0.36, 1)',
  inOut: 'easeInOutQuad',
  draw: 'easeInOutSine',
}
