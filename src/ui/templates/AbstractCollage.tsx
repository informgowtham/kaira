import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { SignatureTemplateProps } from './signatureTypes'

export function AbstractCollage(props: SignatureTemplateProps & { isRevealing?: boolean; onRevealComplete?: () => void }) {
  const [opened, setOpened] = useState(false)
  const title = props.title || (props.recipientName ? `For ${props.recipientName}` : 'Abstract Collage')

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fffaf3] text-[#23191d]">
      <AnimatePresence onExitComplete={() => { if (opened) props.onRevealComplete?.() }}>
        {props.isRevealing && !opened ? (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1f1720]" exit={{ opacity: 0, transition: { duration: 1.2 } }}>
            {Array.from({ length: 8 }).map((_, idx) => (
              <motion.div
                key={idx}
                className="absolute rounded-[2rem]"
                style={{
                  width: 200 + (idx % 3) * 90,
                  height: 130 + (idx % 3) * 50,
                  background: ['#fca5a5', '#93c5fd', '#fde68a', '#c4b5fd'][idx % 4],
                  rotate: `${-20 + idx * 8}deg`,
                }}
                exit={{
                  x: idx % 2 === 0 ? '-130%' : '130%',
                  y: idx % 3 === 0 ? '-80%' : '80%',
                  rotate: idx % 2 === 0 ? -40 : 40,
                  opacity: 0,
                  transition: { duration: 1.1, delay: idx * 0.04 },
                }}
              />
            ))}
            <motion.button
              className="relative z-10 rounded-full bg-white px-10 py-4 text-lg font-semibold text-[#23191d]"
              onClick={() => setOpened(true)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              Pull the layers apart
            </motion.button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {props.topBar}
      {[
        { left: '4%', top: '18%', color: '#fca5a5', rotate: '-12deg' },
        { left: '68%', top: '12%', color: '#93c5fd', rotate: '10deg' },
        { left: '14%', top: '68%', color: '#fde68a', rotate: '8deg' },
        { left: '70%', top: '64%', color: '#c4b5fd', rotate: '-10deg' },
      ].map((shape, idx) => (
        <motion.div
          key={idx}
          className="pointer-events-none absolute h-48 w-72 rounded-[2.5rem] opacity-55 blur-[1px]"
          style={{ left: shape.left, top: shape.top, background: shape.color, rotate: shape.rotate }}
          animate={{ y: [0, idx % 2 === 0 ? -14 : 14, 0] }}
          transition={{ duration: 8 + idx, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 sm:px-8">
        <header className="max-w-3xl">
          <div className="text-sm font-semibold uppercase tracking-[.26em] text-[#96516d]">Abstract Collage</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#23191d]/68">
            Cut-paper composition, layered color blocks, and handmade notes with art-board energy.
          </p>
          {props.actionSlot ? <div className="mt-5 flex flex-wrap gap-2">{props.actionSlot}</div> : null}
        </header>

        {props.messages.length === 0 ? (
          <div className="mt-10">{props.emptyState}</div>
        ) : (
          <main className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {props.messages.map((message, idx) => (
              <motion.article
                key={message.id}
                className="rounded-[1.75rem] border border-white/60 bg-white/84 p-5 shadow-[0_24px_70px_rgba(92,48,70,.14)]"
                style={{ rotate: `${[-2, 1.5, -1, 2][idx % 4]}deg` }}
                initial={{ opacity: 0, y: 18, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: Math.min(idx * 0.08, 1.2) }}
              >
                <div className="h-3 w-20 rounded-full bg-[#96516d]/20" />
                <div className="mt-3 font-semibold text-[#23191d]">{message.displayName || 'Someone'}</div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#23191d]/78">{message.text}</p>
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
