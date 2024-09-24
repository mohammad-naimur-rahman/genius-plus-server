import { AnyColumn, SQL } from 'drizzle-orm'
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

type SortOrder = 'asc' | 'desc'

export interface PaginateParams {
  sortBy: AnyColumn
  sortOrder: SortOrder
  page: number
  limit: number
  search?: string
}

export interface DBQuery {
  where: SQL<unknown> | undefined
  limit?: number
  offset?: number
  orderBy?: SQL<unknown>[] | undefined
}
