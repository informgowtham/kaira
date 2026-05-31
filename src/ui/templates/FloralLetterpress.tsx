import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SignatureTemplateProps } from './signatureTypes'

const PETALS = Array.from({ length: 18 }, (_, idx) => ({
  left: `${(idx * 17) % 96}%`,
  delay: `${-(idx % 7) * 0.7}s`,
  size: 12 + (idx % 4) * 5,
}))

export function FloralLetterpress(props: SignatureTemplateProps & { isRevealing?: boolean; onRevealComplete?: () => void }) {
  const [showOverlay, setShowOverlay] = useState(props.isRevealing)

  useEffect(() => {
    if (props.isRevealing) setShowOverlay(true)
  }, [props.isRevealing])

  const title = props.title || (props.recipientName ? `For ${props.recipientName}` : 'A Floral Celebration')
  const messages = props.messages

  return (
    <>
      <AnimatePresence onExitComplete={() => { if (!showOverlay) props.onRevealComplete?.() }}>
        {showOverlay && (
          <motion.div 
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#1a3a29]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.5, delay: 1.5 } }}
          >
            <motion.div 
              className="absolute inset-0 pointer-events-none flex justify-between"
              exit={{ opacity: 0, transition: { delay: 1.5 } }}
            >
               {/* Left Vine Canopy */}
               <motion.div 
                 className="w-1/2 h-full bg-[#112a1d] origin-left"
                 style={{ borderRight: '8px solid #2d5a3f', borderRadius: '0 40% 40% 0' }}
                 exit={{ scaleX: 0, transition: { duration: 2, ease: "easeInOut" } }}
               />
               {/* Right Vine Canopy */}
               <motion.div 
                 className="w-1/2 h-full bg-[#112a1d] origin-right"
                 style={{ borderLeft: '8px solid #2d5a3f', borderRadius: '40% 0 0 40%' }}
                 exit={{ scaleX: 0, transition: { duration: 2, ease: "easeInOut" } }}
               />
               {/* Petals blowing */}
               {Array.from({ length: 40 }).map((_, i) => (
                 <motion.div
                   key={i}
                   className="absolute w-6 h-6 bg-rose-400/80 rounded-[70%_30%_70%_30%]"
                   style={{ 
                     left: `${Math.random() * 100}%`, 
                     top: `${Math.random() * 100}%`,
                     rotate: `${Math.random() * 360}deg` 
                   }}
                   exit={{ 
                     x: (Math.random() - 0.5) * 2000, 
                     y: (Math.random() - 0.5) * 2000,
                     rotate: Math.random() * 720,
                     opacity: 0,
                     scale: 0,
                     transition: { duration: 2.5 + Math.random(), ease: "easeOut" }
                   }}
                 />
               ))}
            </motion.div>
            
            <motion.button
              className="relative z-10 px-10 py-5 font-serif text-3xl text-rose-50 bg-[#2d4a36] border border-rose-300/50 rounded-full shadow-[0_0_40px_rgba(244,114,182,0.3)] hover:bg-[#3d5a46] transition-all tracking-widest"
              onClick={() => setShowOverlay(false)}
              exit={{ scale: 0, opacity: 0, filter: 'blur(10px)', transition: { duration: 0.8, ease: "backIn" } }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              UNVEIL
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="relative min-h-screen overflow-hidden bg-[#fff8ef] text-[#3d2430]">
      {props.topBar}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(244,114,182,.22),transparent_30%),radial-gradient(circle_at_86%_12%,rgba(251,191,36,.18),transparent_28%),linear-gradient(120deg,rgba(255,255,255,.5),transparent)]" />
      <div className="pointer-events-none absolute inset-6 rounded-[2rem] border border-rose-200/80 shadow-[inset_0_0_0_8px_rgba(255,255,255,.42)]" />
      {PETALS.map((petal, idx) => (
        <motion.div
          key={idx}
          className="pointer-events-none absolute top-[-40px] rounded-[70%_30%_70%_30%] bg-rose-300/50"
          style={{ left: petal.left, width: petal.size, height: petal.size * 1.5, animationDelay: petal.delay }}
          animate={{ y: ['0vh', '110vh'], rotate: [0, 180, 360], x: [0, idx % 2 ? 28 : -28, 0] }}
          transition={{ duration: 13 + (idx % 5), repeat: Infinity, ease: 'linear', delay: idx * 0.25 }}
        />
      ))}

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 sm:px-8">
        <header className="mx-auto max-w-3xl text-center">
          <div className="font-serif text-sm uppercase tracking-[.28em] text-rose-700/70">Pressed Floral Card</div>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-rose-950 sm:text-6xl">{title}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-rose-950/65">
            Soft letterpress paper, blooming details, and handwritten wishes.
          </p>
          {props.actionSlot ? <div className="mt-5 flex flex-wrap justify-center gap-2">{props.actionSlot}</div> : null}
        </header>

        {messages.length === 0 ? (
          <div className="mt-10">{props.emptyState}</div>
        ) : (
          <main className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {messages.map((message, idx) => (
              <motion.article
                key={message.id}
                className="relative rounded-[1.25rem] border border-rose-200 bg-white/78 p-5 shadow-[0_22px_55px_rgba(103,45,73,.16)]"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.08, 1.5) }}
              >
                <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-rose-200/70 blur-sm" />
                <div className="relative">
                  <div className="font-serif text-lg text-rose-950">{message.displayName || 'Someone'}</div>
                  <div className="mt-1 text-xs uppercase tracking-[.2em] text-rose-700/45">{new Date(message.createdAt).toLocaleDateString()}</div>
                  <p className="mt-4 whitespace-pre-wrap line-clamp-8 text-sm leading-7 text-[#4f2f3b]">{message.text}</p>
                  {(message.gifUrl || message.imageUrl) ? (
                    <img src={message.gifUrl || message.imageUrl} alt="" className="mt-4 max-h-44 w-full rounded-xl object-cover" />
                  ) : null}
                </div>
              </motion.article>
            ))}
          </main>
        )}
        {props.footerSlot ? <div className="mt-8">{props.footerSlot}</div> : null}
      </div>
    </div>
    </>
  )
}
