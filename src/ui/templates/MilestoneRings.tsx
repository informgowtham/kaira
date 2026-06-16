import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { SignatureTemplateProps } from './signatureTypes'

const RING_POSITIONS = [
  { left: '14%', top: '24%' },
  { left: '62%', top: '20%' },
  { left: '68%', top: '56%' },
  { left: '18%', top: '60%' },
  { left: '38%', top: '40%' },
]

export function MilestoneRings(props: SignatureTemplateProps & { isRevealing?: boolean; onRevealComplete?: () => void }) {
  const [opened, setOpened] = useState(false)
  const title = props.title || (props.recipientName ? `Milestones for ${props.recipientName}` : 'Milestone Rings')

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8f3eb] text-[#2e2030]">
      <AnimatePresence onExitComplete={() => { if (opened) props.onRevealComplete?.() }}>
        {props.isRevealing && !opened ? (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1b1224]" exit={{ opacity: 0, transition: { duration: 1.2 } }}>
            {Array.from({ length: 4 }).map((_, idx) => (
              <motion.div
                key={idx}
                className="absolute rounded-full border border-white/20"
                style={{ width: 180 + idx * 120, height: 180 + idx * 120 }}
                exit={{ scale: 1.8, opacity: 0, transition: { duration: 1.1, delay: idx * 0.05 } }}
              />
            ))}
            <motion.button
              className="relative z-10 rounded-full bg-white px-10 py-4 text-lg font-semibold text-[#2e2030]"
              onClick={() => setOpened(true)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
            >
              Reveal the milestones
            </motion.button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {props.topBar}
      <div className="pointer-events-none absolute left-1/2 top-[48%] h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#7c5f6e]/20" />
      <div className="pointer-events-none absolute left-1/2 top-[48%] h-[410px] w-[410px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#7c5f6e]/18" />
      <div className="pointer-events-none absolute left-1/2 top-[48%] h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#7c5f6e]/16" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 sm:px-8">
        <header className="mx-auto max-w-3xl text-center">
          <div className="text-sm font-semibold uppercase tracking-[.26em] text-[#7c5f6e]">Milestone Rings</div>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight sm:text-6xl">{title}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#2e2030]/68">
            Abstract rings of progress, recognition, and messages placed around a growing story.
          </p>
          {props.actionSlot ? <div className="mt-5 flex flex-wrap justify-center gap-2">{props.actionSlot}</div> : null}
        </header>

        {props.messages.length === 0 ? (
          <div className="mt-10">{props.emptyState}</div>
        ) : (
          <main className="relative mt-10 min-h-[680px]">
            {props.messages.map((message, idx) => {
              const stop = RING_POSITIONS[idx % RING_POSITIONS.length]
              return (
                <motion.article
                  key={message.id}
                  className="absolute w-[min(300px,76vw)] rounded-[1.75rem] border border-[#dbc7d7] bg-white/86 p-5 shadow-[0_22px_70px_rgba(79,50,69,.16)]"
                  style={{ left: stop.left, top: stop.top }}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.min(idx * 0.08, 1.2) }}
                >
                  <div className="text-xs font-semibold uppercase tracking-[.24em] text-[#7c5f6e]">Ring {idx + 1}</div>
                  <div className="mt-2 font-semibold text-[#2e2030]">{message.displayName || 'Someone'}</div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#2e2030]/76">{message.text}</p>
                  {(message.gifUrl || message.imageUrl) ? (
                    <img src={message.gifUrl || message.imageUrl} alt="" className="mt-4 max-h-44 w-full rounded-2xl object-cover" />
                  ) : null}
                </motion.article>
              )
            })}
          </main>
        )}

        {props.footerSlot ? <div className="mt-8">{props.footerSlot}</div> : null}
      </div>
    </div>
  )
}
