import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Application, NextFunction, Request, Response } from 'express'
import globalErrorHandler from '~app/middlewares/globalErrorHandler'
import { processQuery } from '~app/middlewares/processQuery'
import requestLogger from '~app/middlewares/requestLogger'
import sse from '~app/middlewares/sse'
import router from '~app/routes'
import envVars from '~configs'
import ApiError from '~utils/errorHandlers/ApiError'
import httpStatus from '~utils/httpStatus'

const app: Application = express()

// Middlewares
const allowedOrigins = [
  envVars.clientUrl.split('/en')[0], // First origin
  'http://localhost:3000' // Second origin
]

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(
          new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Not allowed by CORS')
        )
      }
    },
    credentials: true
  })
)

app.use(cookieParser())
app.use(processQuery)
app.use(requestLogger)

// Setting streaming for OpenAI
app.use(sse)

// Parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/v1', router)

//Global error handler
app.use(globalErrorHandler)

//Handle not found routes
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
