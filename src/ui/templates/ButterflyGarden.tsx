import { motion } from 'framer-motion'
import type { SignatureTemplateProps } from './signatureTypes'

function Butterfly({ className = '' }: { className?: string }) {
  return (
    <div className={`flex gap-0.5 ${className}`}>
      <div className="h-12 w-9 rounded-[80%_45%_80%_45%] border-[5px] border-gray-300 bg-pink-50" />
      <div className="h-12 w-9 rounded-[45%_80%_45%_80%] border-[5px] border-gray-300 bg-violet-50" />
    </div>
  )
}

export function ButterflyGarden(props: SignatureTemplateProps) {
  const title = props.title || (props.recipientName ? `Happy Birthday ${props.recipientName}` : 'A Butterfly Garden')

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-purple-950">
      {props.topBar}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1200 800" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 650 C180 280 330 850 560 360 C760 -40 910 560 1200 220" fill="none" stroke="#d4d4d8" strokeDasharray="20 20" strokeWidth="8" opacity=".8" />
        <path d="M0 240 C180 90 320 380 470 170 C650 -70 850 300 1200 80" fill="none" stroke="#e9d5ff" strokeDasharray="14 18" strokeWidth="5" opacity=".75" />
      </svg>
      {[12, 40, 70, 86].map((left, idx) => (
        <motion.div
          key={left}
          className="pointer-events-none absolute"
          style={{ left: `${left}%`, top: `${12 + (idx % 3) * 22}%` }}
          animate={{ y: [0, -14, 0], rotate: [-6, 8, -6] }}
          transition={{ duration: 4.5 + idx, repeat: Infinity }}
        >
          <Butterfly />
        </motion.div>
      ))}

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 sm:px-8">
        <header className="mx-auto max-w-3xl text-center">
          <div className="text-sm font-semibold uppercase tracking-[.25em] text-purple-500/75">Butterfly Garden</div>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-purple-950 sm:text-6xl">{title}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-purple-950/60">A bright greeting-card field with wishes following gentle flight paths.</p>
          {props.actionSlot ? <div className="mt-5 flex flex-wrap justify-center gap-2">{props.actionSlot}</div> : null}
        </header>

        {props.messages.length === 0 ? (
          <div className="mt-10">{props.emptyState}</div>
        ) : (
          <main className="relative mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {props.messages.map((message, idx) => (
              <motion.article
                key={message.id}
                className="relative rounded-[2rem] border border-purple-100 bg-white/90 p-5 shadow-[0_20px_70px_rgba(147,51,234,.14)]"
                initial={{ opacity: 0, y: 28, scale: .95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: Math.min(idx * 0.08, 1.5) }}
              >
                <div className="absolute -right-5 -top-5 scale-75 opacity-70"><Butterfly /></div>
                <div className="font-semibold">{message.displayName || 'Someone'}</div>
                <p className="mt-3 whitespace-pre-wrap line-clamp-8 text-sm leading-7 text-purple-950/75">{message.text}</p>
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
