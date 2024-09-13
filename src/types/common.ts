import { Request } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import { IGenericErrorMessage } from './error'

export type IGenericResponse<T> = {
  meta: {
    page: number
    limit: number
    total: number
  }
  data: T
}

export type IGenericErrorResponse = {
  statusCode: number
  message: string
  errorMessages: IGenericErrorMessage[]
}

export interface ReqWithUser extends Request {
  user: JwtPayload
}
