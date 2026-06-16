import { Suspense, lazy } from 'react'
import type { ComponentType, LazyExoticComponent } from 'react'
import type { SignatureTemplateProps } from './signatureTypes'
import type { SignatureTemplateId } from './signatureTypes'

const BirthdayWallArt = lazy(() => import('./BirthdayWallArt').then((m) => ({ default: m.BirthdayWallArt })))
const ButterflyGarden = lazy(() => import('./ButterflyGarden').then((m) => ({ default: m.ButterflyGarden })))
const ConfettiOrbit = lazy(() => import('./ConfettiOrbit').then((m) => ({ default: m.ConfettiOrbit })))
const FloralLetterpress = lazy(() => import('./FloralLetterpress').then((m) => ({ default: m.FloralLetterpress })))
const GratitudeGrid = lazy(() => import('./GratitudeGrid').then((m) => ({ default: m.GratitudeGrid })))
const HangingTreeGarden = lazy(() => import('./HangingTreeGarden').then((m) => ({ default: m.HangingTreeGarden })))
const CosmicConstellation = lazy(() => import('./CosmicConstellation').then((m) => ({ default: m.CosmicConstellation })))
const JoyRibbons = lazy(() => import('./JoyRibbons').then((m) => ({ default: m.JoyRibbons })))
const MilestoneRings = lazy(() => import('./MilestoneRings').then((m) => ({ default: m.MilestoneRings })))
const AuroraAwards = lazy(() => import('./AuroraAwards').then((m) => ({ default: m.AuroraAwards })))
const PaperTrails = lazy(() => import('./PaperTrails').then((m) => ({ default: m.PaperTrails })))
const VinylLounge = lazy(() => import('./VinylLounge').then((m) => ({ default: m.VinylLounge })))
const WatercolorJournal = lazy(() => import('./WatercolorJournal').then((m) => ({ default: m.WatercolorJournal })))
const MemoryLanePaper = lazy(() => import('./MemoryLanePaper').then((m) => ({ default: m.MemoryLanePaper })))
const OrigamiFold = lazy(() => import('./OrigamiFold').then((m) => ({ default: m.OrigamiFold })))
const PaperclipDesk = lazy(() => import('./PaperclipDesk').then((m) => ({ default: m.PaperclipDesk })))
const ScrapbookTape = lazy(() => import('./ScrapbookTape').then((m) => ({ default: m.ScrapbookTape })))
const AbstractCollage = lazy(() => import('./AbstractCollage').then((m) => ({ default: m.AbstractCollage })))
const ColorField = lazy(() => import('./ColorField').then((m) => ({ default: m.ColorField })))

export function SignatureTemplateRenderer(props: SignatureTemplateProps & { templateId: SignatureTemplateId }) {
  let Template: LazyExoticComponent<ComponentType<SignatureTemplateProps & { templateId: SignatureTemplateId }>> | null = null
  switch (props.templateId) {
    case 'signature:birthday-wall-art':
      Template = BirthdayWallArt
      break
    case 'signature:confetti-orbit':
      Template = ConfettiOrbit
      break
    case 'signature:joy-ribbons':
      Template = JoyRibbons
      break
    case 'signature:hanging-tree-garden':
      Template = HangingTreeGarden
      break
    case 'signature:cosmic-constellation':
      Template = CosmicConstellation
      break
    case 'signature:milestone-rings':
      Template = MilestoneRings
      break
    case 'signature:aurora-awards':
      Template = AuroraAwards
      break
    case 'signature:vinyl-lounge':
      Template = VinylLounge
      break
    case 'signature:watercolor-journal':
      Template = WatercolorJournal
      break
    case 'signature:paper-trails':
      Template = PaperTrails
      break
    case 'signature:gratitude-grid':
      Template = GratitudeGrid
      break
    case 'signature:floral-letterpress':
      Template = FloralLetterpress
      break
    case 'signature:origami-fold':
      Template = OrigamiFold
      break
    case 'signature:butterfly-garden':
      Template = ButterflyGarden
      break
    case 'signature:paperclip-desk':
      Template = PaperclipDesk
      break
    case 'signature:memory-lane-paper':
      Template = MemoryLanePaper
      break
    case 'signature:scrapbook-tape':
      Template = ScrapbookTape
      break
    case 'signature:abstract-collage':
      Template = AbstractCollage
      break
    case 'signature:color-field':
      Template = ColorField
      break
    default:
      return null
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen kb-grid flex items-center justify-center">
          <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/75 backdrop-blur-md">
            Loading template...
          </div>
        </div>
      }
    >
      <Template {...props} />
    </Suspense>
  )
}
