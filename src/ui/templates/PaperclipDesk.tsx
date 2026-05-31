import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo } from 'react'
import type { SignatureTemplateProps } from './signatureTypes'

export function PaperclipDesk(props: SignatureTemplateProps) {
  const title = props.title || (props.recipientName ? `Notes for ${props.recipientName}` : 'Team Notes')
  const [startedReveal, setStartedReveal] = useState(false)

  const papers = useMemo(() => {
    const colors = ['#fdfbf7', '#f4f1e1', '#e8e2d2', '#dcd5c4', '#e2e8f0', '#fef3c7']
    return Array.from({ length: 45 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      rotate: (Math.random() - 0.5) * 180,
      width: `${Math.random() * 200 + 150}px`,
      height: `${Math.random() * 300 + 200}px`,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.4,
      exitX: (Math.random() > 0.5 ? 1 : -1) * (1500 + Math.random() * 1000),
      exitY: (Math.random() - 0.5) * 1500,
      exitRot: (Math.random() - 0.5) * 720
    }))
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#cdb38f] text-[#22170f]">
      <AnimatePresence onExitComplete={() => {
        if (startedReveal) {
          props.onRevealComplete?.()
        }
      }}>
        {props.isRevealing && !startedReveal && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#4a3928]/95 backdrop-blur-sm"
            exit={{ opacity: 0, transition: { duration: 2.5, ease: 'easeInOut', delay: 0.6 } }}
          >
            {papers.map((p, i) => (
              <motion.div
                key={i}
                className="absolute rounded-sm border border-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
                style={{
                  left: p.left, top: p.top, width: p.width, height: p.height, backgroundColor: p.color,
                  marginLeft: `-${parseInt(p.width) / 2}px`, marginTop: `-${parseInt(p.height) / 2}px`
                }}
                initial={{ rotate: p.rotate, scale: 1 }}
                exit={{
                  x: p.exitX,
                  y: p.exitY,
                  rotate: p.exitRot,
                  transition: { duration: 0.8, delay: p.delay, ease: 'backIn' }
                }}
              >
                <div className="flex flex-col gap-3 p-5 opacity-20">
                  <div className="h-3 w-3/4 rounded-full bg-black" />
                  <div className="h-3 w-full rounded-full bg-black" />
                  <div className="h-3 w-5/6 rounded-full bg-black" />
                  <div className="mt-4 h-3 w-1/2 rounded-full bg-black" />
                </div>
              </motion.div>
            ))}
            <motion.button
              className="relative z-10 rounded-md border-4 border-red-800 bg-[#fdfbf7] px-12 py-5 text-4xl font-black tracking-widest text-red-800 shadow-[0_15px_50px_rgba(0,0,0,0.6)]"
              initial={{ rotate: -5 }}
              whileHover={{ scale: 1.05, rotate: -2 }}
              whileTap={{ scale: 0.95, rotate: -8 }}
              onClick={() => setStartedReveal(true)}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.3 } }}
            >
              CLEAR DESK
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {props.topBar}
      <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(90deg,rgba(84,50,24,.22)_1px,transparent_1px),linear-gradient(rgba(84,50,24,.15)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,.38),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(55,48,163,.18),transparent_30%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 sm:px-8">
        <header className="rounded-2xl border border-white/40 bg-[#f8f1df]/80 p-6 shadow-[0_25px_80px_rgba(66,37,16,.24)]">
          <div className="text-sm font-semibold uppercase tracking-[.24em] text-blue-800/65">Paperclip Desk</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-700">Editorial desk notes, clipped memories, and send-off messages arranged like a thoughtful workspace.</p>
          {props.actionSlot ? <div className="mt-5 flex flex-wrap gap-2">{props.actionSlot}</div> : null}
        </header>

        {props.messages.length === 0 ? (
          <div className="mt-10">{props.emptyState}</div>
        ) : (
          <main className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {props.messages.map((message, idx) => (
              <motion.article
                key={message.id}
                className="relative min-h-52 rounded-sm bg-[#fffbea] p-5 shadow-[0_24px_55px_rgba(53,33,17,.28)]"
                style={{ rotate: `${[-2, 1.5, -1, 2][idx % 4]}deg` }}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.08, 1.5) }}
              >
                <div className="absolute -top-5 left-8 h-12 w-7 rounded-full border-[3px] border-blue-600" />
                <div className="absolute left-0 top-0 h-3 w-full bg-blue-600/15" />
                <div className="mt-5 font-semibold text-stone-900">{message.displayName || 'Someone'}</div>
                <p className="mt-3 whitespace-pre-wrap line-clamp-8 text-sm leading-7 text-stone-700">{message.text}</p>
                {(message.gifUrl || message.imageUrl) ? (
                  <img src={message.gifUrl || message.imageUrl} alt="" className="mt-4 max-h-44 w-full rounded-md object-cover" />
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
