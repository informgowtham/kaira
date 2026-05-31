import { useMemo, useState, useRef, useEffect } from 'react'
import { Image, PartyPopper, Sparkles, Upload, Loader2, X, Search } from 'lucide-react'
import { Button } from './Button'
import { Modal } from './Modal'
import { fetchGifs, uploadFile } from '../store/api'

const EMOJIS = ['🎉', '💛', '✨', '🙌', '👏', '🌟', '🥳', '💐', '🔥', '🎂']

export function MessageComposerModal(props: {
  open: boolean
  title: string
  onClose: () => void
  onSubmit: (msg: { displayName?: string; text: string; emoji?: string; gifUrl?: string; imageUrl?: string }) => void
  lockedReason?: string | null
}) {
  const { open, title, onClose, onSubmit, lockedReason } = props
  const [displayName, setDisplayName] = useState('')
  const [text, setText] = useState('')
  const [emoji, setEmoji] = useState<string | undefined>(undefined)
  const [gifUrl, setGifUrl] = useState('')
  const [gifQuery, setGifQuery] = useState('')
  const [gifs, setGifs] = useState<any[]>([])
  const [isSearchingGifs, setIsSearchingGifs] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // GIF search via backend proxy (keeps provider key server-side).
  useEffect(() => {
    const loadGifs = async () => {
      try {
        setIsSearchingGifs(true)
        const results = await fetchGifs(gifQuery)
        setGifs(results)
        setUploadError(null)
      } catch (err) {
        console.error('GIF search error:', err)
        setUploadError('Failed to fetch GIFs right now.')
      } finally {
        setIsSearchingGifs(false)
      }
    }

    const handler = setTimeout(loadGifs, 500)
    return () => clearTimeout(handler)
  }, [gifQuery])

  const canSubmit = useMemo(() => Boolean(text.trim()) && !lockedReason, [text, lockedReason])

  return (
    <Modal
      open={open}
      title={title}
      onClose={() => {
        onClose()
      }}
    >
      {lockedReason ? (
        <div className="kb-glass rounded-xl border border-white/10 p-4 text-sm text-white/75">{lockedReason}</div>
      ) : null}

      <div className="mt-3 grid gap-3">
        <div>
          <div className="text-xs text-white/60">Name (optional)</div>
          <input
            className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 kb-ring"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="e.g., Priya"
            disabled={Boolean(lockedReason)}
          />
        </div>
        <div>
          <div className="text-xs text-white/60">Message</div>
          <textarea
            className="mt-1 min-h-[120px] w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 kb-ring resize-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write something warm, funny, or heartfelt..."
            disabled={Boolean(lockedReason)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {EMOJIS.map((e) => (
              <button
                key={e}
                className={`kb-ring h-9 w-9 rounded-lg border transition ${
                  emoji === e ? 'bg-white/10 border-white/25' : 'bg-black/20 border-white/10 hover:bg-white/8'
                }`}
                onClick={() => setEmoji((cur) => (cur === e ? undefined : e))}
                disabled={Boolean(lockedReason)}
                aria-label={`Emoji ${e}`}
              >
                <span className="text-base">{e}</span>
              </button>
            ))}
          </div>
          <div className="text-xs text-white/60 flex items-center gap-2">
            <Sparkles size={14} />
            Expression matters
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="kb-glass rounded-xl border border-white/10 p-3 flex flex-col">
            <div className="text-xs text-white/60 flex items-center gap-2">
              <PartyPopper size={14} />
              GIF Search
            </div>
            <div className="relative mt-2">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                className="w-full rounded-lg bg-black/30 border border-white/10 pl-9 pr-3 py-2 text-sm text-white placeholder:text-white/40 kb-ring"
                value={gifQuery}
                onChange={(e) => setGifQuery(e.target.value)}
                placeholder="Search GIFs..."
                disabled={Boolean(lockedReason) || isUploading}
              />
            </div>

            {gifUrl && (
              <div className="mt-2 relative group rounded-lg overflow-hidden border border-white/20 aspect-video bg-black/40">
                <img src={gifUrl} alt="Selected GIF" className="w-full h-full object-cover" />
                <button 
                  className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition"
                  onClick={() => setGifUrl('')}
                >
                  <X size={12} />
                </button>
              </div>
            )}

            {!gifUrl && gifs.length > 0 && (
              <div className="mt-2 grid grid-cols-4 gap-1 max-h-[120px] overflow-y-auto pr-1 kb-scrollbar">
                {gifs.map((g: any) => {
                  // Klipy format: g.file.sd.gif.url or similar
                  const thumb = g.file?.sd?.webp?.url || g.file?.sd?.gif?.url || g.file?.hd?.gif?.url
                  const full = g.file?.hd?.gif?.url || g.file?.sd?.gif?.url
                  
                  return (
                    <button
                      key={g.id || g.slug}
                      className="aspect-square rounded border border-white/5 overflow-hidden hover:border-white/40 transition"
                      onClick={() => {
                        setGifUrl(full)
                        setGifQuery('')
                        setGifs([])
                      }}
                    >
                      <img src={thumb} alt="gif" className="w-full h-full object-cover" />
                    </button>
                  )
                })}
              </div>
            )}

            {isSearchingGifs && (
              <div className="mt-2 flex items-center justify-center py-2">
                <Loader2 size={16} className="animate-spin text-white/40" />
              </div>
            )}

            <div className="mt-2 pt-2 border-t border-white/5">
              <div className="text-[10px] text-white/40 uppercase tracking-wider">Or paste direct URL</div>
              <input
                className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-1.5 text-xs text-white placeholder:text-white/30 kb-ring"
                value={gifUrl}
                onChange={(e) => setGifUrl(e.target.value)}
                placeholder="https://media.giphy.com/..."
                disabled={Boolean(lockedReason) || isUploading}
              />
            </div>
          </div>
          <div className="kb-glass rounded-xl border border-white/10 p-3 flex flex-col items-start">
            <div className="text-xs text-white/60 flex items-center gap-2">
              <Image size={14} />
              Photo Upload
            </div>
            {imageFile ? (
              <div className="mt-2 flex items-center gap-2 w-full bg-black/30 px-3 py-2 rounded-lg border border-white/10">
                <div className="text-sm text-white truncate flex-1">{imageFile.name}</div>
                <button
                  className="text-white/60 hover:text-white"
                  onClick={() => setImageFile(null)}
                  disabled={Boolean(lockedReason) || isUploading}
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <Button
                variant="secondary"
                className="mt-2 w-full justify-center text-xs"
                onClick={() => fileInputRef.current?.click()}
                disabled={Boolean(lockedReason) || isUploading}
                left={<Upload size={14} />}
              >
                Choose Image
              </Button>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) setImageFile(file)
                e.target.value = ''
              }}
            />
          </div>
        </div>
        {uploadError && <div className="text-sm text-rose-300">{uploadError}</div>}

        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={!canSubmit || isUploading}
            left={isUploading ? <Loader2 size={16} className="animate-spin" /> : undefined}
            onClick={async () => {
              try {
                setIsUploading(true)
                setUploadError(null)
                let finalImageUrl: string | undefined
                if (imageFile) {
                  finalImageUrl = await uploadFile(imageFile)
                }

                onSubmit({
                  displayName: displayName.trim() || undefined,
                  text: text.trim(),
                  emoji,
                  gifUrl: gifUrl.trim() || undefined,
                  imageUrl: finalImageUrl,
                })
                setDisplayName('')
                setText('')
                setEmoji(undefined)
                setGifUrl('')
                setImageFile(null)
                onClose()
              } catch (err) {
                setUploadError(err instanceof Error ? err.message : 'Upload failed')
              } finally {
                setIsUploading(false)
              }
            }}
          >
            {isUploading ? 'Uploading...' : 'Add Message'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
