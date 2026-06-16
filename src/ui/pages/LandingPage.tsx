import { motion } from 'framer-motion'
import { ArrowRight, Gift, PartyPopper, Sparkles, Star, Users } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Surface } from '../components/Surface'
import { TopBar } from '../components/TopBar'
import { useAppStore } from '../store/useAppStore'
import { useSEO } from '../utils/seo'
import { preloadCreateBoardRoute, preloadPricingRoute, preloadTemplatesRoute } from '../routePreloads'

const CATEGORIES = [
  { id: 'birthday', title: 'Birthday', icon: <PartyPopper size={18} />, hint: 'Make it feel like a gift.', accent: 'from-pink-400/40 via-orange-300/20 to-transparent' },
  { id: 'farewell', title: 'Farewell', icon: <Users size={18} />, hint: 'A wall of appreciation.', accent: 'from-cyan-300/40 via-blue-300/20 to-transparent' },
  { id: 'anniversary', title: 'Anniversary', icon: <Sparkles size={18} />, hint: 'Milestones and tenure.', accent: 'from-yellow-300/35 via-orange-200/15 to-transparent' },
  { id: 'other', title: 'Other', icon: <Gift size={18} />, hint: 'Celebrate anything.', accent: 'from-fuchsia-300/35 via-violet-300/20 to-transparent' },
]

