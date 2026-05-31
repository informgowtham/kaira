/**
 * TemplatePreviewApp
 * ──────────────────────────────────────────────────────────────────
 * A standalone preview sandbox for the two new custom templates.
 * Mount this at any route to demo them with sample messages.
 *
 * Touches ZERO existing code. Purely additive.
 */

import { useState } from 'react'
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

/* ─── Sample data ───────────────────────────────────────────────── */
const SAMPLE_MESSAGES = [
  {
    id: '1',
    boardId: 'preview',
    displayName: 'Priya',
    text: 'Wishing you a year full of joy, laughter, and everything you love. You deserve all the happiness in the world!',
    emoji: '🎉',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    boardId: 'preview',
    displayName: 'Rahul',
    text: 'Happy birthday! May your day be as bright as your smile and as sweet as cake. Cheers to you!',
    emoji: '🎂',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    boardId: 'preview',
    displayName: 'Ananya',
    text: 'Another year wiser, another year more fabulous. Hope this birthday is your best one yet!',
    emoji: '🌟',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    boardId: 'preview',
    displayName: 'Vikram',
    text: 'Sending you warm wishes and big hugs on your special day. Thank you for being such an amazing person.',
    emoji: '🥳',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    boardId: 'preview',
    displayName: 'Meera',
    text: 'You light up every room you walk into. Happy birthday to someone who makes every day brighter.',
    emoji: '✨',
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    boardId: 'preview',
    displayName: 'Dev',
    text: 'Birthdays are a time to celebrate the amazing journey you have had and look forward to the adventures ahead. Here is to you!',
    emoji: '🎈',
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    boardId: 'preview',
    displayName: 'Sanjana',
    text: 'May all your wishes come true this year. You have worked hard and you deserve everything good coming your way.',
    emoji: '💫',
    createdAt: new Date().toISOString(),
  },
  {
    id: '8',
    boardId: 'preview',
    displayName: 'Arjun',
    text: 'Happy birthday! Time flies when you are having fun — and we have had so much fun together. Here is to many more years.',
    emoji: '🎊',
    createdAt: new Date().toISOString(),
  },
  {
    id: '9',
    boardId: 'preview',
    displayName: 'Karan',
    text: 'Cheers to a lifetime of shared laughs, late-night tea talks, and endless memories. Hope this year brings you peace!',
    emoji: '🍵',
    createdAt: new Date().toISOString(),
  },
  {
    id: '10',
    boardId: 'preview',
    displayName: 'Sneha',
    text: 'To one of my absolute favorite people in the universe: Happy Birthday! May your day be filled with warm smiles and warm hugs.',
    emoji: '🌸',
    createdAt: new Date().toISOString(),
  },
  {
    id: '11',
    boardId: 'preview',
    displayName: 'Amit',
    text: 'Congratulations on turning another year older! May you always maintain that sparkling energy and continue to inspire everyone around you.',
    emoji: '⚡',
    createdAt: new Date().toISOString(),
  },
  {
    id: '12',
    boardId: 'preview',
    displayName: 'Riya',
    text: 'Happy Birthday! Let the celebrations begin! May your day be filled with your favorite songs, your favorite food, and your favorite people.',
    emoji: '🎶',
    createdAt: new Date().toISOString(),
  },
  {
    id: '13',
    boardId: 'preview',
    displayName: 'Aditya',
    text: 'Wishing you a magnificent birthday. Here is to breaking records, making big moves, and writing your own beautiful path.',
    emoji: '🚀',
    createdAt: new Date().toISOString(),
  },
  {
    id: '14',
    boardId: 'preview',
    displayName: 'Pooja',
    text: 'Warmest birthday wishes to a truly wonderful soul. May your heart always remain this kind, and may you achieve everything you hope for.',
    emoji: '💖',
    createdAt: new Date().toISOString(),
  },
  {
    id: '15',
    boardId: 'preview',
    displayName: 'Nikhil',
    text: 'Happy Birthday, buddy! Grateful for your presence in our lives. Let us make this year legendary!',
    emoji: '🍻',
    createdAt: new Date().toISOString(),
  },
  {
    id: '16',
    boardId: 'preview',
    displayName: 'Kriti',
    text: 'To another year of incredible adventures, self-discovery, and wonderful achievements. Keep shining bright!',
    emoji: '🌈',
    createdAt: new Date().toISOString(),
  },
  {
    id: '17',
    boardId: 'preview',
    displayName: 'Siddharth',
    text: 'Happy Birthday! Wishing you a blessed, healthy, and exceptionally happy year ahead. Enjoy your special cake!',
    emoji: '🍰',
    createdAt: new Date().toISOString(),
  },
  {
    id: '18',
    boardId: 'preview',
    displayName: 'Divya',
    text: 'May you always find reasons to smile, and may this special milestone birthday mark the beginning of your finest chapter yet!',
    emoji: '🎁',
    createdAt: new Date().toISOString(),
  },
]

