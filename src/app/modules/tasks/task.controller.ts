import catchAsync from '~shared/catchAsync'
import sendResponse from '~shared/sendResponse'
import httpStatus from '~utils/httpStatus'
import { taskService } from './task.service'

const createTask = catchAsync(async (req, res) => {
  const allUsers = await taskService.createTask(req.body)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    data: 'newTask',
    message: 'Task created successfully!'
  })
})

export const taskController = {
  createTask
}
