import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../api'
import { useAuth } from '../AuthContext'
import { Logo, Button, Input, Label, ErrorNote, Spinner } from '../components/ui'
import { ThreadUnderline } from '../components/Thread'

const PERKS = [
  'A complete look, reasoned piece by piece',
  'Honest photo feedback before you walk out',
  'A wardrobe that catalogs itself from photos',
]

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const fn = mode === 'login' ? authAPI.login : authAPI.register
      const res = await fn(email, password)
      login(res.data.access_token)
      navigate(mode === 'register' ? '/setup' : '/app')
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-ink">
      {/* Left — the atelier statement */}
      <div className="hidden w-1/2 flex-col justify-between border-r border-seam p-14 lg:flex">
        <Link to="/"><Logo /></Link>
        <div>
          <p className="spec text-lacquer">The digital atelier</p>
          <h1 className="mt-5 font-display text-display font-light text-porcelain">
            A stylist who
            <br />
            <em>knows you.</em>
          </h1>
          <ThreadUnderline className="mt-5 h-3 w-48" />
          <p className="mt-8 max-w-sm text-base leading-relaxed text-mercury">
            Elegante is a private styling consultation — built around your body,
            your budget, and the moment you're dressing for.
          </p>
          <ul className="mt-10 space-y-4">
            {PERKS.map((f, i) => (
              <li key={f} className="flex items-baseline gap-4">
                <span className="font-mono text-[11px] text-lacquer">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-sm text-mercury">{f}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="spec text-faint">© 2026 Elegante</p>
      </div>

      {/* Right — the form */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="mb-10 text-center lg:hidden">
            <Link to="/"><Logo /></Link>
          </div>

          <p className="spec text-faint">{mode === 'login' ? 'Returning client' : 'New client'}</p>
          <h2 className="mt-2 font-display text-title font-light text-porcelain">
            {mode === 'login' ? 'Welcome back' : 'Book your first fitting'}
          </h2>
          <p className="mb-9 mt-3 text-sm text-mercury">
            {mode === 'login'
              ? 'Sign in to open your atelier.'
              : 'An account takes a minute. The style takes a lifetime.'}
          </p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                placeholder="••••••••"
              />
            </div>

            <ErrorNote>{error}</ErrorNote>

            <Button type="submit" variant="primary" disabled={loading} className="mt-2 w-full">
              {loading ? <>Please wait <Spinner /></> : mode === 'login' ? 'Sign in' : 'Create account'}
            </Button>
          </form>

          <p className="mt-7 text-center text-sm text-mercury">
            {mode === 'login' ? 'New to the atelier?' : 'Already a client?'}{' '}
            <button
              type="button"
              onClick={() => { setMode((m) => (m === 'login' ? 'register' : 'login')); setError('') }}
              className="font-medium text-lacquer-bright transition-colors hover:text-lacquer"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>

          <p className="mt-10 text-center text-xs text-faint">
            <Link to="/" className="transition-colors hover:text-mercury">← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