export function LandingPage() {
  const navigate = useNavigate()
  const user = useAppStore((s) => s.user)
  useSEO('Welcome', 'Turn fleeting moments into unforgettable memories.')

  return (
    <div className="min-h-screen kb-grid kb-page">
      <div className="kb-aurora" />
      <TopBar />

      <div className="mx-auto w-full max-w-6xl px-4 pt-8 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_.9fr] gap-8 items-center min-h-[70vh]">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full kb-glass kb-glow-border px-3 py-1 text-xs text-white/80 border border-white/10">
              <Sparkles size={14} className="text-yellow-200" />
              Turn group messages into lasting memories
            </div>

            <h1 className="mt-5 text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[0.95] tracking-tight text-white">
              Turn fleeting moments into
              <span className="block bg-gradient-to-r from-pink-300 via-yellow-200 to-cyan-200 bg-clip-text text-transparent pb-2">
                unforgettable memories
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-base sm:text-lg text-white/76 leading-relaxed">
              Gather heartfelt messages, photos, and joy from everyone who matters. Deliver a cinematic, 
              collaborative experience that feels like a collective hug.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Button
                className="kb-pulse"
                variant="primary"
                left={<ArrowRight size={16} />}
                onMouseEnter={() => void preloadCreateBoardRoute()}
                onFocus={() => void preloadCreateBoardRoute()}
                onClick={() => navigate(user ? '/app/create' : '/auth')}
              >
                Create Group Card
              </Button>
              <Link to="/pricing" onMouseEnter={() => void preloadPricingRoute()} onFocus={() => void preloadPricingRoute()}>
                <Button variant="secondary">View Pricing</Button>
              </Link>
            </div>

            <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/65">
              <span className="inline-flex items-center gap-2 rounded-full kb-glass px-3 py-1">
                <Users size={14} className="text-cyan-200" />
                No login needed for contributors
              </span>
              <span className="inline-flex items-center gap-2 rounded-full kb-glass px-3 py-1">
                <Star size={14} className="text-yellow-200" />
                Cinematic reveal preview
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative min-h-[420px] sm:min-h-[520px]"
          >
            <div className="absolute inset-8 rounded-[2rem] bg-[radial-gradient(circle_at_top_left,rgba(255,95,178,.35),transparent_30%),radial-gradient(circle_at_90%_20%,rgba(94,231,255,.28),transparent_28%),linear-gradient(145deg,rgba(255,255,255,.15),rgba(255,255,255,.04))] blur-sm" />
            <motion.div
              className="absolute left-[6%] top-[8%] w-[62%] rounded-[1.75rem] border border-white/10 kb-glass kb-shadow p-5 kb-float"
              whileHover={{ y: -8, rotate: -2 }}
              transition={{ type: 'spring', stiffness: 180, damping: 18 }}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-white">Happy Birthday Aisha</div>
                <span className="rounded-full bg-pink-400/20 px-2 py-1 text-[11px] text-pink-100">Live</span>
              </div>
              <div className="mt-4 grid gap-3">
                <div className="rounded-2xl bg-white/10 p-4">
                  <div className="text-xs text-white/55">From Riya</div>
                  <div className="mt-1 text-sm text-white/90">You make every sprint kinder and every lunch break louder.</div>
                </div>
                <div className="rounded-2xl bg-gradient-to-r from-pink-400/20 to-orange-300/20 p-4">
                  <div className="text-xs text-white/55">18 people are adding memories</div>
                  <div className="mt-1 text-sm text-white/90">GIFs, notes, confetti, and one very dramatic inside joke.</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute right-[4%] top-[16%] w-[44%] rounded-[1.5rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,218,121,.25),rgba(255,255,255,.08))] p-4 kb-shadow kb-float-delayed"
              whileHover={{ y: -8, rotate: 2 }}
              transition={{ type: 'spring', stiffness: 180, damping: 18 }}
            >
              <div className="text-xs uppercase tracking-[0.2em] text-white/60">Theme</div>
              <div className="mt-2 text-lg font-semibold text-white">Neon Celebration</div>
              <div className="mt-2 h-28 rounded-2xl bg-[radial-gradient(circle_at_20%_20%,rgba(255,95,178,.6),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(94,231,255,.45),transparent_40%),linear-gradient(145deg,#1f1137,#111a33)]" />
            </motion.div>

            <motion.div
              className="absolute left-[20%] bottom-[8%] w-[55%] rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,.14),rgba(255,255,255,.06))] p-4 kb-shadow"
              initial={{ rotate: -6 }}
              animate={{ rotate: [-6, -3, -6], y: [0, -6, 0] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">Reveal moment</div>
                  <div className="mt-1 text-xs text-white/60">A surprise is waiting for you</div>
                </div>
                <div className="h-10 w-10 rounded-full bg-white/12 flex items-center justify-center">
                  <Sparkles size={18} className="text-yellow-200" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CATEGORIES.map((c, idx) => (
            <motion.button
              key={c.id}
              className="kb-ring text-left rounded-xl kb-glass kb-shadow p-4 hover:bg-white/12 transition relative overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * idx, duration: 0.4 }}
              onMouseEnter={() => void preloadTemplatesRoute()}
              onFocus={() => void preloadTemplatesRoute()}
              onClick={() => navigate(`/templates?category=${c.id}`)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${c.accent}`} />
              <div className="flex items-center gap-2 text-white">
                <div className="relative h-8 w-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
                  {c.icon}
                </div>
                <div className="relative font-semibold">{c.title}</div>
              </div>
              <div className="relative mt-2 text-sm text-white/70">{c.hint}</div>
            </motion.button>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-3">
          <Surface className="p-5 kb-glow-border">
            <div className="text-sm font-semibold text-white">Designed for human connection</div>
            <div className="mt-1 text-sm text-white/70 leading-relaxed">
              Every interaction feels warm, personal, and deeply memorable.
            </div>
          </Surface>
          <Surface className="p-5 kb-glow-border">
            <div className="text-sm font-semibold text-white">Effortless joy</div>
            <div className="mt-1 text-sm text-white/70 leading-relaxed">
              Share a single link and let everyone add their voice instantly—no signups required.
            </div>
          </Surface>
          <Surface className="p-5 kb-glow-border">
            <div className="text-sm font-semibold text-white">Cinematic reveal</div>
            <div className="mt-1 text-sm text-white/70 leading-relaxed">
              Anticipation screens, 3D card openings, confetti, and progressive storytelling.
            </div>
          </Surface>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="max-w-2xl text-center text-white/60 text-sm">
            Fully implemented: secure authentication, media uploads, scheduled deliveries, and cinematic reveals.
          </div>
        </div>
      </div>
    </div>
  )
}
