import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { SignatureTemplateProps } from './signatureTypes'

export function JoyRibbons(props: SignatureTemplateProps & { isRevealing?: boolean; onRevealComplete?: () => void }) {
  const [opened, setOpened] = useState(false)
  const title = props.title || (props.recipientName ? `For ${props.recipientName}` : 'Joy Ribbons')

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fff4ee] text-[#281126]">
      <AnimatePresence onExitComplete={() => { if (opened) props.onRevealComplete?.() }}>
        {props.isRevealing && !opened ? (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#21111d]" exit={{ opacity: 0, transition: { duration: 1.2 } }}>
            {Array.from({ length: 6 }).map((_, idx) => (
              <motion.div
                key={idx}
                className="absolute left-[-10%] right-[-10%] h-24 rounded-full"
                style={{
                  top: `${18 + idx * 12}%`,
                  background: ['#fb7185', '#fbbf24', '#f97316', '#60a5fa', '#34d399', '#c084fc'][idx],
                }}
                exit={{
                  x: idx % 2 === 0 ? '-120%' : '120%',
                  rotate: idx % 2 === 0 ? -14 : 14,
                  transition: { duration: 1.4, delay: idx * 0.04, ease: 'easeInOut' },
                }}
              />
            ))}
            <motion.button
              className="relative z-10 rounded-full bg-white px-10 py-4 text-lg font-semibold text-[#281126]"
              onClick={() => setOpened(true)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.25 } }}
            >
              Pull the ribbons
            </motion.button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {props.topBar}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(140deg,rgba(255,255,255,.68),rgba(255,255,255,.25))]" />
      {['#fb7185', '#fbbf24', '#f97316', '#60a5fa'].map((color, idx) => (
        <motion.div
          key={color}
          className="pointer-events-none absolute left-[-8%] right-[-8%] rounded-full opacity-75"
          style={{ top: `${18 + idx * 18}%`, height: idx % 2 === 0 ? 100 : 84, background: color }}
          animate={{ x: [0, idx % 2 === 0 ? 20 : -20, 0], rotate: [idx - 2, idx + 1, idx - 2] }}
          transition={{ duration: 8 + idx, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 sm:px-8">
        <header className="max-w-3xl">
          <div className="text-sm font-semibold uppercase tracking-[.26em] text-[#9f3453]">Joy Ribbons</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#281126]/70">
            Bold celebration bands, cut-paper color, and notes that feel threaded into the moment.
          </p>
          {props.actionSlot ? <div className="mt-5 flex flex-wrap gap-2">{props.actionSlot}</div> : null}
        </header>

        {props.messages.length === 0 ? (
          <div className="mt-10">{props.emptyState}</div>
        ) : (
          <main className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {props.messages.map((message, idx) => (
              <motion.article
                key={message.id}
                className={`rounded-[2rem] border border-white/60 bg-white/82 p-5 shadow-[0_24px_70px_rgba(120,37,57,.18)] ${idx % 2 ? 'lg:ml-14' : 'lg:mr-14'}`}
                initial={{ opacity: 0, x: idx % 2 ? 28 : -28 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(idx * 0.08, 1.2) }}
              >
                <div className="text-sm font-semibold uppercase tracking-[.22em] text-[#9f3453]/70">{message.displayName || 'Someone'}</div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#281126]/78">{message.text}</p>
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
