import type { BoardTheme } from '../../store/types'
import { AnimatedBalloons } from './AnimatedBalloons'
import { AnimatedConfetti } from './AnimatedConfetti'
import { AnimatedStars } from './AnimatedStars'
import { AnimatedShapes } from './AnimatedShapes'
import { AnimatedGalaxy } from './AnimatedGalaxy'
import { AnimatedPetalDrift } from './AnimatedPetalDrift'
import { AnimatedBloomShimmer } from './AnimatedBloomShimmer'

/**
 * Renders the theme gradient background plus the matching animated layer.
 * Use `className` to control sizing (e.g. `h-40 w-full rounded-xl` for previews,
 * or omit for full-page backgrounds).
 */
export function ThemeBackground(props: {
  theme: BoardTheme
  className?: string
  children?: React.ReactNode
}) {
  const { theme, className = '', children } = props

  const AnimatedLayer = (() => {
    switch (theme.animatedBackground) {
      case 'balloons':
        return AnimatedBalloons
      case 'confetti':
        return AnimatedConfetti
      case 'stars':
        return AnimatedStars
      case 'floating-shapes':
        return AnimatedShapes
      case 'galaxy':
        return AnimatedGalaxy
      case 'petal-drift':
        return AnimatedPetalDrift
      case 'bloom-shimmer':
        return AnimatedBloomShimmer
      default:
        return null
    }
  })()

  if (!theme) {
    return <div className={`bg-slate-900 ${className}`}>{children}</div>
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ backgroundImage: theme.previewGradient }}>
      {AnimatedLayer && <AnimatedLayer />}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  )
}
