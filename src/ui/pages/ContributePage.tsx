import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { HeartHandshake, Link2 } from 'lucide-react'
import { TopBar } from '../components/TopBar'
import { Surface } from '../components/Surface'
import { Button } from '../components/Button'
import { Masonry } from '../components/Masonry'
import { MessageCard } from '../components/MessageCard'
import { MessageComposerModal } from '../components/MessageComposerModal'
import { useAppStore } from '../store/useAppStore'
import { getThemeById, messagesForBoard } from '../store/selectors'
import { useSEO } from '../utils/seo'
import { ThemeBackground } from '../components/backgrounds/ThemeBackground'
import { getSignatureTemplate } from '../templates/registry'
import { SignatureTemplateRenderer } from '../templates/SignatureTemplateRenderer'

export function ContributePage() {
  const { boardId = '', token = '' } = useParams()
  const boards = useAppStore((s) => s.boards)
  const addPublicBoardMessage = useAppStore((s) => s.addPublicBoardMessage)
  const hydratePublicBoard = useAppStore((s) => s.hydratePublicBoard)
  const messages = useAppStore((s) => s.messages)
  const loading = useAppStore((s) => s.loading)
  const error = useAppStore((s) => s.error)
  const [showAdd, setShowAdd] = useState(false)

  const board = useMemo(() => boards.find((b) => b.id === boardId && b.contributorToken === token), [boards, boardId, token])
  const boardMessages = useMemo(() => messagesForBoard(messages, boardId), [messages, boardId])
  const theme = getThemeById(board?.themeId)
  const signatureTemplate = getSignatureTemplate(board?.themeId)

  useEffect(() => {
    if (boardId && token) void hydratePublicBoard(boardId, token)
  }, [boardId, token, hydratePublicBoard])

  useSEO(board ? `Add to ${board.recipientName}'s Card` : 'Contribute')

  if (!board) {
    return (
      <div className="min-h-screen kb-grid">
        <TopBar compact />
        <div className="mx-auto w-full max-w-5xl px-4 pt-10 pb-12">
          <Surface className="p-6 max-w-xl">
            <div className="text-white text-lg font-semibold">This contribution link isn’t valid</div>
            <div className="mt-1 text-sm text-white/70">Please check the URL or ask the creator for a new link.</div>
          </Surface>
        </div>
      </div>
    )
  }

  if (signatureTemplate) {
    return (
      <>
        <SignatureTemplateRenderer
          templateId={signatureTemplate.id}
          mode="contributor"
          topBar={<TopBar compact />}
          title={board.title}
          recipientName={board.recipientName}
          messages={boardMessages}
          actionSlot={
            <>
              <Button variant="primary" onClick={() => setShowAdd(true)} disabled={loading}>
                Add Message
              </Button>
              <Button
                variant="secondary"
                left={<Link2 size={16} />}
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(window.location.href)
                  } catch {
                    // ignore
                  }
                }}
              >
                Copy Link
              </Button>
            </>
          }
          emptyState={
            <Surface className="p-6 text-center">
              <div className="text-white text-lg font-semibold">Be the first to write something</div>
              <div className="mt-1 text-sm text-white/70">A heartfelt note, inside joke, or photo can set the tone.</div>
              <Button className="mt-4" variant="secondary" onClick={() => setShowAdd(true)}>
                Add your message
              </Button>
            </Surface>
          }
        />
        {error ? <div className="fixed bottom-4 left-4 z-50 rounded-xl bg-rose-950/90 px-4 py-3 text-sm text-rose-100">{error}</div> : null}
        <MessageComposerModal
          open={showAdd}
          title="Add your message"
          onClose={() => setShowAdd(false)}
          lockedReason={
            board.status === 'delivered' || board.status === 'archived'
              ? 'This board is locked and delivered.'
              : null
          }
          onSubmit={async (msg) => {
            await addPublicBoardMessage(board.id, token, { ...msg, sticker: 'heart' })
          }}
        />
      </>
    )
  }

  return (
    <ThemeBackground theme={theme} className="min-h-screen">
      <div className="kb-grid">
      <TopBar compact />
      <div className="mx-auto w-full max-w-5xl px-4 pt-8 pb-12">
        <div className="rounded-2xl border border-white/10 overflow-hidden kb-shadow bg-black/20 backdrop-blur-sm">
          <div className="p-6 sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-black/30 border border-white/10 px-3 py-1 text-xs text-white/70">
              <HeartHandshake size={14} />
              Join the celebration
            </div>
            <h1 className="mt-4 text-3xl sm:text-4xl font-semibold text-white tracking-tight">{board.title}</h1>
            <p className="mt-2 text-sm text-white/75">Add a heartfelt message, a funny GIF, or a favorite memory to help build the surprise. No login required.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="primary" onClick={() => setShowAdd(true)} disabled={loading}>
                Add Message
              </Button>
              <Button
                variant="secondary"
                left={<Link2 size={16} />}
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(window.location.href)
                  } catch {
                    // ignore
                  }
                }}
              >
                Copy Link
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          {boardMessages.length === 0 ? (
            <Surface className="p-6 text-center">
              <div className="text-white text-lg font-semibold">Be the first to write something</div>
              <div className="mt-1 text-sm text-white/70">A heartfelt note, inside joke, or photo can set the tone.</div>
              <Button className="mt-4" variant="secondary" onClick={() => setShowAdd(true)}>
                Add your message
              </Button>
            </Surface>
          ) : (
            <Masonry>
              {boardMessages.map((message, idx) => (
                <MessageCard key={message.id} message={message} accent={idx % 2 === 0 ? 'blue' : 'teal'} />
              ))}
            </Masonry>
          )}
        </div>
        {error ? <div className="mt-3 text-sm text-rose-200">{error}</div> : null}
      </div>

      <MessageComposerModal
        open={showAdd}
        title="Add your message"
        onClose={() => setShowAdd(false)}
        lockedReason={
          board.status === 'delivered' || board.status === 'archived'
            ? 'This board is locked and delivered.'
            : null
        }
        onSubmit={async (msg) => {
          await addPublicBoardMessage(board.id, token, { ...msg, sticker: 'heart' })
        }}
      />
    </div>
    </ThemeBackground>
  )
}
