// The Second Opinion — upload a mirror shot, get honest notes.
// The score is a red thread that wraps an arc to the mark.
import { useEffect, useRef, useState } from 'react'
import { outfitsAPI } from '../api'
import { Button, Panel, Input, Label, ErrorNote, Spinner } from '../components/ui'
import { StitchLoader } from '../components/Thread'
import { CameraIcon } from '../components/Icons'
import { anime, motionOK, EASE } from '../lib/motion'

const FEEDBACK_NOTES = [
  'Studying the photograph…',
  'Reading color against skin tone…',
  'Judging the fit, honestly…',
  'Noting what already works…',
  'Writing the verdict…',
]

/** Score 0–10 drawn as a thread arc with a counting number. */
function ScoreArc({ score }) {
  const arcRef = useRef(null)
  const numRef = useRef(null)
  const R = 40
  const C = 2 * Math.PI * R
  const frac = Math.max(0, Math.min(1, (score ?? 0) / 10))

  useEffect(() => {
    const arc = arcRef.current
    const num = numRef.current
    if (!arc || !num) return
    if (!motionOK()) {
      arc.style.strokeDashoffset = C * (1 - frac)
      num.textContent = score
      return
    }
    arc.style.strokeDashoffset = C
    const counter = { v: 0 }
    const a1 = anime({
      targets: arc,
      strokeDashoffset: [C, C * (1 - frac)],
      duration: 1200,
      easing: EASE.draw,
    })
    const a2 = anime({
      targets: counter,
      v: score,
      round: 10,
      duration: 1200,
      easing: EASE.draw,
      update: () => { num.textContent = counter.v.toFixed(1).replace(/\.0$/, '') },
    })
    return () => { a1.pause(); a2.pause() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score])

  return (
    <div className="relative h-28 w-28 flex-shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={R} fill="none" stroke="var(--color-seam)" strokeWidth="2" />
        <circle
          ref={arcRef}
          cx="50" cy="50" r={R}
          fill="none"
          stroke="var(--color-lacquer)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span ref={numRef} className="font-display text-3xl font-light text-porcelain">0</span>
        <span className="spec text-faint">/ 10</span>
      </div>
    </div>
  )
}

export default function FeedbackPage() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [occasion, setOccasion] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef()
  const resultRef = useRef(null)

  const onFile = (f) => {
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setResult(null)
  }

  const onDrop = (e) => {
    e.preventDefault()
    onFile(e.dataTransfer.files[0])
  }

  const submit = async () => {
    if (!file || !occasion || loading) return
    setError('')
    setLoading(true)
    setResult(null)
    try {
      const res = await outfitsAPI.photoFeedback(file, occasion)
      setResult(res.data.feedback)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to analyze the photo')
    } finally {
      setLoading(false)
    }
  }

  // Reveal the verdict sections in sequence.
  useEffect(() => {
    const root = resultRef.current
    if (!result || !root || !motionOK()) return
    const blocks = root.querySelectorAll('.verdict-block')
    anime.set(blocks, { opacity: 0, translateY: 12 })
    const anim = anime({
      targets: blocks,
      opacity: [0, 1],
      translateY: [12, 0],
      duration: 500,
      delay: anime.stagger(110),
      easing: EASE.out,
    })
    return () => anim.pause()
  }, [result])

  return (
    <div className="mx-auto max-w-3xl p-5 sm:p-8 md:p-12">
      <div className="mb-10 animate-fade-up md:mb-12">
        <p className="spec mb-3 text-lacquer">The second opinion</p>
        <h1 className="font-display text-title font-light text-porcelain">How does this look?</h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-mercury">
          A mirror shot before you walk out the door. The verdict is specific — and honest.
        </p>
      </div>

      <div className="mb-10 grid gap-5 md:grid-cols-5 md:gap-6">
        {/* Upload zone */}
        <div className="md:col-span-3">
          <div
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => inputRef.current.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && inputRef.current.click()}
            className="relative min-h-[300px] cursor-pointer overflow-hidden rounded-xl border border-dashed border-seam-strong bg-graphite transition-colors hover:border-lacquer-dim"
          >
            {preview ? (
              <img src={preview} alt="Your outfit" className="h-full min-h-[300px] w-full object-cover" />
            ) : (
              <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
                <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-seam-strong text-mercury">
                  <CameraIcon className="h-6 w-6" />
                </span>
                <p className="text-sm text-mercury">Drop your photo here</p>
                <p className="spec mt-2 text-faint">or tap to browse</p>
              </div>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*,.heic"
              className="hidden"
              onChange={(e) => onFile(e.target.files[0])}
            />
          </div>
          {preview && (
            <button
              onClick={() => { setFile(null); setPreview(null); setResult(null) }}
              className="spec mt-3 text-faint transition-colors hover:text-mercury"
            >
              Remove photo
            </button>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4 md:col-span-2">
          <div>
            <Label>The occasion</Label>
            <Input
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              placeholder="e.g. job interview"
            />
          </div>

          <ErrorNote>{error}</ErrorNote>

          <Button
            variant="primary"
            onClick={submit}
            disabled={loading || !file || !occasion}
            className="w-full md:mt-auto"
          >
            {loading ? <>Reviewing <Spinner /></> : 'Ask for the verdict'}
          </Button>
        </div>
      </div>

      {loading && (
        <Panel className="p-2">
          <StitchLoader label="Your stylist is looking" notes={FEEDBACK_NOTES} />
        </Panel>
      )}

      {!loading && result && (
        <Panel className="p-6 md:p-8" >
          <div ref={resultRef}>
            <div className="verdict-block flex flex-wrap items-center justify-between gap-6 border-b border-seam pb-6">
              <div>
                <p className="spec text-lacquer">The verdict</p>
                <h2 className="mt-2 font-display text-h3 font-light capitalize text-porcelain">
                  For {occasion}
                </h2>
              </div>
              {result.overall_score != null && <ScoreArc score={result.overall_score} />}
            </div>

            <div className="mt-6 space-y-6">
              {result.color_match && (
                <div className="verdict-block">
                  <span className="spec text-faint">Color</span>
                  <p className="mt-2 border-l border-seam pl-4 text-sm leading-relaxed text-mercury">
                    {result.color_match}
                  </p>
                </div>
              )}
              {result.fit_assessment && (
                <div className="verdict-block">
                  <span className="spec text-faint">Fit</span>
                  <p className="mt-2 border-l border-seam pl-4 text-sm leading-relaxed text-mercury">
                    {result.fit_assessment}
                  </p>
                </div>
              )}

              <div className="grid gap-6 sm:grid-cols-2">
                {result.strengths?.length > 0 && (
                  <div className="verdict-block">
                    <span className="spec text-porcelain">What works</span>
                    <ul className="mt-3 space-y-2.5">
                      {result.strengths.map((s, i) => (
                        <li key={i} className="flex gap-3 text-sm leading-relaxed text-mercury">
                          <span className="mt-0.5 font-mono text-xs text-porcelain">+</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.improvements?.length > 0 && (
                  <div className="verdict-block">
                    <span className="spec text-lacquer-bright">What to change</span>
                    <ul className="mt-3 space-y-2.5">
                      {result.improvements.map((s, i) => (
                        <li key={i} className="flex gap-3 text-sm leading-relaxed text-mercury">
                          <span className="mt-0.5 font-mono text-xs text-lacquer-bright">→</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Panel>
      )}
    </div>
  )
}
