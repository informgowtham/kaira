import type { SignatureTemplateProps } from './signatureTypes'
import { BirthdayWallArt } from './BirthdayWallArt'
import { ButterflyGarden } from './ButterflyGarden'
import { FloralLetterpress } from './FloralLetterpress'
import { HangingTreeGarden } from './HangingTreeGarden'
import { CosmicConstellation } from './CosmicConstellation'
import { VinylLounge } from './VinylLounge'
import { WatercolorJournal } from './WatercolorJournal'
import { MemoryLanePaper } from './MemoryLanePaper'
import { OrigamiFold } from './OrigamiFold'
import { PaperclipDesk } from './PaperclipDesk'
import { ScrapbookTape } from './ScrapbookTape'
import type { SignatureTemplateId } from './signatureTypes'

export function SignatureTemplateRenderer(props: SignatureTemplateProps & { templateId: SignatureTemplateId }) {
  switch (props.templateId) {
    case 'signature:birthday-wall-art':
      return <BirthdayWallArt {...props} />
    case 'signature:hanging-tree-garden':
      return <HangingTreeGarden {...props} />
    case 'signature:cosmic-constellation':
      return <CosmicConstellation {...props} />
    case 'signature:vinyl-lounge':
      return <VinylLounge {...props} />
    case 'signature:watercolor-journal':
      return <WatercolorJournal {...props} />
    case 'signature:floral-letterpress':
      return <FloralLetterpress {...props} />
    case 'signature:origami-fold':
      return <OrigamiFold {...props} />
    case 'signature:butterfly-garden':
      return <ButterflyGarden {...props} />
    case 'signature:paperclip-desk':
      return <PaperclipDesk {...props} />
    case 'signature:memory-lane-paper':
      return <MemoryLanePaper {...props} />
    case 'signature:scrapbook-tape':
      return <ScrapbookTape {...props} />
    default:
      return null
  }
}
