import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo } from 'react'
import type { SignatureTemplateProps } from './signatureTypes'

export function ScrapbookTape(props: SignatureTemplateProps) {
  const title = props.title || (props.recipientName ? `Scrapbook for ${props.recipientName}` : 'Celebration Scrapbook')
  const [startedReveal, setStartedReveal] = useState(false)

  const tapes = useMemo(() => {
    return Array.from({ length: 60 }).map(() => {
      const isRibbon = Math.random() > 0.85
      const width = isRibbon ? 2000 : Math.random() * 800 + 300
      const height = isRibbon ? 30 : Math.random() * 60 + 50
      return {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        rotate: (Math.random() - 0.5) * 180,
        width,
        height,
        color: isRibbon ? '#e11d48' : '#fef8e7',
        isRibbon,
        delay: Math.random() * 0.4,
        exitX: (Math.random() > 0.5 ? 1 : -1) * (1500 + Math.random() * 1000),
        exitY: (Math.random() - 0.5) * 1500,
        exitRot: (Math.random() - 0.5) * 720
      }
    })
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fff9ea] text-slate-950">
      <AnimatePresence onExitComplete={() => {
        if (startedReveal) {
          props.onRevealComplete?.()
        }
      }}>
        {props.isRevealing && !startedReveal && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#a68a64]"
            exit={{ opacity: 0, transition: { duration: 2, ease: 'easeInOut', delay: 0.5 } }}
          >
            <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(45deg,rgba(0,0,0,.1)_25%,transparent_25%,transparent_50%,rgba(0,0,0,.1)_50%,rgba(0,0,0,.1)_75%,transparent_75%,transparent)] [background-size:20px_20px]" />
            
            {tapes.map((t, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: t.left, top: t.top, width: `${t.width}px`, height: `${t.height}px`, backgroundColor: t.color,
                  marginLeft: `-${t.width / 2}px`, marginTop: `-${t.height / 2}px`,
                  opacity: t.isRibbon ? 1 : 0.9,
                  border: t.isRibbon ? 'none' : '1px solid rgba(0,0,0,0.05)',
                  boxShadow: t.isRibbon ? '0 4px 15px rgba(0,0,0,0.3)' : '0 2px 10px rgba(0,0,0,0.1)'
                }}
                initial={{ rotate: t.rotate, scale: 1 }}
                exit={{
                  x: t.exitX,
                  y: t.exitY,
                  rotate: t.exitRot,
                  transition: { duration: 0.6, delay: t.delay, ease: 'easeIn' }
                }}
              />
            ))}
            <motion.button
              className="relative z-10 flex h-40 w-40 items-center justify-center rounded-full bg-[#fcd34d] border-8 border-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] text-3xl font-black text-amber-900"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9, rotate: -10 }}
              onClick={() => setStartedReveal(true)}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.3 } }}
            >
              SNIP!
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

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
