// Onboarding — "Measurements". Three fittings, joined by a thread that
// fills as the client progresses.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { profileAPI } from '../api'
import { Logo, Button, Chip, Panel, Input, Select, Label, ErrorNote, Spinner } from '../components/ui'
import { CheckIcon } from '../components/Icons'

const STEPS = ['Basics', 'Measurements', 'Taste']

const BODY_TYPES = ['Slim', 'Athletic', 'Average', 'Stocky', 'Plus']
const LIFESTYLES = ['Office', 'Creative', 'Active', 'Student', 'Entrepreneur', 'Remote']
const STYLES = ['Minimalist', 'Classic', 'Streetwear', 'Smart Casual', 'Business', 'Bohemian', 'Techwear']
const COLORS = ['Black', 'White', 'Navy', 'Grey', 'Beige', 'Brown', 'Olive', 'Burgundy', 'Blue', 'Green', 'Red', 'Yellow']
const SHOPS = ['Zara', 'H&M', 'Uniqlo', 'COS', 'Massimo Dutti', 'ASOS', 'Arket', 'Pull&Bear', 'Mango', 'Other']

export default function ProfileSetupPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: '',
    gender: 'male',
    weight: '',
    weight_unit: 'KG',
    height: '',
    height_unit: 'cm',
    shoe_size: '',
    shoe_size_system: 'EU',
    body_type: '',
    lifestyle: '',
    budget: '',
    currency: 'USD',
    preferred_style: '',
    favourite_colors: [],
    favourite_shops: [],
  })

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const toggleList = (k, v) =>
    setForm((f) => ({
      ...f,
      [k]: f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v],
    }))

  const submit = async () => {
    setError('')
    setLoading(true)
    try {
      await profileAPI.create({
        ...form,
        weight: Number(form.weight),
        height: Number(form.height),
        shoe_size: Number(form.shoe_size),
        budget: Number(form.budget),
      })
      navigate('/app')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink p-4 sm:p-6">
      <div className="w-full max-w-lg animate-fade-up py-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <Logo />
          <p className="spec mt-4 text-lacquer">First fitting</p>
          <h1 className="mt-2 font-display text-title font-light text-porcelain">
            Your measurements
          </h1>
          <p className="mt-3 text-sm text-mercury">
            A stylist can't work blind — this tailors every recommendation to you.
          </p>
        </div>

        {/* Thread stepper */}
        <div className="mx-auto mb-10 flex max-w-xs items-center">
          {STEPS.map((s, i) => (
            <div key={s} className={`flex items-center ${i > 0 ? 'flex-1' : ''}`}>
              {i > 0 && (
                <div className="relative mx-2 h-px flex-1 bg-seam">
                  <div
                    className="absolute inset-y-0 left-0 bg-lacquer transition-all duration-500"
                    style={{ width: i <= step ? '100%' : '0%' }}
                  />
                </div>
              )}
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border font-mono text-[11px] transition-colors duration-300 ${
                    i < step
                      ? 'border-lacquer bg-lacquer text-[#fbf9f4]'
                      : i === step
                        ? 'border-lacquer text-lacquer-bright'
                        : 'border-seam text-faint'
                  }`}
                >
                  {i < step ? <CheckIcon className="h-3.5 w-3.5" /> : String(i + 1).padStart(2, '0')}
                </div>
                <span className={`spec hidden sm:block ${i === step ? 'text-porcelain' : 'text-faint'}`}>
                  {s}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Card */}
        <Panel className="p-6 sm:p-8">
          <div key={step} className="animate-fade-up">
            {step === 0 && (
              <div className="space-y-5">
                <h3 className="mb-6 font-display text-h3 font-light text-porcelain">The basics</h3>
                <div>
                  <Label>Your name</Label>
                  <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Alex" />
                </div>
                <div>
                  <Label>Gender</Label>
                  <div className="flex gap-2">
                    {['male', 'female', 'non-binary'].map((g) => (
                      <Chip key={g} active={form.gender === g} onClick={() => set('gender', g)} className="flex-1">
                        {g}
                      </Chip>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Budget</Label>
                    <Input type="number" value={form.budget} onChange={(e) => set('budget', e.target.value)} placeholder="200" />
                  </div>
                  <div>
                    <Label>Currency</Label>
                    <Select value={form.currency} onChange={(e) => set('currency', e.target.value)}>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="KZT">KZT</option>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <h3 className="mb-6 font-display text-h3 font-light text-porcelain">Measurements</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Height</Label>
                    <Input type="number" value={form.height} onChange={(e) => set('height', e.target.value)} placeholder="180" />
                  </div>
                  <div>
                    <Label>Unit</Label>
                    <Select value={form.height_unit} onChange={(e) => set('height_unit', e.target.value)}>
                      <option value="cm">cm</option>
                      <option value="ft_in">ft/in</option>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Weight</Label>
                    <Input type="number" value={form.weight} onChange={(e) => set('weight', e.target.value)} placeholder="75" />
                  </div>
                  <div>
                    <Label>Unit</Label>
                    <Select value={form.weight_unit} onChange={(e) => set('weight_unit', e.target.value)}>
                      <option value="KG">kg</option>
                      <option value="lb">lb</option>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Shoe size</Label>
                    <Input type="number" value={form.shoe_size} onChange={(e) => set('shoe_size', e.target.value)} placeholder="43" />
                  </div>
                  <div>
                    <Label>System</Label>
                    <Select value={form.shoe_size_system} onChange={(e) => set('shoe_size_system', e.target.value)}>
                      <option value="EU">EU</option>
                      <option value="US">US</option>
                      <option value="UK">UK</option>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Body type</Label>
                  <div className="flex flex-wrap gap-2">
                    {BODY_TYPES.map((b) => (
                      <Chip key={b} active={form.body_type === b} onClick={() => set('body_type', b)}>
                        {b}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <h3 className="mb-6 font-display text-h3 font-light text-porcelain">Your taste</h3>
                <div>
                  <Label>Lifestyle</Label>
                  <div className="flex flex-wrap gap-2">
                    {LIFESTYLES.map((l) => (
                      <Chip key={l} active={form.lifestyle === l} onClick={() => set('lifestyle', l)}>
                        {l}
                      </Chip>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Preferred style</Label>
                  <div className="flex flex-wrap gap-2">
                    {STYLES.map((s) => (
                      <Chip key={s} active={form.preferred_style === s} onClick={() => set('preferred_style', s)}>
                        {s}
                      </Chip>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Favourite colors</Label>
                  <div className="flex flex-wrap gap-2">
                    {COLORS.map((c) => (
                      <Chip key={c} active={form.favourite_colors.includes(c)} onClick={() => toggleList('favourite_colors', c)} className="!px-2.5 !py-1.5">
                        {c}
                      </Chip>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Favourite shops</Label>
                  <div className="flex flex-wrap gap-2">
                    {SHOPS.map((s) => (
                      <Chip key={s} active={form.favourite_shops.includes(s)} onClick={() => toggleList('favourite_shops', s)} className="!px-2.5 !py-1.5">
                        {s}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {error && <div className="mt-4"><ErrorNote>{error}</ErrorNote></div>}

          <div className="mt-8 flex justify-between">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 0}
              className={step === 0 ? 'invisible' : ''}
            >
              Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button variant="outline" onClick={() => setStep((s) => s + 1)}>Continue</Button>
            ) : (
              <Button variant="primary" onClick={submit} disabled={loading}>
                {loading ? <>Saving <Spinner /></> : 'Enter the atelier'}
              </Button>
            )}
          </div>
        </Panel>
      </div>
    </div>
  )
}
