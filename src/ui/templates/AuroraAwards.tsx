import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { SignatureTemplateProps } from './signatureTypes'

export function AuroraAwards(props: SignatureTemplateProps & { isRevealing?: boolean; onRevealComplete?: () => void }) {
  const [opened, setOpened] = useState(false)
  const title = props.title || (props.recipientName ? `Recognizing ${props.recipientName}` : 'Aurora Awards')

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#091120] text-white">
      <AnimatePresence onExitComplete={() => { if (opened) props.onRevealComplete?.() }}>
        {props.isRevealing && !opened ? (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020617]" exit={{ opacity: 0, transition: { duration: 1.2 } }}>
            {Array.from({ length: 5 }).map((_, idx) => (
              <motion.div
                key={idx}
                className="absolute h-[120vh] w-40 rounded-full blur-3xl"
                style={{ left: `${10 + idx * 18}%`, background: ['#38bdf8', '#60a5fa', '#c084fc', '#34d399', '#fbbf24'][idx] }}
                exit={{ y: idx % 2 === 0 ? '-130%' : '130%', opacity: 0, transition: { duration: 1.3, delay: idx * 0.05 } }}
              />
            ))}
            <motion.button
              className="relative z-10 rounded-full border border-white/20 bg-white px-10 py-4 text-lg font-semibold text-[#091120]"
              onClick={() => setOpened(true)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
            >
              Reveal the honors
            </motion.button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {props.topBar}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(56,189,248,.24),transparent_30%),radial-gradient(circle_at_80%_18%,rgba(192,132,252,.22),transparent_30%),radial-gradient(circle_at_60%_75%,rgba(52,211,153,.18),transparent_32%)]" />
      {Array.from({ length: 4 }).map((_, idx) => (
        <motion.div
          key={idx}
          className="pointer-events-none absolute left-[-10%] right-[-10%] h-36 rounded-full blur-3xl"
          style={{ top: `${18 + idx * 17}%`, background: ['rgba(56,189,248,.28)', 'rgba(192,132,252,.24)', 'rgba(52,211,153,.22)', 'rgba(251,191,36,.18)'][idx] }}
          animate={{ x: [0, idx % 2 === 0 ? 35 : -35, 0] }}
          transition={{ duration: 10 + idx, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 sm:px-8">
        <header className="mx-auto max-w-3xl text-center">
          <div className="text-sm font-semibold uppercase tracking-[.26em] text-cyan-200/80">Aurora Awards</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">{title}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/72">
            Luminous ribbons, premium plaques, and milestone notes designed like an award night.
          </p>
          {props.actionSlot ? <div className="mt-5 flex flex-wrap justify-center gap-2">{props.actionSlot}</div> : null}
        </header>

        {props.messages.length === 0 ? (
          <div className="mt-10">{props.emptyState}</div>
        ) : (
          <main className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {props.messages.map((message, idx) => (
              <motion.article
                key={message.id}
                className="rounded-[2rem] border border-white/15 bg-white/10 p-5 backdrop-blur-md shadow-[0_24px_70px_rgba(8,15,34,.36)]"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.07, 1.1) }}
              >
                <div className="rounded-full border border-cyan-200/20 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[.22em] text-cyan-100/85 inline-flex">
                  Recognition
                </div>
                <div className="mt-3 font-semibold text-white">{message.displayName || 'Someone'}</div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/76">{message.text}</p>
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
