import catchAsync from '~shared/catchAsync'
import sendResponse from '~shared/sendResponse'
import httpStatus from '~utils/httpStatus'
import { authService } from './auth.service'

const signup = catchAsync(async (req, res) => {
  const verificationLink = await authService.signup(req.body)

  sendResponse(res, {
    message: 'Email sent successfully!',
    statusCode: httpStatus.CREATED,
    data: { verificationLink }
  })
})

export const authController = {
  signup
}
