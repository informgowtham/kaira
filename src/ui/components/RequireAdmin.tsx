import type { ReactNode } from 'react'
import { Navigate, Link, useLocation } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { Button } from './Button'

export function RequireAdmin(props: { children: ReactNode }) {
  const user = useAppStore((s) => s.user)
  const bootstrapped = useAppStore((s) => s.bootstrapped)
  const loading = useAppStore((s) => s.loading)
  const location = useLocation()

  if (!bootstrapped || loading) {
    return (
      <div className="min-h-screen kb-grid kb-page flex items-center justify-center">
        <div className="kb-glass rounded-xl px-4 py-3 text-sm text-white/80 border border-white/10">
          Loading admin workspace...
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/auth" replace state={{ from: location.pathname }} />
  if (!user.isAdmin) {
    return (
      <div className="min-h-screen kb-grid kb-page flex items-center justify-center px-4">
        <div className="max-w-md rounded-2xl border border-white/10 kb-glass kb-shadow p-6 text-center">
          <div className="text-lg font-semibold text-white">Admin access required</div>
          <div className="mt-2 text-sm text-white/70">
            This workspace is reserved for allowlisted admin accounts.
          </div>
          <div className="mt-4">
            <Link to="/app">
              <Button variant="secondary">Back to dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return <>{props.children}</>
}
