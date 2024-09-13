import ms from 'ms'
import envVars from '~configs'
import catchAsync from '~shared/catchAsync'
import sendResponse from '~shared/sendResponse'
import httpStatus from '~utils/httpStatus'
import { authService } from './auth.service'

const signup = catchAsync(async (req, res) => {
  const verificationLink = await authService.signup(req.body)

  sendResponse(res, {
    message: 'Email sent successfully!',
    statusCode: httpStatus.OK,
    data: { verificationLink }
  })
})

const signupVerify = catchAsync(async (req, res) => {
  const newUser = await authService.signupVerify(req.body)

  const { tokens } = newUser
  const { accessToken, refreshToken } = tokens

  // Set cookies
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: envVars.env === 'production',
    sameSite: 'strict',
    maxAge: ms(envVars.jwt.jwtAccessExpiresIn)
  })

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: envVars.env === 'production',
    sameSite: 'strict',
    maxAge: ms(envVars.jwt.jwtRefreshExpiresIn)
  })

  sendResponse(res, {
    message: 'User Verification Successful!',
    statusCode: httpStatus.CREATED,
    data: newUser
  })
})

export const authController = {
  signup,
  signupVerify
}
