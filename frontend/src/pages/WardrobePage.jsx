// The Wardrobe Ledger — one photo in, every item cataloged like a spec sheet.
import { useEffect, useRef, useState } from 'react'
import { wardrobeAPI } from '../api'
import { Button, Panel, ErrorNote, Spinner, Divider } from '../components/ui'
import { StitchLoader } from '../components/Thread'
import { WardrobeIcon } from '../components/Icons'
import { anime, motionOK, EASE } from '../lib/motion'

const WARDROBE_NOTES = [
  'Laying everything on the table…',
  'Identifying each piece…',
  'Reading fabric and fit…',
  'Writing the ledger entries…',
]

export default function WardrobePage() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef()
  const gridRef = useRef(null)

  const onFile = (f) => {
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setItems([])
  }

  const analyze = async () => {
    if (!file || loading) return
    setError('')
    setLoading(true)
    try {
      const res = await wardrobeAPI.analyzePhoto(file)
      setItems(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to analyze the photo')
    } finally {
      setLoading(false)
    }
  }

  // Ledger entries stagger in once cataloged.
  useEffect(() => {
    if (!items.length || !motionOK() || !gridRef.current) return
    const cards = gridRef.current.querySelectorAll('.ledger-item')
    anime.set(cards, { opacity: 0, translateY: 14 })
    const anim = anime({
      targets: cards,
      opacity: [0, 1],
      translateY: [14, 0],
      duration: 480,
      delay: anime.stagger(70),
      easing: EASE.out,
    })
    return () => anim.pause()
  }, [items])

  return (
    <div className="mx-auto max-w-3xl p-5 sm:p-8 md:p-12">
      <div className="mb-10 animate-fade-up md:mb-12">
        <p className="spec mb-3 text-lacquer">The wardrobe ledger</p>
        <h1 className="font-display text-title font-light text-porcelain">What you already own</h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-mercury">
          One photo — every piece identified and entered into the ledger. No forms.
        </p>
      </div>

      <Panel className="mb-10 p-5 md:p-7">
        <div
          onClick={() => inputRef.current.click()}
          onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files[0]) }}
          onDragOver={(e) => e.preventDefault()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current.click()}
          className="mb-5 min-h-[220px] cursor-pointer overflow-hidden rounded-lg border border-dashed border-seam-strong bg-raise transition-colors hover:border-lacquer-dim"
        >
          {preview ? (
            <img src={preview} alt="Your clothing" className="max-h-80 w-full object-cover" />
          ) : (
            <div className="flex min-h-[220px] flex-col items-center justify-center p-8 text-center">
              <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-seam-strong text-mercury">
                <WardrobeIcon className="h-6 w-6" />
              </span>
              <p className="text-sm text-mercury">Drop a photo of your clothing</p>
              <p className="spec mt-2 text-faint">JPEG · PNG · HEIC</p>
            </div>
          )}
        </div>
        <input ref={inputRef} type="file" accept="image/*,.heic" className="hidden" onChange={(e) => onFile(e.target.files[0])} />

        {error && <div className="mb-4"><ErrorNote>{error}</ErrorNote></div>}

        <div className="flex gap-3">
          {preview && (
            <Button variant="ghost" onClick={() => { setFile(null); setPreview(null); setItems([]) }}>
              Clear
            </Button>
          )}
          <Button variant="primary" onClick={analyze} disabled={loading || !file} className="flex-1">
            {loading ? <>Cataloging <Spinner /></> : 'Catalog the items'}
          </Button>
        </div>
      </Panel>

      {loading && (
        <Panel className="p-2">
          <StitchLoader label="Entering the ledger" notes={WARDROBE_NOTES} />
        </Panel>
      )}

      {!loading && items.length > 0 && (
        <div className="space-y-6">
          <Divider label={`${items.length} ${items.length === 1 ? 'entry' : 'entries'}`} />
          <div ref={gridRef} className="grid gap-3 sm:grid-cols-2">
            {items.map((item, i) => (
              <Panel key={item.id ?? i} className="ledger-item p-5 transition-shadow hover:shadow-lift">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <span className="font-mono text-[10px] text-lacquer">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="spec rounded-md border border-seam px-2 py-1 text-mercury">
                    {item.category}
                  </span>
                </div>
                <h3 className="font-display text-lg font-light text-porcelain">{item.item}</h3>
                <dl className="mt-4 space-y-2 border-t border-seam pt-4">
                  {[['Color', item.color], ['Material', item.material], ['Fit', item.fit]]
                    .filter(([, v]) => v)
                    .map(([k, v]) => (
                      <div key={k} className="flex gap-3 text-xs">
                        <dt className="spec w-20 flex-shrink-0 text-faint">{k}</dt>
                        <dd className="font-mono text-mercury">{v}</dd>
                      </div>
                    ))}
                </dl>
              </Panel>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
