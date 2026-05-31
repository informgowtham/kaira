import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SignatureTemplateProps } from './signatureTypes'

export function MemoryLanePaper(props: SignatureTemplateProps & { isRevealing?: boolean; onRevealComplete?: () => void }) {
  const [isUnveiling, setIsUnveiling] = useState(false)
  const title = props.title || (props.recipientName ? `Memory Lane for ${props.recipientName}` : 'Memory Lane')

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8efe1] text-[#3b2614]">
      <AnimatePresence onExitComplete={() => { if (isUnveiling && props.onRevealComplete) props.onRevealComplete(); }}>
        {props.isRevealing && !isUnveiling && (
          <motion.div
            className="fixed inset-0 z-[999999] flex items-center justify-center bg-zinc-950"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 2, delay: 1 } }}
          >
            <motion.div 
              className="relative w-[300px] h-[360px] bg-white p-4 pb-16 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col cursor-pointer"
              initial={{ y: "100vh", rotate: -5 }}
              animate={{ y: 0, rotate: 2, transition: { type: "spring", damping: 15, delay: 0.3 } }}
              exit={{ scale: 15, opacity: 0, transition: { duration: 2.5, ease: "easeInOut" } }}
              onClick={() => setIsUnveiling(true)}
              whileHover={{ scale: 1.03, rotate: 0 }}
            >
              <motion.div 
                className="flex-1 bg-zinc-800 overflow-hidden relative border border-zinc-200/10 shadow-inner"
                exit={{ backgroundColor: "rgba(255,255,255,0)", transition: { duration: 1.5 } }}
              >
                {/* Developing image effect inside polaroid */}
                <motion.div
                  className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-200/80 to-amber-900/90 mix-blend-overlay"
                  initial={{ opacity: 0 }}
                  exit={{ opacity: 1, scale: 1.5, transition: { duration: 1.5, ease: "easeOut" } }}
                />
              </motion.div>
              <motion.div 
                className="absolute bottom-5 left-0 w-full text-center text-zinc-400 font-serif italic text-sm"
                exit={{ opacity: 0 }}
              >
                Tap to Develop
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {props.topBar}
      <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(120,80,40,.12)_1px,transparent_1px)] [background-size:100%_28px]" />
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1200 900" preserveAspectRatio="none" aria-hidden="true">
        <path d="M70 760 C220 460 340 840 520 470 C700 100 850 520 1130 180" fill="none" stroke="#b45309" strokeDasharray="12 16" strokeWidth="7" opacity=".45" />
      </svg>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 sm:px-8">
        <header className="max-w-3xl">
          <div className="text-sm font-semibold uppercase tracking-[.25em] text-amber-800/70">Memory Lane</div>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight sm:text-6xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-amber-950/65">A paper path of milestones, goodbyes, small moments, and unforgettable notes.</p>
          {props.actionSlot ? <div className="mt-5 flex flex-wrap gap-2">{props.actionSlot}</div> : null}
        </header>

        {props.messages.length === 0 ? (
          <div className="mt-10">{props.emptyState}</div>
        ) : (
          <main className="relative mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
            {props.messages.map((message, idx) => (
              <motion.article
                key={message.id}
                className={`relative rounded-xl border border-amber-200 bg-[#fffaf0] p-5 shadow-[0_24px_60px_rgba(120,80,40,.16)] ${idx % 2 ? 'md:mt-20' : ''}`}
                initial={{ opacity: 0, x: idx % 2 ? 24 : -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(idx * 0.09, 1.5) }}
              >
                <div className="absolute -top-3 left-8 h-6 w-20 -rotate-3 bg-amber-200/80 shadow-sm" />
                <div className="text-xs font-semibold uppercase tracking-[.22em] text-amber-700/55">Moment {idx + 1}</div>
                <div className="mt-2 font-serif text-xl text-amber-950">{message.displayName || 'Someone'}</div>
                <p className="mt-3 whitespace-pre-wrap line-clamp-8 text-sm leading-7 text-amber-950/75">{message.text}</p>
                {(message.gifUrl || message.imageUrl) ? (
                  <img src={message.gifUrl || message.imageUrl} alt="" className="mt-4 max-h-44 w-full rounded-lg object-cover" />
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
