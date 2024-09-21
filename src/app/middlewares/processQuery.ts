import { NextFunction, Request, Response } from 'express'

export const processQuery = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (req?.query) {
    for (const item in req.query) {
      const value = req.query[item]
      if (typeof value === 'string') {
        if (value === 'true') {
          ;(req.query as Record<string, unknown>)[item] = true
        } else if (value === 'false') {
          ;(req.query as Record<string, unknown>)[item] = false
        } else if (value === 'undefined') {
          ;(req.query as Record<string, unknown>)[item] = undefined
        } else if (value === 'null') {
          ;(req.query as Record<string, unknown>)[item] = null
        } else if (/^\d+$/.test(value) && !isNaN(parseInt(value))) {
          // Only convert to number if it's a valid integer
          ;(req.query as Record<string, unknown>)[item] = parseInt(value)
        }
        // If it's any other string (including date strings), leave it as is
      }
    }
  }
  next()
}
