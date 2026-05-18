import jwt from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'

const AUTH_SECRET = process.env.AUTH_SECRET || 'kairaboard-dev-secret'

export type AuthedUser = {
  id: string
  email: string
  provider: 'google' | 'email'
  displayName: string
}

export type TokenPayload = {
  sub: string
  email: string
  provider: 'google' | 'email'
  displayName: string
}

export function signAuthToken(user: AuthedUser) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      provider: user.provider,
      displayName: user.displayName,
    } satisfies TokenPayload,
    AUTH_SECRET,
    { expiresIn: '7d' },
  )
}

export function verifyAuthToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, AUTH_SECRET)
  if (typeof decoded !== 'object' || !decoded || !decoded.sub || !decoded.email) {
    throw new Error('Invalid token payload')
  }
  return decoded as TokenPayload
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const res = _res
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice('Bearer '.length)
    try {
      const payload = verifyAuthToken(token)
      ;(req as Request & { user: AuthedUser }).user = {
        id: payload.sub,
        email: payload.email,
        provider: payload.provider,
        displayName: payload.displayName,
      }
      next()
      return
    } catch {
      res.status(401).json({ error: 'Invalid or expired token' })
      return
    }
  }

  res.status(401).json({ error: 'Authentication required' })
}
