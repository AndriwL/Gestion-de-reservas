import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <div className="flex flex-col items-center gap-3 text-ink-400">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-100 border-t-amber" />
          <p className="text-sm">Verificando sesión…</p>
        </div>
      </div>
    )
  }

  if (!session) return <Navigate to="/login" replace />

  return <Outlet />
}
