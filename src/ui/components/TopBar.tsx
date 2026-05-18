import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Crown, LayoutGrid, LogOut, Plus, ShieldCheck, Sparkles } from 'lucide-react'
import { Button } from './Button'
import { useAppStore } from '../store/useAppStore'

export function TopBar(props: { compact?: boolean }) {
  const { compact } = props
  const location = useLocation()
  const navigate = useNavigate()
  const user = useAppStore((s) => s.user)
  const plan = useAppStore((s) => s.plan)
  const logout = useAppStore((s) => s.logout)

  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-black/25 backdrop-blur-md">
      <div className="mx-auto w-full max-w-6xl px-4 py-3 flex items-center gap-3">
        <Link to="/" className="kb-ring inline-flex items-center gap-2 rounded-lg px-2 py-1">
          <div className="h-8 w-8 rounded-lg border border-white/10 flex items-center justify-center kb-shimmer"
            style={{ background: 'linear-gradient(135deg, rgba(255,95,178,.45), rgba(94,231,255,.32), rgba(255,216,107,.3))' }}>
            <Sparkles size={16} className="text-white" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-white">KairaBoard</span>
            <span className="text-[11px] text-white/70">Turn messages into memories</span>
          </div>
        </Link>

        <div className="flex-1" />

        {user ? (
          <div className="flex items-center gap-2">
            {user.isAdmin ? (
              <Link to="/admin" className="hidden sm:inline-flex">
                <Button variant="ghost" left={<ShieldCheck size={16} />}>
                  Admin
                </Button>
              </Link>
            ) : null}
            <Link to="/templates" className="hidden sm:inline-flex">
              <Button variant="ghost" left={<LayoutGrid size={16} />}>
                Templates
              </Button>
            </Link>
            {!compact ? (
              <Button
                variant="secondary"
                left={<Plus size={16} />}
                onClick={() => navigate('/app/create')}
                aria-label="Create group card"
              >
                Create
              </Button>
            ) : null}

            <Link to="/pricing" className="kb-ring rounded-lg">
              <div
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  plan === 'pro' ? 'bg-amber-300/90 text-black' : 'kb-glass text-white hover:bg-white/10'
                }`}
              >
                <Crown size={16} />
                {plan === 'pro' ? 'Pro' : 'Upgrade'}
              </div>
            </Link>

            <Button
              variant="ghost"
              left={<LogOut size={16} />}
              onClick={() => {
                logout()
                if (location.pathname.startsWith('/app')) navigate('/')
              }}
              aria-label="Log out"
            >
              <span className="hidden sm:inline">Log out</span>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/templates" className="hidden sm:inline-flex">
              <Button variant="ghost" left={<LayoutGrid size={16} />}>
                Templates
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="ghost">Pricing</Button>
            </Link>
            <Link to="/auth">
              <Button variant="primary">Log in</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
