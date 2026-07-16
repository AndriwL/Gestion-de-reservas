import { useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { X } from 'lucide-react'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Topbar } from '@/components/dashboard/Topbar'
import { useAuth } from '@/context/AuthContext'

export function DashboardLayout() {
  const { session, loading } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (loading) {
    return (
      <div className="grid h-screen place-items-center bg-white text-slate-500">
        Cargando…
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-64">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
          <button
            className="flex-1 bg-ink-950/50"
            aria-label="Cerrar menú"
            onClick={() => setMobileOpen(false)}
          >
            <X className="m-4 text-white" size={22} />
          </button>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
        <footer className="border-t border-slate-100 bg-white px-8 py-4 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Transportes GAL — Panel administrativo
        </footer>
      </div>
    </div>
  )
}
