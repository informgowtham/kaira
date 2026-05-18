import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import type { Message } from '../store/types'

function stickerGlyph(sticker: Message['sticker']) {
  switch (sticker) {
    case 'heart':
      return '💛'
    case 'star':
      return '⭐'
    case 'sparkle':
    default:
      return '✨'
  }
}

export function MessageCard(props: { message: Message; accent?: 'violet' | 'blue' | 'teal' }) {
  const { message } = props
  const accent =
    props.accent === 'blue'
      ? 'from-blue-400/25 to-blue-500/5'
      : props.accent === 'teal'
        ? 'from-cyan-300/20 to-cyan-500/5'
        : 'from-violet-400/25 to-violet-500/5'

  return (
    <motion.div
      className="break-inside-avoid mb-3 rounded-xl border border-white/10 kb-glass kb-shadow overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className={`p-4 bg-gradient-to-b ${accent}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-white">
              {message.displayName?.trim() ? message.displayName.trim() : 'Someone'}
            </div>
            <div className="mt-0.5 text-[11px] text-white/55">{new Date(message.createdAt).toLocaleString()}</div>
          </div>
          <div className="flex items-center gap-1 text-white/70">
            {message.emoji ? (
              <span className="text-base leading-none">{message.emoji}</span>
            ) : (
              <Sparkles size={16} />
            )}
          </div>
        </div>

        <div className="mt-3 text-sm text-white/85 leading-relaxed whitespace-pre-wrap">{message.text}</div>

        {message.gifUrl ? (
          <div className="mt-3 overflow-hidden rounded-lg border border-white/10 bg-black/30">
            <img src={message.gifUrl} alt="" className="w-full h-auto block" loading="lazy" />
          </div>
        ) : null}

        {message.imageUrl ? (
          <div className="mt-3 overflow-hidden rounded-lg border border-white/10 bg-black/30">
            <img src={message.imageUrl} alt="" className="w-full h-auto block" loading="lazy" />
          </div>
        ) : null}


      </div>

      <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between">
        <div className="text-xs text-white/60">Card</div>
        <div className="text-sm">{stickerGlyph(message.sticker)}</div>
      </div>
    </motion.div>
  )
}
