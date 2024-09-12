import { ZodError, ZodIssue } from 'zod'
import { IGenericErrorResponse } from '~types/common'
import { IGenericErrorMessage } from '~types/error'
import httpStatus from '~utils/httpStatus'

const handleZodError = (error: ZodError): IGenericErrorResponse => {
  const errors: IGenericErrorMessage[] = error.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue?.message
    }
  })

  const statusCode = httpStatus.BAD_REQUEST

  return {
    statusCode,
    message: 'Validation Error',
    errorMessages: errors
  }
}

export default handleZodError
