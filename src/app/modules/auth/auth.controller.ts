import ms from 'ms'
import envVars from '~configs'
import catchAsync from '~shared/catchAsync'
import sendResponse from '~shared/sendResponse'
import { ReqWithUser } from '~types/common'
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

  // Setting and sending cookies after verificatin so that user doesn't have to login again
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
    statusCode: httpStatus.CREATED,
    message: 'User verification successful!',
    data: newUser
  })
})

const login = catchAsync(async (req, res) => {
  const loggedInUser = await authService.login(req.body)

  // Setting and sending cookies after verificatin so that user doesn't have to login again
  const { tokens } = loggedInUser
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
    statusCode: httpStatus.OK,
    message: 'User logged in successful!',
    data: loggedInUser
  })
})

const forgetPassword = catchAsync(async (req, res) => {
  const verificationLink = await authService.forgetPassword(req.body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Email sent successfully!',
    data: { verificationLink }
  })
})

const forgetPasswordVerify = catchAsync(async (req, res) => {
  const token = await authService.forgetPasswordVerify(req.body)

  sendResponse(res, {
    statusCode: httpStatus.ACCEPTED,
    message: 'User verified successfully!',
    data: { token }
  })
})

const resetForgetPassword = catchAsync(async (req, res) => {
  const updateduser = await authService.resetForgetPassword(req.body)

  // Setting and sending cookies after verificatin so that user doesn't have to login again
  const { tokens } = updateduser
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
    statusCode: httpStatus.OK,
    message: 'Password reset successful!',
    data: updateduser
  })
})

const resetPassword = catchAsync(async (req, res) => {
  const updatedUser = await authService.resetPassword(
    req.body,
    (req as ReqWithUser).user
  )

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Password reset successful!',
    data: updatedUser
  })
})

export const authController = {
  signup,
  signupVerify,
  login,
  forgetPassword,
  forgetPasswordVerify,
  resetForgetPassword,
  resetPassword
}
