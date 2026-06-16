import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { SignatureTemplateProps } from './signatureTypes'

export function PaperTrails(props: SignatureTemplateProps & { isRevealing?: boolean; onRevealComplete?: () => void }) {
  const [opened, setOpened] = useState(false)
  const title = props.title || (props.recipientName ? `Paper Trails for ${props.recipientName}` : 'Paper Trails')

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f0e6] text-[#2f2017]">
      <AnimatePresence onExitComplete={() => { if (opened) props.onRevealComplete?.() }}>
        {props.isRevealing && !opened ? (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2c221b]" exit={{ opacity: 0, transition: { duration: 1.2 } }}>
            <motion.div
              className="relative h-[320px] w-[420px] rounded-[2rem] border border-white/10 bg-[#fdf6ea] shadow-[0_30px_100px_rgba(0,0,0,0.45)]"
              exit={{ y: -420, rotate: -5, transition: { duration: 1.3, ease: 'easeInOut' } }}
            >
              <div className="absolute inset-x-0 top-0 h-1/2 origin-top rounded-t-[2rem] bg-[#d8b48d]" />
              <div className="absolute left-1/2 top-[34%] h-10 w-10 -translate-x-1/2 rounded-full bg-[#9a5b37]" />
            </motion.div>
            <motion.button
              className="absolute rounded-full bg-white px-9 py-4 text-lg font-semibold text-[#2f2017]"
              onClick={() => setOpened(true)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.25 } }}
            >
              Open the envelope
            </motion.button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {props.topBar}
      <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(121,85,48,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(121,85,48,.08)_1px,transparent_1px)] [background-size:28px_28px]" />
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1200 900" preserveAspectRatio="none" aria-hidden="true">
        <path d="M60 760 C220 520 420 820 560 480 C720 120 900 430 1140 200" fill="none" stroke="#9a5b37" strokeDasharray="14 16" strokeWidth="6" opacity=".45" />
      </svg>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 sm:px-8">
        <header className="max-w-3xl">
          <div className="text-sm font-semibold uppercase tracking-[.26em] text-[#9a5b37]">Paper Trails</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#2f2017]/68">
            Stamped stationery, soft routes, and notes pinned along a path of shared work and memories.
          </p>
          {props.actionSlot ? <div className="mt-5 flex flex-wrap gap-2">{props.actionSlot}</div> : null}
        </header>

        {props.messages.length === 0 ? (
          <div className="mt-10">{props.emptyState}</div>
        ) : (
          <main className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {props.messages.map((message, idx) => (
              <motion.article
                key={message.id}
                className={`relative rounded-[1.5rem] border border-[#d8c5ab] bg-[#fffaf2] p-5 shadow-[0_24px_65px_rgba(93,62,39,.18)] ${idx % 2 ? 'md:mt-14' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.08, 1.2) }}
              >
                <div className="absolute right-5 top-5 rounded-full border border-[#c98f6a] px-3 py-1 text-[11px] uppercase tracking-[.22em] text-[#9a5b37]">
                  Stop {idx + 1}
                </div>
                <div className="font-semibold text-[#2f2017]">{message.displayName || 'Someone'}</div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#2f2017]/78">{message.text}</p>
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
