import catchAsync from '~shared/catchAsync'
import sendResponse from '~shared/sendResponse'
import httpStatus from '~utils/httpStatus'
import { userService } from './user.service'

const getAllUsers = catchAsync(async (req, res) => {
  const allUsers = await userService.getAllUsers()

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: allUsers,
    message: 'All users retrieved successfully!'
  })
})

export const userController = {
  getAllUsers
}
