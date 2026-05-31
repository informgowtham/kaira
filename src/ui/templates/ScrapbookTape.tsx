import { motion } from 'framer-motion'
import type { SignatureTemplateProps } from './signatureTypes'

export function ScrapbookTape(props: SignatureTemplateProps) {
  const title = props.title || (props.recipientName ? `Scrapbook for ${props.recipientName}` : 'Celebration Scrapbook')

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fff9ea] text-slate-950">
      {props.topBar}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(244,114,182,.18),transparent_28%),radial-gradient(circle_at_82%_12%,rgba(59,130,246,.14),transparent_26%),radial-gradient(circle_at_70%_82%,rgba(250,204,21,.22),transparent_30%)]" />
      {[0, 1, 2, 3, 4, 5].map((idx) => (
        <motion.div
          key={idx}
          className="pointer-events-none absolute h-16 w-28 rounded-sm bg-white/70 shadow-lg"
          style={{ left: `${5 + idx * 17}%`, top: `${12 + (idx % 3) * 23}%`, rotate: `${[-8, 5, -3, 7, -6, 3][idx]}deg` }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5 + idx, repeat: Infinity }}
        />
      ))}

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 sm:px-8">
        <header className="mx-auto max-w-3xl text-center">
          <div className="text-sm font-semibold uppercase tracking-[.25em] text-pink-700/70">Scrapbook Tape</div>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">{title}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-700">Layered paper, tape, little stickers, and messages that feel collected by hand.</p>
          {props.actionSlot ? <div className="mt-5 flex flex-wrap justify-center gap-2">{props.actionSlot}</div> : null}
        </header>

        {props.messages.length === 0 ? (
          <div className="mt-10">{props.emptyState}</div>
        ) : (
          <main className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {props.messages.map((message, idx) => (
              <motion.article
                key={message.id}
                className="relative rounded-sm bg-white p-5 shadow-[0_22px_60px_rgba(15,23,42,.16)]"
                style={{ rotate: `${[-2, 2, -4, 3][idx % 4]}deg` }}
                initial={{ opacity: 0, scale: .95, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.08, 1.5) }}
              >
                <div className="absolute -top-3 left-7 h-6 w-24 -rotate-6 bg-pink-300/65" />
                <div className="absolute -right-3 top-8 rounded-full bg-yellow-200 px-3 py-1 text-xs font-bold">#{idx + 1}</div>
                <div className="mt-5 font-bold">{message.displayName || 'Someone'}</div>
                <p className="mt-3 whitespace-pre-wrap line-clamp-8 text-sm leading-7 text-slate-700">{message.text}</p>
                {(message.gifUrl || message.imageUrl) ? (
                  <img src={message.gifUrl || message.imageUrl} alt="" className="mt-4 max-h-44 w-full rounded-sm object-cover" />
                ) : null}
              </motion.article>
            ))}
          </main>
        )}
        {props.footerSlot ? <div className="mt-8">{props.footerSlot}</div> : null}
      </div>
    </div>
  )
}
