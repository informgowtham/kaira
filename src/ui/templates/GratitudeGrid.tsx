import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { SignatureTemplateProps } from './signatureTypes'

export function GratitudeGrid(props: SignatureTemplateProps & { isRevealing?: boolean; onRevealComplete?: () => void }) {
  const [opened, setOpened] = useState(false)
  const title = props.title || (props.recipientName ? `Gratitude Grid for ${props.recipientName}` : 'Gratitude Grid')

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3efe7] text-[#1d2430]">
      <AnimatePresence onExitComplete={() => { if (opened) props.onRevealComplete?.() }}>
        {props.isRevealing && !opened ? (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#111827]" exit={{ opacity: 0, transition: { duration: 1.2 } }}>
            {Array.from({ length: 9 }).map((_, idx) => (
              <motion.div
                key={idx}
                className="absolute h-36 w-36 rounded-[1.5rem] border border-white/10 bg-white/10"
                style={{ left: `${20 + (idx % 3) * 20}%`, top: `${18 + Math.floor(idx / 3) * 18}%` }}
                exit={{
                  scale: 0,
                  rotate: idx % 2 === 0 ? 15 : -15,
                  opacity: 0,
                  transition: { duration: 0.7, delay: idx * 0.04 },
                }}
              />
            ))}
            <motion.button
              className="relative z-10 rounded-full bg-white px-10 py-4 text-lg font-semibold text-[#1d2430]"
              onClick={() => setOpened(true)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              Open the board
            </motion.button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {props.topBar}
      <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(17,24,39,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(17,24,39,.07)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 sm:px-8">
        <header className="grid gap-4 rounded-[2rem] border border-black/10 bg-white/65 p-6 shadow-[0_24px_80px_rgba(20,26,35,.08)] md:grid-cols-[1.2fr_.8fr]">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[.26em] text-[#4b5563]">Gratitude Grid</div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">{title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#1d2430]/68">
              Structured appreciation notes arranged like an editorial wall of thanks.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[1.5rem] bg-[#e0f2fe] p-4 text-sm text-sky-950">Thoughtful notes</div>
            <div className="rounded-[1.5rem] bg-[#ede9fe] p-4 text-sm text-violet-950">Team memories</div>
            <div className="rounded-[1.5rem] bg-[#dcfce7] p-4 text-sm text-emerald-950">Warm send-off</div>
            <div className="rounded-[1.5rem] bg-[#fef3c7] p-4 text-sm text-amber-950">Lasting impact</div>
          </div>
          {props.actionSlot ? <div className="md:col-span-2 flex flex-wrap gap-2">{props.actionSlot}</div> : null}
        </header>

        {props.messages.length === 0 ? (
          <div className="mt-10">{props.emptyState}</div>
        ) : (
          <main className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {props.messages.map((message, idx) => (
              <motion.article
                key={message.id}
                className="rounded-[1.75rem] border border-black/10 bg-white/82 p-5 shadow-[0_18px_50px_rgba(20,26,35,.10)]"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.07, 1.1) }}
              >
                <div className="text-xs font-semibold uppercase tracking-[.22em] text-[#4b5563]/75">Grid Note</div>
                <div className="mt-2 font-semibold text-[#111827]">{message.displayName || 'Someone'}</div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#1f2937]/78">{message.text}</p>
                {(message.gifUrl || message.imageUrl) ? (
                  <img src={message.gifUrl || message.imageUrl} alt="" className="mt-4 max-h-44 w-full rounded-2xl object-cover" />
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
