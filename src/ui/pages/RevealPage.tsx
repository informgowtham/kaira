import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, RoundedBox } from '@react-three/drei'
import confetti from 'canvas-confetti'
import { 
  Loader2, Heart, Play, Sparkles, FileDown, FileText, Download 
} from 'lucide-react'
import type { Group } from 'three'

import { TopBar } from '../components/TopBar'
import { Surface } from '../components/Surface'
import { Button } from '../components/Button'
import { Masonry } from '../components/Masonry'
import { MessageCard } from '../components/MessageCard'
import { ThemeBackground } from '../components/backgrounds/ThemeBackground'

import { getReveal } from '../store/api'
import { getThemeById } from '../store/selectors'
import { useSEO } from '../utils/seo'
import type { Board, Message, BoardTheme } from '../store/types'

export function RevealPage() {
  const { boardId = '', token = '' } = useParams()
  const [board, setBoard] = useState<Board | null>(null)
  const [revealMessages, setRevealMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stage, setStage] = useState<'anticipation' | 'opening' | 'messages' | 'ending'>('anticipation')
  const [opened, setOpened] = useState(false)

  const theme = getThemeById(board?.themeId)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const data = await getReveal(boardId, token)
        setBoard(data.board)
        setRevealMessages(data.messages)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load reveal')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [boardId, token])

  useEffect(() => {
    if (opened) {
      const timeout = window.setTimeout(() => {
        setStage('messages')
      }, 1600)
      confetti({ particleCount: 120, spread: 84, origin: { y: 0.6 } })
      return () => window.clearTimeout(timeout)
    }
  }, [opened])

  const handleDownloadMemory = (format: 'html' | 'pdf') => {
    if (!board) return

    if (format === 'pdf') {
      // For PDF, we use a specialized print window
      const printWindow = window.open('', '_blank')
      if (!printWindow) return
      
      const content = generateMemoryHtml(board, revealMessages)
      printWindow.document.write(content)
      printWindow.document.close()
      
      // Give it a moment to load fonts
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 1000)
      return
    }

    const html = generateMemoryHtml(board, revealMessages)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `memory-${board.title.toLowerCase().replace(/\s+/g, '-')}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    if (stage === 'messages') {
      const timeout = window.setTimeout(() => setStage('ending'), 2200)
      return () => window.clearTimeout(timeout)
    }
  }, [stage])

  useSEO(board ? board.title : 'Reveal', 'A cinematic surprise for you')

  if (loading) {
    return (
      <div className="min-h-screen kb-grid flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-white/50" />
          <div className="text-white/50 text-sm">Preparing your surprise...</div>
        </div>
      </div>
    )
  }

  if (error || !board) {
    return (
      <div className="min-h-screen kb-grid">
        <TopBar compact />
        <div className="mx-auto w-full max-w-5xl px-4 pt-10 pb-12">
          <Surface className="p-6 max-w-xl">
            <div className="text-white text-lg font-semibold">{error || 'This reveal link isn’t valid'}</div>
            <div className="mt-1 text-sm text-white/70">Please ask the board creator to send a valid link.</div>
          </Surface>
        </div>
      </div>
    )
  }

  return (
    <ThemeBackground theme={theme} className="min-h-screen overflow-hidden">
      <div className="kb-grid h-full">
        <TopBar compact />
        <div className="relative mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-6xl flex-col px-4 py-8">

        <AnimatePresence mode="wait">
          {stage === 'anticipation' ? (
            <motion.div
              key="anticipation"
              className="relative z-10 m-auto max-w-2xl text-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-black/30 border border-white/10 px-3 py-1 text-xs text-white/75">
                <Sparkles size={14} />
                A surprise is waiting for you
              </div>
              <h1 className="mt-5 text-4xl sm:text-5xl font-semibold text-white tracking-tight">A surprise is waiting for you</h1>
              <p className="mt-3 text-base sm:text-lg text-white/75">
                {revealMessages.length || 18} people came together to celebrate you
              </p>
              <Button className="mt-6" variant="primary" onClick={() => setStage('opening')}>
                Open Your Card
              </Button>
            </motion.div>
          ) : null}

          {stage === 'opening' ? (
            <motion.div key="opening" className="relative z-10 m-auto h-[500px] w-full max-w-4xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Canvas camera={{ position: [0, 1.5, 6], fov: 45 }}>
                <ambientLight intensity={1.5} />
                <pointLight position={[10, 10, 10]} intensity={2} />
                <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
                
                {theme.animatedBackground === 'balloons' || theme.animatedBackground === 'confetti' ? (
                  <GiftBoxScene opened={opened} theme={theme} />
                ) : theme.animatedBackground === 'galaxy' || theme.animatedBackground === 'stars' || theme.animatedBackground === 'floating-shapes' ? (
                  <PortalScene opened={opened} theme={theme} />
                ) : (
                  <CardScene opened={opened} />
                )}
              </Canvas>
              <div className="absolute inset-x-0 bottom-12 flex flex-col items-center gap-3">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-white/60 text-sm font-medium tracking-wide uppercase"
                >
                  {opened ? 'Unveiling the magic...' : 'Click below to reveal'}
                </motion.div>
                <Button 
                  variant="primary" 
                  className="px-8 py-4 text-lg shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                  onClick={() => setOpened(true)}
                  disabled={opened}
                >
                  {opened ? 'Opening...' : 'Open Surprise'}
                </Button>
              </div>
            </motion.div>
          ) : null}

          {stage === 'messages' || stage === 'ending' ? (
            <motion.div
              key="messages"
              className="relative z-10"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-black/30 border border-white/10 px-3 py-1 text-xs text-white/75">
                  <Heart size={14} />
                  Made with love
                </div>
                <h1 className="mt-4 text-3xl sm:text-4xl font-semibold text-white tracking-tight">{board.title}</h1>
                <p className="mt-2 text-sm sm:text-base text-white/75">Messages arrive with gentle motion instead of all at once.</p>
              </div>

              <div className="mt-6">
                <Masonry>
                  {(revealMessages.length ? revealMessages : fallbackMessages()).map((message, idx) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.12 }}
                    >
                      <MessageCard message={message} accent={idx % 3 === 0 ? 'violet' : idx % 3 === 1 ? 'blue' : 'teal'} />
                    </motion.div>
                  ))}
                </Masonry>
              </div>

              {stage === 'ending' ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <div>
                    <div className="text-lg font-semibold text-white">Made with love by {revealMessages.length || 18} people</div>
                    <div className="mt-1 text-sm text-white/70">Replay this reveal anytime and keep the memory.</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <div className="relative group">
                      <Button variant="secondary" left={<Download size={16} />}>
                        Download Memory
                      </Button>
                      <div className="absolute bottom-full mb-2 left-0 hidden group-hover:block w-48 kb-glass rounded-xl border border-white/10 overflow-hidden shadow-2xl z-50">
                        <button 
                          className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/10 flex items-center gap-3 transition"
                          onClick={() => {
                            handleDownloadMemory('html')
                          }}
                        >
                          <FileText size={16} className="text-blue-400" />
                          Save as HTML
                        </button>
                        <button 
                          className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/10 flex items-center gap-3 border-t border-white/5 transition"
                          onClick={() => {
                            handleDownloadMemory('pdf')
                          }}
                        >
                          <FileDown size={16} className="text-red-400" />
                          Save as PDF
                        </button>
                      </div>
                    </div>
                    <Button variant="secondary" onClick={() => { setOpened(false); setStage('anticipation') }}>
                      Replay Celebration
                    </Button>
                    <Button variant="ghost" left={<Play size={16} />}>Share Reaction</Button>
                  </div>
                </motion.div>
              ) : null}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
    </ThemeBackground>
  )
}

function generateMemoryHtml(board: Board, messages: Message[]) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Memory: ${board.title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg: #0f172a;
            --surface: rgba(255, 255, 255, 0.05);
            --border: rgba(255, 255, 255, 0.1);
            --text: #f8fafc;
            --text-dim: #94a3b8;
        }
        @media print {
            :root {
                --bg: #ffffff;
                --surface: #f8fafc;
                --border: #e2e8f0;
                --text: #0f172a;
                --text-dim: #64748b;
            }
            body { padding: 0 !important; }
            .card { break-inside: avoid; border: 1px solid #e2e8f0 !important; }
        }
        body {
            font-family: 'Outfit', sans-serif;
            background-color: var(--bg);
            color: var(--text);
            margin: 0;
            padding: 40px 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .container {
            max-width: 800px;
            width: 100%;
        }
        header {
            text-align: center;
            margin-bottom: 50px;
        }
        h1 {
            font-size: 2.5rem;
            margin: 0;
            letter-spacing: -0.02em;
        }
        .meta {
            color: var(--text-dim);
            margin-top: 10px;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
        }
        .card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 24px;
            backdrop-filter: blur(10px);
        }
        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 16px;
        }
        .author {
            font-weight: 600;
            font-size: 1.1rem;
        }
        .date {
            font-size: 0.8rem;
            color: var(--text-dim);
        }
        .content {
            line-height: 1.6;
            font-size: 1rem;
            color: var(--text);
            opacity: 0.9;
            white-space: pre-wrap;
        }
        .media {
            margin-top: 16px;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid var(--border);
        }
        .media img {
            width: 100%;
            display: block;
        }
        .emoji {
            font-size: 1.5rem;
        }
        footer {
            margin-top: 60px;
            text-align: center;
            color: var(--text-dim);
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>${board.title}</h1>
            <div class="meta">A memory created with love by ${messages.length} people</div>
        </header>
        <div class="grid">
            ${messages.map(m => `
                <div class="card">
                    <div class="card-header">
                        <div>
                            <div class="author">${m.displayName || 'Someone'}</div>
                            <div class="date">${new Date(m.createdAt).toLocaleDateString()}</div>
                        </div>
                        ${m.emoji ? `<div class="emoji">${m.emoji}</div>` : ''}
                    </div>
                    <div class="content">${m.text}</div>
                    ${m.gifUrl ? `<div class="media"><img src="${m.gifUrl}"></div>` : ''}
                    ${m.imageUrl ? `<div class="media"><img src="${m.imageUrl}"></div>` : ''}
                </div>
            `).join('')}
        </div>
        <footer>
            Built with KairaBoard &bull; ${new Date().getFullYear()}
        </footer>
    </div>
</body>
</html>
    `
}

