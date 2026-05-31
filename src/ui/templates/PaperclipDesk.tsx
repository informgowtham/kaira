import { motion } from 'framer-motion'
import type { SignatureTemplateProps } from './signatureTypes'

export function PaperclipDesk(props: SignatureTemplateProps) {
  const title = props.title || (props.recipientName ? `Notes for ${props.recipientName}` : 'Team Notes')

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#cdb38f] text-[#22170f]">
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
