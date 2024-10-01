import { NextFunction, Request, Response } from 'express'

// Middleware to remove 'id' from request body
export default function removeId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.body && 'id' in req.body) {
    delete req.body.id
  }
  next() // Pass control to the next middleware or route handler
}
