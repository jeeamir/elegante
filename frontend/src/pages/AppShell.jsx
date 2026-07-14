import { Outlet } from 'react-router-dom'
import Sidebar, { MobileNav, MobileTopBar } from '../components/Sidebar'

export default function AppShell() {
  return (
    <div className="flex min-h-screen bg-ink">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopBar />
        <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
