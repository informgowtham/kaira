import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { SignatureTemplateProps } from './signatureTypes'

const ORBIT_STOPS = [
  { left: '8%', top: '18%' },
  { left: '72%', top: '14%' },
  { left: '64%', top: '58%' },
  { left: '16%', top: '62%' },
  { left: '38%', top: '34%' },
  { left: '46%', top: '74%' },
]

export function ConfettiOrbit(props: SignatureTemplateProps & { isRevealing?: boolean; onRevealComplete?: () => void }) {
  const [startedReveal, setStartedReveal] = useState(false)
  const title = props.title || (props.recipientName ? `Celebrate ${props.recipientName}` : 'Confetti Orbit')

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fff8ec] text-[#31143a]">
      <AnimatePresence onExitComplete={() => { if (startedReveal) props.onRevealComplete?.() }}>
        {props.isRevealing && !startedReveal ? (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#201127]" exit={{ opacity: 0, transition: { duration: 1.4 } }}>
            {Array.from({ length: 48 }).map((_, idx) => (
              <motion.div
                key={idx}
                className="absolute rounded-full"
                style={{
                  width: 10 + (idx % 4) * 8,
                  height: 10 + (idx % 4) * 8,
                  background: ['#fb7185', '#fbbf24', '#60a5fa', '#34d399'][idx % 4],
                  left: '50%',
                  top: '50%',
                }}
                exit={{
                  x: Math.cos((idx / 48) * Math.PI * 2) * (250 + (idx % 6) * 60),
                  y: Math.sin((idx / 48) * Math.PI * 2) * (250 + (idx % 6) * 60),
                  rotate: 720,
                  opacity: 0,
                  transition: { duration: 1.4, ease: 'easeOut' },
                }}
              />
            ))}
            <motion.button
              className="relative z-10 rounded-full border border-white/20 bg-white px-10 py-4 text-lg font-semibold text-[#31143a] shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
              onClick={() => setStartedReveal(true)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              exit={{ scale: 0.85, opacity: 0, transition: { duration: 0.3 } }}
            >
              Start the celebration
            </motion.button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {props.topBar}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(251,113,133,.18),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(96,165,250,.18),transparent_28%),radial-gradient(circle_at_50%_80%,rgba(251,191,36,.18),transparent_30%)]" />
      <div className="pointer-events-none absolute left-1/2 top-[42%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#31143a]/10" />
      <div className="pointer-events-none absolute left-1/2 top-[42%] h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#31143a]/10" />
      <div className="pointer-events-none absolute left-1/2 top-[42%] h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#31143a]/10" />

      {Array.from({ length: 18 }).map((_, idx) => (
        <motion.div
          key={idx}
          className="pointer-events-none absolute h-4 w-4 rounded-sm"
          style={{
            left: `${8 + (idx * 5) % 84}%`,
            top: `${12 + (idx * 9) % 72}%`,
            background: ['#fb7185', '#fbbf24', '#60a5fa', '#34d399'][idx % 4],
          }}
          animate={{ rotate: [0, 180, 360], y: [0, -10, 0] }}
          transition={{ duration: 6 + (idx % 5), repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 sm:px-8">
        <header className="mx-auto max-w-3xl text-center">
          <div className="text-sm font-semibold uppercase tracking-[.26em] text-[#8b3d54]">Confetti Orbit</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">{title}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#31143a]/70">
            Orbiting color, paper confetti, and bright wishes arranged like a celebration in motion.
          </p>
          {props.actionSlot ? <div className="mt-5 flex flex-wrap justify-center gap-2">{props.actionSlot}</div> : null}
        </header>

        {props.messages.length === 0 ? (
          <div className="mt-10">{props.emptyState}</div>
        ) : (
          <main className="relative mt-10 min-h-[680px]">
            {props.messages.map((message, idx) => {
              const stop = ORBIT_STOPS[idx % ORBIT_STOPS.length]
              return (
                <motion.article
                  key={message.id}
                  className="absolute w-[min(320px,78vw)] rounded-[1.75rem] border border-white/60 bg-white/88 p-5 shadow-[0_26px_80px_rgba(92,30,78,.18)] backdrop-blur-sm"
                  style={{ left: stop.left, top: stop.top }}
                  initial={{ opacity: 0, scale: 0.92, y: 18 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.08, 1.2) }}
                >
                  <div className="text-sm font-semibold uppercase tracking-[.22em] text-[#8b3d54]/70">{message.displayName || 'Someone'}</div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#31143a]/78">{message.text}</p>
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
