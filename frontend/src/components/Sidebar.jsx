import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { Logo } from './ui'
import { SparkleIcon, CameraIcon, WardrobeIcon, ClockIcon, LogoutIcon } from './Icons'

export const NAV_LINKS = [
  { to: '/app', label: 'Consultation', icon: SparkleIcon, exact: true },
  { to: '/app/feedback', label: 'Second opinion', icon: CameraIcon },
  { to: '/app/wardrobe', label: 'Wardrobe', icon: WardrobeIcon },
  { to: '/app/history', label: 'Lookbook', icon: ClockIcon },
]

// Desktop sidebar — a quiet atelier rail. Active item carries the red thread.
export default function Sidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-60 flex-shrink-0 flex-col border-r border-seam bg-ink md:flex">
      <div className="border-b border-seam p-6">
        <Link to="/"><Logo /></Link>
        <p className="spec mt-1.5 text-faint">The digital atelier</p>
      </div>

      <nav className="flex-1 space-y-0.5 p-4">
        {NAV_LINKS.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-graphite font-medium text-porcelain'
                  : 'text-mercury hover:bg-graphite/60 hover:text-porcelain'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* the thread — active marker */}
                <span
                  className={`absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-lacquer transition-opacity ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                <Icon className="h-[18px] w-[18px]" />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-seam p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm text-faint transition-colors hover:bg-graphite/60 hover:text-mercury"
        >
          <LogoutIcon className="h-[18px] w-[18px]" />
          Sign out
        </button>
      </div>
    </aside>
  )
}

// Mobile bottom navigation
export function MobileNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 border-t border-seam bg-ink/95 backdrop-blur md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="grid grid-cols-4">
        {NAV_LINKS.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-1 py-2.5 text-[10px] tracking-wide transition-colors ${
                isActive ? 'font-medium text-porcelain' : 'text-faint'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`absolute top-0 h-0.5 w-6 rounded-full bg-lacquer transition-opacity ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                <Icon className="h-5 w-5" />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

// Mobile top bar
export function MobileTopBar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-seam bg-ink/95 px-5 py-3.5 backdrop-blur md:hidden">
      <Link to="/"><Logo className="!text-lg" /></Link>
      <button
        onClick={() => { logout(); navigate('/') }}
        className="flex items-center gap-1.5 text-xs text-faint transition-colors hover:text-mercury"
      >
        <LogoutIcon className="h-4 w-4" />
        Sign out
      </button>
    </header>
  )
}
