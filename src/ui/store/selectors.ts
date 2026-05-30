import type { Board, Message } from './types'
import { THEMES } from './themes'

export function getThemeById(themeId: string | undefined) {
  return THEMES.find((t) => t.id === themeId) ?? THEMES[0]
}

export function messagesForBoard(messages: Message[], boardId: string) {
  const list = Array.isArray(messages) ? messages : []
  return list.filter((m) => m?.boardId === boardId).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

export function boardsForOwner(boards: Board[], ownerId: string) {
  const list = Array.isArray(boards) ? boards : []
  return list.filter((b) => b?.ownerId === ownerId).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}
