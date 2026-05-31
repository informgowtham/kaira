import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Board, Message, Occasion, PlanTier, User } from './types'
import { THEMES } from './themes'
import {
  addMessageOwner,
  addPublicMessage,
  createBoardRemote,
  getBoard,
  getMe,
  getPublicBoard,
  getReveal,
  listBoards,
  loginEmail,
  loginGoogle,
  patchBoard,
  removeBoard,
  setPlanRemote,
  setStoredToken,
} from './api'

type AppState = {
  user: User | null
  plan: PlanTier
  boards: Board[]
  messages: Message[]
  bootstrapped: boolean
  loading: boolean
  error: string | null

  bootstrap: () => Promise<void>
  loginAsGoogle: (credential?: string) => Promise<void>
  loginWithEmail: (email: string, password?: string, mode?: 'login' | 'signup') => Promise<void>
  logout: () => void
  setPlan: (plan: PlanTier) => Promise<void>

  refreshBoards: () => Promise<void>
  hydrateOwnerBoard: (boardId: string) => Promise<void>
  hydratePublicBoard: (boardId: string, token: string) => Promise<void>
  hydrateReveal: (boardId: string, token: string) => Promise<void>

  createBoard: (input: {
    recipientName: string
    occasion: Occasion
    themeId: string
    recipientContact: string
    scheduledAt: string
    destinationType?: 'recipient' | 'creator'
  }) => Promise<Board>
  updateBoard: (boardId: string, patch: Partial<Board>) => Promise<void>
  deleteBoard: (boardId: string) => Promise<void>

  addMessage: (boardId: string, msg: Omit<Message, 'id' | 'createdAt' | 'boardId'>) => Promise<Message>
  addPublicBoardMessage: (
    boardId: string,
    token: string,
    msg: Omit<Message, 'id' | 'createdAt' | 'boardId'>,
  ) => Promise<Message>
}

function setError(set: (fn: (state: AppState) => Partial<AppState>) => void, message: string | null) {
  set(() => ({ error: message }))
}

async function withLoading<T>(set: any, fn: () => Promise<T>) {
  set(() => ({ loading: true, error: null }))
  try {
    return await fn()
  } catch (error) {
    setError(set, error instanceof Error ? error.message : 'Request failed')
    throw error
  } finally {
    set(() => ({ loading: false }))
  }
}

function buildBoardTitle(input: { recipientName: string; occasion: Occasion }) {
  const name = input.recipientName.trim() || 'Someone'
  switch (input.occasion) {
    case 'birthday':
      return `Happy Birthday ${name} 🎉`
    case 'farewell':
      return `Farewell ${name} 👋`
    case 'anniversary':
      return `Celebrating ${name} 🌟`
    case 'other':
    default:
      return `For ${name} 🎉`
  }
}

