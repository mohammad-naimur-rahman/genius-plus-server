import { NextFunction, Request, Response } from 'express'
import envVars from '~configs'
import ApiError from '~utils/errorHandlers/ApiError'
import httpStatus from '~utils/httpStatus'
import { jwtUtils } from '~utils/jwtUtils'

const authGuard =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get authorization token
      const token = req.headers.authorization

      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized')
      }

      const accessToken = token?.split(' ')[1]

      if (accessToken === 'undefined') {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized!')
      }

      // Verify token
      let verifiedUser = null
      verifiedUser = jwtUtils.verifyToken(accessToken, envVars.jwt.jwtSecret)

      req.user = verifiedUser

      // Check if user is in required roles
      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, `You can't do this action`)
      }

      next()
    } catch (error) {
      next(error)
    }
  }

export default authGuard
