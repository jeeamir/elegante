// Dashboard — "The Consultation Desk".
// Left: the brief (occasion, mood, the ask). Right: the canvas where the
// look is composed. One orchestrated load sequence; a stitching thread
// while the stylist considers; the Look sheet as the payoff.
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { outfitsAPI } from '../api'
import { Button, Chip, Panel, Input, Label, ErrorNote, Spinner } from '../components/ui'
import { StitchLoader } from '../components/Thread'
import LookSheet from '../components/LookSheet'
import { anime, motionOK, primePath, EASE } from '../lib/motion'

const OCCASIONS = ['Work', 'Casual', 'Date', 'Formal', 'Gym', 'Party', 'Travel', 'Weekend']
const MOODS = ['Confident', 'Relaxed', 'Creative', 'Professional', 'Bold', 'Minimal']

const greeting = () => {
  const h = new Date().getHours()
  if (h < 5) return 'Good evening'
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function OutfitPage() {
  const [occasion, setOccasion] = useState('')
  const [customOccasion, setCustomOccasion] = useState('')
  const [mood, setMood] = useState('')
  const [result, setResult] = useState(null)
  const [asked, setAsked] = useState({ occasion: '', mood: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [needsProfile, setNeedsProfile] = useState(false)

  const rootRef = useRef(null)
  const underlineRef = useRef(null)

  // ——— Page-load sequence: greeting rises, the thread underlines it,
  //     the brief settles in, chips stagger. Then the page is still. ———
  useEffect(() => {
    const root = rootRef.current
    if (!root || !motionOK()) return

    const lines = root.querySelectorAll('.g-line-inner')
    const reveals = root.querySelectorAll('.load-reveal')
    const chips = root.querySelectorAll('.brief-chip')
    const underline = underlineRef.current

    anime.set(lines, { translateY: '110%' })
    anime.set(reveals, { opacity: 0, translateY: 14 })
    anime.set(chips, { opacity: 0, translateY: 8 })
    if (underline) primePath(underline)

    const tl = anime.timeline({ easing: EASE.out })
    tl.add({
      targets: lines,
      translateY: ['110%', '0%'],
      duration: 720,
      delay: anime.stagger(130),
    })
    if (underline) {
      tl.add(
        {
          targets: underline,
          strokeDashoffset: [anime.setDashoffset, 0],
          duration: 780,
          easing: EASE.draw,
        },
        '-=380'
      )
    }
    tl.add(
      {
        targets: reveals,
        opacity: [0, 1],
        translateY: [14, 0],
        duration: 560,
        delay: anime.stagger(90),
      },
      '-=520'
    )
    tl.add(
      {
        targets: chips,
        opacity: [0, 1],
        translateY: [8, 0],
        duration: 380,
        delay: anime.stagger(26),
      },
      '-=480'
    )

    return () => tl.pause()
  }, [])

  const generate = async () => {
    const occ = occasion || customOccasion.trim()
    if (!occ || loading) return
    setError('')
    setNeedsProfile(false)
    setLoading(true)
    setResult(null)
    try {
      const res = await outfitsAPI.generate(occ, mood || undefined)
      setAsked({ occasion: occ, mood })
      setResult(res.data.result)
    } catch (err) {
      if (err.response?.status === 404) {
        setNeedsProfile(true)
      } else {
        setError(err.response?.data?.detail || 'The stylist stepped away. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div ref={rootRef} className="mx-auto max-w-6xl p-5 sm:p-8 lg:p-12">
      <div className="grid gap-10 lg:grid-cols-[minmax(300px,5fr)_7fr] lg:gap-14">
        {/* ————— The Brief ————— */}
        <div className="lg:sticky lg:top-12 lg:self-start">
          <header className="mb-8">
            <h1 className="font-display text-display font-light text-porcelain">
              <span className="block overflow-hidden">
                <span className="g-line-inner block">{greeting()}.</span>
              </span>
              <span className="block overflow-hidden">
                <span className="g-line-inner block text-mercury">
                  What are we <em className="text-porcelain">dressing for?</em>
                </span>
              </span>
            </h1>
            <svg
              className="mt-4 block h-3 w-44"
              viewBox="0 0 220 12"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                ref={underlineRef}
                d="M2 8 C 40 2, 75 11, 112 6 S 185 4, 218 7"
                stroke="var(--color-lacquer)"
                strokeWidth="2"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </header>

          <Panel className="load-reveal p-5 sm:p-6">
            <div className="mb-6">
              <Label>The occasion</Label>
              <div className="mb-3 flex flex-wrap gap-2">
                {OCCASIONS.map((o) => (
                  <Chip
                    key={o}
                    className="brief-chip"
                    active={occasion === o}
                    onClick={() => { setOccasion(o); setCustomOccasion('') }}
                  >
                    {o}
                  </Chip>
                ))}
              </div>
              <Input
                value={customOccasion}
                onChange={(e) => { setCustomOccasion(e.target.value); setOccasion('') }}
                placeholder="Or describe it — 'gallery opening', 'first day'…"
              />
            </div>

            <div className="mb-7">
              <Label hint="optional">The mood</Label>
              <div className="flex flex-wrap gap-2">
                {MOODS.map((m) => (
                  <Chip
                    key={m}
                    className="brief-chip"
                    active={mood === m}
                    onClick={() => setMood((prev) => (prev === m ? '' : m))}
                  >
                    {m}
                  </Chip>
                ))}
              </div>
            </div>

            {error && <div className="mb-4"><ErrorNote>{error}</ErrorNote></div>}
            {needsProfile && (
              <div className="mb-4 rounded-lg border border-seam bg-raise px-4 py-3 text-sm text-mercury">
                The stylist needs your measurements first.{' '}
                <Link to="/setup" className="text-lacquer-bright underline underline-offset-2 hover:text-lacquer">
                  Complete your profile
                </Link>
              </div>
            )}

            <Button
              variant="primary"
              onClick={generate}
              disabled={loading || (!occasion && !customOccasion.trim())}
              className="w-full"
            >
              {loading ? <>Consulting <Spinner /></> : 'Consult the stylist'}
            </Button>
          </Panel>

          <p className="load-reveal spec mt-4 text-center text-faint lg:text-left">
            Tailored to your profile · saved to your lookbook
          </p>
        </div>

        {/* ————— The Canvas ————— */}
        <div className="load-reveal min-h-[420px] lg:border-l lg:border-seam lg:pl-14">
          {loading && <StitchLoader />}

          {!loading && result && (
            <LookSheet result={result} occasion={asked.occasion} mood={asked.mood} />
          )}

          {!loading && !result && (
            <div className="flex h-full min-h-[420px] flex-col items-center justify-center text-center">
              <span className="font-display text-7xl font-light text-seam-strong">E<span className="text-lacquer-dim">.</span></span>
              <p className="spec mt-6 text-faint">The atelier is open</p>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-mercury">
                Give your stylist an occasion and the look will be composed here — piece by piece.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
