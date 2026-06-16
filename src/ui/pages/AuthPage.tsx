import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle2, LockKeyhole, Mail, Sparkles, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { TopBar } from '../components/TopBar'
import { Surface } from '../components/Surface'
import { Button } from '../components/Button'
import { useAppStore } from '../store/useAppStore'
import { useSEO } from '../utils/seo'
import { preloadCreateBoardRoute, preloadDashboardRoute, preloadPricingRoute } from '../routePreloads'
import { getPublicConfigStatus, type PublicConfigStatus } from '../store/api'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'placeholder-client-id'

function safeReturnPath(value: unknown) {
  if (typeof value !== 'string') return '/app'
  if (!value.startsWith('/') || value.startsWith('//')) return '/app'
  if (value.startsWith('/auth')) return '/app'
  return value
}

export function AuthPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const loginAsGoogle = useAppStore((s) => s.loginAsGoogle)
  const loginWithEmail = useAppStore((s) => s.loginWithEmail)
  const loading = useAppStore((s) => s.loading)
  const error = useAppStore((s) => s.error)
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [googleError, setGoogleError] = useState<string | null>(null)
  const [configStatus, setConfigStatus] = useState<PublicConfigStatus | null>(null)

  const from = useMemo(() => {
    const state = location.state as { from?: string } | null
    return safeReturnPath(state?.from)
  }, [location.state])

  useEffect(() => {
    if (from.startsWith('/app/create')) void preloadCreateBoardRoute()
    else if (from === '/pricing') void preloadPricingRoute()
    else void preloadDashboardRoute()
  }, [from])

  useEffect(() => {
    let cancelled = false
    void getPublicConfigStatus()
      .then((status) => {
        if (!cancelled) setConfigStatus(status)
      })
      .catch(() => {
        if (!cancelled) setConfigStatus(null)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useSEO(mode === 'login' ? 'Log in' : 'Sign up')

  return (
    <div className="min-h-screen kb-grid kb-page">
      <TopBar compact />
      <div className="mx-auto w-full max-w-6xl px-4 pt-8 pb-12">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-stretch">
            <Surface className="overflow-hidden p-0">
              <div className="relative min-h-full p-6 sm:p-8">
                <div className="absolute inset-0 opacity-80">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(245,206,92,0.18),transparent_30%),radial-gradient(circle_at_80%_15%,rgba(92,205,255,0.14),transparent_28%),linear-gradient(135deg,rgba(40,18,51,0.9),rgba(15,35,55,0.88))]" />
                  <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/35 to-transparent" />
                </div>
                <div className="relative flex min-h-[560px] flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs text-white/75">
                      <Sparkles size={14} />
                      KairaBoard creator workspace
                    </div>
                    <h1 className="mt-6 max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                      {mode === 'login' ? 'Welcome back to your celebration studio' : 'Create your celebration studio'}
                    </h1>
                    <p className="mt-4 max-w-xl text-base leading-7 text-white/70">
                      Sign in to create boards, invite contributors, schedule deliveries, and manage every card you have created.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <AuthBenefit icon={<LockKeyhole size={18} />} title="Owned boards" text="Only creators can manage their own boards." />
                    <AuthBenefit icon={<Users size={18} />} title="No contributor login" text="Shared links stay fast for guests." />
                    <AuthBenefit icon={<CheckCircle2 size={18} />} title="Admin ready" text="Enterprise accounts stay organized." />
                  </div>
                </div>
              </div>
            </Surface>

            <Surface className="p-5 sm:p-6">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-white/45">{mode === 'login' ? 'Login' : 'Signup'}</div>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                  {mode === 'login' ? 'Access your account' : 'Start with your account'}
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/62">
                  Google is the recommended path. Email/password remains available for teams that need a fallback.
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-4">
                {GOOGLE_CLIENT_ID === 'placeholder-client-id' || configStatus?.googleAuthConfigured === false ? (
                  <div className="rounded-xl border border-amber-300/25 bg-amber-500/15 p-4 text-sm leading-6 text-amber-100">
                    <strong>Google Sign-In is not configured yet.</strong> Add the same OAuth client id to{' '}
                    <code className="rounded bg-black/20 px-1 py-0.5">VITE_GOOGLE_CLIENT_ID</code> and{' '}
                    <code className="rounded bg-black/20 px-1 py-0.5">GOOGLE_CLIENT_ID</code>.
                  </div>
                ) : (
                  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                    <div className="kb-glass flex w-full justify-center rounded-xl border border-white/10 p-2">
                      <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                          setGoogleError(null)
                          if (credentialResponse.credential) {
                            await loginAsGoogle(credentialResponse.credential)
                            navigate(from, { replace: true })
                          }
                        }}
                        onError={() => {
                          setGoogleError('Google Sign-In failed. Please try again or use email.')
                        }}
                        theme="filled_black"
                        shape="rectangular"
                        size="large"
                        width="360"
                        text={mode === 'login' ? 'signin_with' : 'signup_with'}
                      />
                    </div>
                  </GoogleOAuthProvider>
                )}

                <div className="relative flex items-center gap-3 py-1">
                  <div className="h-px flex-1 bg-white/10" />
                  <div className="text-xs uppercase tracking-[0.16em] text-white/35">or continue with email</div>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs font-medium text-white/70">Email</div>
                  <input
                    className="kb-ring mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-3 text-sm text-white placeholder:text-white/40"
                    value={email}
                    placeholder="you@company.com"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="mt-4 text-xs font-medium text-white/70">Password</div>
                  <input
                    className="kb-ring mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-3 text-sm text-white placeholder:text-white/40"
                    type="password"
                    value={password}
                    placeholder="Minimum 6 characters"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    className="mt-4 w-full"
                    variant="primary"
                    left={mode === 'login' ? <ArrowRight size={16} /> : <Mail size={16} />}
                    disabled={!email.trim() || password.length < 6 || loading}
                    onClick={async () => {
                      await loginWithEmail(email.trim(), password, mode)
                      navigate(from, { replace: true })
                    }}
                  >
                    {loading ? 'Please wait...' : mode === 'login' ? 'Log in with email' : 'Create account with email'}
                  </Button>
                </div>
              </div>

              {googleError || error ? (
                <div className="mt-3 rounded-lg border border-rose-300/25 bg-rose-500/15 px-3 py-2 text-sm text-rose-100">
                  {googleError || error}
                </div>
              ) : null}

              {configStatus && !configStatus.uploadsPersistent ? (
                <div className="mt-3 rounded-lg border border-sky-300/20 bg-sky-500/10 px-3 py-2 text-sm text-sky-100">
                  Media uploads are currently using temporary local storage in this environment.
                </div>
              ) : null}

              <div className="mt-4 text-sm text-white/70">
                {mode === 'login' ? 'New here?' : 'Already have an account?'}{' '}
                <button
                  className="underline underline-offset-4 text-white kb-ring rounded"
                  onClick={() => setMode((m) => (m === 'login' ? 'signup' : 'login'))}
                >
                  {mode === 'login' ? 'Sign up' : 'Log in'}
                </button>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Link to="/pricing">
                  <Button variant="secondary">View Pricing</Button>
                </Link>
                <Link to="/">
                  <Button variant="ghost">Back Home</Button>
                </Link>
              </div>
            </Surface>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function AuthBenefit(props: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/24 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-white">
        <span className="text-amber-100">{props.icon}</span>
        {props.title}
      </div>
      <div className="mt-2 text-sm leading-5 text-white/62">{props.text}</div>
    </div>
  )
}
