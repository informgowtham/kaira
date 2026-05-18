import { Link } from 'react-router-dom'
import { TopBar } from '../components/TopBar'
import { Button } from '../components/Button'
import { Surface } from '../components/Surface'
import { useSEO } from '../utils/seo'

export function NotFoundPage() {
  useSEO('Page Not Found')
  return (
    <div className="min-h-screen kb-grid">
      <TopBar compact />
      <div className="mx-auto w-full max-w-6xl px-4 pt-10 pb-12">
        <Surface className="p-6 max-w-xl">
          <div className="text-white text-lg font-semibold">Page not found</div>
          <div className="mt-1 text-sm text-white/70">That link doesn’t exist.</div>
          <div className="mt-4 flex gap-2">
            <Link to="/">
              <Button variant="primary">Go home</Button>
            </Link>
            <Link to="/pricing">
              <Button variant="secondary">Pricing</Button>
            </Link>
          </div>
        </Surface>
      </div>
    </div>
  )
}
