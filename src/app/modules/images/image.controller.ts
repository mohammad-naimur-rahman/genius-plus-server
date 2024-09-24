import catchAsync from '~shared/catchAsync'
import pick from '~shared/pick'
import sendResponse from '~shared/sendResponse'
import { ReqWithUser } from '~types/common'
import httpStatus from '~utils/httpStatus'
import { paginateQueries } from '~utils/paginationUtils'
import { imagesService, PaginateParams } from './image.service'

const generateImage = catchAsync(async (req, res) => {
  const { body, user } = req as ReqWithUser
  const generatedImageData = await imagesService.generateImage(body, user)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Image created successfully!',
    data: generatedImageData
  })
})

const getUserImages = catchAsync(async (req, res) => {
  const { query, user } = req as ReqWithUser
  const params = pick(query, paginateQueries()) as unknown as PaginateParams
  const userImages = await imagesService.getUserImages(params, user)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'User images retrieved successfully!',
    data: userImages
  })
})

export const imageController = {
  generateImage,
  getUserImages
}
