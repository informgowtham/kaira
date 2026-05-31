import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect, useMemo } from 'react'
import { CalendarClock, ChevronRight, Plus } from 'lucide-react'
import { TopBar } from '../components/TopBar'
import { Button } from '../components/Button'
import { Surface } from '../components/Surface'
import { useAppStore } from '../store/useAppStore'
import { boardsForOwner, getThemeById } from '../store/selectors'
import { useSEO } from '../utils/seo'

export function DashboardPage() {
  const navigate = useNavigate()
  const user = useAppStore((s) => s.user)!
  const refreshBoards = useAppStore((s) => s.refreshBoards)
  const allBoards = useAppStore((s) => s.boards)
  const boards = useMemo(() => boardsForOwner(allBoards, user.id), [allBoards, user.id])
  useSEO('Dashboard')

  useEffect(() => {
    void refreshBoards()
  }, [refreshBoards])

  return (
    <div className="min-h-screen kb-grid">
      <TopBar />
      <div className="mx-auto w-full max-w-6xl px-4 pt-8 pb-12">
        <div className="flex items-start sm:items-center justify-between gap-3 flex-col sm:flex-row">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">Your dashboard</h1>
            <div className="mt-1 text-sm text-white/60">Boards you’ve created live here. No public discovery.</div>
          </div>
          <Button variant="primary" left={<Plus size={16} />} onClick={() => navigate('/app/create')}>
            Create Board
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-3">
          <Surface className="p-5 lg:col-span-2">
            <div className="text-sm font-semibold text-white">Recent boards</div>
            {boards.length === 0 ? (
              <div className="mt-3 kb-glass rounded-xl p-5 border border-white/10">
                <div className="text-white font-semibold">Your first card is waiting</div>
                <div className="mt-1 text-sm text-white/70">Create a board, share the link, collect messages.</div>
                <Button className="mt-4" variant="secondary" onClick={() => navigate('/app/create')}>
                  Create your first board
                </Button>
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-1 gap-2">
                {boards.slice(0, 10).map((b, idx) => {
                  const theme = getThemeById(b.themeId)
                  return (
                    <motion.button
                      key={b.id}
                      className="kb-ring w-full text-left rounded-xl kb-glass border border-white/10 p-4 hover:bg-white/10 transition"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      onClick={() => navigate(`/app/board/${b.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="h-10 w-10 rounded-xl border border-white/10"
                          style={{ backgroundImage: theme.previewGradient }}
                        />
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-white">{b.title}</div>
                          <div className="mt-0.5 text-xs text-white/60">
                            {b.status.replace(/_/g, ' ')} • {new Date(b.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-white/50" />
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            )}
          </Surface>

          <Surface className="p-5">
            <div className="text-sm font-semibold text-white">Next steps</div>
            <div className="mt-3 grid gap-2">
              <div className="kb-glass rounded-xl p-4 border border-white/10">
                <div className="text-sm font-semibold text-white flex items-center gap-2">
                  <CalendarClock size={16} className="text-white/80" />
                  Schedule delivery
                </div>
                <div className="mt-1 text-sm text-white/70">Scheduling and delivery are fully operational.</div>
              </div>
              <div className="kb-glass rounded-xl p-4 border border-white/10">
                <div className="text-sm font-semibold text-white">Pricing</div>
                <div className="mt-1 text-sm text-white/70">The UI previews how a real monetization gateway functions.</div>
                <Link to="/pricing" className="inline-flex mt-3">
                  <Button variant="secondary">See Free vs Pro</Button>
                </Link>
              </div>
            </div>
          </Surface>
        </div>
      </div>
    </div>
  )
}
