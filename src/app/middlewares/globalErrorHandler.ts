import { DrizzleError } from 'drizzle-orm'
import { ErrorRequestHandler, Request, Response } from 'express'
import { ZodError } from 'zod'
import envVars from '~configs'
import { IGenericErrorMessage } from '~types/error'
import ApiError from '~utils/errorHandlers/ApiError'
import handleZodError from '~utils/errorHandlers/handleZodError'
import httpStatus from '~utils/httpStatus'
import { errorlogger } from '../../shared/logger'

// Global error handler
const globalErrorHandler: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response
) => {
  if (envVars.env === 'development')
    console.log(`🐱‍🏍 globalErrorHandler ~~`, { error })
  else errorlogger.error(`🐱‍🏍 globalErrorHandler ~~`, error)

  let statusCode = 500
  let message = 'Something went wrong!'
  let errorMessages: IGenericErrorMessage[] = []

  if (error instanceof DrizzleError) {
    statusCode = httpStatus.BAD_REQUEST
    message = error.message
    errorMessages = error.message
      ? [
          {
            path: '',
            message: error.message
          }
        ]
      : []
  } else if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorMessages = simplifiedError.errorMessages
  } else if (error?.code === '23505') {
    // Unique violation code for PostgreSQL
    statusCode = httpStatus.BAD_REQUEST
    message = `There's already a record with the value ${error.detail}`
    errorMessages = [
      {
        path: '',
        message: `There's already a record with the value ${error.detail}`
      }
    ]
  } else if (error instanceof ApiError) {
    statusCode = error?.statusCode
    message = error.message
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message
          }
        ]
      : []
  } else if (error instanceof Error) {
    message = error?.message
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message
          }
        ]
      : []
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: envVars.env !== 'production' ? error?.stack : undefined
  })
}

export default globalErrorHandler
