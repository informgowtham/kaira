import type { Board, Message } from './types'
import { THEMES } from './themes'

export function getThemeById(themeId: string | undefined) {
  return THEMES.find((t) => t.id === themeId) ?? THEMES[0]
}

export function messagesForBoard(messages: Message[], boardId: string) {
  return messages.filter((m) => m.boardId === boardId).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

export function boardsForOwner(boards: Board[], ownerId: string) {
  return boards.filter((b) => b.ownerId === ownerId).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}
