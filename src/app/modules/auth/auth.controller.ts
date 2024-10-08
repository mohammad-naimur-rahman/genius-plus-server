import catchAsync from '~shared/catchAsync'
import sendResponse from '~shared/sendResponse'
import { ReqWithUser } from '~types/common'
import httpStatus from '~utils/httpStatus'
import { authService } from './auth.service'
import { authUtils } from './auth.utils'

const signup = catchAsync(async (req, res) => {
  const verificationLink = await authService.signup(req.body)

  sendResponse(res, {
    message: 'Email sent successfully!',
    statusCode: httpStatus.OK,
    data: { verificationLink }
  })
})

const signupVerify = catchAsync(async (req, res) => {
  const data = await authService.signupVerify(req.body)

  // Setting and sending cookies after verificatin so that user doesn't have to login again
  const { tokens, user } = data
  const { accessToken, refreshToken } = tokens

  // Set cookies
  authUtils.setCookies(res, accessToken, refreshToken)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'User verification successful!',
    data: user,
    tokens: tokens
  })
})

const login = catchAsync(async (req, res) => {
  const data = await authService.login(req.body)

  // Setting and sending cookies after verificatin so that user doesn't have to login again
  const { tokens, user } = data
  const { accessToken, refreshToken } = tokens

  // Set cookies
  authUtils.setCookies(res, accessToken, refreshToken)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'User logged in successful!',
    data: user,
    tokens
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
  const { tokens, user } = updateduser
  const { accessToken, refreshToken } = tokens

  // Set cookies
  authUtils.setCookies(res, accessToken, refreshToken)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Password reset successful!',
    data: user,
    tokens
  })
})

const resetPassword = catchAsync(async (req, res) => {
  const { body, user } = req as ReqWithUser
  const updatedUser = await authService.resetPassword(body, user)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Password reset successful!',
    data: updatedUser
  })
})

const generateNewAccessToken = catchAsync(async (req, res) => {
  const { accessToken, refreshToken } =
    await authService.generateNewAccessToken(req.body)

  // Set cookies
  authUtils.setCookies(res, accessToken, refreshToken)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'New access token generated successfully!',
    tokens: { accessToken, refreshToken }
  })
})

export const authController = {
  signup,
  signupVerify,
  login,
  forgetPassword,
  forgetPasswordVerify,
  resetForgetPassword,
  resetPassword,
  generateNewAccessToken
}
