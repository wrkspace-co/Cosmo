import basicAuth from 'basic-auth'
import { Request, Response, NextFunction } from 'express'

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const user = basicAuth(req)
  if (!user || user.name !== process.env.AUTH_USER || user.pass !== process.env.AUTH_PASS) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  next()
}
