import catchAsync from '~shared/catchAsync'
import sendResponse from '~shared/sendResponse'
import { ReqWithUser } from '~types/common'
import httpStatus from '~utils/httpStatus'
import { NewImage } from './image.schema'
import { imagesService } from './image.service'

const generateImage = catchAsync(async (req, res) => {
  const { body, user } = req as ReqWithUser
  const generatedImageData = await imagesService.generateImage(body, user)

  sendResponse<NewImage>(res, {
    statusCode: httpStatus.CREATED,
    message: 'Image created successfully!',
    data: generatedImageData
  })
})

export const imageController = {
  generateImage
}