function fallbackMessages() {
  const now = new Date().toISOString()
  return [
    { id: 'fallback-1', boardId: 'fallback', createdAt: now, text: 'You make hard days lighter and good days brighter.', displayName: 'Team', emoji: '💛', sticker: 'heart' as const },
    { id: 'fallback-2', boardId: 'fallback', createdAt: now, text: 'Thanks for the calm, clarity, and laughs along the way.', displayName: 'Friends', emoji: '✨', sticker: 'sparkle' as const },
    { id: 'fallback-3', boardId: 'fallback', createdAt: now, text: 'Here is to more milestones, more joy, and more memories.', displayName: 'Everyone', emoji: '🌟', sticker: 'star' as const },
  ]
}

function GiftBoxScene(props: { opened: boolean; theme: BoardTheme }) {
  const lidRef = useRef<Group>(null)

  useFrame((_, delta) => {
    if (props.opened && lidRef.current) {
      lidRef.current.position.y += (4 - lidRef.current.position.y) * delta * 2
      lidRef.current.rotation.x += (1.5 - lidRef.current.rotation.x) * delta * 2
      lidRef.current.position.z += (-2 - lidRef.current.position.z) * delta * 2
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group position={[0, -0.5, 0]}>
        {/* Main Box Body */}
        <RoundedBox args={[2.5, 2.5, 2.5]} radius={0.05} smoothness={4}>
          <meshStandardMaterial color="#ff4d4d" metalness={0.2} roughness={0.3} />
        </RoundedBox>
        {/* Ribbon Vertical */}
        <RoundedBox args={[0.5, 2.52, 2.52]} radius={0.02} smoothness={2}>
          <meshStandardMaterial color="#ffd700" metalness={0.6} roughness={0.2} />
        </RoundedBox>
        {/* Ribbon Horizontal */}
        <RoundedBox args={[2.52, 0.5, 2.52]} radius={0.02} smoothness={2}>
          <meshStandardMaterial color="#ffd700" metalness={0.6} roughness={0.2} />
        </RoundedBox>

        {/* Box Lid */}
        <group ref={lidRef} position={[0, 1.3, 0]}>
          <RoundedBox args={[2.7, 0.6, 2.7]} radius={0.05} smoothness={4} position={[0, 0, 0]}>
            <meshStandardMaterial color="#ff4d4d" metalness={0.2} roughness={0.3} />
          </RoundedBox>
          {/* Lid Ribbons */}
          <RoundedBox args={[0.55, 0.62, 2.72]} radius={0.02} smoothness={2}>
            <meshStandardMaterial color="#ffd700" metalness={0.6} roughness={0.2} />
          </RoundedBox>
          <RoundedBox args={[2.72, 0.62, 0.55]} radius={0.02} smoothness={2}>
            <meshStandardMaterial color="#ffd700" metalness={0.6} roughness={0.2} />
          </RoundedBox>
        </group>
      </group>
    </Float>
  )
}

function PortalScene(props: { opened: boolean; theme: BoardTheme }) {
  const ring1Ref = useRef<Group>(null)
  const ring2Ref = useRef<Group>(null)
  const coreRef = useRef<Group>(null)

  useFrame((_, delta) => {
    if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 1.5
    if (ring2Ref.current) ring2Ref.current.rotation.x += delta * 1.2
    
    if (props.opened && coreRef.current) {
      coreRef.current.scale.setScalar(coreRef.current.scale.x + (15 - coreRef.current.scale.x) * delta * 1.5)
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <group>
        <group ref={ring1Ref}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[2.5, 0.05, 16, 100]} />
            <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={2} />
          </mesh>
        </group>
        <group ref={ring2Ref}>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[2.8, 0.03, 16, 100]} />
            <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={2} />
          </mesh>
        </group>
        
        <group ref={coreRef}>
          <mesh>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={5} transparent opacity={0.9} />
          </mesh>
          <pointLight intensity={10} distance={5} color="#ffffff" />
        </group>
      </group>
    </Float>
  )
}

function CardScene(props: { opened: boolean }) {
  const hingeRef = useRef<Group>(null)
  useFrame((_, delta) => {
    const target = props.opened ? -2.2 : 0
    if (hingeRef.current) {
      hingeRef.current.rotation.y += (target - hingeRef.current.rotation.y) * Math.min(1, delta * 3.8)
    }
  })

  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.45}>
      <group rotation={[0.1, -0.4, 0]}>
        <RoundedBox args={[2.1, 3, 0.12]} radius={0.08} smoothness={4} position={[-1.05, 0, 0]}>
          <meshStandardMaterial color="#f8fafc" metalness={0.1} roughness={0.4} />
        </RoundedBox>
        <group ref={hingeRef} position={[0, 0, 0]}>
          <RoundedBox args={[2.1, 3, 0.12]} radius={0.08} smoothness={4} position={[1.05, 0, 0]}>
            <meshStandardMaterial color="#f1f5f9" metalness={0.1} roughness={0.3} />
          </RoundedBox>
        </group>
      </group>
    </Float>
  )
}
