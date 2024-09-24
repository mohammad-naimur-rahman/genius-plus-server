import { Response } from 'express'

export type IMetadata = {
  page: number
  limit: number
  total: number
}

type IApiReponse<T> = {
  statusCode: number
  success?: boolean
  message?: string | null
  meta?: IMetadata
  tokens?: {
    accessToken: string
    refreshToken: string
  }
  data?: T | null
}

const sendResponse = <T>(res: Response, data: IApiReponse<T>): void => {
  const responseData: IApiReponse<T> = {
    statusCode: data.statusCode,
    success: data.success || true,
    message: data.message || null,
    meta: data.meta || null || undefined,
    data: data.data || null || undefined,
    tokens: data.tokens || undefined
  }

  res.status(data.statusCode).json(responseData)
}

export default sendResponse
