import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

export function RequireAuth(props: { children: ReactNode }) {
  const user = useAppStore((s) => s.user)
  const bootstrapped = useAppStore((s) => s.bootstrapped)
  const location = useLocation()
  if (!bootstrapped) {
    return (
      <div className="min-h-screen kb-grid kb-page flex items-center justify-center">
        <div className="kb-glass rounded-xl px-4 py-3 text-sm text-white/80 border border-white/10">Loading your workspace...</div>
      </div>
    )
  }
  if (!user) return <Navigate to="/auth" replace state={{ from: location.pathname }} />
  return <>{props.children}</>
}
