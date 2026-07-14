import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-[#edf7f8]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-x-hidden bg-[radial-gradient(circle_at_top_right,_rgba(103,232,249,0.28),_transparent_30%),linear-gradient(135deg,_#f6fbfc_0%,_#eaf5f6_100%)] px-4 py-6 sm:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
