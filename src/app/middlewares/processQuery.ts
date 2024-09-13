import { NextFunction, Request, Response } from 'express'

export const processQuery = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (req?.query) {
    for (const item in req.query) {
      if (req.query[item] === 'true') {
        ;(req.query[item] as unknown) = true
      } else if (req.query[item] === 'false') {
        ;(req.query[item] as unknown) = false
      } else if (req.query[item] === 'undefined') {
        ;(req.query[item] as unknown) = undefined
      } else if (req.query[item] === 'null') {
        ;(req.query[item] as unknown) = null
      } else if (typeof Number(req.query[item]) === 'number') {
        ;(req.query[item] as unknown) = Number(req.query[item])
      }
    }
  }
  next()
}
