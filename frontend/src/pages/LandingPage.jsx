import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { Logo, Button } from '../components/ui'
import { ThreadRule } from '../components/Thread'
import { ArrowRightIcon } from '../components/Icons'
import { anime, motionOK, primePath, EASE } from '../lib/motion'

const SERVICES = [
  {
    n: '01',
    title: 'The consultation',
    text: 'Name the occasion and the mood. Your stylist composes a complete look — top to accessory — with the reasoning behind every piece and where to find it.',
  },
  {
    n: '02',
    title: 'The second opinion',
    text: 'A mirror shot before you leave the house. You get a score and specific, honest notes on color, fit, and what to change.',
  },
  {
    n: '03',
    title: 'The wardrobe ledger',
    text: 'One photo of your clothes and every item is identified — color, material, fit — cataloged without a single form field.',
  },
]

const SAMPLE_LOOK = [
  ['Top', 'Camel wool overshirt'],
  ['Bottom', 'Charcoal pleated trouser'],
  ['Shoes', 'Ivory leather sneaker'],
  ['Accessory', 'Tonal knit scarf'],
]

export default function LandingPage() {
  const { isAuth } = useAuth()
  const cta = isAuth ? '/app' : '/auth'
  const rootRef = useRef(null)
  const underlineRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root || !motionOK()) return

    const lines = root.querySelectorAll('.g-line-inner')
    const reveals = root.querySelectorAll('.hero-reveal')
    const underline = underlineRef.current

    anime.set(lines, { translateY: '110%' })
    anime.set(reveals, { opacity: 0, translateY: 16 })
    if (underline) primePath(underline)

    const tl = anime.timeline({ easing: EASE.out })
    tl.add({
      targets: lines,
      translateY: ['110%', '0%'],
      duration: 760,
      delay: anime.stagger(140),
    })
    if (underline) {
      tl.add(
        { targets: underline, strokeDashoffset: [anime.setDashoffset, 0], duration: 820, easing: EASE.draw },
        '-=400'
      )
    }
    tl.add(
      { targets: reveals, opacity: [0, 1], translateY: [16, 0], duration: 560, delay: anime.stagger(100) },
      '-=520'
    )

    return () => tl.pause()
  }, [])

  return (
    <div ref={rootRef} className="min-h-screen bg-ink">
      {/* Nav */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <div className="flex items-center gap-4">
          {!isAuth && (
            <Link to="/auth" className="hidden text-sm text-mercury transition-colors hover:text-porcelain sm:block">
              Sign in
            </Link>
          )}
          <Link to={cta}>
            <Button variant="outline" className="!px-5 !py-2.5">{isAuth ? 'Open the atelier' : 'Get started'}</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-16 md:pt-24">
        <p className="hero-reveal spec text-lacquer">The digital atelier</p>
        <h1 className="mt-6 max-w-4xl font-display text-display font-light text-porcelain">
          <span className="block overflow-hidden">
            <span className="g-line-inner block">A personal stylist,</span>
          </span>
          <span className="block overflow-hidden">
            <span className="g-line-inner block">
              <em>considered</em> <span className="text-mercury">— not generated.</span>
            </span>
          </span>
        </h1>
        <svg className="mt-6 block h-3 w-56" viewBox="0 0 220 12" fill="none" preserveAspectRatio="none" aria-hidden="true">
          <path
            ref={underlineRef}
            d="M2 8 C 40 2, 75 11, 112 6 S 185 4, 218 7"
            stroke="var(--color-lacquer)"
            strokeWidth="2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <p className="hero-reveal mt-8 max-w-xl text-base leading-relaxed text-mercury md:text-lg">
          Elegante studies your body, your budget, and the moment you're dressing for —
          then presents a complete look with the reasoning a stylist would give you in the room.
        </p>
        <div className="hero-reveal mt-10 flex flex-col gap-3 sm:flex-row">
          <Link to={cta}>
            <Button variant="primary" className="w-full sm:w-auto">
              Book your first fitting <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </Link>
          <a href="#services">
            <Button variant="outline" className="w-full sm:w-auto">The services</Button>
          </a>
        </div>

        {/* Sample look — a miniature of the signature sheet */}
        <div className="hero-reveal mt-20 max-w-2xl rounded-xl border border-seam bg-graphite p-6 shadow-panel sm:p-8">
          <div className="mb-6 flex items-baseline justify-between border-b border-seam pb-4">
            <div>
              <p className="spec text-lacquer">The look</p>
              <p className="mt-1 font-display text-h3 font-light text-porcelain">
                Weekend <em className="text-mercury">· relaxed</em>
              </p>
            </div>
            <span className="font-mono text-xs text-faint">preview</span>
          </div>
          <ul className="space-y-4">
            {SAMPLE_LOOK.map(([part, item], i) => (
              <li key={part} className="flex items-baseline gap-4">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-seam-strong font-mono text-[10px] text-porcelain">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="spec w-20 flex-shrink-0 text-faint">{part}</span>
                <span className="font-display text-base font-light text-porcelain">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="border-t border-seam">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <ThreadRule label="The services" className="mb-14" />
          <div className="grid gap-12 md:grid-cols-3 md:gap-10">
            {SERVICES.map(({ n, title, text }) => (
              <div key={n}>
                <span className="font-mono text-sm text-lacquer">{n}</span>
                <h3 className="mt-4 font-display text-h3 font-light text-porcelain">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mercury">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-seam px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-title font-light text-porcelain">
            Never wonder <em className="text-lacquer-bright">"what should I wear?"</em> again.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-mercury md:text-base">
            Your first consultation takes under three minutes — measurements included.
          </p>
          <Link to={cta} className="mt-9 inline-block">
            <Button variant="primary">
              Enter the atelier <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-seam">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <Logo className="!text-base" />
          <p className="spec text-faint">© 2026 Elegante · le fil rouge</p>
        </div>
      </footer>
    </div>
  )
}
