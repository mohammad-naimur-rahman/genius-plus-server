import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Application, NextFunction, Request, Response } from 'express'
import globalErrorHandler from '~app/middlewares/globalErrorHandler'
import requestLogger from '~app/middlewares/requestLogger'
import router from '~app/routes'
import httpStatus from '~utils/httpStatus'

const app: Application = express()

// Middlewares
app.use(cors())
app.use(cookieParser())
app.use(requestLogger)

// Parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/v1', router)

//Global error handler
app.use(globalErrorHandler)

//Handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Route Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Route Not Available'
      }
    ]
  })
  next()
})

export default app
