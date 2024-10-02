import { NextFunction, Request, Response } from 'express'

declare module 'express-serve-static-core' {
  interface Response {
    sseSetup: () => void
    sseSend: (data: string) => void
    sseStop: () => void
  }
}

type SseMiddleware = (req: Request, res: Response, next: NextFunction) => void

declare const sse: SseMiddleware
