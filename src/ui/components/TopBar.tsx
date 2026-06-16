import { Link, useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import { Crown, LayoutGrid, LogOut, Plus, ShieldCheck, Sparkles } from 'lucide-react'
import { Button } from './Button'
import { useAppStore } from '../store/useAppStore'
import { preloadCreateBoardRoute, preloadPricingRoute, preloadTemplatesRoute } from '../routePreloads'

export function TopBar(props: { compact?: boolean; tone?: 'light' | 'dark' | 'paper' }) {
  const { compact, tone = 'dark' } = props
  const navigate = useNavigate()
  const user = useAppStore((s) => s.user)
  const plan = useAppStore((s) => s.plan)
  const logout = useAppStore((s) => s.logout)

  return (
    <div className={clsx("sticky top-0 z-40 border-b backdrop-blur-md transition-colors", tone === 'dark' ? "border-white/10 bg-black/25" : "border-black/10 bg-white/40")}>
      <div className="mx-auto w-full max-w-6xl px-4 py-3 flex items-center gap-3">
        <Link to="/" className={clsx("kb-ring inline-flex items-center gap-2 rounded-lg px-2 py-1", tone !== 'dark' && "hover:bg-black/5")}>
          <div className={clsx("h-8 w-8 rounded-lg border flex items-center justify-center kb-shimmer", tone === 'dark' ? "border-white/10" : "border-black/10 shadow-sm")}
            style={{ background: 'linear-gradient(135deg, rgba(255,95,178,.45), rgba(94,231,255,.32), rgba(255,216,107,.3))' }}>
            <Sparkles size={16} className="text-white" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className={clsx("text-sm font-semibold", tone === 'dark' ? "text-white" : "text-black/85")}>KairaBoard</span>
            <span className={clsx("text-[11px]", tone === 'dark' ? "text-white/70" : "text-black/50")}>Turn messages into memories</span>
          </div>
        </Link>

        <div className="flex-1" />

        {user ? (
          <div className="flex items-center gap-2">
            {user.isAdmin ? (
              <Link to="/admin" className="hidden sm:inline-flex">
                <Button variant="ghost" left={<ShieldCheck size={16} />} tone={tone}>
                  Admin
                </Button>
              </Link>
            ) : null}
            <Link to="/templates" className="hidden sm:inline-flex" onMouseEnter={() => void preloadTemplatesRoute()} onFocus={() => void preloadTemplatesRoute()}>
              <Button variant="ghost" left={<LayoutGrid size={16} />} tone={tone}>
                Templates
              </Button>
            </Link>
            {!compact ? (
              <Button
                variant="secondary"
                left={<Plus size={16} />}
                onMouseEnter={() => void preloadCreateBoardRoute()}
                onFocus={() => void preloadCreateBoardRoute()}
                onClick={() => navigate('/app/create')}
                aria-label="Create group card"
                tone={tone}
              >
                Create
              </Button>
            ) : null}

            <Link to="/pricing" className="kb-ring rounded-lg" onMouseEnter={() => void preloadPricingRoute()} onFocus={() => void preloadPricingRoute()}>
              <div
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  plan === 'pro' 
                    ? 'bg-amber-300/90 text-black shadow-sm' 
                    : (tone === 'dark' ? 'kb-glass text-white hover:bg-white/10' : 'bg-black/5 text-black/70 border border-black/10 hover:bg-black/10')
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
                navigate('/')
              }}
              aria-label="Log out"
              tone={tone}
            >
              <span className="hidden sm:inline">Log out</span>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/templates" className="hidden sm:inline-flex" onMouseEnter={() => void preloadTemplatesRoute()} onFocus={() => void preloadTemplatesRoute()}>
              <Button variant="ghost" left={<LayoutGrid size={16} />} tone={tone}>
                Templates
              </Button>
            </Link>
            <Link to="/pricing" onMouseEnter={() => void preloadPricingRoute()} onFocus={() => void preloadPricingRoute()}>
              <Button variant="ghost" tone={tone}>Pricing</Button>
            </Link>
            <Link to="/auth">
              <Button variant="primary" tone={tone}>Log in</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