function defaultThemeForOccasion(occasion: Occasion) {
  const preferred =
    THEMES.find((t) => t.category === occasion && !t.proOnly) ??
    THEMES.find((t) => t.category === 'celebration' && !t.proOnly) ??
    THEMES[0]
  return preferred.id
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      plan: 'free',
      boards: [],
      messages: [],
      bootstrapped: false,
      loading: false,
      error: null,

      bootstrap: async () => {
        if (get().bootstrapped) return
        set(() => ({ loading: true }))
        try {
          const me = await getMe()
          set(() => ({ user: me.user, plan: me.plan }))
          const boards = await listBoards()
          set(() => ({ boards }))
        } catch {
          set(() => ({ user: null, boards: [], messages: [] }))
        } finally {
          set(() => ({ loading: false, bootstrapped: true }))
        }
      },

      loginAsGoogle: async (credential) => {
        set(() => ({ loading: true }))
        try {
          const result = await loginGoogle({ credential })
          set(() => ({ user: result.user, plan: result.plan, error: null }))
          const boards = await listBoards()
          set(() => ({ boards }))
        } catch (error) {
          setError(set, error instanceof Error ? error.message : 'Unable to sign in with Google')
          throw error
        } finally {
          set(() => ({ loading: false }))
        }
      },

      loginWithEmail: async (email, password, mode = 'login') => {
        set(() => ({ loading: true }))
        try {
          const result = await loginEmail({ email: email.trim(), password, mode })
          set(() => ({ user: result.user, plan: result.plan, error: null }))
          const boards = await listBoards()
          set(() => ({ boards }))
        } catch (error) {
          setError(set, error instanceof Error ? error.message : 'Unable to sign in')
          throw error
        } finally {
          set(() => ({ loading: false }))
        }
      },

      logout: () => {
        setStoredToken(null)
        set(() => ({ user: null, boards: [], messages: [], error: null }))
      },

      setPlan: async (plan) => {
        set(() => ({ plan }))
        try {
          await setPlanRemote(plan)
        } catch {
          // keep UI responsive in phase 2 foundations even if backend is down
        }
      },

      refreshBoards: async () => {
        await withLoading(set, async () => {
          const boards = await listBoards()
          set(() => ({ boards }))
        })
      },

      hydrateOwnerBoard: async (boardId) => {
        await withLoading(set, async () => {
          const payload = await getBoard(boardId)
          set((state) => ({
            boards: [payload.board, ...state.boards.filter((b) => b.id !== boardId)],
            messages: [...payload.messages, ...state.messages.filter((m) => m.boardId !== boardId)],
          }))
        })
      },

      hydratePublicBoard: async (boardId, token) => {
        await withLoading(set, async () => {
          const payload = await getPublicBoard(boardId, token)
          set((state) => ({
            boards: [payload.board, ...state.boards.filter((b) => b.id !== boardId)],
            messages: [...payload.messages, ...state.messages.filter((m) => m.boardId !== boardId)],
          }))
        })
      },

      hydrateReveal: async (boardId, token) => {
        await withLoading(set, async () => {
          const payload = await getReveal(boardId, token)
          set((state) => ({
            boards: [payload.board, ...state.boards.filter((b) => b.id !== boardId)],
            messages: [...payload.messages, ...state.messages.filter((m) => m.boardId !== boardId)],
          }))
        })
      },

      createBoard: async ({ recipientName, occasion, themeId, recipientContact, scheduledAt, destinationType }) => {
        return withLoading(set, async () => {
          const board = await createBoardRemote({
            recipientName: recipientName.trim(),
            occasion,
            themeId: themeId || defaultThemeForOccasion(occasion),
            title: buildBoardTitle({ recipientName, occasion }),
            planTier: get().plan,
            recipientContact,
            scheduledAt,
            destinationType,
          })
          set((state) => ({ boards: [board, ...state.boards] }))
          return board
        })
      },

      updateBoard: async (boardId, patch) => {
        await withLoading(set, async () => {
          const board = await patchBoard(boardId, patch)
          set((state) => ({
            boards: state.boards.map((b) => (b.id === boardId ? board : b)),
          }))
        })
      },

      deleteBoard: async (boardId) => {
        await withLoading(set, async () => {
          await removeBoard(boardId)
          set((state) => ({
            boards: state.boards.filter((b) => b.id !== boardId),
            messages: state.messages.filter((m) => m.boardId !== boardId),
          }))
        })
      },

      addMessage: async (boardId, msg) => {
        return withLoading(set, async () => {
          const message = await addMessageOwner(boardId, msg)
          set((state) => ({ messages: [message, ...state.messages] }))
          return message
        })
      },

      addPublicBoardMessage: async (boardId, token, msg) => {
        return withLoading(set, async () => {
          const message = await addPublicMessage(boardId, token, msg)
          set((state) => ({ messages: [message, ...state.messages] }))
          return message
        })
      },
    }),
    {
      name: 'kairaboard.phase2',
      version: 3,
      migrate: (persistedState: any) => {
        const state = persistedState && typeof persistedState === 'object' ? persistedState : {}
        const user = state.user && typeof state.user === 'object' ? state.user : null
        const plan = state.plan === 'pro' ? 'pro' : 'free'
        const boards = Array.isArray(state.boards) ? state.boards : []
        const messages = Array.isArray(state.messages) ? state.messages : []
        return { ...state, user, plan, boards, messages }
      },
      partialize: (state) => ({
        user: state.user,
        plan: state.plan,
        boards: state.boards,
        messages: state.messages,
      }),
    },
  ),
)
