// Shared UI primitives — The Digital Atelier design system.
// Surfaces: ink / graphite / seam. Type: porcelain / mercury / faint.
// One accent: lacquer. Labels are always .spec (mono, uppercase, tracked).
import { ThreadWorking } from './Thread'

export function Logo({ className = '' }) {
  return (
    <span className={`font-display text-xl tracking-tight text-porcelain ${className}`}>
      Elegante<span className="text-lacquer">.</span>
    </span>
  )
}

export function Button({ variant = 'primary', className = '', children, ...props }) {
  const variants = {
    // The one loud element on any screen.
    primary:
      'bg-lacquer text-[#fbf9f4] hover:bg-lacquer-bright hover:-translate-y-px active:translate-y-0 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none',
    // Quiet outline — most buttons.
    outline:
      'border border-seam-strong bg-transparent text-porcelain hover:border-mercury active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none',
    ghost:
      'text-mercury hover:text-porcelain active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none',
  }
  return (
    <button
      className={`inline-flex items-center justify-center gap-2.5 rounded-lg px-6 py-3 text-sm font-medium transition-all duration-200 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

/** Tailor's tab — rectangular chip with a mono label. Active = inverted. */
export function Chip({ active, className = '', children, ...props }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`spec rounded-md border px-3.5 py-2 transition-all duration-150 active:scale-[0.96] ${
        active
          ? 'border-porcelain bg-porcelain text-ink'
          : 'border-seam bg-transparent text-mercury hover:border-seam-strong hover:text-porcelain'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function Panel({ className = '', style, children }) {
  return (
    <div style={style} className={`rounded-xl border border-seam bg-graphite shadow-panel ${className}`}>
      {children}
    </div>
  )
}

// Kept as an alias so page code reads naturally in either idiom.
export const Card = Panel

export function Label({ children, hint }) {
  return (
    <label className="spec mb-2 block text-faint">
      {children}
      {hint && <span className="ml-1.5 normal-case tracking-normal text-faint/70">({hint})</span>}
    </label>
  )
}

export function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full rounded-lg border border-seam bg-raise px-4 py-3 text-sm text-porcelain placeholder-faint transition-colors focus:border-lacquer ${className}`}
      {...props}
    />
  )
}

export function Select({ className = '', children, ...props }) {
  return (
    <select
      className={`w-full appearance-none rounded-lg border border-seam bg-raise px-4 py-3 text-sm text-porcelain transition-colors focus:border-lacquer ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}

export function ErrorNote({ children }) {
  if (!children) return null
  return (
    <div className="rounded-lg border border-lacquer-dim bg-lacquer/10 px-4 py-3 text-sm text-lacquer-bright">
      {children}
    </div>
  )
}

/** Working indicator — a moving stitch. There are no spinners in this app. */
export function Spinner({ className = '' }) {
  return <ThreadWorking className={className} />
}

export function PageHeader({ kicker, title, subtitle }) {
  return (
    <header className="mb-10 animate-fade-up md:mb-12">
      {kicker && <p className="spec mb-3 text-lacquer">{kicker}</p>}
      <h1 className="font-display text-title font-light text-porcelain">{title}</h1>
      {subtitle && <p className="mt-3 max-w-md text-sm leading-relaxed text-mercury">{subtitle}</p>}
    </header>
  )
}

export function Divider({ label }) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-px flex-1 bg-seam" />
      {label && <span className="spec text-faint">{label}</span>}
      <div className="h-px flex-1 bg-seam" />
    </div>
  )
}
