import { EventEmitter } from 'events'
import { Request, Response } from 'express'

export default function applySSE(
  req: Request,
  res: Response,
  eventEmitter: EventEmitter
) {
  res.sseSetup()
  let streamClosed = false
  eventEmitter.on('event', data => {
    if (streamClosed) {
      return
    }

    if (data.event === 'thread.message.delta') {
      res.sseSend(data.data.delta.content[0].text.value)
    } else if (data.event === 'thread.run.completed') {
      res.sseStop()
      streamClosed = true
    }
  })
  req.on('close', () => {
    streamClosed = true
    eventEmitter.removeAllListeners('event')
  })
}
