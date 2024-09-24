import catchAsync from '~shared/catchAsync'
import sendResponse from '~shared/sendResponse'
import { ReqWithUser } from '~types/common'
import httpStatus from '~utils/httpStatus'
import { imagesService } from './image.service'

const generateImage = catchAsync(async (req, res) => {
  const { body, user } = req as ReqWithUser
  const data = await imagesService.generateImage(body, user)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Image created successfully!',
    data
  })
})

export const imageController = {
  generateImage
}
