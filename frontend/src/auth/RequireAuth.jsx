import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext.jsx'

export default function RequireAuth() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-[13px] text-[var(--text-3)]">Loading…</div>
  }

  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />
  }

  return <Outlet />
}
