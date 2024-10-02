import { NextFunction, Request, Response } from 'express'

const sse = (_req: Request, res: Response, next: NextFunction): void => {
  res.sseSetup = () => {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.flushHeaders()
  }

  res.sseSend = (data: string) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`)
  }

  res.sseStop = () => {
    res.end()
  }

  next()
}

export default sse
