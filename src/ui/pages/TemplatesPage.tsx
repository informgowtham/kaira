import { motion } from 'framer-motion'
import { LogIn } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { TopBar } from '../components/TopBar'
import { Button } from '../components/Button'
import { Modal } from '../components/Modal'
import { useAppStore } from '../store/useAppStore'
import { THEMES } from '../store/themes'
import { useSEO } from '../utils/seo'
import { ThemeBackground } from '../components/backgrounds/ThemeBackground'
import type { BoardTheme } from '../store/types'
import { signatureTemplatesForOccasion } from '../templates/registry'
import { SignatureTemplatePreview } from '../templates/SignatureTemplatePreview'
import type { SignatureTemplateDefinition } from '../templates/signatureTypes'

type TemplateChoice = BoardTheme | SignatureTemplateDefinition

export function TemplatesPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const user = useAppStore((s) => s.user)

  const category = (searchParams.get('category') || 'birthday') as 'birthday' | 'farewell' | 'anniversary' | 'other'
  const themes = useMemo(() => THEMES.filter((t) => t.category === category), [category])
  const signatureTemplates = useMemo(() => signatureTemplatesForOccasion(category), [category])

  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1)
  useSEO(`${categoryTitle} Templates`, `Browse templates for ${category} boards.`)

  const [pending, setPending] = useState<TemplateChoice | null>(null)

  const buildCreateUrl = (theme: TemplateChoice) => `/app/create?occasion=${category}&theme=${encodeURIComponent(theme.id)}`

  const handleSelectTemplate = (theme: TemplateChoice) => {
    if (!user) {
      setPending(theme)
      return
    }
    navigate(buildCreateUrl(theme))
  }

  return (
    <div className="min-h-screen kb-grid kb-page">
      <TopBar compact />
      <div className="mx-auto w-full max-w-6xl px-4 pt-10 pb-16">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-3xl font-semibold text-white tracking-tight">{categoryTitle} Templates</h1>
          <p className="mt-2 text-white/70">Pick a starting theme for your group card. You can customize this later.</p>
        </motion.div>

        <div className="mt-6 inline-flex flex-wrap gap-2">
          {(['birthday', 'farewell', 'anniversary', 'other'] as const).map((c) => {
            const active = c === category
            return (
              <button
                key={c}
                className={`kb-ring rounded-full border px-4 py-2 text-sm transition ${
                  active ? 'bg-white text-black border-white/20' : 'bg-black/20 text-white/75 border-white/10 hover:bg-white/8'
                }`}
                onClick={() => navigate(`/templates?category=${c}`)}
              >
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            )
          })}
        </div>

        <div className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Signature Templates</h2>
              <p className="mt-1 text-sm text-white/60">Unique coded experiences with their own background, motion, and message layout.</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {signatureTemplates.map((template, idx) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 + 0.1, duration: 0.4 }}
                className="group cursor-pointer rounded-2xl kb-glass border border-white/10 p-2 kb-shadow hover:bg-white/5 transition"
                onClick={() => handleSelectTemplate(template)}
              >
                <SignatureTemplatePreview template={template} className="h-40 w-full rounded-xl" />
                <div className="mt-3 px-2 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-white">{template.name}</div>
                    <div className="rounded-full border border-amber-200/25 bg-amber-300/90 px-2 py-0.5 text-[10px] font-bold text-black">Signature</div>
                  </div>
                  <div className="mt-1 text-xs text-white/60 leading-relaxed">{template.description}</div>
                  <Button variant="secondary" className="mt-4 w-full kb-ring">
                    Use Template
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <div>
            <h2 className="text-xl font-semibold text-white">Classic Themes</h2>
            <p className="mt-1 text-sm text-white/60">Lightweight visual themes with the familiar KairaBoard masonry layout.</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {themes.map((theme, idx) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 + 0.1, duration: 0.4 }}
              className="group cursor-pointer rounded-2xl kb-glass border border-white/10 p-2 kb-shadow hover:bg-white/5 transition"
              onClick={() => handleSelectTemplate(theme)}
            >
              <ThemeBackground theme={theme} className="h-40 w-full rounded-xl" />
              <div className="mt-3 px-2 pb-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-white">{theme.name}</div>
                </div>
                <div className="mt-1 text-xs text-white/60 leading-relaxed">{theme.description}</div>
                <Button variant="secondary" className="mt-4 w-full kb-ring">
                  Use Template
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Modal
        open={Boolean(pending)}
        title="Log in to use this template"
        onClose={() => setPending(null)}
      >
        <div className="text-sm text-white/75 leading-relaxed">
          You can browse templates freely, but creating a board is tied to a creator account for secure ownership.
        </div>
        <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-end">
          <Button variant="secondary" onClick={() => setPending(null)}>
            Keep browsing
          </Button>
          <Button
            variant="primary"
            left={<LogIn size={16} />}
            onClick={() => {
              const theme = pending
              if (!theme) return
              navigate('/auth', { state: { from: buildCreateUrl(theme) } })
            }}
          >
            Log in to continue
          </Button>
        </div>
      </Modal>
    </div>
  )
}
