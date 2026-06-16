import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { SignatureTemplateProps } from './signatureTypes'

export function ColorField(props: SignatureTemplateProps & { isRevealing?: boolean; onRevealComplete?: () => void }) {
  const [opened, setOpened] = useState(false)
  const title = props.title || (props.recipientName ? `Color Field for ${props.recipientName}` : 'Color Field')

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8f4ef] text-[#18212c]">
      <AnimatePresence onExitComplete={() => { if (opened) props.onRevealComplete?.() }}>
        {props.isRevealing && !opened ? (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#101827]" exit={{ opacity: 0, transition: { duration: 1.2 } }}>
            {Array.from({ length: 6 }).map((_, idx) => (
              <motion.div
                key={idx}
                className="absolute rounded-[2rem]"
                style={{
                  width: 340 - idx * 30,
                  height: 220 - idx * 20,
                  background: ['#fda4af', '#93c5fd', '#c4b5fd', '#99f6e4', '#fde68a', '#fbcfe8'][idx],
                  opacity: 0.9,
                }}
                exit={{ scale: 2.2, opacity: 0, transition: { duration: 1 + idx * 0.03, ease: 'easeOut' } }}
              />
            ))}
            <motion.button
              className="relative z-10 rounded-full bg-white px-10 py-4 text-lg font-semibold text-[#18212c]"
              onClick={() => setOpened(true)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              Enter the gallery
            </motion.button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {props.topBar}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-[14%] h-52 w-72 rounded-[2rem] bg-[#fda4af]/65 blur-[1px]" />
        <div className="absolute right-[12%] top-[18%] h-56 w-80 rounded-[2rem] bg-[#93c5fd]/60 blur-[1px]" />
        <div className="absolute left-[16%] bottom-[14%] h-56 w-80 rounded-[2rem] bg-[#c4b5fd]/55 blur-[1px]" />
        <div className="absolute right-[14%] bottom-[10%] h-48 w-72 rounded-[2rem] bg-[#fde68a]/55 blur-[1px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 sm:px-8">
        <header className="mx-auto max-w-3xl text-center">
          <div className="text-sm font-semibold uppercase tracking-[.26em] text-[#4d637d]">Color Field</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">{title}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#18212c]/68">
            Museum-like color planes and floating note panels with a calm, modern celebration tone.
          </p>
          {props.actionSlot ? <div className="mt-5 flex flex-wrap justify-center gap-2">{props.actionSlot}</div> : null}
        </header>

        {props.messages.length === 0 ? (
          <div className="mt-10">{props.emptyState}</div>
        ) : (
          <main className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {props.messages.map((message, idx) => (
              <motion.article
                key={message.id}
                className="rounded-[1.75rem] border border-white/60 bg-white/72 p-5 shadow-[0_24px_70px_rgba(26,43,64,.12)] backdrop-blur-md"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.08, 1.2) }}
              >
                <div className="text-xs font-semibold uppercase tracking-[.24em] text-[#4d637d]">Field Note</div>
                <div className="mt-2 font-semibold text-[#18212c]">{message.displayName || 'Someone'}</div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#18212c]/78">{message.text}</p>
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
