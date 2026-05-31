import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { 
  CalendarClock, Link2, PartyPopper, Play, Trash2, Users, Palette,
  ExternalLink, Timer, Mail
} from 'lucide-react'
import { TopBar } from '../components/TopBar'
import { Surface } from '../components/Surface'
import { Button } from '../components/Button'
import { Modal } from '../components/Modal'
import { CopyField } from '../components/CopyField'
import { Masonry } from '../components/Masonry'
import { MessageCard } from '../components/MessageCard'
import { MessageComposerModal } from '../components/MessageComposerModal'
import { Watermark } from '../components/Watermark'
import { useAppStore } from '../store/useAppStore'
import { getThemeById, messagesForBoard } from '../store/selectors'
import { useSEO } from '../utils/seo'
import { ThemeBackground } from '../components/backgrounds/ThemeBackground'
import { ThemePickerModal } from '../components/ThemePickerModal'
import { getSignatureTemplate } from '../templates/registry'
import { SignatureTemplateRenderer } from '../templates/SignatureTemplateRenderer'

export function BoardPage() {
  const { boardId = '' } = useParams()
  const navigate = useNavigate()
  const user = useAppStore((s) => s.user)!
  const plan = useAppStore((s) => s.plan)
  const boards = useAppStore((s) => s.boards)
  const allMessages = useAppStore((s) => s.messages)
  const addMessage = useAppStore((s) => s.addMessage)
  const updateBoard = useAppStore((s) => s.updateBoard)
  const deleteBoard = useAppStore((s) => s.deleteBoard)
  const hydrateOwnerBoard = useAppStore((s) => s.hydrateOwnerBoard)
  const loading = useAppStore((s) => s.loading)
  const error = useAppStore((s) => s.error)

  const [showAdd, setShowAdd] = useState(false)
  const [showInvite, setShowInvite] = useState(false)
  const [showDeliver, setShowDeliver] = useState(false)
  const [showTheme, setShowTheme] = useState(false)
  const [scheduledAt, setScheduledAt] = useState('')
  const [destinationType, setDestinationType] = useState<'recipient' | 'creator'>('recipient')
  const [recipientContact, setRecipientContact] = useState('')

  const board = useMemo(() => boards.find((b) => b.id === boardId && b.ownerId === user.id), [boards, boardId, user.id])
  const messages = useMemo(() => messagesForBoard(allMessages, boardId), [allMessages, boardId])
  const theme = getThemeById(board?.themeId)
  useSEO(board?.title || 'Dashboard')

  useEffect(() => {
    if (boardId) void hydrateOwnerBoard(boardId)
  }, [boardId, hydrateOwnerBoard])

  if (!board) {
    return (
      <div className="min-h-screen kb-grid">
        <TopBar />
        <div className="mx-auto w-full max-w-6xl px-4 pt-10 pb-12">
          <Surface className="p-6 max-w-xl">
            <div className="text-white text-lg font-semibold">Board not found</div>
            <div className="mt-1 text-sm text-white/70">This board either doesn’t exist or isn’t yours.</div>
            <Button className="mt-4" variant="primary" onClick={() => navigate('/app')}>
              Back to dashboard
            </Button>
          </Surface>
        </div>
      </div>
    )
  }

  const contributorLink = `${window.location.origin}/c/${board.id}/${board.contributorToken}`
  const revealLink = `${window.location.origin}/r/${board.id}/${board.revealToken}`
  const waText = `Hey! We’re creating a surprise card for ${board.recipientName} 🎉 Add your message here: ${contributorLink}`
  const isFreeLimitReached = plan === 'free' && messages.length >= 20
  const signatureTemplate = getSignatureTemplate(board.themeId)
  const boardActions = (
    <>
      <Button variant="secondary" left={<PartyPopper size={16} />} onClick={() => setShowAdd(true)} disabled={loading}>
        Add Message
      </Button>
      <Button variant="secondary" left={<Link2 size={16} />} onClick={() => setShowInvite(true)}>
        Invite
      </Button>
      <Button variant="secondary" left={<CalendarClock size={16} />} onClick={() => setShowDeliver(true)}>
        Deliver
      </Button>
      <Button variant="secondary" left={<Palette size={16} />} onClick={() => setShowTheme(true)}>
        Theme
      </Button>
      <Button variant="ghost" left={<Play size={16} />} onClick={() => navigate(`/r/${board.id}/${board.revealToken}`)}>
        Preview Reveal
      </Button>
    </>
  )
  const signatureEmptyState = (
    <Surface className="p-6 text-center">
      <div className="text-white text-lg font-semibold">Your card is ready</div>
      <div className="mt-1 text-sm text-white/70">Start by adding your message or invite others.</div>
      <div className="mt-4 flex flex-col sm:flex-row justify-center gap-2">
        <Button variant="primary" onClick={() => setShowAdd(true)}>
          Add First Message
        </Button>
        <Button variant="secondary" onClick={() => setShowInvite(true)}>
          Copy Invite Link
        </Button>
      </div>
    </Surface>
  )

  if (signatureTemplate) {
    return (
      <>
        <SignatureTemplateRenderer
          templateId={signatureTemplate.id}
          mode="owner"
          topBar={<TopBar />}
          title={board.title}
          recipientName={board.recipientName}
          messages={messages}
          actionSlot={boardActions}
          emptyState={signatureEmptyState}
          footerSlot={
            <div className="mx-auto flex max-w-6xl justify-end px-4">
              <Button
                variant="danger"
                left={<Trash2 size={16} />}
                onClick={async () => {
                  await deleteBoard(board.id)
                  navigate('/app')
                }}
              >
                Delete Board
              </Button>
            </div>
          }
        />
        {plan === 'free' ? <Watermark /> : null}
        {error ? <div className="fixed bottom-4 left-4 z-50 rounded-xl bg-rose-950/90 px-4 py-3 text-sm text-rose-100">{error}</div> : null}

        <MessageComposerModal
          open={showAdd}
          title="Add a message"
          onClose={() => setShowAdd(false)}
          lockedReason={
            board.status === 'delivered' || board.status === 'archived'
              ? 'This board is locked and delivered.'
              : isFreeLimitReached
              ? 'You reached the Free plan limit of 20 messages on this board. Upgrade to Pro to keep collecting.'
              : null
          }
          onSubmit={async (msg) => {
            await addMessage(board.id, { ...msg, sticker: 'sparkle' })
          }}
        />

        <Modal open={showInvite} title="Invite contributors" onClose={() => setShowInvite(false)}>
          <div className="text-sm text-white/70">Anyone can add messages, no login needed.</div>
          <div className="mt-4 grid gap-3">
            <CopyField label="Contribution link" value={contributorLink} />
            <CopyField label="Reveal preview link" value={revealLink} />
            <div className="flex flex-wrap gap-2">
              <a href={`https://wa.me/?text=${encodeURIComponent(waText)}`} target="_blank" rel="noreferrer">
                <Button variant="secondary">WhatsApp</Button>
              </a>
              <a href={`mailto:?subject=${encodeURIComponent('Join the ' + board.title)}&body=${encodeURIComponent(waText)}`} target="_blank" rel="noreferrer">
                <Button variant="secondary" left={<Mail size={14} />}>Email</Button>
              </a>
            </div>
          </div>
        </Modal>

        <Modal open={showDeliver} title="Schedule delivery" onClose={() => setShowDeliver(false)}>
          <div className="grid gap-3">
            <div>
              <div className="text-xs text-white/60">Delivery date & time</div>
              <input
                type="datetime-local"
                className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-sm text-white kb-ring"
                value={scheduledAt || board.scheduledAt?.slice(0, 16) || ''}
                onChange={(e) => setScheduledAt(e.target.value)}
              />
            </div>
            <div>
              <div className="text-xs text-white/60">Recipient contact</div>
              <input
                className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 kb-ring"
                value={recipientContact}
                onChange={(e) => setRecipientContact(e.target.value)}
                placeholder={board.recipientContact || user.email}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setShowDeliver(false)}>Close</Button>
              <Button
                variant="primary"
                disabled={!scheduledAt}
                onClick={async () => {
                  await updateBoard(board.id, {
                    scheduledAt: new Date(scheduledAt).toISOString(),
                    destinationType,
                    recipientContact,
                    status: 'scheduled',
                  })
                  setShowDeliver(false)
                }}
              >
                Save Schedule
              </Button>
            </div>
          </div>
        </Modal>

        <ThemePickerModal
          open={showTheme}
          occasion={board.occasion}
          selectedThemeId={board.themeId}
          onClose={() => setShowTheme(false)}
          onSelect={async (t) => {
            if (t.id === board.themeId) return
            await updateBoard(board.id, { themeId: t.id } as Partial<import('../store/types').Board>)
          }}
        />
      </>
    )
  }

  return (
    <ThemeBackground theme={theme} className="min-h-screen">
      <div className="kb-grid kb-page">
      <TopBar />
      {plan === 'free' ? <Watermark /> : null}
      <div className="mx-auto w-full max-w-6xl px-4 pt-8 pb-12">
          <div className="rounded-2xl border border-white/10 overflow-hidden kb-shadow kb-glow-border bg-black/20 backdrop-blur-sm">
            <div className="p-6 sm:p-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-black/30 border border-white/10 px-3 py-1 text-xs text-white/75 kb-shimmer">
                  <Users size={14} />
                  {messages.length > 0 ? `${messages.length} messages added` : 'Be the first to write something'}
                </div>
                <h1 className="mt-4 text-3xl sm:text-4xl font-semibold text-white tracking-tight">{board.title}</h1>
                <p className="mt-2 max-w-2xl text-sm sm:text-base text-white/75">
                  A collaborative celebration wall with layered cards, motion, and a cinematic reveal.
                </p>
                <div className="mt-3 text-sm text-white/70">
                  {board.scheduledAt ? (
                    <LiveCountdown iso={board.scheduledAt} onDelivered={() => useAppStore.getState().hydrateOwnerBoard(board.id)} />
                  ) : (
                    'Your card is ready.'
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" left={<PartyPopper size={16} />} onClick={() => setShowAdd(true)} disabled={loading}>
                  Add Message
                </Button>
                <Button variant="secondary" left={<Link2 size={16} />} onClick={() => setShowInvite(true)}>
                  Invite
                </Button>
                <Button variant="secondary" left={<CalendarClock size={16} />} onClick={() => setShowDeliver(true)}>
                  Deliver
                </Button>
                <Button variant="secondary" left={<Palette size={16} />} onClick={() => setShowTheme(true)}>
                  Theme
                </Button>
                <Button variant="ghost" left={<Play size={16} />} onClick={() => navigate(`/r/${board.id}/${board.revealToken}`)}>
                  Preview Reveal
                </Button>
              </div>
            </div>
          </div>

        <div className="mt-6">
          {messages.length === 0 ? (
            <Surface className="p-6 text-center">
              <div className="text-white text-lg font-semibold">Your card is ready</div>
              <div className="mt-1 text-sm text-white/70">Start by adding your message or invite others.</div>
              <div className="mt-4 flex flex-col sm:flex-row justify-center gap-2">
                <Button variant="primary" onClick={() => setShowAdd(true)}>
                  Add First Message
                </Button>
                <Button variant="secondary" onClick={() => setShowInvite(true)}>
                  Copy Invite Link
                </Button>
              </div>
            </Surface>
          ) : (
            <Masonry>
              {messages.map((message, idx) => (
                <MessageCard
                  key={message.id}
                  message={message}
                  accent={idx % 3 === 0 ? 'violet' : idx % 3 === 1 ? 'blue' : 'teal'}
                />
              ))}
            </Masonry>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            variant="danger"
            left={<Trash2 size={16} />}
            onClick={async () => {
              await deleteBoard(board.id)
              navigate('/app')
            }}
          >
            Delete Board
          </Button>
        </div>
        {error ? <div className="mt-3 text-sm text-rose-200">{error}</div> : null}
      </div>

      <MessageComposerModal
        open={showAdd}
        title="Add a message"
        onClose={() => setShowAdd(false)}
        lockedReason={
          board.status === 'delivered' || board.status === 'archived'
            ? 'This board is locked and delivered.'
            : isFreeLimitReached
            ? 'You reached the Free plan limit of 20 messages on this board. Upgrade to Pro to keep collecting.'
            : null
        }
        onSubmit={async (msg) => {
          await addMessage(board.id, { ...msg, sticker: 'sparkle' })
        }}
      />

      <Modal open={showInvite} title="Invite contributors" onClose={() => setShowInvite(false)}>
        <div className="text-sm text-white/70">Anyone can add messages, no login needed.</div>
        <div className="mt-4 grid gap-3">
          <CopyField label="Contribution link" value={contributorLink} />
          <CopyField label="Reveal preview link" value={revealLink} />
          <div className="flex flex-wrap gap-2">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(waText)}`}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="secondary">WhatsApp</Button>
            </a>
            <a
              href={`mailto:?subject=${encodeURIComponent('Join the ' + board.title)}&body=${encodeURIComponent(waText)}`}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="secondary" left={<Mail size={14} />}>Email</Button>
            </a>
            <a
              href={`https://slack.com/share?text=${encodeURIComponent(waText)}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 min-w-[120px]"
            >
              <Button variant="secondary" className="w-full" left={<ExternalLink size={14} />}>Slack</Button>
            </a>
          </div>
        </div>
      </Modal>

      <Modal open={showDeliver} title="Schedule delivery" onClose={() => setShowDeliver(false)}>
        <div className="grid gap-3">
          <div>
            <div className="text-xs text-white/60">Delivery date & time</div>
            <input
              type="datetime-local"
              className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-sm text-white kb-ring"
              value={scheduledAt || board.scheduledAt?.slice(0, 16) || ''}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              className={`kb-ring rounded-xl border p-3 text-left ${destinationType === 'recipient' ? 'bg-white/10 border-white/25' : 'bg-black/20 border-white/10'}`}
              onClick={() => setDestinationType('recipient')}
            >
              <div className="text-sm font-semibold text-white">Send to recipient</div>
              <div className="mt-1 text-xs text-white/60">Email or phone</div>
            </button>
            <button
              className={`kb-ring rounded-xl border p-3 text-left ${destinationType === 'creator' ? 'bg-white/10 border-white/25' : 'bg-black/20 border-white/10'}`}
              onClick={() => setDestinationType('creator')}
            >
              <div className="text-sm font-semibold text-white">Send to creator</div>
              <div className="mt-1 text-xs text-white/60">Manual review or share</div>
            </button>
          </div>
          <div>
            <div className="text-xs text-white/60">{destinationType === 'recipient' ? 'Recipient contact' : 'Creator contact'}</div>
            <input
              className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 kb-ring"
              value={recipientContact}
              onChange={(e) => setRecipientContact(e.target.value)}
              placeholder={destinationType === 'recipient' ? 'sarah@example.com' : user.email}
            />
          </div>

          <div className="kb-glass rounded-xl border border-white/10 p-4">
            <div className="text-sm font-semibold text-white">Countdown preview</div>
            <div className="mt-1 text-sm text-white/70">
              {scheduledAt ? (
                <LiveCountdown iso={new Date(scheduledAt).toISOString()} onDelivered={() => {}} />
              ) : board.scheduledAt ? (
                <LiveCountdown iso={board.scheduledAt} onDelivered={() => {}} />
              ) : (
                'Choose a date and time to preview delivery timing.'
              )}
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setShowDeliver(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              disabled={!scheduledAt}
              onClick={async () => {
                await updateBoard(board.id, {
                  scheduledAt: new Date(scheduledAt).toISOString(),
                  destinationType,
                  recipientContact,
                  status: 'scheduled',
                })
                setShowDeliver(false)
              }}
            >
              Save Schedule
            </Button>
          </div>
        </div>
      </Modal>

      <ThemePickerModal
        open={showTheme}
        occasion={board.occasion}
        selectedThemeId={board.themeId}
        onClose={() => setShowTheme(false)}
        onSelect={async (t) => {
          if (t.id === board.themeId) return
          await updateBoard(board.id, { themeId: t.id } as Partial<import('../store/types').Board>)
        }}
      />
    </div>
    </ThemeBackground>
  )
}

function formatCountdown(iso: string) {
  const delta = new Date(iso).getTime() - Date.now()
  if (Number.isNaN(delta)) return 'Pick a valid delivery time.'
  if (delta <= 0) return 'Delivery time reached.'
  
  const totalSeconds = Math.floor(delta / 1000)
  const days = Math.floor(totalSeconds / (60 * 60 * 24))
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60))
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60)
  const seconds = totalSeconds % 60

  const parts = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}m`)
  parts.push(`${seconds}s`)
  
  return `Delivering in ${parts.join(' ')}`
}

function LiveCountdown({ iso, onDelivered }: { iso: string; onDelivered: () => void }) {
  const [text, setText] = useState(formatCountdown(iso))
  useEffect(() => {
    const interval = setInterval(() => {
      const nextText = formatCountdown(iso)
      setText(nextText)
      if (nextText === 'Delivery time reached.') {
        onDelivered()
        clearInterval(interval)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [iso, onDelivered])
  return (
    <span className="flex items-center gap-1.5">
      <Timer size={14} className="animate-pulse" />
      {text}
    </span>
  )
}
