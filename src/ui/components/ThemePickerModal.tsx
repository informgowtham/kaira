import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from './Button'
import type { BoardTheme, Occasion, ThemeMood } from '../store/types'
import { THEMES } from '../store/themes'
import { ThemeBackground } from './backgrounds/ThemeBackground'

const MOODS: { id: ThemeMood; label: string }[] = [
  { id: 'elegant', label: 'Elegant' },
  { id: 'playful', label: 'Playful' },
  { id: 'corporate', label: 'Corporate' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'neon', label: 'Neon' },
  { id: 'gold', label: 'Gold' },
]

export function ThemePickerModal(props: {
  open: boolean
  occasion: Occasion
  selectedThemeId: string
  onClose: () => void
  onSelect: (theme: BoardTheme) => void
}) {
  const { open, occasion, selectedThemeId, onClose, onSelect } = props
  const [q, setQ] = useState('')
  const [mood, setMood] = useState<ThemeMood | 'all'>('all')

  const themes = useMemo(() => {
    const base = THEMES.filter((t) => t.category === occasion)
    const filtered = base.filter((t) => {
      if (mood !== 'all' && t.mood !== mood) return false
      if (q.trim()) {
        const needle = q.trim().toLowerCase()
        return (t.name + ' ' + t.description).toLowerCase().includes(needle)
      }
      return true
    })
    return filtered
  }, [occasion, mood, q])

  return (
    <Modal open={open} title="Choose a theme" onClose={onClose}>
      <div className="grid gap-3">
        <div className="kb-glass rounded-xl border border-white/10 p-3">
          <div className="flex items-center gap-2">
            <Search size={16} className="text-white/60" />
            <input
              className="w-full bg-transparent outline-none text-sm text-white placeholder:text-white/40"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search themes..."
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className={`kb-ring rounded-full border px-3 py-1.5 text-xs transition ${
              mood === 'all' ? 'bg-white text-black border-white/20' : 'bg-black/20 text-white/75 border-white/10 hover:bg-white/8'
            }`}
            onClick={() => setMood('all')}
          >
            All
          </button>
          {MOODS.map((m) => (
            <button
              key={m.id}
              className={`kb-ring rounded-full border px-3 py-1.5 text-xs transition ${
                mood === m.id ? 'bg-white text-black border-white/20' : 'bg-black/20 text-white/75 border-white/10 hover:bg-white/8'
              }`}
              onClick={() => setMood(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {themes.map((theme, idx) => {
            const selected = theme.id === selectedThemeId
            return (
              <motion.div
                key={theme.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className={`rounded-2xl border p-2 kb-shadow transition cursor-pointer ${
                  selected ? 'border-white/30 bg-white/10' : 'border-white/10 kb-glass hover:bg-white/8'
                }`}
                onClick={() => {
                  onSelect(theme)
                  onClose()
                }}
              >
                <ThemeBackground theme={theme} className="h-36 w-full rounded-xl" />
                <div className="mt-3 px-2 pb-2">
                  <div className="text-sm font-semibold text-white">{theme.name}</div>
                  <div className="mt-1 text-xs text-white/60 leading-relaxed">{theme.description}</div>
                  <Button className="mt-3 w-full" variant={selected ? 'primary' : 'secondary'}>
                    {selected ? 'Selected' : 'Use this theme'}
                  </Button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </Modal>
  )
}

