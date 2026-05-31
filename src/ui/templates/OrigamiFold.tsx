import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SignatureTemplateProps } from './signatureTypes'

export function OrigamiFold(props: SignatureTemplateProps & { isRevealing?: boolean; onRevealComplete?: () => void }) {
  const [isUnveiling, setIsUnveiling] = useState(false)
  const title = props.title || (props.recipientName ? `For ${props.recipientName}` : 'Folded With Care')

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#f8fbff,#eef2ff_52%,#ffffff)] text-slate-950">
      <AnimatePresence onExitComplete={() => { if (isUnveiling && props.onRevealComplete) props.onRevealComplete(); }}>
        {props.isRevealing && !isUnveiling && (
          <motion.div
            className="fixed inset-0 z-[999999] flex items-center justify-center bg-indigo-600 origin-center overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ 
              scaleX: [1, 0.5, 0.5, 0], 
              scaleY: [1, 1, 0.5, 0],
              rotateZ: [0, 90, 180, 270],
              opacity: [1, 1, 1, 0],
              transition: { duration: 2.5, ease: "easeInOut" } 
            }}
          >
            {/* Some fold lines for texture */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(45deg,transparent_49%,white_49%,white_51%,transparent_51%)] bg-[length:100px_100px]" />
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(-45deg,transparent_49%,white_49%,white_51%,transparent_51%)] bg-[length:100px_100px]" />
            
            <motion.button
              onClick={() => setIsUnveiling(true)}
              className="relative z-10 px-12 py-4 text-xl font-bold tracking-[0.2em] text-indigo-600 bg-white shadow-2xl hover:bg-indigo-50 transition-colors uppercase cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              exit={{ opacity: 0, scale: 0, transition: { duration: 0.5 } }}
            >
              Unfold Paper
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      {props.topBar}
      <div className="pointer-events-none absolute inset-0">
        {[0, 1, 2, 3, 4].map((idx) => (
          <motion.div
            key={idx}
            className="absolute bg-white shadow-2xl [clip-path:polygon(0_0,100%_42%,0_100%,25%_48%)]"
            style={{ left: `${8 + idx * 19}%`, top: `${10 + (idx % 3) * 21}%`, width: 130, height: 108 }}
            animate={{ y: [0, -12, 0], rotate: [-8 + idx * 6, -3 + idx * 6, -8 + idx * 6] }}
            transition={{ duration: 5 + idx, repeat: Infinity }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 sm:px-8">
        <header className="max-w-3xl">
          <div className="text-sm font-semibold uppercase tracking-[.25em] text-indigo-700/70">Origami Fold</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">Messages unfold like paper planes across a bright handmade canvas.</p>
          {props.actionSlot ? <div className="mt-5 flex flex-wrap gap-2">{props.actionSlot}</div> : null}
        </header>

        {props.messages.length === 0 ? (
          <div className="mt-10">{props.emptyState}</div>
        ) : (
          <main className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            {props.messages.map((message, idx) => (
              <motion.article
                key={message.id}
                className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-white/88 p-5 shadow-[0_24px_60px_rgba(79,70,229,.13)]"
                initial={{ opacity: 0, rotateX: -18, y: 22 }}
                animate={{ opacity: 1, rotateX: 0, y: 0 }}
                transition={{ delay: Math.min(idx * 0.09, 1.5) }}
              >
                <div className="absolute right-0 top-0 h-full w-1/3 bg-indigo-50 [clip-path:polygon(100%_0,0_50%,100%_100%)]" />
                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div className="font-semibold text-indigo-950">{message.displayName || 'Someone'}</div>
                    <div className="text-2xl">{message.emoji || '✈️'}</div>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap line-clamp-8 text-sm leading-7 text-slate-700">{message.text}</p>
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
  )
}
