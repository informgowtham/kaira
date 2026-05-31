import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, MoreHorizontal, Palette } from 'lucide-react'
import { TopBar } from '../components/TopBar'
import { Surface } from '../components/Surface'
import { Button } from '../components/Button'
import type { Occasion } from '../store/types'
import { THEMES } from '../store/themes'
import { useAppStore } from '../store/useAppStore'
import { useSEO } from '../utils/seo'
import { DateTimePicker } from '../components/DateTimePicker'
import { ThemeBackground } from '../components/backgrounds/ThemeBackground'
import { SIGNATURE_TEMPLATES, getSignatureTemplate, signatureTemplatesForOccasion } from '../templates/registry'
import { SignatureTemplatePreview } from '../templates/SignatureTemplatePreview'

function isValidEmail(value: string) {
  const v = value.trim()
  if (!v) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

const OCCASIONS: { id: Occasion; label: string; helper: string }[] = [
  { id: 'birthday', label: 'Birthday', helper: 'Fun, warm, celebratory.' },
  { id: 'farewell', label: 'Farewell', helper: 'Appreciation and memories.' },
  { id: 'anniversary', label: 'Anniversary', helper: 'Milestones, tenure, team wins.' },
  { id: 'other', label: 'Other', helper: 'Celebrate anything.' },
]

export function CreateBoardPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const plan = useAppStore((s) => s.plan)
  const createBoard = useAppStore((s) => s.createBoard)
  const loading = useAppStore((s) => s.loading)
  const error = useAppStore((s) => s.error)
  useSEO('Create a Board', 'Create a new group card')

  const initialOccasion = (searchParams.get('occasion') as Occasion) || 'birthday'
  const initialTheme = searchParams.get('theme') || ''

  const [recipientName, setRecipientName] = useState('')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [deliveryAt, setDeliveryAt] = useState<Date | null>(null)
  const [occasion, setOccasion] = useState<Occasion>(initialOccasion)
  const [themeId, setThemeId] = useState<string>(() => {
    const requested = initialTheme ? THEMES.find((t) => t.id === initialTheme) : undefined
    const requestedSignature = initialTheme ? getSignatureTemplate(initialTheme) : undefined
    if (requestedSignature && requestedSignature.category === initialOccasion) return requestedSignature.id
    if (requested && requested.category === initialOccasion) return requested.id
    const first = THEMES.find((t) => t.category === initialOccasion)
    return first?.id ?? THEMES.find((t) => t.category === 'birthday')?.id ?? THEMES[0].id
  })

  useEffect(() => {
    const urlOccasion = (searchParams.get('occasion') as Occasion) || 'birthday'
    const urlTheme = searchParams.get('theme') || ''
    setOccasion(urlOccasion)
    if (urlTheme) {
      const requested = THEMES.find((t) => t.id === urlTheme)
      const requestedSignature = getSignatureTemplate(urlTheme)
      if (requestedSignature && requestedSignature.category === urlOccasion) {
        setThemeId(requestedSignature.id)
        return
      }
      if (requested && requested.category === urlOccasion) {
        setThemeId(requested.id)
        return
      }
    }
    const first = THEMES.find((t) => t.category === urlOccasion)
    if (first) setThemeId(first.id)
  }, [searchParams])

  useEffect(() => {
    const t = THEMES.find((x) => x.id === themeId)
    const signature = getSignatureTemplate(themeId)
    if ((!t || t.category !== occasion) && (!signature || signature.category !== occasion)) {
      const first = THEMES.find((x) => x.category === occasion)
      if (first) setThemeId(first.id)
    }
  }, [occasion, themeId])

  const selectedTheme = useMemo(() => THEMES.find((t) => t.id === themeId) ?? THEMES[0], [themeId])
  const selectedSignature = useMemo(() => getSignatureTemplate(themeId), [themeId])
  const occasionThemes = useMemo(() => THEMES.filter((t) => t.category === occasion), [occasion])
  const occasionSignatures = useMemo(() => signatureTemplatesForOccasion(occasion).filter((t) => t.category === occasion), [occasion])
  const topThemes = useMemo(() => {
    const rank = (animatedBackground?: string) => {
      if (animatedBackground === 'petal-drift') return 0
      if (animatedBackground === 'bloom-shimmer') return 1
      return 2
    }
    const classic = [...occasionThemes]
      .sort((a, b) => rank(a.animatedBackground) - rank(b.animatedBackground))
      .slice(0, Math.max(1, 3 - Math.min(2, occasionSignatures.length)))
    return [...occasionSignatures.slice(0, 2), ...classic]
  }, [occasionThemes, occasionSignatures])
  const emailOk = isValidEmail(recipientEmail)
  const deliveryOk = deliveryAt ? deliveryAt.getTime() > Date.now() : false
  const canCreate = Boolean(recipientName.trim()) && emailOk && deliveryOk && !loading

  return (
    <div className="min-h-screen kb-grid">
      <TopBar />
      <div className="mx-auto w-full max-w-6xl px-4 pt-8 pb-12">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">Create a group card</h1>
          <div className="mt-1 text-sm text-white/60">Set delivery details, pick an occasion, and choose a theme.</div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-3">
            <Surface className="p-5 lg:col-span-1">
              <div className="text-sm font-semibold text-white">Delivery setup</div>
              <div className="mt-2 text-xs text-white/60">Name</div>
              <input
                className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 kb-ring"
                value={recipientName}
                placeholder="e.g., Sarah"
                onChange={(e) => setRecipientName(e.target.value)}
              />

              <div className="mt-4 text-xs text-white/60">Recipient email</div>
              <input
                className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 kb-ring"
                value={recipientEmail}
                placeholder="sarah@example.com"
                onChange={(e) => setRecipientEmail(e.target.value)}
              />
              {!recipientEmail.trim() ? null : emailOk ? null : (
                <div className="mt-2 text-xs text-rose-200">Enter a valid email address.</div>
              )}

              <div className="mt-4">
                <DateTimePicker value={deliveryAt} onChange={setDeliveryAt} min={new Date(Date.now() + 60_000)} label="Delivery date & time" />
                {deliveryAt ? (deliveryOk ? null : <div className="mt-2 text-xs text-rose-200">Pick a time in the future.</div>) : null}
              </div>

              <div className="mt-5 text-sm font-semibold text-white">Occasion</div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {OCCASIONS.map((o) => (
                  <button
                    key={o.id}
                    className={`kb-ring rounded-xl border p-3 text-left transition ${
                      occasion === o.id
                        ? 'bg-white/10 border-white/20'
                        : 'bg-black/20 border-white/10 hover:bg-white/8'
                    }`}
                    onClick={() => setOccasion(o.id)}
                  >
                    <div className="text-sm font-semibold text-white">{o.label}</div>
                    <div className="mt-0.5 text-xs text-white/60">{o.helper}</div>
                  </button>
                ))}
              </div>

            </Surface>

            <Surface className="p-5 lg:col-span-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-white flex items-center gap-2">
                    <Palette size={16} className="text-white/80" />
                    Theme
                  </div>
                  <div className="mt-1 text-sm text-white/60">Pick a starting template. You can customize later.</div>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <div className="text-xs text-white/60">Plan:</div>
                  <div
                    className={`text-xs px-2 py-1 rounded-full border ${
                      plan === 'pro'
                        ? 'bg-amber-300/90 text-black border-amber-200/30'
                        : 'bg-black/20 text-white/70 border-white/10'
                    }`}
                  >
                    {plan === 'pro' ? 'Pro' : 'Free'}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-xs font-semibold uppercase text-white/45">Top themes</div>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {topThemes.map((theme) => {
                    const active = theme.id === themeId
                    return (
                      <button
                        key={theme.id}
                        className={`kb-ring group rounded-xl border p-2 text-left transition ${
                          active ? 'border-white/35 bg-white/10' : 'border-white/10 bg-black/20 hover:bg-white/8'
                        }`}
                        onClick={() => setThemeId(theme.id)}
                      >
                        {'previewTone' in theme ? (
                          <SignatureTemplatePreview template={theme} className="h-16 w-full rounded-lg border border-white/10" />
                        ) : (
                          <ThemeBackground theme={theme} className="h-16 w-full rounded-lg border border-white/10" />
                        )}
                        <div className="mt-2 text-xs font-semibold text-white truncate">{theme.name}</div>
                      </button>
                    )
                  })}
                  <button
                    className="kb-ring rounded-xl border border-white/10 bg-black/20 p-2 text-left transition hover:bg-white/8"
                    onClick={() => navigate(`/templates?category=${occasion}`)}
                  >
                    <div className="flex h-16 w-full items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/80">
                      <MoreHorizontal size={22} />
                    </div>
                    <div className="mt-2 text-xs font-semibold text-white truncate">More</div>
                  </button>
                </div>
              </div>

              <div className="mt-4 kb-glass rounded-xl p-4 border border-white/10">
                <div className="text-sm font-semibold text-white">Preview</div>
                <ThemePreview
                  theme={selectedSignature ? undefined : selectedTheme}
                  signature={selectedSignature}
                  recipientName={recipientName.trim()}
                  deliveryAt={deliveryAt}
                />
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className="text-sm text-white/60">
                  Contributors won’t need to log in. You’ll invite them with a link.
                </div>
                <Button
                  variant="primary"
                  left={<ArrowRight size={16} />}
                  disabled={!canCreate}
                  onClick={async () => {
                    const board = await createBoard({
                      recipientName: recipientName.trim(),
                      occasion,
                      themeId,
                      recipientContact: recipientEmail.trim(),
                      scheduledAt: deliveryAt!.toISOString(),
                      destinationType: 'recipient',
                    })
                    navigate(`/app/board/${board.id}`)
                  }}
                >
                  {loading ? 'Creating...' : 'Create Board'}
                </Button>
              </div>
              {error ? <div className="text-sm text-rose-200">{error}</div> : null}
            </Surface>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function ThemePreview(props: {
  theme?: (typeof THEMES)[number]
  signature?: (typeof SIGNATURE_TEMPLATES)[number]
  recipientName: string
  deliveryAt: Date | null
}) {
  const title = props.recipientName ? `For ${props.recipientName}` : 'For someone special'
  const deliveryText = props.deliveryAt
    ? props.deliveryAt.toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
    : 'Delivery scheduled soon'

  return (
    props.signature ? (
      <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
        <SignatureTemplatePreview template={props.signature} recipientName={props.recipientName} className="min-h-[300px]" />
      </div>
    ) : (
    <ThemeBackground theme={props.theme ?? THEMES[0]} className="mt-3 min-h-[300px] rounded-xl border border-white/10">
      <div className="relative z-10 flex min-h-[300px] flex-col justify-between p-5">
        <div>
          <div className="inline-flex rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs text-white/75">
            {deliveryText}
          </div>
          <h3 className="mt-4 max-w-xl text-2xl font-semibold text-white tracking-tight">{title}</h3>
          <p className="mt-1 max-w-xl text-sm text-white/75">A collaborative celebration wall with messages, images, and memories.</p>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          {[
            ['Maya', 'You make every moment feel thoughtful and bright.', 'h-32'],
            ['Team', 'So many people came together for this one.', 'h-40'],
            ['Alex', 'Here is to the next beautiful chapter.', 'h-28'],
          ].map(([name, text, height], idx) => (
            <motion.div
              key={name}
              className={`rounded-xl border border-white/15 bg-black/25 p-4 backdrop-blur-md kb-shadow ${height}`}
              animate={{ y: [0, idx === 1 ? -8 : -5, 0] }}
              transition={{ duration: 4 + idx, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="text-xs font-semibold text-white/80">{name}</div>
              <div className="mt-2 text-sm leading-relaxed text-white">{text}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </ThemeBackground>
    )
  )
}