type TemplateId = 'wallart' | 'tree' | 'cosmic' | 'vinyl' | 'watercolor' | 'floral' | 'origami' | 'butterfly' | 'desk' | 'memory' | 'scrapbook'

export function TemplatePreviewApp() {
  const [active, setActive] = useState<TemplateId>('wallart')

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      {/* Switcher Bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 20px',
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Custom Templates Preview
        </span>
        <div style={{ flex: 1 }} />
        {([
          { id: 'wallart', label: '🎂 Birthday Wall Art' },
          { id: 'tree',    label: '🌳 Hanging Tree Garden' },
          { id: 'cosmic',  label: '🌌 Cosmic Constellation' },
          { id: 'vinyl',   label: '📻 Retro Vinyl' },
          { id: 'watercolor', label: '🎨 Watercolor' },
          { id: 'floral', label: '🌸 Floral Letterpress' },
          { id: 'origami', label: '✈️ Origami Fold' },
          { id: 'butterfly', label: '🦋 Butterfly Garden' },
          { id: 'desk', label: '📎 Paperclip Desk' },
          { id: 'memory', label: '🛤️ Memory Lane' },
          { id: 'scrapbook', label: '✂️ Scrapbook Tape' },
        ] as { id: TemplateId; label: string }[]).map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            style={{
              padding: '6px 16px',
              borderRadius: 20,
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              background: active === id ? '#4ade80' : 'rgba(255,255,255,0.1)',
              color:      active === id ? '#052e16' : 'rgba(255,255,255,0.75)',
              transition: 'all 0.2s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Template Content */}
      <div style={{ paddingTop: 48 }}>
        {active === 'wallart' && (
          <BirthdayWallArt messages={SAMPLE_MESSAGES} recipientName="Gowtham" />
        )}
        {active === 'tree' && (
          <HangingTreeGarden messages={SAMPLE_MESSAGES} recipientName="Gowtham" />
        )}
        {active === 'cosmic' && (
          <CosmicConstellation messages={SAMPLE_MESSAGES} recipientName="Gowtham" />
        )}
        {active === 'vinyl' && (
          <VinylLounge messages={SAMPLE_MESSAGES} recipientName="Gowtham" />
        )}
        {active === 'watercolor' && (
          <WatercolorJournal messages={SAMPLE_MESSAGES} recipientName="Gowtham" />
        )}
        {active === 'floral' && <FloralLetterpress messages={SAMPLE_MESSAGES} recipientName="Gowtham" />}
        {active === 'origami' && <OrigamiFold messages={SAMPLE_MESSAGES} recipientName="Gowtham" />}
        {active === 'butterfly' && <ButterflyGarden messages={SAMPLE_MESSAGES} recipientName="Gowtham" />}
        {active === 'desk' && <PaperclipDesk messages={SAMPLE_MESSAGES} recipientName="Gowtham" />}
        {active === 'memory' && <MemoryLanePaper messages={SAMPLE_MESSAGES} recipientName="Gowtham" />}
        {active === 'scrapbook' && <ScrapbookTape messages={SAMPLE_MESSAGES} recipientName="Gowtham" />}
      </div>
    </div>
  )
}
