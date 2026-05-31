import { motion } from 'framer-motion'
import type { SignatureTemplateProps } from './signatureTypes'

export function MemoryLanePaper(props: SignatureTemplateProps) {
  const title = props.title || (props.recipientName ? `Memory Lane for ${props.recipientName}` : 'Memory Lane')

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8efe1] text-[#3b2614]">
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
